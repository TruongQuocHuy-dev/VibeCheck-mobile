Bạn là AI Agent phát triển React Native + TypeScript cho VibeCheck - Social Discovery App 2026.
Mọi code sinh ra PHẢI tuân thủ Clean Architecture 4 layers và đạt Quality Score tối thiểu 9.0/10.

═══════════════════════════════════════════════
CLEAN ARCHITECTURE — 4 LAYERS (BẮT BUỘC)
═══════════════════════════════════════════════

Dependency Rule: Chỉ import từ layer ngoài vào trong (Presentation → Application → Domain → Infrastructure).
Layer trong KHÔNG BAO GIỜ import từ layer ngoài.

┌─────────────────────────────────────────┐
│  LAYER 1: PRESENTATION                  │
│  src/screens/        → UI rendering     │
│  src/components/     → Atomic UI parts  │
│  Được phép import: Application, Domain  │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  LAYER 2: APPLICATION                   │
│  src/hooks/          → Business logic   │
│  Được phép import: Domain, Infra        │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  LAYER 3: DOMAIN                        │
│  src/types/          → Types/Interfaces │
│  src/models/         → Entities         │
│  src/validators/     → Zod schemas      │
│  KHÔNG import bất cứ layer nào khác     │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  LAYER 4: INFRASTRUCTURE                │
│  src/services/       → API calls only   │
│  src/constants/      → Design tokens    │
│  src/assets/         → Asset registry   │
└─────────────────────────────────────────┘

═══════════════════════════════════════════════
COMPONENT-BASED DESIGN — QUY TẮC KÍCH THƯỚC
═══════════════════════════════════════════════

1. MAX 300 LINES PER FILE (không tính comments/imports)
   - Nếu component > 300 lines → tách thành sub-components
   - Mỗi component CHỈ làm 1 việc (Single Responsibility)

2. ATOMIC DESIGN HIERARCHY
   src/components/
   ├── atoms/        → Button, Icon, Text, Input  (<50 lines)
   ├── molecules/    → SearchBar, UserCard        (<100 lines)
   ├── organisms/    → FeedList, ProfileHeader    (<300 lines)
   └── templates/    → ScreenLayout, TabLayout    (<300 lines)

3. COMPONENT NAMING
   - File:      PascalCase.tsx          → UserProfileCard.tsx
   - Component: PascalCase             → export default UserProfileCard
   - Test:      PascalCase.test.tsx    → UserProfileCard.test.tsx
   - Story:     PascalCase.stories.tsx → UserProfileCard.stories.tsx

4. TÁCH NHỎ KHI:
   - Component render > 1 list → tách ListItem riêng
   - JSX lồng > 3 levels → tách sub-component
   - Logic điều kiện phức tạp → tách vào hook

═══════════════════════════════════════════════
NAMING CONVENTIONS — BẮT BUỘC TOÀN DỰ ÁN
═══════════════════════════════════════════════

FILES:
  Components/Screens : PascalCase.tsx       → VibeCard.tsx
  Hooks              : camelCase.ts         → useVibeCard.ts
  Services           : camelCase.service.ts → vibe.service.ts
  Types              : kebab-case.types.ts  → vibe-card.types.ts
  Constants          : camelCase.ts         → colors.ts
  Utils              : camelCase.util.ts    → format.util.ts
  Tests              : [name].test.ts(x)    → useVibeCard.test.ts

VARIABLES & FUNCTIONS:
  Variables          : camelCase            → isLoading, userData
  Constants          : UPPER_SNAKE_CASE     → MAX_RETRY_COUNT
  Functions          : camelCase verb+noun  → fetchUserProfile()
  Event handlers     : handle + Event       → handleCardPress()
  Boolean vars       : is/has/can/should    → isVisible, hasError

TYPES & INTERFACES:
  Props interface    : [Name]Props          → VibeCardProps
  Data interface     : [Name]Data           → UserProfileData
  Hook return        : Use[Name]Return      → UseVibeCardReturn
  API response       : [Name]Response       → FetchVibeResponse
  API request        : [Name]Request        → CreateVibeRequest
  Enum               : PascalCase           → VibeStatus { Active, Expired }

HOOKS:
  Data fetching      : use[Entity]          → useUser, useVibe
  Feature logic      : use[Feature]         → useVibeCard, useDiscovery
  Animation          : use[Feature]Animations → useCardAnimations
  Form               : use[Feature]Form     → useLoginForm

SERVICES:
  Naming             : [entity].service.ts  → user.service.ts
  Methods            : verb + noun          → createVibe(), fetchFeed()

EXPORTS:
  Components         : export default ComponentName
  Types/Hooks        : export named exports
  index.ts           : Re-export tất cả từ folder

IMPORTS:
  Relative paths     : ../../constants/colors
  ❌ KHÔNG dùng      : ../../../.. (quá 3 level)

═══════════════════════════════════════════════
TYPES — TÁCH FILE RIÊNG (BẮT BUỘC)
═══════════════════════════════════════════════

CẤU TRÚC: src/types/[layer]/[feature].types.ts
  src/types/
  ├── presentation/
  │   ├── vibe-card.types.ts     → Props, UIState interfaces
  │   └── profile-header.types.ts
  ├── application/
  │   ├── vibe.types.ts          → UseVibeReturn, VibeState
  │   └── auth.types.ts
  ├── domain/
  │   ├── user.types.ts          → UserData, UserEntity
  │   └── vibe.types.ts
  └── infrastructure/
      └── api.types.ts           → ApiResponse, ApiError

QUY TẮC:
  - KHÔNG inline interface trong component/screen file
  - KHÔNG import component vào file types
  - TẤT CẢ properties phải có JSDoc comment
  - Dùng `type` cho union/intersection, `interface` cho objects

VÍ DỤ CHUẨN:
  // src/types/presentation/vibe-card.types.ts
  /** Props for the VibeCard component */
  export interface VibeCardProps {
    /** Unique identifier of the vibe */
    vibeId: string;
    /** Callback when card is pressed */
    onPress: (id: string) => void;
    /** Whether the card is in loading state */
    isLoading?: boolean;
    /** Test identifier for E2E testing */
    testID?: string;
  }

═══════════════════════════════════════════════
DESIGN TOKENS — KHÔNG HARDCODED (BẮT BUỘC)
═══════════════════════════════════════════════

KHÔNG BAO GIỜ dùng:
  ❌ color: '#FF6B6B'
  ❌ fontSize: 16
  ❌ padding: 12
  ❌ borderRadius: 8
  ❌ || '#fallbackHex'
  ❌ ?? '#rgbaFallback'

LUÔN DÙNG:
  ✅ color: colors.primary
  ✅ color: colors.text.primary
  ✅ color: colors.background.card
  ✅ fontSize: typography.sizes.md
  ✅ fontWeight: typography.weight.semibold
  ✅ padding: spacing.md
  ✅ borderRadius: spacing.borderRadius.lg
  ✅ ...shadows.glass  (spread shadow object)
  ✅ backgroundImage: ASSETS.URLS.gradient

TOKEN FILES (src/constants/):
  colors.ts      → Tất cả màu sắc
  typography.ts  → fontSize, fontWeight, lineHeight
  spacing.ts     → padding, margin, gap, borderRadius
  shadows.ts     → shadow objects (glass, button, card)
  assets.ts      → ASSETS.URLS.*, ASSETS.ICONS.*

═══════════════════════════════════════════════
SEPARATION OF CONCERNS — BẮT BUỘC
═══════════════════════════════════════════════

SCREENS (src/screens/):
  ✅ JSX rendering
  ✅ Import và gọi hooks
  ✅ SafeAreaView wrapper
  ✅ Navigation props handling
  ❌ KHÔNG fetch API
  ❌ KHÔNG chứa useState cho business data
  ❌ KHÔNG chứa useEffect cho data fetching
  ❌ KHÔNG chứa animation logic

HOOKS (src/hooks/):
  ✅ useState, useEffect, useCallback, useMemo
  ✅ Gọi services
  ✅ State management (Zustand store actions)
  ✅ Business logic, validation
  ✅ Animation logic (use[Feature]Animations)
  ❌ KHÔNG chứa JSX
  ❌ KHÔNG gọi API trực tiếp (qua services)

SERVICES (src/services/):
  ✅ API calls (axios/fetch)
  ✅ Request/Response mapping
  ✅ Error normalization
  ❌ KHÔNG chứa business logic
  ❌ KHÔNG chứa state
  ❌ KHÔNG import hooks
  ❌ KHÔNG swallow errors (empty catch)

COMPONENTS (src/components/):
  ✅ Pure UI, nhận props → render
  ✅ Local UI state (isHovered, isExpanded)
  ❌ KHÔNG fetch data
  ❌ KHÔNG chứa business logic

═══════════════════════════════════════════════
SAFEAREA & ACCESSIBILITY — BẮT BUỘC
═══════════════════════════════════════════════

SAFEAREA:
  - Import: import { SafeAreaView } from 'react-native-safe-area-context'
  - Luôn dùng: edges={['top', 'left', 'right']} cho screens
  - Bottom edge chỉ thêm khi KHÔNG có tab bar
  - style={{ flex: 1, backgroundColor: colors.background.primary }}

ACCESSIBILITY:
  - accessibilityLabel: Mọi icon, image button
  - accessibilityRole: 'button' cho TouchableOpacity
  - accessibilityRole: 'link' cho Text có onPress
  - accessibilityRole: 'image' cho Image
  - accessibilityHint: Cho actions không rõ ràng
  - accessibilityState: { disabled, selected, checked } khi relevant

TEST IDs:
  - testID prop với default value trên mọi interactive element
  - Convention: `[screen]-[component]-[action]`
  - Ví dụ: testID="vibe-card-like-button"

═══════════════════════════════════════════════
WORKFLOW TẠO FILE MỚI — THEO ĐÚ THỨ TỰ
═══════════════════════════════════════════════

Bước 1: TẠO TYPES FILE
  → src/types/[layer]/[feature].types.ts
  → Định nghĩa tất cả Props, Data, Return interfaces với JSDoc

Bước 2: TẠO DOMAIN ENTITIES (nếu cần)
  → src/models/[entity].model.ts
  → src/validators/[entity].validator.ts (Zod)

Bước 3: TẠO SERVICE (nếu có API)
  → src/services/[entity].service.ts
  → CHỈ API calls, import types từ bước 1

Bước 4: TẠO HOOK
  → src/hooks/use[Feature].ts
  → Import service và types từ bước trên
  → Chứa toàn bộ business logic

Bước 5: TẠO ANIMATION HOOK (nếu có animation)
  → src/hooks/use[Feature]Animations.ts

Bước 6: TẠO COMPONENTS (Atomic → Molecule → Organism)
  → Import types từ bước 1
  → KHÔNG quá 300 lines

Bước 7: TẠO SCREEN
  → Import hook + components
  → Chỉ UI + SafeAreaView

Bước 8: VERIFY QUALITY SCORE ≥ 9.0/10

═══════════════════════════════════════════════
QUALITY SCORE — TỐI THIỂU 9.0/10 ĐỂ MERGE
═══════════════════════════════════════════════

[+1.0] SafeAreaView đúng cách từ react-native-safe-area-context
[+1.0] Tất cả types trong file riêng src/types/[layer]/
[+1.0] Không dùng hex/rgba trực tiếp → dùng colors.ts
[+1.0] Không hardcoded spacing/fontSize → dùng tokens
[+1.0] Không fallback patterns (|| '#hex')
[+1.0] Animation logic trong useFeatureAnimations hook
[+1.0] Shadow styles từ shadows.ts constant
[+1.0] Accessibility hoàn chỉnh (label + role + hint)
[+1.0] testID props với default values
[+1.0] Component ≤ 300 lines + đúng Atomic level
[+0.5] JSDoc trên tất cả interface properties   (BONUS)
[+0.5] Zero any/unknown types — strict TypeScript (BONUS)

TARGET: 10/10 cho production code.
Bắt buộc tự chấm điểm cuối mỗi response sinh code.

═══════════════════════════════════════════════
KHÔNG BAO GIỜ — HARD RULES
═══════════════════════════════════════════════

❌ Inline interface trong component/screen file
❌ Hardcoded hex colors, spacing, fontSizes
❌ API calls trong Screens hoặc Components
❌ Animation logic trong Screens
❌ Fallback patterns (|| '#hex', ?? '#rgba')
❌ Bỏ qua SafeAreaView
❌ Bỏ qua accessibility labels
❌ Import component vào file types
❌ Component/file > 300 lines (không tính imports)
❌ Dùng `any` type
❌ Import từ layer trong ra layer ngoài (vi phạm Dependency Rule)
❌ Empty catch blocks (swallow errors)
❌ Import paths quá 3 level (../../../..)