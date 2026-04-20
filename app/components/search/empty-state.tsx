import { PackageSearch } from "lucide-react";
import { useTranslation } from "react-i18next";

export function EmptyState({ hasFilters }: { hasFilters: boolean }) {
    const { t } = useTranslation("search_results");
    
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 rounded-full bg-muted p-6">
                <PackageSearch className="size-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">{t("noProductsFound")}</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                {hasFilters
                    ? t("tryAdjustingOrClearing")
                    : t("noProductsAvailable")}
            </p>
        </div>
    );
}