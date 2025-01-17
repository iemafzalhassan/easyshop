# Frontend Project Structure

## Directory Structure

```
frontend/
├── public/                    # Static files
│   └── assets/               # Static assets
│       ├── images/           # Image files
│       │   ├── products/     # Product images
│       │   ├── banners/      # Banner images
│       │   ├── categories/   # Category images
│       │   └── shops/        # Shop images
│       └── icons/            # Icon files
│
├── src/                      # Source code
│   ├── app/                  # Next.js app directory
│   │   ├── (auth)/          # Authentication routes
│   │   ├── checkout/        # Checkout routes
│   │   ├── products/        # Product routes
│   │   ├── profile/         # User profile routes
│   │   └── shops/           # Shop routes
│   │
│   ├── components/          # React components
│   │   ├── ui/             # UI components
│   │   ├── shared/         # Shared components
│   │   └── features/       # Feature components
│   │
│   ├── hooks/              # Custom React hooks
│   │   ├── use-debounce.ts
│   │   ├── use-local-storage.ts
│   │   └── use-media-query.ts
│   │
│   ├── lib/                # Utility functions
│   │   ├── api.ts         # API client
│   │   └── utils.ts       # Helper functions
│   │
│   ├── store/             # Redux store
│   │   ├── index.ts      # Store configuration
│   │   └── slices/       # Redux slices
│   │
│   ├── styles/            # Global styles
│   │   └── globals.css   # Global CSS
│   │
│   ├── types/             # TypeScript types
│   │   └── index.ts      # Type definitions
│   │
│   └── constants/         # Constants and config
│       └── index.ts      # App constants
```

## Key Directories and Files

### `/public/assets`
- Static assets like images and icons
- Organized by type and feature

### `/src/app`
- Next.js app router pages
- Feature-based directory structure
- Route groups for authentication

### `/src/components`
- `ui/`: Reusable UI components
- `shared/`: Shared components across features
- `features/`: Feature-specific components

### `/src/hooks`
- Custom React hooks for reusable logic
- Each hook in a separate file
- Well-documented with TypeScript

### `/src/lib`
- Utility functions and services
- API client configuration
- Helper functions

### `/src/store`
- Redux store configuration
- Feature-based slices
- Type-safe actions and reducers

### `/src/styles`
- Global styles and themes
- CSS modules for components
- Tailwind CSS configuration

### `/src/types`
- TypeScript type definitions
- Shared interfaces
- API response types

### `/src/constants`
- Application constants
- Configuration values
- Route definitions

## Best Practices

1. **Component Organization**
   - Keep components small and focused
   - Use TypeScript for props
   - Follow naming conventions

2. **State Management**
   - Use Redux for global state
   - Local state for UI components
   - Context for theme/auth

3. **Code Style**
   - Consistent formatting
   - Clear naming
   - Proper documentation

4. **Performance**
   - Lazy loading
   - Code splitting
   - Image optimization

5. **Testing**
   - Component tests
   - Hook tests
   - Integration tests
