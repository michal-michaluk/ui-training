import { AppLayout } from "@/components/app-layout";
import { AppSidebar } from "@/components/app-sidebar";
import { ComponentExample } from "@/components/component-example";
import { SiteHeader } from "@/components/site-header";
import { ToolsSidebar } from "@/components/tools-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LayoutProvider } from "./contexts/layout-context";

export function App() {
  return (
    <TooltipProvider>
      <LayoutProvider>
        <AppLayout
          header={<SiteHeader />}
          sidebar={<AppSidebar />}
          main={<ComponentExample />}
          tools={<ToolsSidebar />}
        />
      </LayoutProvider>
    </TooltipProvider>
  );
}

export default App;
