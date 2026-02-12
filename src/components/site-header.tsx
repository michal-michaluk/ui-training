"use client";

import { SearchForm } from "@/components/search-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import {
  PanelLeftCloseIcon,
  PanelLeftIcon,
  PanelRightCloseIcon,
} from "lucide-react";
import { useLayout } from "@/contexts/layout-context";

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();
  const {
    toggleMainPanel,
    toggleToolsPanel,
    mainPanelCollapsed,
    toolsPanelCollapsed,
  } = useLayout();

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          type="button"
          onClick={toggleSidebar}
        >
          <PanelLeftIcon />
        </Button>
        <Separator
          orientation="vertical"
          className="me-2 data-vertical:h-4 data-vertical:self-auto"
        />
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Build Your Application</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Data Fetching</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <SearchForm className="w-full sm:ms-auto sm:w-auto" />
        <Separator
          orientation="vertical"
          className="me-2 data-vertical:h-4 data-vertical:self-auto"
        />
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          type="button"
          onClick={toggleMainPanel}
          title={
            mainPanelCollapsed ? "Expand main panel" : "Collapse main panel"
          }
          aria-label={mainPanelCollapsed ? "Expand main" : "Collapse main"}
        >
          <PanelLeftCloseIcon />
        </Button>
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          type="button"
          onClick={toggleToolsPanel}
          title={
            toolsPanelCollapsed ? "Expand tools panel" : "Collapse tools panel"
          }
          aria-label={toolsPanelCollapsed ? "Expand tools" : "Collapse tools"}
        >
          <PanelRightCloseIcon />
        </Button>
      </div>
    </header>
  );
}
