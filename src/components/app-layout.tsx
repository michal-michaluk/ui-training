"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useLayout, type Layout } from "@/contexts/layout-context";

export interface AppLayoutProps {
  /** Header (e.g. breadcrumbs, search) */
  header: React.ReactNode;
  /** Sidebar (e.g. navigation, projects) */
  sidebar: React.ReactNode;
  /** Main content panel (e.g. document area, component example) */
  main: React.ReactNode;
  /** Tools panel (e.g. AI chat, comments, history) */
  tools: React.ReactNode;
}

export function AppLayout({ header, sidebar, main, tools }: AppLayoutProps) {
  const {
    sidebarOpen,
    setSidebarOpen,
    resizableLayout,
    setResizableLayout,
    resizableGroupRef,
  } = useLayout();

  const handleLayoutChanged = (layout: Layout) => {
    setResizableLayout(layout);
  };

  return (
    <SidebarProvider
      className="flex flex-col"
      open={sidebarOpen}
      onOpenChange={setSidebarOpen}
    >
      {header}
      <div className="flex flex-1">
        {sidebar}
        <SidebarInset>
          <ResizablePanelGroup
            groupRef={resizableGroupRef}
            orientation="horizontal"
            defaultLayout={resizableLayout}
            onLayoutChanged={handleLayoutChanged}
          >
            <ResizablePanel id="main" defaultSize={50} minSize={0} collapsible>
              {main}
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel id="tools" defaultSize={50} minSize={0} collapsible>
              {tools}
            </ResizablePanel>
          </ResizablePanelGroup>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
