# Frontend intro: shadcn/ui and AI-assisted web apps

Short guide for developers using [shadcn/ui](https://ui.shadcn.com) and building web apps with AI tooling.

---

## 1. Create project

Scaffold a Vite + React app with shadcn (RTL, Lyra style, Inter font, Lucide icons):

```bash
npx shadcn@latest create --rtl --preset "https://ui.shadcn.com/init?base=radix&style=lyra&baseColor=stone&theme=teal&iconLibrary=lucide&font=inter&menuAccent=subtle&menuColor=inverted&radius=none&template=vite&rtl=true" --template vite
```

Then:

```bash
npm install
npm run dev
```

**Where to look next:**

| Path                | Purpose                                                                                      |
| ------------------- | -------------------------------------------------------------------------------------------- |
| `src/components/ui` | Primitive UI components (Button, Input, Dialog, etc.). Copy-paste code; customize as needed. |
| `components.json`   | shadcn config: style, Tailwind/CSS path, aliases (`@/components`, `@/lib`, etc.).            |
| `src/index.css`     | Global styles, CSS variables (theme, `--sidebar-*`, `--radius`), Tailwind/shadcn imports.    |

---

## 2. Add a block

[Blocks](https://ui.shadcn.com/blocks) are pre-built layouts (sidebars, auth, etc.). Add one by name, e.g.:

```bash
npx shadcn@latest add sidebar-16
```

(Use the exact block name from the site, e.g. `sidebar-08` for “An inset sidebar with secondary navigation”.)

**TooltipProvider:** If the block uses tooltips (e.g. in the sidebar), the CLI may note that `TooltipProvider` is required. The block’s note describes what’s needed; the suggested placement might not match your app. Fix it by wrapping your app (e.g. in `App.tsx` or `main.tsx`) with `TooltipProvider` from `@/components/ui/tooltip` so all tooltips have a provider.

---

## 3. Use the block in the app

Use **SidebarProvider** and **AppSidebar** (or the block’s main component) as in the [sidebar blocks example](https://ui.shadcn.com/blocks/sidebar). The reference layout is `app/dashboard/page.tsx`:

- Wrap the shell in `SidebarProvider`.
- Render `AppSidebar` (or your block’s sidebar component).
- Put main content in `SidebarInset` (header + page content).

Example pattern:

```tsx
export default function App() {
  return (
    <TooltipProvider>
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <ComponentExample />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
```

Adjust imports and structure to your routes (e.g. use this inside your root layout or `App.tsx`).

---

## 4. Fix TooltipProvider

Tooltips (e.g. in sidebar nav) need a single provider. Wrap the app once:

```tsx
import { TooltipProvider } from "@/components/ui/tooltip";

export function App() {
  return (
    <TooltipProvider>
      {/* rest of app: router, SidebarProvider, etc. */}
    </TooltipProvider>
  );
}
```

---

## 5. Fix header height in CSS

If your layout uses a CSS variable for the header (e.g. for sticky or offset), ensure it’s set in `src/index.css`. Defaults sometimes ship as `0px`, which breaks layout:

In `:root` (or the right scope in `src/index.css`):

```css
--header-height: 64px;
```

Use this variable where you need the header offset (e.g. `top: var(--header-height)` for sticky content).

---

## 6. Add Resizable and Tabs inside SidebarInset

Use [Resizable](https://ui.shadcn.com/docs/components/radix/resizable) to give the main area resizable panels (e.g. document + secondary panel). 

Add [tabs](https://ui.shadcn.com/docs/components/radix/tabs) to the right panel.

change tabs variant="line"
`<TabsList variant="line">`


---

## 7. Extract right sidebar to separate component function

- left resizable panels in App.tsx
- extract all tab related data to new file tools-sidebar.tsx




---

## (Optional). Add all components

To install every shadcn component in one go (useful for exploring or AI-assisted UIs):

```bash
npx shadcn@latest add --all
```

Add only what you need for production; use `add --all` for quick prototyping or when you’re not sure which components you’ll use.

---
