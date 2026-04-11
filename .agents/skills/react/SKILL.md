---
name: react
description: React component patterns for this project. Use when building components, pages, or refactoring UI.
---

# React Components

Use `docs/code_conventions/code-organization.md` only when structure/organization guidance is needed.
Use `docs/code_conventions/backend-safety-rules.md` only when backend safety rules are relevant.

## File Template

```typescript
"use client";  // Only if component uses hooks/browser APIs

// External imports
import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Plus, X } from "lucide-react";

// Convex imports
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

// Custom hooks
import { useConvexQuery } from "@/hooks/useConvexQuery";

// UI components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Feature components
import { RelatedComponent } from "./components/related-component";

// Types
interface Props {
  itemId: Id<"items">;
  isOpen: boolean;
  onClose: () => void;
}

// Main component (named export)
export function ComponentName({ itemId, isOpen, onClose }: Props) {
  // 1. Hooks first
  const router = useRouter();
  const { data, isPending, error } = useConvexQuery(api.items.get, { id: itemId });

  // 2. Local state
  const [isEditing, setIsEditing] = useState(false);

  // 3. Derived values
  const hasData = data && data.length > 0;

  // 4. Handlers
  const handleSubmit = () => {
    // logic
  };

  // 5. Early returns for loading/error
  if (isPending) return <LoadingSkeleton />;
  if (error) return <ErrorState error={error} />;

  // 6. Main JSX
  return (
    <div>
      {/* content */}
    </div>
  );
}

// Helper components (same file if only used here)
function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

function ErrorState({ error }: { error: Error }) {
  return (
    <div className="text-destructive">
      {error.message}
    </div>
  );
}
```

## Data Fetching with Convex

```typescript
// Basic query
const {
  data: user,
  isPending,
  error,
} = useConvexQuery(api.user.currentUser, {});

// Conditional skip (when dependent on other data)
const { data: items } = useConvexQuery(
  api.items.list,
  user ? { userId: user._id } : "skip",
);

// With status pattern for complex UI
const { data, status, error } = useConvexQuery(api.bounty.getBounties, {});
// status: "pending" | "error" | "success"
```

## State Management Patterns

### Local State

Keep state in the component that uses it:

```typescript
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState({ name: "", email: "" });
```

### URL State

Use for shareable/bookmarkable UI state:

```typescript
const searchParams = useSearchParams();
const router = useRouter();
const pathname = usePathname();

// Read from URL
const selectedId = searchParams.get("id");
const tab = searchParams.get("tab") ?? "overview";

// Update URL
const setSelectedId = (id: string | null) => {
  const params = new URLSearchParams(searchParams);
  if (id) {
    params.set("id", id);
  } else {
    params.delete("id");
  }
  router.push(`${pathname}?${params.toString()}`);
};
```

### State Location Guide

| Scenario          | Pattern                            |
| ----------------- | ---------------------------------- |
| Single component  | `useState` inside that component   |
| Parent + children | Lift to parent only                |
| Distant siblings  | Context at closest common ancestor |
| App-wide          | Global store (Zustand)             |
| URL-worthy        | `useSearchParams`                  |

## UI State Handling

Always handle loading, error, and empty states:

```typescript
// Loading
function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

// Empty state
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

function EmptyState({ onAction }: { onAction: () => void }) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Plus className="h-6 w-6" />
        </EmptyMedia>
        <EmptyTitle>No items yet</EmptyTitle>
        <EmptyDescription>
          Create your first item to get started.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={onAction}>Create Item</Button>
      </EmptyContent>
    </Empty>
  );
}

// Error state
function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="text-center py-8">
      <p className="text-destructive">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="mt-4">
          Try Again
        </Button>
      )}
    </div>
  );
}
```

## Component Types

### Feature Component

`features/feature-name/component-name.tsx`

- Main component with data fetching and business logic
- Contains state management
- Related helper components in same file
- Types/interfaces at top

### Feature Sub-Component

`features/feature-name/components/sub-component.tsx`

- Shared within the feature (2-3 usages)
- Receives data via props
- No direct data fetching
- Reusable within the feature

### Page Component

`app/.../page.tsx`

- Thin wrapper that imports from features
- May export metadata
- No business logic

```typescript
// app/(app)/dashboard/page.tsx
import { DashboardPage } from "@/features/dashboard/dashboard-page";

export const metadata = {
  title: "Dashboard",
};

export default function Page() {
  return <DashboardPage />;
}
```
