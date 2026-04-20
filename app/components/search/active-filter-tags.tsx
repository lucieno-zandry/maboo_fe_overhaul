import { SORT_OPTIONS, useSearchStore } from "~/hooks/use-search-store";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";
import formatMoney from "~/lib/format-money";
import { useTranslation } from "react-i18next";

export interface ActiveFilterTag {
    key: string;
    label: string;
    onRemove: () => void;
}

export interface ActiveFilterTagsViewProps {
    tags: ActiveFilterTag[];
}

export function ActiveFilterTagsView({ tags }: ActiveFilterTagsViewProps) {
    if (tags.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
                <Badge
                    key={tag.key}
                    variant="secondary"
                    className="gap-1 pr-1 text-xs font-normal"
                >
                    {tag.label}
                    <button
                        onClick={tag.onRemove}
                        className="ml-0.5 rounded-full p-0.5 hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        <X className="size-2.5" />
                    </button>
                </Badge>
            ))}
        </div>
    );
}

export function ActiveFilterTags() {
    const filters = useSearchStore((s) => s.filters);
    const categories = useSearchStore((s) => s.categories);
    const priceRangeMeta = useSearchStore((s) => s.priceRangeMeta);
    const setFilter = useSearchStore((s) => s.setFilter);
    const { t } = useTranslation("search_results");

    const tags: ActiveFilterTag[] = [];

    if (filters.search) {
        tags.push({
            key: "search",
            label: `"${filters.search}"`,
            onRemove: () => setFilter("search", ""),
        });
    }

    if (filters.category_id !== undefined) {
        const cat = categories.find((c) => c.id === filters.category_id);
        tags.push({
            key: "category",
            label: cat?.title ?? t("categoryWithId", { id: filters.category_id }),
            onRemove: () => setFilter("category_id", undefined),
        });
    }

    const hasMinPrice =
        filters.min_price !== undefined &&
        priceRangeMeta &&
        filters.min_price > priceRangeMeta.min;
    const hasMaxPrice =
        filters.max_price !== undefined &&
        priceRangeMeta &&
        filters.max_price < priceRangeMeta.max;

    if (hasMinPrice || hasMaxPrice) {
        const minLabel = hasMinPrice ? formatMoney(filters.min_price) : "min";
        const maxLabel = hasMaxPrice ? formatMoney(filters.max_price) : "max";
        tags.push({
            key: "price",
            label: t("priceTag", { min: minLabel, max: maxLabel }),
            onRemove: () => {
                setFilter("min_price", undefined);
                setFilter("max_price", undefined);
            },
        });
    }

    if (filters.sortIndex !== 0) {
        const sortOptionLabels: Record<string, string> = {
            "Newest first": t("newestFirst"),
            "Oldest first": t("oldestFirst"),
            "Name A → Z": t("nameAZ"),
            "Name Z → A": t("nameZA"),
        };
        const rawLabel = SORT_OPTIONS[filters.sortIndex].label;
        tags.push({
            key: "sort",
            label: t("sortTag", { label: sortOptionLabels[rawLabel] || rawLabel }),
            onRemove: () => setFilter("sortIndex", 0),
        });
    }

    return <ActiveFilterTagsView tags={tags} />;
}