import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useTranslation } from 'react-i18next';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  category: string;
  rating: number;
  image: string;
  inStock: boolean;
  onAddToCart: (product: { id: number; name: string; price: number; image: string }) => void;
}

export function ProductCard({
  id,
  name,
  price,
  oldPrice,
  category,
  rating,
  image,
  inStock,
  onAddToCart,
}: ProductCardProps) {
  const { t } = useTranslation();
  const discount = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-shadow">
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {discount > 0 && (
            <Badge className="bg-red-600">-{discount}%</Badge>
          )}
          {!inStock && (
            <Badge variant="secondary">{t('products.outOfStock')}</Badge>
          )}
        </div>

        {/* Wishlist button */}
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart className="h-4 w-4" />
        </Button>

        {/* Quick add button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            className="w-full"
            disabled={!inStock}
            onClick={() => onAddToCart({ id, name, price, image })}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {t('products.addToCart')}
          </Button>
        </div>
      </div>

      {/* Product info */}
      <div className="p-4 space-y-2">
        <div className="text-xs text-gray-500 uppercase tracking-wide">{category}</div>
        <h3 className="text-sm line-clamp-2 min-h-[40px]">{name}</h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${
                i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">({rating}.0)</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg text-blue-600">${price.toLocaleString()}</span>
          {oldPrice && (
            <span className="text-sm text-gray-400 line-through">
              ${oldPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
