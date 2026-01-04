# PROJECT BLUEPRINT: IronPath (Fitness App)

## 1. Project Overview
**App Name:** IronPath
**Goal:** A high-end, production-level MERN Stack fitness application for bodybuilders and gym-goers.
**Timeline:** 5-Day Sprint (Jan 3 – Jan 7).
**Roles:**
- **User:** Lead Architect (Focus on Logic, Debugging, Deployment).
- **AI Agent:** Junior Developer (Focus on Boilerplate, Syntax, Implementation).

## 2. Tech Stack
- **Frontend:** React (Vite), Tailwind CSS, Framer Motion (for smooth animations).
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (Mongoose).
- **Auth:** JWT (JSON Web Tokens) & Bcrypt.

## 3. Design & UI Guidelines (Strict)
- **Aesthetic:** Premium Dark Mode (Black/Dark Grey backgrounds).
- **Accents:** Neon Green (`#CCFF00`) or Electric Blue for buttons/highlights.
- **Style:** "Glassmorphism" for cards. Modern, clean typography (Inter or Oswald font).
- **Constraint:** Must NOT look like a generic Bootstrap/AI template. It must look like a commercial product (e.g., Nike Run Club, Strong App).

## 4. User Flow (The "Real World" Journey)
1.  **Landing Page (Public):**
    - Hero Section: High-energy video/image background. "Build Your Dream Physique."
    - Features Section: "Smart Splits," "Budget Diets."
    - **About Developer:** A dedicated section featuring the developer's photo and bio ("CS Student & Bodybuilder").
    - Call to Action: "Start Transformation."
2.  **Auth Page:** Login / Signup (Name, Email, Password).
3.  **Onboarding Wizard (Private - First Login Only):**
    - Collects Personal Data: Age, Weight, Height, Gender, Activity Level.
    - **Logic:** Instantly calculates BMR & TDEE (Total Daily Energy Expenditure) and saves to DB.
4.  **Main Dashboard:**
    - Displays User Stats (BMR, Maintenance Calories).
    - Workout Program Selector.
    - Diet Section.

## 5. Database Schema Requirements (Mongoose)
**User Schema:**
- **Auth Details:** Name, Email, Password (hashed).
- **Physical Stats (Optional initially, filled during Onboarding):**
    - Age (Number)
    - Weight (Number, kg)
    - Height (Number, cm)
    - Gender (String)
    - ActivityLevel (String)
    - Goal (String: Cut/Bulk)
    - BMR (Number - Calculated)
- **Progress:** DaysCompleted (Number).

## 6. 5-Day Sprint Schedule
- **Day 1: Setup & Onboarding.** Project structure, Database connection, User Schema, Auth API, and the Onboarding Logic.
- **Day 2: Workout Engine.** Creating Schemas for Programs (Bro Split, PPL, Full Body) and connecting exercises.
- **Day 3: The Selector UI.** Frontend page to filter programs based on user days available.
- **Day 4: Diet & Dashboard.** "Budget vs. Supplement" diet toggle and visual progress tracking.
- **Day 5: Polish & Deploy.** UI Refinement (Animations, Responsive checks) and Vercel/Render deployment.