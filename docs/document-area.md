# Development Guide for document-area

## Architecture Overview

```
NavigationContext (src/contexts/navigation-context.tsx)
  ↓ (owns navigation state)
DocumentAreaStack (src/components/document-area-stack.tsx)
  ↓ (renders stack, passes isActive prop)
DocumentArea (src/components/document-area.tsx)
  ↓ (routes to editor based on mimeType)
Editor Components (src/components/editors/*)
```

## Core Components

### NavigationContext

**Responsibility**: Single source of truth for navigation state (current view, history, document cache).

**Key Functions**:

```typescript
navigateToDocument(docId: string)     // Open a document
navigateToFolder(folderPath: string)  // Open a folder
navigateToHome()                      // Go to home view
navigateToSettings(section?: string) // Open settings

// Access current state
const { currentView, viewMetadata, documentCache } = useNavigationContext()
```

**Rules**:

- Always use navigation context to change views - never manipulate URL directly
- Document cache tracks opened documents for DocumentAreaStack
- View metadata provides breadcrumbs and context info

### DocumentAreaStack

**Responsibility**: Renders all open documents in a stack, only active one is visible.

**Key Points**:

- Receives `isActive` prop from parent based on current view
- Keeps inactive documents mounted (preserves editor state)
- Passes `isActive` to each DocumentArea

### DocumentArea

**Responsibility**: Container that loads document, sets up collaboration, renders header, routes to editor.

**Rules**:

- Loads `DocumentDraft` via `useDocumentLoader`
- Finds editor via registry based on `mimeType` + `semanticType`
- Sets up collaboration only if `isActive && editor.supportsCollaboration`
- Manages autosave via `useDocumentAutosave`
- Renders common header (breadcrumb, status badges, branch/commit menu)
- NEVER imports editor-specific code - uses registry lookup

## Developing New Editors

### 1. Create Editor Component

**Location**: `src/components/editors/your-editor.tsx`

**Interface** (receive these props from DocumentArea):

```typescript
interface DocumentEditorProps {
  document: DocumentDraft; // Full doc from API
  collaboration?: {
    // Only if supportsCollaboration
    yDoc: Y.Doc;
    provider: HocuspocusProvider;
    user: { name: string; color: string };
    isActive: boolean;
  };
  onSave: (content: unknown) => Promise<void>;
  onChange: (content: unknown, hasUnsavedChanges: boolean) => void;
  theme: "light" | "dark";
  isActive: boolean;
  readOnly?: boolean;
  renderActions?: () => React.ReactNode; // Optional custom actions
}
```

**Rules**:

- NEVER import `useNavigationContext` or `useApiClient` - receive all data via props
- Call `onChange(content, true)` when user edits (triggers autosave)
- Call `onSave(content)` only if immediate save needed
- Handle content parsing internally (format-specific)
- Collaboration is optional - only use if `collaboration` prop provided

### 2. Register Editor

**Location**: `src/components/editors/index.ts`

```typescript
import { YourEditor } from "./your-editor";
import { registerEditor } from "@/lib/document-editors/registry";

registerEditor({
  mimeTypes: ["application/vnd.your+json"],
  semanticTypes: "*", // Or ['specific-type'] or '*'
  component: YourEditor,
  supportsCollaboration: true, // Or false
  displayName: "Your Editor",
  // Optional: custom header components (replace defaults when provided)
  headerComponents: {
    // Custom status indicator (replaces default StatusBadges)
    status: YourCustomStatus,
    // Custom actions (replaces default BranchCommitMenu)
    actions: YourCustomActions,
  },
});
```

### 3. Custom Header Components (Optional)

Editors can register custom components for the shared header:

**Custom Status Indicator** - Replaces default status badges:

```typescript
import { EditorStatusProps } from "@/lib/document-editors/types";

function YourCustomStatus({
  autosaveStatus,
  collabActive,
  collabStatus,
  collabError,
  document,
}: EditorStatusProps) {
  return (
    <Badge variant={autosaveStatus === "saved" ? "default" : "outline"}>
      {autosaveStatus === "saved" ? "✓ Saved" : "● Editing"}
    </Badge>
  );
}
```

**Custom Action Buttons** - Additional buttons in header:

```typescript
import { EditorActionsProps } from "@/lib/document-editors/types";

function ExportButton({ document, onSave }: EditorActionsProps) {
  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={() => handleExport(document.docId)}
    >
      Export
    </Button>
  );
}
```

**Symmetric Replacement**:

Both `status` and `actions` follow the same pattern:

- If **not provided** → default component is rendered
- If **provided** → your custom component **replaces** the default completely

**Including Default Actions**:

To add custom actions AND keep the default branch/commit menu, use the exported `DefaultActions` component:

```typescript
import { DefaultActions } from "@/components/header/default-actions";
import { EditorActionsProps } from "@/lib/document-editors/types";

function SpreadsheetActions(props: EditorActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Custom button */}
      <Button size="sm" variant="ghost" onClick={() => exportToExcel(props.document)}>
        Export Excel
      </Button>

      {/* Include default branch/commit menu */}
      <DefaultActions {...props} />
    </div>
  );
}

registerEditor({
  mimeTypes: ["application/vnd.spreadsheet+json"],
  component: SpreadsheetEditor,
  supportsCollaboration: true,
  displayName: "Spreadsheet",
  headerComponents: {
    actions: SpreadsheetActions, // Replaces default, but includes DefaultActions inside
  },
});
```

**Completely Replacing Actions**:

If you want full control without default menu:

```typescript
function CustomActions({ document, onCommit, onSwitchBranch }: EditorActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button size="sm" variant="outline" onClick={onCommit}>
        Save Version
      </Button>
      <Button size="sm" variant="ghost" onClick={onSwitchBranch}>
        Switch Branch
      </Button>
    </div>
  );
}

registerEditor({
  mimeTypes: ["application/vnd.custom+json"],
  component: CustomEditor,
  headerComponents: {
    actions: CustomActions, // Replaces default completely
  },
});
```

### Example: BlockNote Editor

See `src/components/editors/blocknote-editor.tsx` for reference:

- Parses API content to BlockNote format
- Uses `useCreateBlockNote` with/without collaboration config
- Calls `onChange` on edits, skips when `collaboration?.isActive`
- Handles theme via `theme` prop

## Common Patterns

### Navigate to Document

```typescript
const { navigateToDocument } = useNavigationContext();
navigateToDocument("folder/doc-id");
```

### Navigate to Folder

```typescript
const { navigateToFolder } = useNavigationContext();
navigateToFolder("path/to/folder");
```

### Listen to Currently Opened Document

```typescript
const { currentView, documentCache } = useNavigationContext();

if (currentView.type === "document") {
  const docId = currentView.docId;
  const docState = documentCache.get(docId);
  // docState contains openedAt, etc.
}
```

### Extend Actions (Header)

**Recommended**: Register custom actions in editor registration (see "Custom Header Components" section above).

**Alternative**: DocumentArea passes `renderActions` callback to editor for dynamic actions:

```typescript
// In your editor component
const customActions = () => (
  <Button onClick={handleSpecialAction}>
    Special Action
  </Button>
);

// Pass via renderActions prop if your component receives it
<YourEditor renderActions={customActions} />
```

**Key Points**:

- `headerComponents.actions` → Replaces default BranchCommitMenu completely
- Use `DefaultActions` component inside your custom actions to include default menu
- `renderActions` → Dynamic actions passed via props (not part of registration)

For most cases, use `headerComponents.actions` with `DefaultActions` included.

## Dependencies Rule

**DO**:

- Use props from DocumentArea (document, onSave, onChange, etc.)
- Import types from `@/lib/document-editors/types`
- Register via `@/lib/document-editors/registry`
- Use shared hooks: `useDocumentLoader`, `useDocumentAutosave`

**DON'T**:

- Import `useNavigationContext` in editors
- Import `useApiClient` in editors
- Directly manipulate document cache
- Access localStorage/sessionStorage for document state

## File Locations

| Component            | Location                                      |
| -------------------- | --------------------------------------------- |
| NavigationContext    | `src/contexts/navigation-context.tsx`         |
| DocumentAreaStack    | `src/components/document-area-stack.tsx`      |
| DocumentArea         | `src/components/document-area.tsx`            |
| Editor Registry      | `src/lib/document-editors/registry.ts`        |
| Editor Types         | `src/lib/document-editors/types.ts`           |
| Editor Status Props  | `EditorStatusProps` in types.ts               |
| Editor Actions Props | `EditorActionsProps` in types.ts              |
| DefaultActions       | `src/components/header/default-actions.tsx`   |
| BlockNote Editor     | `src/components/editors/blocknote-editor.tsx` |
| Editor Registration  | `src/components/editors/index.ts`             |
| Document Loader Hook | `src/lib/hooks/use-document-loader.ts`        |
| Autosave Hook        | `src/lib/hooks/use-document-autosave.ts`      |
| Header Components    | `src/components/header/*.tsx`                 |

## Quick Checklist for New Editor

- [ ] Component created in `src/components/editors/`
- [ ] Uses `DocumentEditorProps` interface
- [ ] Doesn't import NavigationContext or ApiClient
- [ ] Calls `onChange` when content changes
- [ ] Handles `collaboration` prop if supports it
- [ ] Registered in `src/components/editors/index.ts`
- [ ] (Optional) Custom header components registered via `headerComponents`
- [ ] (Optional) Use `DefaultActions` if you need default branch/commit menu in custom actions
- [ ] Tested with different mimeTypes/semanticTypes
