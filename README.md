# 💙 Memora — Best Friend Memory Challenge

> Create custom friendship quizzes, share with friends via unique links, track responses with analytics, and download beautiful certificates!

![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react) ![Vite](https://img.shields.io/badge/Vite-8-646cff?style=flat-square&logo=vite) ![Supabase](https://img.shields.io/badge/Supabase-Ready-3ecf8e?style=flat-square&logo=supabase) ![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-ff0055?style=flat-square) ![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## ✨ Features

### 🎯 Core Features
- **Custom Quiz Builder** — Create questions (Short Text, Long Text, Multiple Choice)
- **6 Quiz Templates** — Best Friend, Couple, Birthday, Childhood, Fun, Blank (Telugu + English)
- **Unique Share Links** — Each quiz gets a 6-digit code + shareable URL
- **QR Code Sharing** — Scan-to-play QR code for each quiz
- **Certificate Download** — Beautiful PNG certificates (share on WhatsApp/Instagram)
- **WhatsApp & Twitter Share** — One-click sharing to social platforms

### 📊 Admin & Analytics
- **🔐 Admin Login** — Password-protected admin panel (corner lock icon)
- **Dashboard** — See all responses, average time, response count
- **MCQ Analytics Charts** — Bar charts for multiple choice questions
- **Leaderboard** — Rank responders by speed
- **CSV Export** — Download all responses as spreadsheet
- **Edit / Duplicate / Delete** — Full quiz management

### 🎨 Design & UX
- **Premium Dark Theme** — Deep dark (#08070f) with indigo/purple accents
- **Animated Particle Background** — Floating connected particles
- **Framer Motion** — Smooth page transitions & micro-interactions
- **Confetti Celebration** — On quiz completion
- **Typewriter Animation** — Dynamic welcome text
- **Glassmorphism Cards** — Frosted glass with glow borders
- **Gradient Text** — White-to-indigo gradient headings
- **8 Color Themes** — Customize quiz appearance
- **Toast Notifications** — Elegant slide-in messages
- **Mobile Bottom Navigation** — Responsive sticky nav
- **Custom Scrollbar** — Themed scrollbar
- **Noise Texture Overlay** — Premium visual depth
- **Poppins Font** — Clean modern typography

---

## 📁 Project Structure

```
src/
├── supabase.js                  # Supabase config + all DB operations
├── App.jsx                      # Main app with hash routing + AnimatePresence
├── main.jsx                     # React entry point
├── index.css                    # Global styles + premium theme
│
├── components/
│   ├── AdminLogin.jsx/css       # 🔐 Password login modal
│   ├── ColorThemePicker.jsx/css # 🎨 8 theme selector
│   ├── MobileNav.jsx/css        # 📱 Bottom nav (mobile)
│   ├── PageTransition.jsx       # 🎬 Framer Motion wrapper
│   ├── ParticleBackground.jsx/css # ✨ Animated particles
│   ├── ShareModal.jsx/css       # 🔗 QR + platform share
│   ├── Skeleton.jsx/css         # 💀 Loading skeletons
│   ├── TemplateSelector.jsx/css # 📋 Quiz template picker
│   ├── Toast.jsx/css            # 🔔 Notification system
│   └── Typewriter.jsx           # ⌨️ Typing animation
│
├── pages/
│   ├── Welcome.jsx/css          # 🏠 Landing + admin login
│   ├── CreateQuiz.jsx/css       # ✨ Quiz builder
│   ├── AnswerQuiz.jsx/css       # 📝 Answer questions
│   ├── Dashboard.jsx/css        # 📊 Responses + analytics
│   ├── Result.jsx/css           # 🏆 Certificate + confetti
│   ├── MyQuizzes.jsx/css        # 📋 Quiz management
│   └── AdminPanel.jsx/css       # 🔐 Admin overview
│
├── data/
│   └── templates.js             # 📋 6 quiz templates
│
└── utils/
    ├── certificate.js           # 🏅 PNG certificate generator
    └── csvExport.js             # 📊 CSV download utility
```

---

## 🚀 Quick Start

### 1. Install & Run

```bash
git clone https://github.com/avulapranay7033-lab/memora.git
cd memora
npm install
npm run dev
```

App opens at `http://localhost:5173`

### 2. Setup Supabase (Required for Sharing)

#### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com) → Sign up (free)
2. Create a new project → Note your **Project URL** and **Anon Key**

#### Step 2: Create Database Tables
Go to **SQL Editor** in Supabase dashboard and run:

```sql
-- Quizzes table
CREATE TABLE quizzes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_name TEXT NOT NULL,
  title TEXT NOT NULL,
  share_code TEXT UNIQUE NOT NULL,
  questions JSONB NOT NULL,
  theme JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Responses table
CREATE TABLE responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  respondent_name TEXT NOT NULL,
  answers JSONB NOT NULL,
  time_taken INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security (allow public access)
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all read" ON quizzes FOR SELECT USING (true);
CREATE POLICY "Allow all insert" ON quizzes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all delete" ON quizzes FOR DELETE USING (true);

CREATE POLICY "Allow all read" ON responses FOR SELECT USING (true);
CREATE POLICY "Allow all insert" ON responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all delete" ON responses FOR DELETE USING (true);
```

#### Step 3: Add Credentials
Edit `src/supabase.js`:

```js
const SUPABASE_URL = "https://your-project.supabase.co";
const SUPABASE_ANON_KEY = "your-anon-key-here";
```

### 3. Change Admin Password

Edit `src/components/AdminLogin.jsx`:

```js
const ADMIN_PASSWORD = "your-new-password";
```

---

## 🌐 How It Works

```
┌─────────────────────────────────────────────────────┐
│                    CREATOR                          │
│                                                     │
│  1. Click "Create Quiz"                             │
│  2. Pick a template or start blank                  │
│  3. Add custom questions                            │
│  4. Choose color theme                              │
│  5. Get unique code + share link                    │
│  6. Share via WhatsApp/Twitter/QR Code              │
│                                                     │
├─────────────────────────────────────────────────────┤
│                    FRIEND                           │
│                                                     │
│  1. Opens shared link                               │
│  2. Enters their name                               │
│  3. Answers all questions                           │
│  4. Gets confetti celebration 🎊                    │
│  5. Downloads certificate 🏆                        │
│  6. Shares result on WhatsApp                       │
│                                                     │
├─────────────────────────────────────────────────────┤
│                    ADMIN                            │
│                                                     │
│  1. Clicks 🔒 icon on Welcome page                  │
│  2. Enters admin password                           │
│  3. Sees ALL quizzes + response counts              │
│  4. Opens individual dashboards                     │
│  5. Views analytics charts                          │
│  6. Checks leaderboard                              │
│  7. Exports all data as CSV                         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.2 | UI Framework |
| Vite | 8.1 | Build Tool |
| Supabase | Latest | PostgreSQL Backend |
| Framer Motion | 12.x | Animations |
| react-confetti | 6.x | Celebration Effects |
| Recharts | Latest | Analytics Charts |
| html-to-image | Latest | Certificate PNG Generation |
| qrcode.react | Latest | QR Code Generation |
| react-icons | 5.x | Icon Library |
| Poppins | Google Fonts | Typography |

---

## 📱 Screens

| Screen | Route | Description |
|--------|-------|-------------|
| Welcome | `#/` | Landing page with typewriter + admin login |
| Templates | `#/templates` | Choose from 6 quiz templates |
| Create | `#/create` | Build quiz with questions + theme |
| Answer | `#/quiz/:code` | Friend answers via shared link |
| Result | `#/result` | Confetti + certificate download |
| Dashboard | `#/dashboard/:id` | Responses + analytics + leaderboard |
| My Quizzes | `#/my-quizzes` | Manage all quizzes |
| Admin Panel | `#/admin` | Full overview (password protected) |

---

## 🔐 Default Credentials

| What | Value | Where to Change |
|------|-------|-----------------|
| Admin Password | `memora2026` | `src/components/AdminLogin.jsx` |
| Supabase URL | Placeholder | `src/supabase.js` |
| Supabase Key | Placeholder | `src/supabase.js` |

---

## 📦 Build & Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Vercel
npx vercel --prod

# Or deploy to Netlify
# Drag & drop the /dist folder at netlify.com
```

---

## ⚠️ Without Supabase

The app works using **localStorage** as fallback:
- ✅ Create quizzes
- ✅ Answer quizzes (same browser)
- ✅ View dashboard
- ✅ Download certificates
- ❌ Share links across devices
- ❌ Responses persist across browsers

---

## 📄 License

MIT — Free to use, modify, and distribute.

---

Made with 💙 by [avulapranay7033](https://github.com/avulapranay7033-lab) using React + Supabase
