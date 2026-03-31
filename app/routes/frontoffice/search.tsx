import { SearchPage } from "~/components/search/search-page";

export default function SearchRoute() {
    return <SearchPage />;
}

// Optional: set a document title
export function meta() {
    return [
        { title: "Search Products" },
        { name: "description", content: "Browse and filter our product catalog" },
    ];
}