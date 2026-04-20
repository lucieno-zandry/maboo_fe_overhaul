import { SearchPage } from "~/components/search/search-page";

export default function SearchRoute() {
    return <SearchPage />;
}

// Optional: set a document title
export function meta() {
    return [
        { title: "Alofo - Recherche" },
        { name: "description", content: "Recherchez et parcourez notre catalogue de produits" },
    ];
}