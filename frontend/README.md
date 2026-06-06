# Agency Management SaaS - Frontend

This is the enterprise-grade frontend application for the Agency Management SaaS platform. Built using **React**, **Vite**, **TypeScript**, and styled with a custom, pixel-perfect **CSS Variable System** (AlSafar Design).

## Architecture Overview

The frontend utilizes a simplified **Feature-Sliced Design**. This structure avoids deep folder nesting while preventing "spaghetti code" by keeping all feature-specific UI, logic, and state neatly encapsulated together.

### Directory Structure
```
src/
├── assets/       # Static files and images
├── components/   # Shared, highly reusable UI components (e.g., generic buttons, inputs)
├── features/     # Feature-Specific Domains
│   ├── auth/     # Login UI and authentication flows
│   ├── dashboard/# Dashboard UI, Charts, and Widgets
│   ├── candidates/
│   ├── jobs/
│   ├── visas/
│   ├── flights/
│   └── payments/
├── layouts/      # Application-wide layouts (DashboardLayout, AuthLayout)
├── router/       # Centralized react-router-dom configuration
├── store/        # Global Zustand state management
└── utils/        # Generic helper functions
```

## UI & Design System
- **Pixel-Perfect**: The UI is built to exactly match the premium "AlSafar Light Theme" design, featuring responsive layouts, custom sparkline charts (`recharts`), and a sleek sidebar.
- **Performance**: Powered by Vite for lightning-fast HMR (Hot Module Replacement) and optimized production builds.

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Run the development server**:
   ```bash
   npm run dev
   ```
   *The application will be available at `http://localhost:5173`*

3. **Build for production**:
   ```bash
   npm run build
   ```

## Development Standards
- All new pages and specific components must be created within their respective folder inside `src/features/`.
- Do not pollute `src/components/` with feature-specific UI. Keep it strictly for generic UI components.
