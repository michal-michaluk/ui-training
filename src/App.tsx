import { AppSidebar } from "@/components/app-sidebar";
import { ComponentExample } from "@/components/component-example";
import { SiteHeader } from "@/components/site-header";
import { ToolsSidebar } from "@/components/tools-sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export function App() {
  return (
    <TooltipProvider>
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <ResizablePanelGroup orientation="horizontal">
              <ResizablePanel>
                <ComponentExample />
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel>
                <ToolsSidebar />
              </ResizablePanel>
            </ResizablePanelGroup>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}

export default App;
