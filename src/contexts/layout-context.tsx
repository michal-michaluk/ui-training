"use client";

import * as React from "react";

const STORAGE_KEY_SIDEBAR = "layout-sidebar-open";
const STORAGE_KEY_RESIZABLE = "layout-resizable";
const DEFAULT_SIDEBAR_OPEN = true;

/** Map of panel id to size (percentage). Compatible with react-resizable-panels Layout. */
export type Layout = { [id: string]: number };

const DEFAULT_RESIZABLE_LAYOUT: Layout = { main: 50, tools: 50 };

function readSidebarOpen(): boolean {
  if (typeof window === "undefined") return DEFAULT_SIDEBAR_OPEN;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SIDEBAR);
    if (raw === null) return DEFAULT_SIDEBAR_OPEN;
    return raw === "true";
  } catch {
    return DEFAULT_SIDEBAR_OPEN;
  }
}

function readResizableLayout(): Layout {
  if (typeof window === "undefined") return { ...DEFAULT_RESIZABLE_LAYOUT };
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RESIZABLE);
    if (raw === null) return { ...DEFAULT_RESIZABLE_LAYOUT };
    const parsed = JSON.parse(raw) as unknown;
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed))
      return { ...DEFAULT_RESIZABLE_LAYOUT };
    const layout: Layout = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === "number" && Number.isFinite(value))
        layout[key] = value;
    }
    if (Object.keys(layout).length === 0)
      return { ...DEFAULT_RESIZABLE_LAYOUT };
    return layout;
  } catch {
    return { ...DEFAULT_RESIZABLE_LAYOUT };
  }
}

type LayoutContextValue = {
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
  resizableLayout: Layout;
  setResizableLayout: (value: Layout | ((prev: Layout) => Layout)) => void;
};

const LayoutContext = React.createContext<LayoutContextValue | null>(null);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpenState] = React.useState(readSidebarOpen);
  const [resizableLayout, setResizableLayoutState] =
    React.useState(readResizableLayout);

  const setSidebarOpen = React.useCallback(
    (value: boolean | ((prev: boolean) => boolean)) => {
      setSidebarOpenState((prev) => {
        const next = typeof value === "function" ? value(prev) : value;
        try {
          localStorage.setItem(STORAGE_KEY_SIDEBAR, String(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    []
  );

  const setResizableLayout = React.useCallback(
    (value: Layout | ((prev: Layout) => Layout)) => {
      setResizableLayoutState((prev) => {
        const next = typeof value === "function" ? value(prev) : value;
        try {
          localStorage.setItem(STORAGE_KEY_RESIZABLE, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    []
  );

  const value = React.useMemo<LayoutContextValue>(
    () => ({
      sidebarOpen,
      setSidebarOpen,
      resizableLayout,
      setResizableLayout,
    }),
    [sidebarOpen, setSidebarOpen, resizableLayout, setResizableLayout]
  );

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- hook is the public API for LayoutContext
export function useLayout(): LayoutContextValue {
  const context = React.useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider.");
  }
  return context;
}
