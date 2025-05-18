# Spaced Repetition Flashcard Engine

A modern flashcard application built with React, Vite, and Firebase that implements the SM-2 spaced repetition algorithm for optimal learning.

## Features

- 🎴 Interactive flashcard interface with smooth flip animations
- 📊 Real-time review statistics and progress tracking
- 🔄 SM-2 spaced repetition algorithm for optimal review scheduling
- 📱 Responsive design for mobile and desktop
- ☁️ Cloud sync with Firebase

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a Firebase project and enable Firestore

4. Create a `.env` file in the root directory with your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Add new flashcards through the Firebase console or implement a card creation interface
2. Review cards daily using the spaced repetition system
3. Track your progress through the dashboard
4. Cards will be automatically scheduled for review based on your performance

## Technology Stack

- React + TypeScript
- Vite
- Firebase (Firestore)
- Chakra UI
- Framer Motion
- Recharts

## Contributing

Feel free to submit issues and enhancement requests!
