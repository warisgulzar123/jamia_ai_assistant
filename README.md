# جامعۃ المدینہ اے آئی اسسٹنٹ (Jamiatul Madina AI Assistant)

Official, enterprise-grade AI Knowledge Base and Semantic Search Portal for **Jamiatul Madina (دعوتِ اسلامی)**.

Grounded in verified institutional records under **Kanz-ul-Madaris Board** regulations.

---

## 🌟 Key Features

- 🟢 **Bilingual AI Search Portal:** Supports queries in Pure Urdu (اردو), Roman Urdu, and English with script matching.
- 🎙️ **Native Urdu Voice Search:** Live Web Speech API voice capture with `ur-PK` language detection.
- ⚡ **Sub-2-Second Vector Semantic Search:**
  - 768-dimensional vector embeddings generated using Google Gemini (`gemini-embedding-001` / `text-embedding-004`).
  - Fast vector dot-product computation via `Float32Array`.
  - In-memory LRU query cache for instant responses.
- 📑 **Dual Response Views:**
  - **Detailed Tab:** Complete, fully grounded context response.
  - **Khulasa (Summary) Tab:** Concise 1-to-2 sentence executive summary.
- 🔊 **Dual-Engine Audio Player (TTS):** Context-aware verbal response reading supporting native Urdu pronunciation.
- 🔐 **Protected Administrator Dashboard:**
  - Role-protected management for Knowledge Base records.
  - Restricted to authenticated administrator (`admin@gmail.com`).
  - Real-time Add, Edit, Delete, Search, and Vector Embedding synchronization.
- 📱 **100% Mobile Responsive:** Optimized flex layout with zero horizontal overflow across 320px–4K displays.

---

## 🏗️ Tech Stack

### Frontend (`/client`)
- **React 18** (Vite)
- **Tailwind CSS** (Islamic Emerald Green Theme `#064e3b` & `#10b981`)
- **Lucide React Icons**
- **Web Speech API & HTML5 Audio TTS**

### Backend (`/server`)
- **Node.js & Express.js**
- **MongoDB & Mongoose** (Vector Storage)
- **@google/genai SDK** (Gemini Flash & Vector Embeddings)
- **Float32Array Cosine Similarity Math Engine**

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas or local MongoDB instance
- Google Gemini API Key

### 2. Environment Configuration
Copy `.env.example` to `.env` in the root directory:
```bash
cp .env.example .env
```
Update your `.env` with your credentials:
```env
MONGODB_URI=your_mongodb_connection_string
GEMINI_OPEN_API=your_google_gemini_api_key
PORT=5000
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=admin123
```

### 3. Installation
Install dependencies for both server and client:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 4. Database Seeding
Seed the initial 50 official verified records with 768-dimensional vector embeddings:
```bash
npm run seed
# or
node server/seed.js
```

### 5. Running the Application
```bash
# Run backend server (from root or /server)
npm run server:dev

# Run frontend client (from /client)
npm run client
```

---

## 🔐 Admin Access
- **Email:** `admin@gmail.com`
- **Password:** `admin123`

---

## 📜 License
Developed for Jamiatul Madina (دعوتِ اسلامی). All rights reserved.
