import { AppSidebar } from "@/components/app-sidebar";
import { ComponentExample } from "@/components/component-example";
import { SiteHeader } from "@/components/site-header";
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
                        <ComponentExample />
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </TooltipProvider>
    );
}

export default App;
