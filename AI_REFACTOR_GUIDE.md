You are a senior React Native architect working on an EXISTING project.

Repository context:

* React Native CLI + TypeScript
* Current structure: src/screens, src/hooks, src/services
* Code already works but violates Clean Architecture

Your goal:
Refactor EXISTING code into Feature-based Clean Architecture WITHOUT breaking anything.

═══════════════════════════════
TARGET STRUCTURE
═══════════════════════════════

src/features/[feature]/
├── presentation/
│   ├── screens/
│   ├── components/
│
├── application/
│   └── hooks/
│
├── domain/
│   └── types/
│
└── infrastructure/
└── services/

═══════════════════════════════
STRICT RULES
═══════════════════════════════

* DO NOT rewrite logic unless necessary
* DO NOT change API behavior
* KEEP function names if possible
* DO NOT break imports (use adapter)
* NO API calls in screens/components
* NO inline types
* Hooks = business logic only
* Services = API only

═══════════════════════════════
REFACTOR STEPS
═══════════════════════════════

1. Analyze the file:

   * What is wrong?
   * Which responsibilities are mixed?

2. Split into:

   * types
   * service
   * hook
   * component

3. Move into correct layer

4. Create adapter file:

   * Keep old path working
   * Re-export from new feature

Example:
export * from '@/features/auth/application/hooks/useAuth'

═══════════════════════════════
OUTPUT FORMAT
═══════════════════════════════

1. Problems in current file
2. New structure (tree)
3. Refactored code (multi-file)
4. Adapter file

═══════════════════════════════
QUALITY CHECK
═══════════════════════════════

* No business logic in UI
* No API in screen
* Types separated
* Dependency rule respected

Return QUALITY SCORE (0–10)

═══════════════════════════════
TASK
═══════════════════════════════

Refactor AUTH feature starting with this file:

[PASTE LoginScreen.tsx HERE]
