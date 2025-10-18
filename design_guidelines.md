# Design Guidelines: Inha University Study Materials Platform

## Design Approach: Hybrid System (Material Design + Academic Marketplace)

**Selected Approach:** Material Design foundation with marketplace patterns inspired by Gumroad and Korean university platforms
**Rationale:** The platform requires trustworthy, data-rich interfaces for academic content while maintaining marketplace efficiency. Material Design provides the structured hierarchy needed for filters, categories, and seller information, while marketplace patterns ensure smooth buying/selling flows.

**Core Design Principles:**
- Trust through clarity: Clean layouts with prominent verification badges and grade displays
- Academic professionalism: Subdued palette with strategic accent colors
- Efficient discovery: Card-based layouts with comprehensive filtering
- Community-focused: Warm, approachable tone for peer-to-peer transactions

---

## Core Design Elements

### A. Color Palette

**Primary Colors (Dark Mode):**
- Primary Brand: 220 70% 50% (Trust blue - academic, reliable)
- Primary Light: 220 65% 60% (Interactive states)
- Background: 222 20% 12% (Deep navy-black)
- Surface: 220 18% 16% (Card backgrounds)
- Surface Elevated: 220 16% 20% (Modals, dropdowns)

**Primary Colors (Light Mode):**
- Primary Brand: 220 75% 45%
- Background: 0 0% 98%
- Surface: 0 0% 100%
- Surface Subtle: 220 20% 96%

**Accent & Semantic Colors:**
- Success (Grade A+): 140 70% 45% (Verification badges)
- Warning: 35 90% 55% (Pending reviews)
- Text Primary: 220 15% 95% (dark) / 220 20% 15% (light)
- Text Secondary: 220 10% 65% (dark) / 220 15% 45% (light)
- Border: 220 15% 25% (dark) / 220 20% 85% (light)

### B. Typography

**Font Families:**
- Primary (Korean + Latin): 'Pretendard', 'Inter', -apple-system, system-ui, sans-serif
- Fallback for older browsers: 'Noto Sans KR', 'Roboto', sans-serif

**Type Scale:**
- Hero/Display: 3rem (48px) / font-bold / -0.02em
- H1 (Page Titles): 2rem (32px) / font-bold / -0.01em
- H2 (Section Headers): 1.5rem (24px) / font-semibold
- H3 (Card Titles): 1.125rem (18px) / font-semibold
- Body Large: 1rem (16px) / font-normal / 1.6 line-height
- Body: 0.875rem (14px) / font-normal / 1.5 line-height
- Caption (Metadata): 0.75rem (12px) / font-medium / text-secondary

### C. Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Component padding: p-4 (mobile), p-6 (tablet), p-8 (desktop)
- Section spacing: py-12 (mobile), py-16 (tablet), py-20 (desktop)
- Card gaps: gap-4 (list items), gap-6 (grid cards)

**Grid Systems:**
- Material Cards Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- Dashboard Layout: 64px left sidebar (desktop) + main content area
- Max Content Width: max-w-7xl for listings, max-w-4xl for detail pages

### D. Component Library

**Navigation:**
- Top Bar: Fixed header with logo (left), search (center), user menu (right) - h-16, backdrop-blur
- Category Pills: Horizontal scroll chips for 전공/핵심교양/일반교양 - rounded-full, px-4 py-2
- Breadcrumbs: Material-style with chevron separators

**Cards (Material Elevated Pattern):**
- Material Card: rounded-xl, shadow-md on hover, transition-all 200ms
- Content: Thumbnail (16:9 aspect), Title (2-line clamp), Price (bold, primary color), Seller badge, Rating stars
- Grade Badge: Absolute top-right, rounded-bl-lg, bg-success with "A+" text
- Verified Checkmark: Small icon next to seller name (success color)

**Forms & Inputs:**
- Text Fields: Material outlined style, rounded-lg, border-2, focus:ring-2 ring-primary/20
- File Upload: Dashed border zone with upload icon, drag-drop area
- Filters Panel: Left sidebar (desktop) or slide-over drawer (mobile), checkbox groups with counts

**Buttons:**
- Primary CTA: bg-primary, hover:brightness-110, rounded-lg, px-6 py-3, font-semibold
- Secondary: variant="outline" with border-2, hover:bg-surface-elevated
- Icon Buttons: 40x40px, rounded-full, hover:bg-surface-elevated

**Seller Dashboard Components:**
- Stats Cards: Grid of 4 cards showing total sales/revenue/materials/rating
- Material Table: For uploaded materials with edit/delete actions
- Upload Modal: Full-screen on mobile, centered modal on desktop, multi-step form

**Data Display:**
- Rating Stars: Yellow-500 filled, gray-300 outline, with numeric score "(4.8)"
- Price Tags: text-2xl font-bold, primary color for price, text-sm for "원" unit
- Sample Preview: Lightbox gallery with thumbnail grid (3x2 on detail page)

**Trust Elements:**
- Verification Badges: Rounded pills with icons - "성적 인증" (green), "노트 검증" (blue)
- Seller Profile Card: Avatar, name, department, total materials, rating, join date
- Review Section: User avatar + name + rating + text + helpful count

### E. Animations

**Minimal, Purposeful Animations:**
- Card Hover: scale-102, shadow-lg transition (200ms)
- Filter Apply: Fade-in new results (300ms)
- Badge Appearance: Subtle scale-in when verified (500ms)
- Page Transitions: None - instant navigation for data density

---

## Page-Specific Layouts

### Landing/Marketing Page (Korean University Style)
- **Hero Section:** 70vh with background gradient (220 60% 20% to 240 50% 15%), centered text "A+ 선배의 노트를 만나보세요", CTA buttons, floating material card previews
- **Features:** 3-column grid (인증 시스템, 간편 검색, 안전 거래) with icons
- **Popular Materials:** Horizontal scroll showcase with top-rated cards
- **How It Works:** 3-step visual flow (판매자 등록 → 구매자 검색 → 거래 완료)
- **Trust Section:** Student testimonials, verification process explanation
- **CTA Footer:** Centered "지금 시작하기" with secondary "더 알아보기"

### Marketplace/Browse Page
- **Filter Sidebar (Desktop):** 240px width, sticky, categories → price range → grade verification → professor
- **Results Grid:** 3-4 column responsive grid, infinite scroll or pagination
- **Search Bar:** Prominent top position with autocomplete for course names/professors
- **Sort Dropdown:** Material-style select (최신순, 인기순, 낮은 가격순)

### Material Detail Page
- **Two-Column Layout:** 60% left (image gallery + description), 40% right (purchase card)
- **Purchase Card:** Sticky, shows price, seller info, badges, "구매하기" CTA, sample download
- **Review Section:** Below description, sortable by rating, with helpful voting

### Seller Dashboard
- **Side Navigation:** Vertical tabs (내 자료, 판매 현황, 정산, 프로필)
- **Stats Overview:** 4-card grid with icons (total uploads, sales, revenue, avg rating)
- **Material Management:** Table view with thumbnail, title, price, status, actions

---

## Images

**Hero Image:** Full-width gradient overlay image showing blurred study materials/notebooks with Korean text overlaid - conveys academic focus
**Material Cards:** 16:9 thumbnail images of actual study notes/materials (user-uploaded)
**Verification Icons:** Use Heroicons for badges (CheckBadgeIcon for verified, AcademicCapIcon for grade)
**Empty States:** Illustrations of students studying for no-results pages

---

## Korean-Specific Considerations
- Font weight 500-600 for Korean text (lighter weights can appear too thin)
- Generous line-height (1.6-1.7) for Korean readability
- Respect Korean punctuation spacing (e.g., "가격: 5,000원" not "가격:5,000원")
- Use Korean-friendly colors (avoid pure black, use very dark grays 90% black max)