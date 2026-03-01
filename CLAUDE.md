# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server with hot reload (uses custom server.ts with Socket.IO)
- `npm run build` - Build the production application
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

### Database Operations
- `npm run db:push` - Push schema changes to database (development)
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:reset` - Reset database to initial state

## Project Architecture

### Technology Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **State Management**: Zustand with devtools
- **Database**: Prisma ORM with SQLite
- **Real-time**: Socket.IO integration via custom server
- **Forms**: React Hook Form + Zod validation
- **Data Fetching**: TanStack Query + Axios
- **Authentication**: NextAuth.js (configured but not implemented)
- **Internationalization**: Next Intl

### Application Structure

This is a **Family Trivia Game** application with the following core architecture:

#### State Management (`src/lib/store.ts`)
Central game state managed by Zustand:
- **Game Phases**: `setup` → `gameplay` → `conclusion`
- **Player Management**: Multi-player support with scoring, streaks, and statistics
- **Question System**: Dynamic question generation with AI integration
- **Game Settings**: Categories, difficulty, modes (MC/Open/Hybrid), hints, tie-breakers

#### Component Architecture
- **Main Game**: `src/components/trivia-game.tsx` - Phase-based game renderer
- **Game Phases**:
  - `src/components/game-phases/setup-phase.tsx` - Player setup and configuration
  - `src/components/game-phases/gameplay-phase.tsx` - Core trivia gameplay
  - `src/components/game-phases/conclusion-phase.tsx` - Results and scoring
- **UI Components**: `src/components/ui/` - Complete shadcn/ui component library

#### API Routes
- **Health Check**: `src/app/api/health/route.ts`
- **Question Generation**: `src/app/api/generate-questions/route.ts` - Uses Z.ai SDK for AI-powered question generation with fallback templates

#### Custom Server (`server.ts`)
- Standalone Next.js server with Socket.IO integration
- Supports real-time gameplay features
- Custom development setup with nodemon and logging

### Key Features

#### AI-Powered Question Generation
- Uses `z-ai-web-dev-sdk` for dynamic trivia question creation
- Fallback template system for reliable question generation
- Family-friendly content filtering
- Multiple question modes: Multiple Choice, Open-ended, Hybrid

#### Game Mechanics
- **Scoring System**: Base points by difficulty + streak bonuses - hint penalties
- **Adaptive Gameplay**: Questions adapt to player skill levels
- **Multi-player Support**: Turn-based gameplay with individual statistics
- **Answer Validation**: Intelligent answer matching with acceptable variations

#### Production Features
- **Type Safety**: End-to-end TypeScript with Zod schemas
- **Performance**: Optimized build with Next.js standalone mode
- **Internationalization**: Multi-language support ready
- **Responsive Design**: Mobile-first with Tailwind CSS

### Database Schema
The Prisma schema includes basic User/Post models but can be extended for:
- Game history persistence
- User profiles and statistics
- Question categorization and storage

### Development Notes

#### Custom Development Server
The project uses a custom server setup (`server.ts`) instead of the default Next.js dev server. This provides:
- Socket.IO integration for real-time features
- Custom logging and development tools
- Production-ready server configuration

#### Component Library
The project includes a comprehensive shadcn/ui component library with:
- Form components with validation
- Data display (tables, charts, badges)
- Interactive elements (dialogs, sheets, tooltips)
- Layout components (resizable panels, scroll areas)

#### AI Integration
The question generation system:
- Prioritizes template-based questions for reliability
- Falls back to AI generation when templates are unavailable
- Includes robust error handling and fallback mechanisms
- Maintains family-friendly content standards

## Common Mistakes

- Running `npm run dev` without the custom `server.ts` — Socket.IO real-time features require the custom server, not the default Next.js dev server.
- Running `npm run db:push` before `npm run db:generate` — Prisma client must be generated first or schema changes silently fail.
- Modifying game state directly instead of through Zustand store methods in `src/lib/store.ts` — breaks the phase system and scoring logic.
- Assuming questions come from a remote API at all times — the system silently falls back to templates when the AI SDK is unavailable.