# 🚀 Welcome to Z.ai Code Scaffold

A modern, production-ready web application scaffold powered by cutting-edge technologies, designed to accelerate your development with [Z.ai](https://chat.z.ai)'s AI-powered coding assistance.

## ✨ Technology Stack

This scaffold provides a robust foundation built with:

### 🎯 Core Framework
- **⚡ Next.js 15** - The React framework for production with App Router
- **📘 TypeScript 5** - Type-safe JavaScript for better developer experience
- **🎨 Tailwind CSS 4** - Utility-first CSS framework for rapid UI development

### 🧩 UI Components & Styling
- **🧩 shadcn/ui** - High-quality, accessible components built on Radix UI
- **🎯 Lucide React** - Beautiful & consistent icon library
- **🌈 Framer Motion** - Production-ready motion library for React
- **🎨 Next Themes** - Perfect dark mode in 2 lines of code

### 📋 Forms & Validation
- **🎣 React Hook Form** - Performant forms with easy validation
- **✅ Zod** - TypeScript-first schema validation

### 🔄 State Management & Data Fetching
- **🐻 Zustand** - Simple, scalable state management
- **🔄 TanStack Query** - Powerful data synchronization for React
- **🌐 Axios** - Promise-based HTTP client

### 🗄️ Database & Backend
- **🗄️ Prisma** - Next-generation Node.js and TypeScript ORM
- **🔐 NextAuth.js** - Complete open-source authentication solution

### 🎨 Advanced UI Features
- **📊 TanStack Table** - Headless UI for building tables and datagrids
- **🖱️ DND Kit** - Modern drag and drop toolkit for React
- **📊 Recharts** - Redefined chart library built with React and D3
- **🖼️ Sharp** - High performance image processing

### 🌍 Internationalization & Utilities
- **🌍 Next Intl** - Internationalization library for Next.js
- **📅 Date-fns** - Modern JavaScript date utility library
- **🪝 ReactUse** - Collection of essential React hooks for modern development

## 🎯 Why This Scaffold?

- **🏎️ Fast Development** - Pre-configured tooling and best practices
- **🎨 Beautiful UI** - Complete shadcn/ui component library with advanced interactions
- **🔒 Type Safety** - Full TypeScript configuration with Zod validation
- **📱 Responsive** - Mobile-first design principles with smooth animations
- **🗄️ Database Ready** - Prisma ORM configured for rapid backend development
- **🔐 Auth Included** - NextAuth.js for secure authentication flows
- **📊 Data Visualization** - Charts, tables, and drag-and-drop functionality
- **🌍 i18n Ready** - Multi-language support with Next Intl
- **🚀 Production Ready** - Optimized build and deployment settings
- **🤖 AI-Friendly** - Structured codebase perfect for AI assistance

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see your application running.

## 🤖 Powered by Z.ai

This scaffold is optimized for use with [Z.ai](https://chat.z.ai) - your AI assistant for:

- **💻 Code Generation** - Generate components, pages, and features instantly
- **🎨 UI Development** - Create beautiful interfaces with AI assistance  
- **🔧 Bug Fixing** - Identify and resolve issues with intelligent suggestions
- **📝 Documentation** - Auto-generate comprehensive documentation
- **🚀 Optimization** - Performance improvements and best practices

Ready to build something amazing? Start chatting with Z.ai at [chat.z.ai](https://chat.z.ai) and experience the future of AI-powered development!

## 🎮 Featured Project: AI-Powered Family Trivia Host

This scaffold now includes a complete, production-ready **Family Trivia Night** game powered by AI! 

### 🌟 Key Features

**🤖 AI-Powered Host**
- Warm, energetic AI host that guides players through the game
- Context-aware feedback and encouragement
- Personalized greetings and celebrations

**🎯 Advanced Answer Validation**
- Fuzzy matching with Levenshtein distance algorithm
- Accepts typos, synonyms, and common variations
- Numeric tolerance (±1 for small numbers, ±10% for large)
- Partial credit for close answers (50% points)

**📊 Dynamic Difficulty Adjustment**
- Automatically adjusts question difficulty based on player performance
- Raises difficulty if accuracy >85%, lowers if <50%
- Age-adjusted difficulty for younger players
- Real-time notifications of difficulty changes

**🏆 Comprehensive Scoring System**
- Base points: Easy (100), Medium (150), Hard (200)
- Streak bonuses: +20 points after 3 correct in a row
- Hint penalty: -25% points
- Tracks per-category performance

**✨ Enhanced Superlatives**
- 🎯 **Sharpshooter** - Highest accuracy rate
- 🔥 **On a Roll** - Longest correct streak
- 🥷 **Hint Ninja** - Fewest hints used
- ⭐ **Category Ace** - Best in specific category
- 🚀 **Comeback Kid** - Best second-half improvement

**🎲 Game Modes**
- **Multiple Choice** - Traditional MC questions
- **Open-ended** - Type your answer
- **Hybrid** - Starts open, converts to MC after hint

**📋 Progress Tracking**
- Phase checklists for setup, gameplay, and conclusion
- Leaderboard updates every 3 questions
- Real-time score tracking
- Tie-breaker detection

### 🚀 Try It Out

```bash
npm run dev
# Navigate to http://localhost:3000
```

See `IMPLEMENTATION_SUMMARY.md` for complete technical details.

## 📁 Project Structure

```
src/
├── app/                     # Next.js App Router pages
│   └── api/                # API routes
│       ├── ai-host/        # AI host message generation
│       └── generate-questions/ # Question generation with validation
├── components/              # Reusable React components
│   ├── game-phases/        # Trivia game phase components
│   └── ui/                 # shadcn/ui + custom components
├── hooks/                  # Custom React hooks
└── lib/                    # Utility functions and configurations
    ├── config.ts           # Trivia game configuration
    ├── ai-host.ts          # AI host utilities
    ├── difficulty-adjuster.ts # Dynamic difficulty system
    └── store.ts            # Zustand game state management
```

## 🎨 Available Features & Components

This scaffold includes a comprehensive set of modern web development tools:

### 🧩 UI Components (shadcn/ui)
- **Layout**: Card, Separator, Aspect Ratio, Resizable Panels
- **Forms**: Input, Textarea, Select, Checkbox, Radio Group, Switch
- **Feedback**: Alert, Toast (Sonner), Progress, Skeleton
- **Navigation**: Breadcrumb, Menubar, Navigation Menu, Pagination
- **Overlay**: Dialog, Sheet, Popover, Tooltip, Hover Card
- **Data Display**: Badge, Avatar, Calendar

### 📊 Advanced Data Features
- **Tables**: Powerful data tables with sorting, filtering, pagination (TanStack Table)
- **Charts**: Beautiful visualizations with Recharts
- **Forms**: Type-safe forms with React Hook Form + Zod validation

### 🎨 Interactive Features
- **Animations**: Smooth micro-interactions with Framer Motion
- **Drag & Drop**: Modern drag-and-drop functionality with DND Kit
- **Theme Switching**: Built-in dark/light mode support

### 🔐 Backend Integration
- **Authentication**: Ready-to-use auth flows with NextAuth.js
- **Database**: Type-safe database operations with Prisma
- **API Client**: HTTP requests with Axios + TanStack Query
- **State Management**: Simple and scalable with Zustand

### 🌍 Production Features
- **Internationalization**: Multi-language support with Next Intl
- **Image Optimization**: Automatic image processing with Sharp
- **Type Safety**: End-to-end TypeScript with Zod validation
- **Essential Hooks**: 100+ useful React hooks with ReactUse for common patterns

## 🤝 Get Started with Z.ai

1. **Clone this scaffold** to jumpstart your project
2. **Visit [chat.z.ai](https://chat.z.ai)** to access your AI coding assistant
3. **Start building** with intelligent code generation and assistance
4. **Deploy with confidence** using the production-ready setup

---

Built with ❤️ for the developer community. Supercharged by [Z.ai](https://chat.z.ai) 🚀
