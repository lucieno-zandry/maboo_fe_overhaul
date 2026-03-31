// hooks/useSearchResults.ts
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { toast } from 'sonner';
import { getCategories, getPriceRange, getProducts } from '~/api/http-requests';
import useDebounce from '~/hooks/use-debounce';
import { getDefaultPriceRange, getDefaultRangeConfig, getUrlPriceRange } from '~/lib/get-price-range';
import type { ProductQueryParams } from '~/lib/serialize-product-params';

const LIMIT = 12;

export function useSearchResults(query: string | undefined) {
    const [searchParams, setSearchParams] = useSearchParams();

    // Filter states — initialized from URL
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
        searchParams.get('category') ? parseInt(searchParams.get('category')!) : undefined
    );

    const initialPriceRange = getUrlPriceRange(searchParams) || getDefaultPriceRange();

    const [priceRange, setPriceRange] = useState<[number, number]>(initialPriceRange);

    const [rangeConfig, setRangeConfig] = useState<{ min: number, max: number, step: number }>();

    const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
    const [sortBy, setSortBy] = useState<'created_at' | 'title'>(
        (searchParams.get('sort') as 'created_at' | 'title') || 'created_at'
    );
    const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>(
        (searchParams.get('dir') as 'ASC' | 'DESC') || 'DESC'
    );

    // Data states
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalProducts, setTotalProducts] = useState(0);

    const page = parseInt(searchParams.get('page') || '1');
    const totalPages = Math.ceil(totalProducts / LIMIT);

    // Memoize filter dependencies to avoid unnecessary debounce updates
    const filterDeps = useMemo(
        () => ({
            query,
            selectedCategory,
            priceRange,
            selectedOptions,
            sortBy,
            sortDirection,
        }),
        [query, selectedCategory, priceRange, selectedOptions, sortBy, sortDirection]
    );

    // Debounce filters (excluding page)
    const debouncedFilters = useDebounce(filterDeps, 300);

    // Sync filter state → URL
    useEffect(() => {
        const params = new URLSearchParams(searchParams);

        if (selectedCategory) {
            params.set('category', selectedCategory.toString());
        } else {
            params.delete('category');
        }

        params.set('min_price', priceRange[0].toString());
        params.set('max_price', priceRange[1].toString());
        params.set('sort', sortBy);
        params.set('dir', sortDirection);

        if (page === 1) {
            params.delete('page');
        } else {
            params.set('page', page.toString());
        }

        setSearchParams(params, { replace: true });
    }, [selectedCategory, priceRange, sortBy, sortDirection]);

    // Fetch categories once (unchanged)
    useEffect(() => {
        const fetchCategories = async () => {
            setLoadingCategories(true);
            try {
                const response = await getCategories();
                setCategories(response.data?.categories || []);
            } catch (err) {
                console.error('Error fetching categories:', err);
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchPriceRange = async () => {
            try {
                const response = await getPriceRange();

                if (response.data?.min != undefined && response.data.max && response.data.step) {
                    setRangeConfig(response.data)
                    setPriceRange([response.data.min, response.data.max]);
                    return;
                }

                throw new Error;
            } catch (e) {
                toast.error('Failed to fetch price range');
                console.error('Failed to fetch price range', error);
                setRangeConfig(getDefaultRangeConfig());
            }
        }

        fetchPriceRange();
    }, []);

    // Fetch products when debounced filters or page change
    useEffect(() => {
        if (!debouncedFilters.query || !rangeConfig) return; // use debounced query

        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const params: ProductQueryParams = {
                    search: debouncedFilters.query,
                    category_id: debouncedFilters.selectedCategory,
                    min_price: debouncedFilters.priceRange[0],
                    max_price: debouncedFilters.priceRange[1],
                    variant_option_ids:
                        debouncedFilters.selectedOptions.length > 0
                            ? debouncedFilters.selectedOptions
                            : undefined,
                    order_by: debouncedFilters.sortBy,
                    direction: debouncedFilters.sortDirection,
                    limit: LIMIT,
                    page, // page is not debounced – changes trigger fetch immediately
                };

                const response = await getProducts(params);

                setProducts(response.data?.data || []);
                setTotalProducts(response.data?.total ?? response.data?.data.length ?? 0);
            } catch (err) {
                setError('errorLoading');
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [debouncedFilters, page, rangeConfig]); // only depend on debounced filters and page

    // The rest of the hook (clearFilters, handlePageChange, etc.) remains exactly as before
    const clearFilters = () => {
        setSelectedCategory(undefined);
        setPriceRange(initialPriceRange);
        setSelectedOptions([]);
        setSortBy('created_at');
        setSortDirection('DESC');
        setSearchParams({});
    };

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            if (newPage === 1) {
                next.delete('page');
            } else {
                next.set('page', newPage.toString());
            }
            return next;
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCategoryChange = (categoryId: number | undefined) => {
        setSelectedCategory(categoryId);
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.delete('page');
            return next;
        });
    };

    return {
        // data
        products,
        categories,
        totalProducts,
        totalPages,
        // loading / error
        loading,
        loadingCategories,
        error,
        // filter state
        selectedCategory,
        priceRange,
        selectedOptions,
        sortBy,
        sortDirection,
        page,
        limit: LIMIT,
        // actions
        setSelectedCategory: handleCategoryChange,
        setPriceRange,
        setSelectedOptions,
        setSortBy,
        setSortDirection,
        clearFilters,
        handlePageChange,
        refetch: () => setSearchParams((p) => new URLSearchParams(p)),
        rangeConfig,
    };
}