# RabbitHole Migration to WXT

This document outlines the migration of RabbitHoleV4 extension functionality to the WXT framework with shadcn/ui components.

## What Was Migrated

### 1. Text Selection & Preview Card
- **From**: `content.js` with vanilla JavaScript
- **To**: `entrypoints/content/text-selection.ts` with TypeScript
- **Features**: 
  - Text selection detection
  - Modern preview card with shadcn styling
  - Message passing to background script

### 2. Background Script
- **From**: `background.js` with basic message handling
- **To**: `entrypoints/background.ts` with TypeScript and proper message types
- **Features**:
  - Selected text storage
  - Sidepanel opening
  - Message routing between content script and sidepanel

### 3. Sidepanel
- **From**: `sidepanel/sidepanel.html` with vanilla JavaScript and iframe
- **To**: `entrypoints/sidepanel/wikipedia.tsx` with React and shadcn components
- **Features**:
  - Wikipedia API integration
  - Modern UI with loading states and error handling
  - Responsive iframe with custom styling
  - "Open in Wikipedia" button

### 4. Navigation
- **Added**: Wikipedia tab in sidebar navigation
- **Updated**: Header to display "Wikipedia" title
- **Enhanced**: Home page with usage instructions

## New Features

1. **Modern UI**: All components now use shadcn/ui with Tailwind CSS
2. **TypeScript**: Full type safety throughout the extension
3. **React Components**: Reusable, maintainable component architecture
4. **Better Error Handling**: Proper error states and user feedback
5. **Theme Support**: Inherits theme system from WXT template
6. **i18n Ready**: Prepared for internationalization

## How to Use

1. **Select Text**: Select any text on any webpage
2. **Preview Card**: A modern preview card will appear
3. **Open Sidebar**: Click "Open in Sidebar" to view Wikipedia article
4. **Navigate**: Use the Wikipedia icon in the sidebar to access your last search
5. **External Link**: Click "Open in Wikipedia" to view the full article

## Build & Development

```bash
# Development
npm run dev

# Build for production
npm run build

# Build for Firefox
npm run build:firefox
```

## File Structure

```
entrypoints/
├── background.ts              # Background script with message handling
├── content/
│   ├── index.tsx             # Disabled (replaced by text-selection.ts)
│   └── text-selection.ts     # Text selection and preview card
├── sidepanel/
│   ├── App.tsx               # Main sidepanel app
│   ├── wikipedia.tsx         # Wikipedia viewer component
│   ├── home.tsx              # Updated home page
│   └── header.tsx            # Updated header
├── sidebar.tsx               # Updated sidebar with Wikipedia tab
└── types.ts                  # Message types and interfaces

components/ui/
└── alert.tsx                 # New alert component for error states
```

## Key Improvements

1. **Better UX**: Modern, consistent UI with proper loading states
2. **Type Safety**: Full TypeScript support prevents runtime errors
3. **Maintainability**: React components are easier to maintain and extend
4. **Performance**: WXT's optimized build process
5. **Accessibility**: shadcn/ui components include accessibility features
6. **Responsive**: Works well on different screen sizes
