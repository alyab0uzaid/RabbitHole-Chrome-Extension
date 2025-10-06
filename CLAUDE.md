# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RabbitHole is a Chrome/Firefox browser extension built with WXT framework. It provides Wikipedia preview and research capabilities by allowing users to select text on any webpage and view Wikipedia articles in a sidebar.

**Tech Stack:**
- **WXT**: Browser extension framework with React/Vite integration
- **React 18**: UI framework with TypeScript
- **Tailwind CSS**: Utility-first CSS with postcss-rem-to-px conversion
- **shadcn/ui**: Reusable component library built on Radix UI
- **i18next**: Internationalization (supports English and Chinese)

## Development Commands

```bash
# Development
npm run dev                  # Start development mode for Chrome (auto-reloads browser)
npm run dev:firefox         # Start development mode for Firefox

# Build
npm run build               # Production build for Chrome
npm run build:firefox       # Production build for Firefox

# Package
npm run zip                 # Create distributable ZIP for Chrome
npm run zip:firefox         # Create distributable ZIP for Firefox

# Type checking
npm run compile             # Run TypeScript type checker (no emit)

# Setup
npm install                 # Install dependencies
npm run postinstall         # Run automatically after install (calls wxt prepare)
```

## Architecture & File Structure

### Extension Entry Points

The extension follows WXT's entry point convention under `entrypoints/`:

**Background Script** (`entrypoints/background.ts`)
- Manages message passing between content scripts and sidepanel
- Stores last selected text in memory
- Opens sidepanel via `browser.sidePanel.open()`
- Broadcasts theme/locale changes to active tabs

**Content Script** (`entrypoints/content/text-selection.ts`)
- Runs on all pages (`matches: ['*://*/*']`)
- Detects text selection via `mouseup` event
- Shows inline preview card with "Open in Sidebar" button
- Sends `openSidePanel` message to background script
- Uses vanilla DOM manipulation (not React) to avoid shadow DOM complexity

**Sidepanel** (`entrypoints/sidepanel/`)
- Main React app with navigation sidebar
- Three views: Home, Wikipedia, Settings
- Receives selected text from background script
- Fetches Wikipedia articles via API and displays in iframe

### Message Passing System

Messages use a typed system defined in `entrypoints/types.ts`:

**Message Types:**
- `openSidePanel` - Content script → Background (includes selectedText)
- `getSelectedText` - Sidepanel → Background (retrieves stored text)
- `clickExtIcon` - Background → Content script (extension icon clicked)
- `changeTheme` - Sidepanel → Background → Content script
- `changeLocale` - Sidepanel → Background → Content script

**Flow Example:**
1. User selects text → content script detects
2. User clicks "Open in Sidebar" → sends `openSidePanel` message
3. Background script stores text + opens sidepanel
4. Sidepanel sends `getSelectedText` → receives stored text
5. Sidepanel fetches Wikipedia article and displays

### Component Structure

**UI Components** (`components/ui/`)
- shadcn/ui components (button, card, alert, tooltip, etc.)
- Installed via `npx shadcn-ui@latest add <component>`
- Configured in `components.json`

**Settings Components** (`components/settings/`)
- `theme-settings.tsx` - Dark/light mode switcher
- `i18n-settings.tsx` - Language switcher (en/zh_CN)

**Theme System** (`components/theme-provider.tsx`)
- Context-based theme management
- Persists theme to `browser.storage.local`
- Applied via className on root div

**Internationalization** (`components/i18n.ts`, `components/i18nConfig.ts`)
- Lazy-loads translation files from `locales/`
- Structure: `locales/{locale}/{namespace}.json`
- Namespaces: `common`, `content`, `sidepanel`
- Usage: `const {t} = useTranslation(); t('key')`

## Key Configuration

**WXT Config** (`wxt.config.ts`)
- Manifest permissions: `activeTab`, `scripting`, `sidePanel`, `storage`, `tabs`
- Extension name: "RabbitHole"
- Vite with React plugin enabled

**Tailwind Config** (`tailwind.config.js` + `postcss.config.js`)
- Uses `@thedutchcoder/postcss-rem-to-px` to convert rem to px
- **Critical**: Prevents rem calculation issues in shadow DOM content scripts
- Theme values aligned with shadcn/ui design tokens

**TypeScript** (`tsconfig.json`)
- Path alias: `@/` maps to project root
- Target: ESNext with module bundling

## Important Considerations

### Tailwind CSS in Content Scripts
Content scripts use shadow DOM but rem values are calculated from host page's root font-size. To prevent styling inconsistencies across different websites, Tailwind is configured to output pixels instead of rem units via `postcss-rem-to-px`.

### SidePanel Behavior
When `browser.sidePanel.setPanelBehavior({openPanelOnActionClick: true})` is set, clicking the extension icon opens the sidepanel and **does not trigger** `browser.action.onClicked` event. The click listener in `background.ts` will only fire if sidepanel is not configured.

### Content Script Styling
`entrypoints/content/text-selection.ts` uses inline styles instead of React/Tailwind because:
- Runs on all pages without shadow DOM isolation
- Needs guaranteed style specificity (z-index: 999999)
- Avoids conflicts with host page styles

### Wikipedia Integration
- Uses Wikipedia OpenSearch API for article lookup
- Mobile Wikipedia URLs (`en.m.wikipedia.org`) for better iframe rendering
- Attempts CSS injection to hide Wikipedia mobile UI elements (may fail due to CORS)
- Provides "Open in Wikipedia" button for full desktop experience

## Migration Notes

This codebase was migrated from a vanilla JavaScript extension (RabbitHoleV4) to WXT with React/TypeScript. See `MIGRATION_NOTES.md` for details on what was migrated and architectural improvements.

**Major Changes:**
- Vanilla JS → React + TypeScript
- Basic HTML → shadcn/ui components
- Manual message handling → Typed message system
- No i18n → Full internationalization support
