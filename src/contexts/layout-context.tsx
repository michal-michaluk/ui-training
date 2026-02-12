"use client";

import * as React from "react";
import {
  useGroupRef,
  type GroupImperativeHandle,
} from "react-resizable-panels";

const STORAGE_KEY_SIDEBAR = "layout-sidebar-open";
const STORAGE_KEY_RESIZABLE = "layout-resizable";
const STORAGE_KEY_TOOLS_TAB = "layout-tools-tab";
const DEFAULT_SIDEBAR_OPEN = true;
const DEFAULT_TOOLS_TAB = "comments";

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

function readToolsTab(): string {
  if (typeof window === "undefined") return DEFAULT_TOOLS_TAB;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TOOLS_TAB);
    if (raw === null) return DEFAULT_TOOLS_TAB;
    return raw;
  } catch {
    return DEFAULT_TOOLS_TAB;
  }
}

export const TOOLS_TAB_VALUES = ["ai", "comments", "history"] as const;
export type ToolsTabValue = (typeof TOOLS_TAB_VALUES)[number];

function isValidToolsTab(value: string): value is ToolsTabValue {
  return TOOLS_TAB_VALUES.includes(value as ToolsTabValue);
}

type LayoutContextValue = {
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
  resizableLayout: Layout;
  setResizableLayout: (value: Layout | ((prev: Layout) => Layout)) => void;
  /** Ref to attach to ResizablePanelGroup for programmatic layout control */
  resizableGroupRef: React.RefObject<GroupImperativeHandle | null>;
  /** Collapse the main panel (id="main") to 0 */
  collapseMainPanel: () => void;
  /** Expand the main panel to 50% (restore split) */
  expandMainPanel: () => void;
  /** Toggle main panel collapsed state */
  toggleMainPanel: () => void;
  /** Collapse the tools panel (id="tools") to 0 */
  collapseToolsPanel: () => void;
  /** Expand the tools panel to 50% (restore split) */
  expandToolsPanel: () => void;
  /** Toggle tools panel collapsed state */
  toggleToolsPanel: () => void;
  /** Whether main panel is collapsed (main === 0) */
  mainPanelCollapsed: boolean;
  /** Whether tools panel is collapsed (tools === 0) */
  toolsPanelCollapsed: boolean;
  /** Current tab in ToolsSidebar */
  toolsTab: ToolsTabValue;
  setToolsTab: (
    value: ToolsTabValue | ((prev: ToolsTabValue) => ToolsTabValue)
  ) => void;
};

const LayoutContext = React.createContext<LayoutContextValue | null>(null);

const MAIN_COLLAPSED_LAYOUT: Layout = { main: 0, tools: 100 };
const TOOLS_COLLAPSED_LAYOUT: Layout = { main: 100, tools: 0 };
const DEFAULT_SPLIT: Layout = { main: 50, tools: 50 };

const ANIMATION_DURATION_MS = 220;

/** Ease-out cubic: fast start, smooth deceleration at end */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function interpolateLayout(
  from: Layout,
  to: Layout,
  keys: (keyof Layout)[],
  t: number
): Layout {
  const result: Layout = {};
  const eased = easeOutCubic(t);
  for (const key of keys) {
    const a = from[key] ?? 0;
    const b = to[key] ?? 0;
    result[key] = a + (b - a) * eased;
  }
  return result;
}

function animateToLayout(
  groupRef: React.RefObject<GroupImperativeHandle | null>,
  target: Layout,
  keys: (keyof Layout)[],
  onComplete: (final: Layout) => void,
  cancelRef: { current: (() => void) | null }
): () => void {
  cancelRef.current?.();
  const group = groupRef.current;
  if (!group) {
    onComplete(target);
    return () => {};
  }
  const startLayout = group.getLayout();
  const from: Layout = {};
  for (const k of keys) {
    from[k] = startLayout[k] ?? 0;
  }
  const startTime = performance.now();
  let rafId: number;
  let cancelled = false;

  const cancel = () => {
    cancelled = true;
    cancelAnimationFrame(rafId);
    cancelRef.current = null;
  };

  cancelRef.current = cancel;

  const tick = () => {
    if (cancelled) return;
    const elapsed = performance.now() - startTime;
    const t = Math.min(elapsed / ANIMATION_DURATION_MS, 1);
    const layout = interpolateLayout(from, target, keys, t);
    group.setLayout(layout);

    if (t < 1) {
      rafId = requestAnimationFrame(tick);
    } else {
      cancelRef.current = null;
      onComplete(target);
    }
  };

  rafId = requestAnimationFrame(tick);
  return cancel;
}

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const resizableGroupRef = useGroupRef();
  const animationCancelRef = React.useRef<(() => void) | null>(null);
  const [sidebarOpen, setSidebarOpenState] = React.useState(readSidebarOpen);
  const [resizableLayout, setResizableLayoutState] =
    React.useState(readResizableLayout);
  const [toolsTab, setToolsTabState] = React.useState(readToolsTab);

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

  const persistLayout = React.useCallback((layout: Layout) => {
    setResizableLayoutState(layout);
    try {
      localStorage.setItem(STORAGE_KEY_RESIZABLE, JSON.stringify(layout));
    } catch {
      // ignore
    }
  }, []);

  const collapseMainPanel = React.useCallback(() => {
    animateToLayout(
      resizableGroupRef,
      MAIN_COLLAPSED_LAYOUT,
      ["main", "tools"],
      persistLayout,
      animationCancelRef
    );
  }, [persistLayout]);

  const collapseToolsPanel = React.useCallback(() => {
    animateToLayout(
      resizableGroupRef,
      TOOLS_COLLAPSED_LAYOUT,
      ["main", "tools"],
      persistLayout,
      animationCancelRef
    );
  }, [persistLayout]);

  const expandMainPanel = React.useCallback(() => {
    animateToLayout(
      resizableGroupRef,
      DEFAULT_SPLIT,
      ["main", "tools"],
      persistLayout,
      animationCancelRef
    );
  }, [persistLayout]);

  const expandToolsPanel = React.useCallback(() => {
    animateToLayout(
      resizableGroupRef,
      DEFAULT_SPLIT,
      ["main", "tools"],
      persistLayout,
      animationCancelRef
    );
  }, [persistLayout]);

  const toggleMainPanel = React.useCallback(() => {
    const isCollapsed = resizableLayout.main === 0;
    if (isCollapsed) {
      expandMainPanel();
    } else {
      collapseMainPanel();
    }
  }, [resizableLayout.main, collapseMainPanel, expandMainPanel]);

  const toggleToolsPanel = React.useCallback(() => {
    const isCollapsed = resizableLayout.tools === 0;
    if (isCollapsed) {
      expandToolsPanel();
    } else {
      collapseToolsPanel();
    }
  }, [resizableLayout.tools, collapseToolsPanel, expandToolsPanel]);

  const setToolsTab = React.useCallback(
    (value: ToolsTabValue | ((prev: ToolsTabValue) => ToolsTabValue)) => {
      setToolsTabState((prev) => {
        const next =
          typeof value === "function"
            ? value(isValidToolsTab(prev) ? prev : DEFAULT_TOOLS_TAB)
            : value;
        const resolved = isValidToolsTab(next) ? next : DEFAULT_TOOLS_TAB;
        try {
          localStorage.setItem(STORAGE_KEY_TOOLS_TAB, resolved);
        } catch {
          // ignore
        }
        return resolved;
      });
    },
    []
  );

  const mainPanelCollapsed = resizableLayout.main === 0;
  const toolsPanelCollapsed = resizableLayout.tools === 0;

  const value = React.useMemo<LayoutContextValue>(
    () => ({
      sidebarOpen,
      setSidebarOpen,
      resizableLayout,
      setResizableLayout,
      resizableGroupRef,
      collapseMainPanel,
      expandMainPanel,
      toggleMainPanel,
      collapseToolsPanel,
      expandToolsPanel,
      toggleToolsPanel,
      mainPanelCollapsed,
      toolsPanelCollapsed,
      toolsTab: isValidToolsTab(toolsTab) ? toolsTab : DEFAULT_TOOLS_TAB,
      setToolsTab,
    }),
    [
      sidebarOpen,
      setSidebarOpen,
      resizableLayout,
      setResizableLayout,
      collapseMainPanel,
      expandMainPanel,
      toggleMainPanel,
      collapseToolsPanel,
      expandToolsPanel,
      toggleToolsPanel,
      mainPanelCollapsed,
      toolsPanelCollapsed,
      toolsTab,
      setToolsTab,
    ]
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
