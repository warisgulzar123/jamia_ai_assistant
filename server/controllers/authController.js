const User = require('../models/User');

/**
 * Public User Signup
 * POST /api/auth/signup
 */
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'A user with this email already exists. Please login.',
      });
    }

    const newUser = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: password, // In production, hash with bcrypt
      role: 'user',
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error(`[Auth Error] Signup failed: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: 'Signup failed',
      details: error.message,
    });
  }
};

/**
 * Public User Login
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check for hardcoded administrator credentials: admin@gmail.com / admin123
    if (cleanEmail === 'admin@gmail.com' && password === 'admin123') {
      return res.status(200).json({
        success: true,
        message: 'Administrator login successful',
        user: {
          id: 'admin_root',
          name: 'Administrator',
          email: 'admin@gmail.com',
          role: 'admin',
        },
        isAdmin: true,
        adminToken: 'jamiat_admin_secure_token_' + Date.now(),
      });
    }

    const user = await User.findOne({ email: cleanEmail });

    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      isAdmin: user.role === 'admin',
      ...(user.role === 'admin' && {
        adminToken: 'jamiat_admin_secure_token_' + Date.now(),
      }),
    });
  } catch (error) {
    console.error(`[Auth Error] Login failed: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: 'Login failed',
      details: error.message,
    });
  }
};

/**
 * Admin Private Dashboard Login
 * POST /api/auth/admin-login
 */
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Admin email and password are required',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@jamiatulmadina.net').toLowerCase();
    const adminPass = process.env.ADMIN_PASSWORD || 'Admin@Jamia123';

    // Verify against admin@gmail.com / admin123, env variables, or database admin
    const isSpecificAdmin = cleanEmail === 'admin@gmail.com' && password === 'admin123';
    const isEnvAdmin = cleanEmail === adminEmail && password === adminPass;
    const dbAdmin = !isSpecificAdmin && !isEnvAdmin ? await User.findOne({ email: cleanEmail, role: 'admin' }) : null;

    if (isSpecificAdmin || isEnvAdmin || (dbAdmin && dbAdmin.password === password)) {
      return res.status(200).json({
        success: true,
        message: 'Admin authentication successful',
        admin: {
          email: cleanEmail,
          role: 'admin',
          token: 'jamiat_admin_secure_token_' + Date.now(),
        },
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Invalid administrator credentials. Access denied.',
    });
  } catch (error) {
    console.error(`[Auth Error] Admin login failed: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: 'Admin authentication failed',
      details: error.message,
    });
  }
};

module.exports = {
  signup,
  login,
  adminLogin,
};
