# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is an instant photo gallery web application that allows users to upload, view, and share photos quickly. The application is built as a modern single-page application (SPA) using vanilla JavaScript, HTML5, and CSS3 with minimal external dependencies.

## Development Commands

### Core Development Commands
- `npm run dev` - Start Vite development server with hot reload
- `npm run build` - Build production-ready application
- `npm run preview` - Preview the built application locally
- `npm run serve` - Serve application using Python's built-in HTTP server on port 8000

### File Serving
- Use `npm run serve` for simple local development without hot reload
- Use `npm run dev` for active development with hot reload and modern tooling

## Architecture Overview

### Application Structure
The codebase follows a modular architecture with clear separation of concerns:

**Core Components:**
- `InstantPhotoGallery` class (`src/main.js`) - Main application controller that orchestrates all functionality
- Modular event handling system for user interactions
- Drag-and-drop file upload with global and zone-specific handlers
- Modal system for photo viewing and actions
- Notification system for user feedback

### Key Architectural Patterns
- **Class-based Architecture**: Single main class manages application state and coordination
- **Event-driven Design**: Extensive use of DOM event listeners for user interactions
- **Modular Methods**: Each feature (upload, gallery, modal, etc.) has dedicated methods
- **Progressive Enhancement**: Works without JavaScript for basic functionality

### File Organization
```
src/
├── main.js          # Main application logic and InstantPhotoGallery class
styles/
├── main.css         # All application styles with CSS Grid/Flexbox layouts
assets/
├── original-page.html  # Reference/template file
index.html           # Main application entry point
```

### Technology Stack
- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Build Tool**: Vite for development server and bundling
- **UI Library**: Swiper.js for carousel/gallery functionality
- **Styling**: CSS Grid, Flexbox, CSS custom properties
- **Images**: Unsplash API for demo content

## Core Features Implementation

### Photo Upload System
- **Drag & Drop**: Global and zone-specific drop handlers
- **File Selection**: Click-to-select file input integration  
- **File Processing**: FileReader API for client-side image processing
- **Validation**: Image format validation and error handling

### Gallery Management
- **Dynamic Rendering**: Real-time photo grid updates using template strings
- **Swiper Integration**: Responsive carousel with touch/swipe support
- **Modal Viewing**: Full-screen photo viewing with action buttons

### User Interface
- **Responsive Design**: Mobile-first approach with breakpoint-based layouts
- **Interactive Elements**: Hover effects, transitions, and micro-animations
- **Accessibility**: Keyboard navigation support (ESC, Ctrl+U shortcuts)

## Development Guidelines

### Code Organization
- Keep all JavaScript in the `InstantPhotoGallery` class for maintainability
- Use descriptive method names that clearly indicate functionality
- Maintain consistent event handling patterns throughout the application

### Styling Approach  
- CSS is organized by component/section in a single file
- Uses CSS custom properties for consistent theming
- Mobile-first responsive design with progressive enhancement

### Adding New Features
1. Add new methods to the `InstantPhotoGallery` class
2. Initialize event listeners in the `setupEventListeners()` method
3. Follow the existing pattern of DOM manipulation and state management
4. Test across different devices and browsers for responsiveness

### External Dependencies
- Keep external dependencies minimal - currently only Swiper.js
- When adding new dependencies, ensure they align with the lightweight philosophy
- Prefer native JavaScript APIs over third-party libraries when possible

## Service Worker & PWA
The application includes basic PWA setup:
- Service worker registration for offline functionality
- Can be extended for full PWA features (manifest, caching, etc.)

## Demo Data Integration
The application includes Unsplash integration for demo photos. When working with the gallery:
- Sample images are loaded from Unsplash with proper attribution
- Demo photos are automatically added after page load for demonstration
- Real user uploads replace demo content dynamically

## Browser Compatibility
- Targets modern browsers with ES6+ support
- Uses native APIs: FileReader, Drag & Drop, Intersection Observer
- Graceful degradation for older browsers where possible