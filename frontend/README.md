# Vue.js Frontend

A modern Vue 3 frontend application for managing music tracks with a clean, responsive interface.

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start development server:**

   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

The application will be available at `http://localhost:5173` (or the port shown in terminal)

## 🎯 Features

### Core Functionality

- ✅ **Track Listing**: Display all tracks in a responsive table
- ✅ **Create Track**: Add new tracks with form validation
- ✅ **Edit Track**: Update existing tracks inline
- ✅ **Duration Format**: Input duration as `mm:ss`, stored as seconds
- ✅ **ISRC Validation**: Real-time validation of ISRC format
- ✅ **Error Handling**: User-friendly error messages and notifications

### User Interface

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Styling**: Clean, professional interface
- **Real-time Updates**: List refreshes automatically after changes
- **Loading States**: Visual feedback during API calls
- **Form Validation**: Client-side validation with helpful messages

## 🏗️ Architecture

### Tech Stack

- **Vue 3** with Composition API
- **Vite** for fast development and building
- **Axios** for HTTP requests
- **Reactive state management** with Vue's built-in reactivity

### Project Structure

```
frontend/
├── components/
│   ├── BaseModal.vue          # Reusable modal component
│   ├── TableHeader.vue        # Table header with actions
│   ├── TrackForm.vue          # Track creation/editing form
│   └── TrackTable.vue         # Track listing table
├── composables/
│   ├── useConfig.js           # Configuration management
│   ├── useModal.js            # Modal state management
│   ├── useNotifications.js    # Notification system
│   └── useTrackApi.js         # API integration
├── styles/
│   └── main.css              # Global styles
├── App.vue                   # Main application component
├── main.js                   # Application entry point
└── index.html               # HTML template
```

### Key Components

#### TrackTable.vue

- Displays tracks in a responsive table
- Handles edit actions
- Shows loading states
- Formats duration display

#### TrackForm.vue

- Handles both create and edit modes
- Duration input with `mm:ss` format conversion
- Real-time ISRC validation
- Form validation and error display

#### Composables

- **useTrackApi**: API calls and state management
- **useModal**: Modal visibility and form state
- **useNotifications**: Success/error message handling
- **useConfig**: API configuration
