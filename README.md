# VibeCheck Mobile

VibeCheck is a **social discovery mobile application** built with **React Native and TypeScript**, designed to help people discover and connect with others who share similar vibes, interests, and activities.

This project follows **Clean Architecture** and **Atomic Design principles** to ensure scalability, maintainability, and high code quality.

---

## Tech Stack

* React Native CLI
* TypeScript
* React Navigation
* Clean Architecture
* Atomic Design (Atoms → Molecules → Organisms → Templates)

---

## Project Structure

```
VibeCheck-mobile
│
├── android/                # Android native project
├── ios/                    # iOS native project
│
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── atoms/
│   │   ├── molecules/
│   │   ├── organisms/
│   │   └── templates/
│   │
│   ├── screens/            # Application screens
│   ├── hooks/              # Business logic hooks
│   ├── services/           # API calls
│   ├── types/              # TypeScript interfaces
│   ├── models/             # Domain entities
│   ├── validators/         # Validation schemas
│   ├── constants/          # Design tokens (colors, spacing, typography)
│   └── assets/             # Images, icons, fonts
│
├── App.tsx
├── package.json
└── README.md
```

---

## Getting Started

### 1 Install dependencies

```
npm install
```

or

```
yarn install
```

---

### 2 Run Metro

```
npm start
```

---

### 3 Run on Android

```
npx react-native run-android
```

---

### 4 Run on iOS

```
npx react-native run-ios
```

Requirements:

* macOS
* Xcode
* CocoaPods

---

## Development Principles

The project follows strict architecture rules:

### Clean Architecture Layers

```
Presentation
   ↓
Application
   ↓
Domain
   ↓
Infrastructure
```

Each layer has clear responsibilities to maintain a scalable and testable codebase.

---

### Atomic Design

Components are organized by complexity:

```
atoms
molecules
organisms
templates
```

---

### Code Quality Rules

* No hardcoded design values
* Design tokens must be used
* TypeScript strict typing
* Components must be under 300 lines
* Business logic lives in hooks
* API calls only in services

---

## Features (Planned)

* User discovery feed
* Profile system
* Swipe interactions
* Real-time matching
* Chat system
* Notifications

---

## License

This project is currently private and under development.

---
