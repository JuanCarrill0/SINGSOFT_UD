import { SlidersHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

const categories = [
  "Calzado Deportivo",
  "Ropa Deportiva",
  "Equipamiento Gym",
  "Ciclismo",
  "Deportes de Equipo",
  "Accesorios",
];

const brands = [
  "Nike",
  "Adidas",
  "Puma",
  "Under Armour",
  "Reebok",
  "New Balance",
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

export function ProductFilters() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filtros
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filtros</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Categories */}
          <div>
            <h3 className="text-sm mb-4">Categorías</h3>
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox id={`cat-${category}`} />
                  <Label htmlFor={`cat-${category}`} className="text-sm cursor-pointer">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Price range */}
          <div>
            <h3 className="text-sm mb-4">Rango de Precio</h3>
            <Slider defaultValue={[20000, 150000]} max={200000} step={5000} className="mb-4" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>$20.000</span>
              <span>$150.000</span>
            </div>
          </div>

          {/* Brands */}
          <div>
            <h3 className="text-sm mb-4">Marcas</h3>
            <div className="space-y-3">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox id={`brand-${brand}`} />
                  <Label htmlFor={`brand-${brand}`} className="text-sm cursor-pointer">
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h3 className="text-sm mb-4">Tallas</h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <Button key={size} variant="outline" size="sm" className="w-12">
                  {size}
                </Button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <h3 className="text-sm mb-4">Valoración</h3>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <Checkbox id={`rating-${rating}`} />
                  <Label htmlFor={`rating-${rating}`} className="text-sm cursor-pointer">
                    {rating}★ y superior
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1">
              Limpiar
            </Button>
            <Button className="flex-1">Aplicar Filtros</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
