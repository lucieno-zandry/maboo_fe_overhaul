import { useSearchStore, type ViewMode } from "~/hooks/use-search-store";
import { Button } from "../ui/button";
import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { Badge } from "../ui/badge";
import { cn } from "~/lib/utils";

export interface TopBarViewProps {
    viewMode: ViewMode;
    activeFiltersCount: number;
    onViewModeChange: (mode: ViewMode) => void;
    onOpenFilters: () => void;
}

export function TopBarView({
    viewMode,
    activeFiltersCount,
    onViewModeChange,
    onOpenFilters,
}: TopBarViewProps) {
    return (
        <div className="flex items-center justify-between gap-3">
            {/* Mobile filter toggle */}
            <Button
                variant="outline"
                size="sm"
                className="relative gap-2 lg:hidden"
                onClick={onOpenFilters}
            >
                <SlidersHorizontal className="size-4" />
                Filters
                {activeFiltersCount > 0 && (
                    <Badge
                        variant="default"
                        className="absolute -right-1.5 -top-1.5 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[9px]"
                    >
                        {activeFiltersCount}
                    </Badge>
                )}
            </Button>

            <div className="ml-auto flex items-center gap-1 rounded-lg border border-border/60 bg-muted/50 p-1">
                <button
                    onClick={() => onViewModeChange("grid")}
                    className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-md transition-all",
                        viewMode === "grid"
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                    title="Grid view"
                >
                    <LayoutGrid className="size-3.5" />
                </button>
                <button
                    onClick={() => onViewModeChange("list")}
                    className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-md transition-all",
                        viewMode === "list"
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                    title="List view"
                >
                    <List className="size-3.5" />
                </button>
            </div>
        </div>
    );
}


export function TopBar() {
    const viewMode = useSearchStore((s) => s.viewMode);
    const setViewMode = useSearchStore((s) => s.setViewMode);
    const setIsSidebarOpen = useSearchStore((s) => s.setIsSidebarOpen);
    const getActiveFiltersCount = useSearchStore((s) => s.getActiveFiltersCount);

    return (
        <TopBarView
            viewMode={viewMode}
            activeFiltersCount={getActiveFiltersCount()}
            onViewModeChange={setViewMode}
            onOpenFilters={() => setIsSidebarOpen(true)}
        />
    );
}