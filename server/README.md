# Jamiatul Madina AI Assistant Backend (`jamia_ai_assistant/server`)

Production-grade Node.js / Express backend with Mongoose and Google Gen AI SDK (`@google/genai`).

---

## 📁 Project Structure

```
jamia_ai_assistant/
├── .env                              # Environment variables (GEMINI_OPEN_API, MONGODB_URI, PORT)
├── package.json                      # Root workspace scripts
└── server/
    ├── config/
    │   └── db.js                     # MongoDB connection with Mongoose & graceful shutdown
    ├── models/
    │   └── KnowledgeBase.js          # Mongoose schema for official knowledge base
    ├── controllers/
    │   ├── aiController.js           # Guardrail search & Gemini AI contextual generation
    │   └── adminController.js        # CRUD endpoints & database seeding
    ├── routes/
    │   ├── aiRoutes.js               # POST /api/ai/search & POST /api/ai
    │   └── adminRoutes.js            # GET/POST/PUT/DELETE /api/admin/data & POST /api/admin/seed
    ├── data/
    │   ├── initialKnowledgeData.js   # 50 comprehensive bilingual Jamiatul Madina Q&A records
    │   └── initialKnowledge.js       # Re-export module
    ├── seed.js                       # Standalone CLI seeding script (node server/seed.js)
    ├── server.js                     # Main Express app, CORS, routes & error middleware
    └── package.json                  # Server dependencies & scripts
```

---

## ⚙️ Environment Variables (`.env`)

Place your `.env` in the root folder:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.zyclij0.mongodb.net/jamia_ai_db?retryWrites=true&w=majority
GEMINI_OPEN_API=your_gemini_api_key_here
PORT=5000
```

---

## 🚀 Running the Server

From the project root:
```bash
# Start server in production mode
npm run server

# Start server in watch mode
npm run server:dev
```

Or from inside the `/server` directory:
```bash
cd server
npm start
# or
npm run dev
```

---

## 🗄️ Database Seeding (50 Bilingual Records)

To wipe the existing collection and seed all 50 official bilingual Jamiatul Madina Q&A records:

### Via CLI Script:
```bash
# From workspace root:
npm run seed
# or
node server/seed.js

# From server directory:
cd server
npm run seed
# or
node seed.js
```

### Via HTTP API:
- **POST** `/api/admin/seed`
  - Wipes existing records and inserts all 50 records.

---

## 📡 API Endpoints

### 1. AI Assistant Query (RAG + Guardrails)
- **Endpoint:** `POST /api/ai/search` (also accepts `POST /api/ai`)
- **Body:**
  ```json
  {
    "query": "جامعۃ المدینہ میں داخلہ کی کیا شرائط ہیں؟"
  }
  ```
- **Response (Match Found):**
  ```json
  {
    "found": true,
    "answer": "جامعۃ المدینہ میں داخلے کے لیے میٹرک یا مساوی تعلیم ہونی چاہیے...",
    "matchedCategories": ["Admissions"],
    "sourceCount": 1
  }
  ```
- **Response (Guardrail Triggered - No Records Match):**
  *Returns immediately WITHOUT calling Google AI API:*
  ```json
  {
    "found": false,
    "message": "یہ معلومات فی الحال جامعۃ المدینہ کے آفیشل ریکارڈ میں موجود نہیں ہیں۔"
  }
  ```

---

### 2. Admin CRUD Endpoints (`/api/admin`)

#### A. Seed Initial Data
- **POST** `/api/admin/seed`
  - Populates the database with official records if the collection is empty.
  - Optional body: `{ "force": true }` to clear and re-seed.

#### B. Get All Knowledge Entries
- **GET** `/api/admin/data`
  - Optional Query Parameters:
    - `?category=Admissions`
    - `?search=matric`
    - `?page=1&limit=10`

#### C. Add Knowledge Entry
- **POST** `/api/admin/data`
  - Body:
    ```json
    {
      "category": "Admissions",
      "question": "What is the age limit for Lilbanat?",
      "answer": "The age limit for Lilbanat admission is typically between 14 to 22 years.",
      "keywords": ["lilbanat", "girls", "age limit", "admission", "للبنات", "عمر کی حد"]
    }
    ```

#### D. Update Knowledge Entry
- **PUT** `/api/admin/data/:id`
  - Body: Any subset of fields to update (`category`, `question`, `answer`, `keywords`).

#### E. Delete Knowledge Entry
- **DELETE** `/api/admin/data/:id`

---

## 🛡️ Guardrails & Language Rules
1. **Zero Hallucination:** Only answers based strictly on official records in the knowledge base.
2. **Cost Optimization:** Queries that do not match existing records are answered by a fixed guardrail response without calling the Gemini API.
3. **Language Matching:** The system prompt instructs Gemini to detect and match the user's language script (Pure Urdu, Roman Urdu, or English).
