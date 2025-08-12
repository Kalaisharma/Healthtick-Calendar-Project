# 📅 HealthTick Custom Calendar System

A custom-built **calendar booking system** for managing **Onboarding** and **Follow-up** coaching calls.  
Built with **React**, **TypeScript**, **Tailwind CSS**, and **Firebase Firestore**.

---

## 🚀 Features

### **1. Daily Calendar View**
- Displays **20-minute slots** from **10:30 AM – 7:30 PM**.
- Booked slots show:
  - Client name
  - Call type
  - Delete option
- Empty slots are available for booking.

### **2. Booking Flow**
- Select **client** from a searchable list (20 dummy clients: name + phone).
- Choose call type:
  - **Onboarding** → One-time (40 mins)
  - **Follow-up** → Weekly recurring (20 mins)
- Prevents **overlapping calls** automatically.

### **3. Recurring Logic**
- Follow-up calls repeat automatically on the **same weekday/time** each week.
- Displays both **one-time calls** and **relevant recurring calls** for the selected date.

### **4. Firebase Firestore Integration**
- Stores:
  - Client list
  - Booking details (date, type, client, time, recurrence)
- Optimized schema to:
  - Avoid duplication for recurring calls
  - Allow efficient **date-based querying**

---

## 🛠 Tech Stack
- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend & DB:** Firebase Firestore
- **Deployment:** Vercel

---
💻 Installation & Setup
Clone the repo

bash
Copy
Edit
git clone [https://github.com/Kalaisharma/healthtick-calendar.git](https://github.com/Kalaisharma/Healthtick-Calendar-Project)
cd healthtick-calendar
Install dependencies

bash
Copy
Edit
npm install
Setup Firebase

Create a Firebase project in the Firebase Console

Enable Firestore

Create .env file in root:

env
Copy
Edit
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
Run locally

bash
Copy
Edit
npm run dev
Build for production

bash
Copy
Edit
npm run build

🌐 Deployment
Deployed on Vercel:  https://healthtick-app.netlify.app/

📌 Assumptions Made
Client list is static (stored in Firestore or hardcoded).

All bookings are handled in 20-min increments.

Follow-up calls always repeat weekly at the same slot.

Overlap prevention checks entire call duration (not just start time).


## 📂 Folder Structure

