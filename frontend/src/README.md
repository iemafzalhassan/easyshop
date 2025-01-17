# Frontend Source Directory Structure

```
src/
├── app/                    # Next.js app directory
│   ├── components/        # React components
│   │   ├── common/       # Shared/reusable components
│   │   ├── features/     # Feature-specific components
│   │   └── layouts/      # Layout components
│   ├── hooks/            # Custom React hooks
│   ├── contexts/         # React contexts
│   ├── store/            # Redux store
│   ├── services/         # API services
│   ├── utils/            # Utility functions
│   ├── styles/           # CSS/SCSS files
│   └── types/            # TypeScript types
├── assets/               # Static assets
│   ├── data/            # Data files
│   │   ├── constants/   # Constant values
│   │   └── mock/       # Mock data for development
│   ├── images/          # Image assets
│   └── icons/           # Icon assets
├── config/               # Configuration files
├── lib/                  # Library code
│   ├── utils/           # Utility functions
│   └── validations/     # Validation schemas
└── types/                # Global TypeScript types
```

## Directory Details

### `/app`
- Contains Next.js pages and routing logic
- Organized by feature/route

### `/assets/data`
- `constants/`: Application-wide constant values
- `mock/`: Mock data for development and testing

### `/components`
- `common/`: Reusable components (buttons, inputs, etc.)
- `features/`: Feature-specific components
- `layouts/`: Page layouts and structure components

### `/config`
- Environment-specific configuration
- Feature flags
- API endpoints

### `/lib`
- Shared utilities and helpers
- Validation schemas
- Custom hooks

### `/types`
- TypeScript type definitions
- Shared interfaces and types

## Best Practices

1. **Component Organization**
   - Keep components small and focused
   - Use proper naming conventions
   - Group related components together

2. **Data Management**
   - Keep constants in appropriate files
   - Use TypeScript for type safety
   - Validate data using Zod schemas

3. **Asset Management**
   - Optimize images before committing
   - Use SVGs for icons when possible
   - Keep assets organized by type/feature

4. **Code Style**
   - Follow consistent naming conventions
   - Use proper TypeScript types
   - Document complex functions and components
