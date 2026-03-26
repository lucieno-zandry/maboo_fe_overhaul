import { Link, useParams } from "react-router";
import { Eye, ShoppingCart } from "lucide-react";
import { Button } from "~/components/ui/button";
import formatMoney from "~/lib/format-money";

interface HoverableProductProps {
    product: Product;
}

export function HoverableProduct({ product }: HoverableProductProps) {
    const { lang } = useParams();
    const mainImage = product.images?.[0]?.url;
    const variant = product.variants?.[0];
    const price = variant?.price || 0;
    const specialPrice = variant?.effective_price;

    return (
        <div className="w-full max-w-[300px] sm:w-[200px] mb-4 mx-auto group">
            <div className="relative aspect-square overflow-hidden rounded-md bg-gray-100">
                {mainImage ? (
                    <img
                        src={mainImage}
                        alt={product.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                    </div>
                )}

                {/* Curtain Effect */}
                <div className="absolute top-[-100%] left-0 w-full h-full bg-gradient-to-br from-red-500/80 to-blue-500/40 transition-all duration-300 ease-in-out group-hover:top-0 flex items-end justify-end p-4">
                    <div className="flex flex-col gap-2">
                        <Button size="icon" variant="outline" className="h-8 w-8 bg-transparent border-white text-white hover:bg-white hover:text-black" asChild>
                            <Link to={`/${lang}/product/${product.slug}`} title="Voir le produit">
                                <Eye className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button size="icon" variant="outline" className="h-8 w-8 bg-transparent border-white text-white hover:bg-white hover:text-black" title="Ajouter au panier">
                            <ShoppingCart className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mt-3 text-center">
                <h6 className="text-base font-medium truncate px-1" title={product.title}>
                    {product.title}
                </h6>
                <div className="flex items-center justify-center gap-2 text-sm">
                    {specialPrice ? (
                        <>
                            <span className="text-gray-500 line-through">{formatMoney(price)}</span>
                            <span className="font-bold text-red-600">{formatMoney(specialPrice)}</span>
                        </>
                    ) : (
                        <span className="font-bold">{formatMoney(price)}</span>
                    )}
                </div>
            </div>
        </div>
    );
}