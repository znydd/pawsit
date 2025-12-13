To install dependencies:
```sh
bun install
```

To run:
```sh
bun run dev
```

open http://localhost:3000

### MVC folder structure example
```
server/src/
├── index.ts                 # App entry point, mounts routes
├── db/
│   ├── index.ts             # DB connection (already exists)
│   ├── schema.ts            # Drizzle schema (already exists)
│   └── auth.schema.ts       # Auth schema (already exists)
├── lib/
│   └── auth.ts              # Better Auth config (already exists)
├── middleware/
│   └── auth.middleware.ts   # Auth middleware for protected routes
├── models/                  # Database queries (data access layer)
│   ├── sitter.model.ts
│   ├── owner.model.ts
│   ├── booking.model.ts
│   ├── service.model.ts
│   └── review.model.ts
├── controllers/             # Business logic, request handling
│   ├── sitter.controller.ts
│   ├── owner.controller.ts
│   ├── booking.controller.ts
│   ├── service.controller.ts
│   └── review.controller.ts
└── routes/                  # Route definitions
    ├── index.ts             # Combines all routes
    ├── sitter.routes.ts
    ├── owner.routes.ts
    ├── booking.routes.ts
    └── auth.routes.ts       # Public auth routes
```