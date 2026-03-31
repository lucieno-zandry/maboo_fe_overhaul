import { useSearchStore } from "~/hooks/use-search-store";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { FilterSidebar } from "./filter-sidebar";

export interface MobileFilterDrawerViewProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function MobileFilterDrawerView({
    open,
    onOpenChange,
}: MobileFilterDrawerViewProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="left" className="w-[300px] p-0 sm:w-[340px]">
                <SheetHeader className="sr-only">
                    <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="h-full">
                    <FilterSidebar />
                </div>
            </SheetContent>
        </Sheet>
    );
}

export function MobileFilterDrawer() {
    const isSidebarOpen = useSearchStore((s) => s.isSidebarOpen);
    const setIsSidebarOpen = useSearchStore((s) => s.setIsSidebarOpen);

    return (
        <MobileFilterDrawerView
            open={isSidebarOpen}
            onOpenChange={setIsSidebarOpen}
        />
    );
}