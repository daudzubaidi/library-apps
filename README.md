# Booky - Library Management System

A modern, full-stack library management application built with React, TypeScript, and Vite.

## Technology Stack

- React 19 with TypeScript for type-safe development
- Vite for fast build tooling and hot module replacement
- Tailwind CSS v4 with custom design tokens from Figma
- Redux Toolkit for predictable state management
- TanStack Query v5 for server state management
- React Router v7 for client-side routing
- shadcn/ui for accessible UI components
- Lucide React for consistent iconography

## Features

### User Authentication
- Secure login and registration system
- JWT token-based authentication
- Persistent sessions with localStorage
- Automatic profile fetching

### Book Browsing
- Responsive book catalog with grid layout
- Real-time search functionality
- Category-based filtering
- Pagination for large datasets
- Book ratings and availability status

### Book Details
- Comprehensive book information display
- Add to cart functionality
- User reviews and ratings
- Related books recommendations

### Shopping Cart
- Add/remove books from cart
- Cart persistence across sessions
- Checkout process

### User Dashboard
- Personal loan history
- Active and returned loans
- Overdue notifications
- Review management

### Admin Panel
- Book inventory management
- User management
- Loan tracking and management
- System overview and statistics

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── api/           # API integration layer
├── components/    # Reusable UI components
├── hooks/         # Custom React hooks
├── layouts/       # Page layout components
├── pages/         # Application pages
├── store/         # Redux state management
├── types/         # TypeScript definitions
└── index.css      # Global styles and design tokens
```

## Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=your_api_endpoint
```

## Design System

The application uses a custom design system with tokens extracted from Figma:

- Typography: Quicksand font family
- Color palette: Neutral, Primary, Brand, and Accent scales
- Spacing: Consistent 8px grid system
- Border radius: Predefined radius values
- Shadows: Elevation system for depth

## Code Quality

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Component-driven architecture
- Separation of concerns
- Performance optimizations

## Deployment

Optimized for deployment on Vercel with automatic builds and previews.

## License

MIT

---

Built with modern web technologies and best practices.
