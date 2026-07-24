---
name: Kinetic Finance
colors:
  surface: '#f9f9ff'
  surface-dim: '#d8d9e3'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3fd'
  surface-container: '#ecedf7'
  surface-container-high: '#e6e7f2'
  surface-container-highest: '#e1e2ec'
  on-surface: '#191b23'
  on-surface-variant: '#424754'
  inverse-surface: '#2e3038'
  inverse-on-surface: '#eff0fa'
  outline: '#727785'
  outline-variant: '#c2c6d6'
  surface-tint: '#005ac2'
  primary: '#0058be'
  on-primary: '#ffffff'
  primary-container: '#2170e4'
  on-primary-container: '#fefcff'
  inverse-primary: '#adc6ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#924700'
  on-tertiary: '#ffffff'
  tertiary-container: '#b75b00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#ffb786'
  on-tertiary-fixed: '#311400'
  on-tertiary-fixed-variant: '#723600'
  background: '#f9f9ff'
  on-background: '#191b23'
  surface-variant: '#e1e2ec'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Outfit
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Outfit
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  amount-lg:
    fontFamily: JetBrains Mono
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  amount-md:
    fontFamily: JetBrains Mono
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  label-sm:
    fontFamily: Outfit
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-padding-mobile: 16px
  container-padding-desktop: 32px
  gutter: 16px
  stack-sm: 4px
  stack-md: 12px
  stack-lg: 24px
---

## Brand & Style

The design system is built for a personal finance experience that feels empowering rather than restrictive. The brand personality is **Modern Professionalism** mixed with **Optimistic Clarity**. It aims to reduce the "financial anxiety" often associated with expense tracking by using a clean, systematic interface that emphasizes progress and control.

The visual style is **Soft Minimalism**. It leverages generous whitespace, a high-fidelity neutral palette, and subtle depth to create a sense of organized calm. While the structure is rigorous and professional, the use of vibrant category colors and smooth transitions ensures the app feels approachable and motivating for daily use.

## Colors

This design system utilizes a high-contrast functional palette to ensure financial data is immediately scannable. 

- **Primary & Secondary:** Used for action-oriented elements and positive growth indicators.
- **Status Colors:** Amber and Red are reserved strictly for over-budget warnings and negative trends.
- **Data Visualization:** The specific category palette provides high distinctiveness for pie charts and transaction lists.
- **Neutral Foundation:** The background uses a cool-toned slate white (`#F8FAFC`) to allow white cards to pop with clear definition.

## Typography

The typography strategy prioritizes numerical legibility and structural hierarchy. 

- **Headlines:** Inter is used for its geometric stability and professional tone. High weights (Bold/600+) are used for section titles to anchor the layout.
- **Body:** Outfit provides a softer, more humanistic touch for descriptions and labels, balancing the technical nature of the app.
- **Financial Data:** All currency amounts, balances, and transaction figures must use JetBrains Mono. The monospaced nature ensures that decimal points align vertically in lists and tables, facilitating quick mental math.

## Layout & Spacing

The design system employs a **Fluid Grid** model based on an 8px square baseline. 

- **Mobile:** 4-column layout with 16px side margins. 
- **Desktop:** 12-column layout with a maximum content width of 1200px.
- **Rhythm:** Vertical spacing between cards and sections should follow the `stack-lg` (24px) unit to maintain a feeling of openness. Elements within cards (like a header and a chart) should use `stack-md` (12px).

## Elevation & Depth

This design system uses **Tonal Layers** combined with **Ambient Shadows** to create a clear information hierarchy without visual clutter.

- **Level 0 (Background):** `#F8FAFC` - The canvas.
- **Level 1 (Cards):** White surface with a `0px 4px 12px rgba(30, 41, 59, 0.05)` shadow. This provides a soft lift that distinguishes content areas from the background.
- **Level 2 (Modals/Popovers):** White surface with a more pronounced `0px 12px 24px rgba(30, 41, 59, 0.12)` shadow.
- **Interactive States:** Buttons and clickable cards should subtly "sink" on press (shadow reduction) or "lift" on hover (slight increase in shadow spread).

## Shapes

The shape language is consistently rounded to reinforce the "inviting" brand pillar.

- **Cards:** 12px (`rounded-lg`) corner radius for all main containers.
- **Interactive Elements:** Buttons and Input fields use an 8px (`base`) radius for a slightly more precise, functional look.
- **Small Elements:** Tags and category chips use 4px (`rounded-sm`) or are fully pill-shaped depending on the context.

## Components

### Buttons
- **Primary:** Solid `#3B82F6` with white text. 8px radius. 
- **Secondary:** Subtle `#3B82F6` (10% opacity) tint with primary color text.
- **Icon Buttons:** Use circular backgrounds for floating action buttons (FAB) but square 8px radius for inline actions.

### Cards
- White background, 12px radius, and Level 1 shadow. 
- Content should have 20px internal padding.

### Progress Bars
- Height: 8px. Fully rounded ends.
- **Logic:** Background is always a light grey. The fill color transitions based on percentage:
  - 0-70%: `#10B981` (Mint)
  - 71-90%: `#F59E0B` (Amber)
  - 91-100%+: `#EF4444` (Red)

### Input Fields
- 8px radius with a 1px border (`#E2E8F0`). 
- On focus, the border changes to Primary Blue with a 2px outer glow of 10% opacity blue.

### Category Chips
- Small, 4px radius chips. 
- Use the category color at 15% opacity for the background and 100% opacity for the text/icon to ensure legibility.

### List Items
- 1px bottom border for separation within cards. 
- Transaction lists should lead with a category icon (colored circle) and end with a right-aligned monospaced amount.