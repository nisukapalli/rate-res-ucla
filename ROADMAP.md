# Project Roadmap: Rate Res UCLA - MVP Focus

## Philosophy & Approach

This roadmap follows an **incremental, architecture-first** approach focused on getting the core MVP working. We'll build:
1. **Building pages** - Display housing units (dorms/apartments)
2. **Reviews with star ratings** - Allow users to submit and view text reviews with ratings

We'll skip authentication, favorites, filtering, and maps for now - these can be added later once the core is working.

---

## Phase 0: Foundation & Planning 🏗️

### 0.1 Database Schema Design
**Goal:** Design a minimal, focused database schema for the MVP.

**What we'll plan:**
- **HousingUnits table** - Dorms/apartments with basic metadata (name, address, type, description)
- **Reviews table** - Text reviews with star ratings, timestamps, and relationship to housing units

**Key decisions:**
- Keep it simple - no user authentication yet (reviews can be anonymous for MVP)
- Normalization - separate tables for housing and reviews (one-to-many relationship)
- Star rating storage - integer (1-5) vs decimal for flexibility
- Timestamps - created/updated at fields
- Soft deletes - should we allow deleting reviews or just flagging them?

**Deliverable:** Prisma schema file with comments explaining each decision

---

### 0.2 Next.js 15 App Router Structure
**Goal:** Establish a clean folder structure that follows Next.js 15 conventions.

**Structure we'll use:**
```
app/
  housing/
    page.tsx              # List all housing units (SSR)
    [id]/
      page.tsx            # Individual housing detail page (SSR)
  api/
    reviews/
      route.ts            # POST endpoint for creating reviews
  layout.tsx              # Root layout
  page.tsx                # Home page

lib/
  prisma/
    client.ts             # Prisma client singleton
  services/
    housing.service.ts    # Business logic for housing
    review.service.ts     # Business logic for reviews
  utils/
    types.ts              # Shared TypeScript types

components/
  ui/                     # Reusable UI components (buttons, cards, etc.)
  housing/
    HousingCard.tsx       # Card component for housing list
    HousingDetail.tsx     # Detail view component
  reviews/
    ReviewForm.tsx        # Form to submit reviews (Client Component)
    ReviewList.tsx        # Display list of reviews
    StarRating.tsx        # Star rating display/input component
```

**Key decisions:**
- Keep it flat and simple for MVP
- Separation of concerns (UI, services, types)
- Server Components by default, Client Components only for interactivity

**Deliverable:** Folder structure with placeholder files

---

## Phase 1: Core Infrastructure 🔧

### 1.1 Project Setup
**Goal:** Initialize Next.js 15 with TypeScript and configure the development environment.

**What we'll do:**
- Initialize Next.js 15 with TypeScript
- Configure ESLint and Prettier
- Set up environment variables structure
- Install core dependencies (Prisma, Zod for validation)

**Key decisions:**
- TypeScript strict mode configuration
- Import alias configuration (`@/` for cleaner imports)
- Environment variable naming conventions

---

### 1.2 Database Setup
**Goal:** Connect Prisma to Supabase PostgreSQL and establish the connection pattern.

**What we'll do:**
- Set up Supabase project and get connection string
- Configure Prisma with PostgreSQL provider
- Create Prisma client singleton pattern (prevents multiple instances in dev)
- Set up database migrations workflow

**Key decisions:**
- Prisma client singleton pattern (why it matters in Next.js)
- Migration strategy (when to use `prisma migrate` vs `prisma db push`)
- Connection pooling considerations

---

## Phase 2: MVP - Core Features 🎯

### 2.1 Housing Units Data Model
**Goal:** Create the housing units schema and seed initial data.

**What we'll do:**
- Implement HousingUnits Prisma model
- Add fields: name, address, type (dorm/apartment), description
- Create seed script with UCLA housing data
- Build Prisma service layer for fetching housing units

**Key decisions:**
- What fields are essential for MVP? (name, address, type, description)
- Data validation at schema vs application level
- Seeding strategy for initial data

---

### 2.2 Housing List & Detail Pages
**Goal:** Build the core pages to view housing units.

**What we'll do:**
- Create housing list page (SSR with React Server Components)
- Create dynamic housing detail page `[id]`
- Implement basic UI for displaying housing information
- Add loading and error states

**Architecture decisions:**
- **Server Components** for data fetching (why: no JS needed, faster)
- **When to use Client Components** (only for interactive forms later)
- Data fetching patterns (direct Prisma calls in Server Components)
- Caching strategy with Next.js 15

---

### 2.3 Reviews System
**Goal:** Allow users to create and view reviews with star ratings.

**What we'll do:**
- Implement Reviews Prisma model with relationship to HousingUnits
- Create review submission form (Client Component)
- Build API route for creating reviews (Route Handler)
- Display reviews on housing detail page
- Calculate and display average ratings
- Build star rating UI component

**Architecture decisions:**
- **Server Actions vs Route Handlers** (we'll use Route Handlers for MVP)
- Form validation strategy (Zod schema validation)
- Star rating storage and calculation
- Review display and sorting (newest first? highest rated first?)

---

## Phase 3: Polish & Deployment 🚀

### 3.1 Basic Error Handling
**Goal:** Add basic error handling and validation.

**What we'll do:**
- Form validation with Zod
- API error handling patterns
- User-friendly error messages
- Basic error boundaries

---

### 3.2 Styling & UI Polish
**Goal:** Make it look good and feel polished.

**What we'll do:**
- Choose styling approach (Tailwind CSS recommended for speed)
- Build reusable UI components
- Add loading states and skeletons
- Responsive design

---

### 3.3 Deployment to Vercel
**Goal:** Deploy the application to production.

**What we'll do:**
- Configure Vercel project
- Set up environment variables
- Configure database connection for production
- Set up Prisma migrations in CI/CD
- Test production deployment

**Key considerations:**
- Vercel deployment workflow
- Database migrations in production
- Environment variable management

---

## Phase 4: Future Enhancements (Post-MVP) ✨

These features can be added later once the core MVP is working and stable.

### 4.1 Authentication Foundation
**Goal:** Set up NextAuth.js with a provider (email/password or OAuth).

**What we'll do:**
- Configure NextAuth with chosen provider(s)
- Set up session strategy (JWT vs database sessions)
- Create authentication API routes
- Build basic login/signup pages
- Update Reviews model to link to Users

**Key decisions:**
- JWT vs database sessions (we'll likely use JWT for simplicity)
- Provider choice (email/password vs OAuth vs both)
- Session management and refresh strategy

---

### 4.2 User Favorites
**Goal:** Allow users to save favorite housing units.

**What we'll do:**
- Create Favorites junction table (many-to-many relationship)
- Build favorite toggle functionality
- Create favorites page to view saved items
- Add favorite indicators throughout the app

**Architecture decisions:**
- Many-to-many relationship pattern
- Optimistic updates for better UX
- Caching favorite state

---

### 4.3 Filtering & Sorting
**Goal:** Enable users to filter and sort housing units.

**What we'll do:**
- Implement filtering by type, rating, price range
- Add sorting options (rating, newest, etc.)
- Build filter UI components
- Use URL search params for shareable filtered views

**Architecture decisions:**
- Client-side vs server-side filtering (we'll use server-side for scalability)
- URL state management (searchParams in Next.js)
- Database query optimization with Prisma

---

### 4.4 Interactive Map
**Goal:** Display housing units on an interactive Westwood map.

**What we'll do:**
- Choose mapping library (likely Mapbox or Google Maps)
- Add coordinates (lat/lng) to HousingUnits model
- Create map component with markers for each housing unit
- Implement click interactions (marker → detail page)
- Add clustering for many markers
- Integrate with housing list (map + list view)

**Architecture decisions:**
- Map library choice (cost, features, licensing)
- Client Component necessity (maps require browser APIs)
- Performance optimization (lazy loading, marker clustering)
- Coordinate system and bounds

---

### 4.5 Advanced Features
**Goal:** Additional enhancements for a richer experience.

**What we'll add:**
- **Search functionality** - Full-text search for housing units
- **User Profiles** - User review history and profile pages
- **Review Reactions** - Helpful/not helpful votes on reviews
- **Photo Uploads** - Allow users to upload photos with reviews
- **Advanced Analytics** - Review trends, popular housing, etc.
- **Admin Dashboard** - Content moderation and management tools

---

### 4.6 Performance Optimization
**Goal:** Optimize for production performance at scale.

**What we'll do:**
- Implement proper caching strategies
- Optimize images (Next.js Image component)
- Add loading states and skeletons
- Database query optimization
- Code splitting and bundle analysis

**Key considerations:**
- Next.js 15 caching (fetch cache, route cache, full route cache)
- Database indexing strategy
- Image optimization with Next.js Image

---

### 4.7 Testing Strategy
**Goal:** Add tests for critical paths.

**What we'll do:**
- Unit tests for service layer functions
- Integration tests for API routes
- E2E tests for critical user flows

**Key decisions:**
- Testing library choice
- What to test (focus on business logic)
- Mocking strategies

---

## Development Principles

1. **Explain First, Code Second** - Every feature starts with architecture discussion
2. **Incremental Development** - Build and test each phase before moving on
3. **Type Safety** - Leverage TypeScript and Prisma types throughout
4. **Server-First** - Use Server Components and SSR by default, Client Components only when needed
5. **Separation of Concerns** - UI components, services, and types in separate layers
6. **Keep It Simple** - MVP focus - no over-engineering

---

## Next Steps

Start with **Phase 0.1: Database Schema Design**. We'll discuss:
- What data we need to store for housing units
- How reviews relate to housing units
- Star rating storage approach
- What fields are essential vs nice-to-have

Ready to begin? Let's start planning the database schema!
