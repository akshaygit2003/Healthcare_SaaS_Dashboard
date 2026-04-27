# Healthcare SaaS Dashboard

A B2B Healthcare SaaS frontend built with React, TypeScript, Redux Toolkit, Firebase Authentication, and Tailwind CSS.

## Features

- Firebase Authentication login flow with form validation, loading, and error handling
- Protected app routes with session-based access via Firebase auth state
- Dashboard page with healthcare KPIs and notification controls
- Analytics page with trend and department load visualizations
- Patient Details module with Grid/List toggle views
- Service Worker registration and working local notification use case
- Scalable folder structure with reusable components and Redux slices

## Tech Stack

- React + TypeScript
- Redux Toolkit + React Redux
- React Router
- Firebase Authentication
- Tailwind CSS
- Vite

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment:

```bash
cp .env.example .env
```

Add your Firebase project credentials in `.env`.

3. Run the app:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

## Authentication Notes

- Login uses Firebase `signInWithEmailAndPassword`
- Create at least one test user in Firebase Authentication (Email/Password provider)
- App routes are protected and redirect unauthenticated users to `/login`

## Notification Use Case

On the Dashboard:

- Click **Enable Notifications**
- Click **Send Medication Reminder**

This triggers a local notification through the registered service worker.
