"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLayout, type ToolsTabValue } from "@/contexts/layout-context";

export function ToolsSidebar() {
  const { toolsTab, setToolsTab } = useLayout();

  return (
    <Tabs
      value={toolsTab}
      onValueChange={(v) => setToolsTab(v as ToolsTabValue)}
      className="flex h-full w-full flex-col"
    >
      <TabsList variant="line">
        <TabsTrigger value="ai">AI Chat</TabsTrigger>
        <TabsTrigger value="comments">Comments</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>
      <TabsContent value="ai" className="pt-4">
        Chat with AI assistant here.
      </TabsContent>
      <TabsContent value="comments" className="pt-4">
        View and add comments here.
      </TabsContent>
      <TabsContent value="history" className="pt-4">
        View your document history here.
      </TabsContent>
    </Tabs>
  );
}
