# Library App - Booky

Modern library management application built with React, TypeScript, and Vite.

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 with Figma Design Tokens
- **State Management**: Redux Toolkit
- **Data Fetching**: TanStack Query v5
- **Routing**: React Router v7
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Toast**: Sonner

## Features

### Phase 1: Project Setup + Design System (Completed)
- Vite + React + TypeScript setup
- Tailwind CSS v4 configuration
- Exact Figma design tokens (colors, typography, spacing, radius)
- Quicksand font integration
- Redux store setup (auth, cart, ui slices)
- shadcn/ui components

### Phase 2: Authentication (Completed)
- Login page with email/password
- Register page with full form validation
- Token-based authentication with localStorage persistence
- Auto-fetch user profile on mount
- Pixel-perfect design matching Figma
- Proper Booky logo with sparkle icon

### Phase 3: Book List + Search/Filter (Completed)
- Books listing page with responsive grid (1-4 columns)
- Search bar with real-time query
- Category filter with dynamic loading
- Book cards with:
  - Cover image
  - Title, author, rating
  - Stock availability status
- Pagination with numbered buttons
- Loading and empty states
- Redux integration for search/filter state
- TanStack Query for data fetching and caching

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run build
```

## Project Structure

```
src/
├── api/           # API client and endpoints
├── components/    # Reusable components (Logo, UI components)
├── hooks/         # Custom React hooks (useAuth, etc.)
├── layouts/       # Layout components (MainLayout)
├── pages/         # Page components (Login, Register, Books, etc.)
├── store/         # Redux store and slices
├── types/         # TypeScript type definitions
└── index.css      # Global styles with Figma design tokens
```

## Design Tokens

All design tokens are extracted from Figma and defined in `src/index.css`:

- **Typography**: Quicksand font family with exact sizes and line heights
- **Colors**: Neutral scale, Primary blue, Brand purple, Accent colors
- **Spacing**: 0px to 160px scale
- **Border Radius**: 0px to 9999px (full)
- **Shadows**: xs and lg shadows from Figma

## Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=your_api_url
```

## Deployment

This project is configured for Vercel deployment with automatic builds on push.

## Best Practices

- Pixel-perfect Figma implementation
- Type-safe with TypeScript
- Modern React patterns (hooks, functional components)
- Clean code, no over-engineering
- Responsive design
- Performance optimized with TanStack Query caching
- Proper error handling and loading states

## Next Phases

- Phase 4: Book Detail + Reviews
- Phase 5: Cart + Checkout
- Phase 6: My Loans + My Profile
- Phase 7: Admin Dashboard
- Phase 8: Testing + Deployment

## License

MIT

## Author

Built with React, TypeScript, and Vite
