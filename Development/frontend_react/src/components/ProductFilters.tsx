import { SlidersHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

const categories = [
  "Calzado",
  "Ropa",
  "Equipamiento",
  "Fitness",
  "Accesorios",
  "Tecnología",
];

const brands = [
  "Nike",
  "Adidas",
  "Puma",
  "Under Armour",
  "Reebok",
  "New Balance",
];

const sports = [
  "Fútbol",
  "Basketball",
  "Running",
  "Fitness",
  "Tennis",
  "Ciclismo",
  "Natación",
  "Yoga",
];

const genders = [
  { value: "Hombre", label: "Hombre" },
  { value: "Mujer", label: "Mujer" },
  { value: "Unisex", label: "Unisex" },
];

interface ProductFiltersProps {
  onApplyFilters?: (filters: {
    categories: string[];
    brands: string[];
    sports: string[];
    gender: string[];
    priceRange: [number, number];
  }) => void;
}

export function ProductFilters({ onApplyFilters }: ProductFiltersProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleSelection = (item: string, list: string[], setter: (items: string[]) => void) => {
    if (list.includes(item)) {
      setter(list.filter((i) => i !== item));
    } else {
      setter([...list, item]);
    }
  };

  const handleApplyFilters = () => {
    if (onApplyFilters) {
      onApplyFilters({
        categories: selectedCategories,
        brands: selectedBrands,
        sports: selectedSports,
        gender: selectedGenders,
        priceRange,
      });
    }
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedSports([]);
    setSelectedGenders([]);
    setPriceRange([0, 200000]);
    if (onApplyFilters) {
      onApplyFilters({
        categories: [],
        brands: [],
        sports: [],
        gender: [],
        priceRange: [0, 200000],
      });
    }
  };

  const activeFiltersCount = 
    selectedCategories.length + 
    selectedBrands.length + 
    selectedSports.length + 
    selectedGenders.length;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filtros
          {activeFiltersCount > 0 && (
            <span className="ml-1 bg-blue-600 text-white rounded-full px-2 py-0.5 text-xs">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filtros de Búsqueda</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Categorías</h3>
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`cat-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => toggleSelection(category, selectedCategories, setSelectedCategories)}
                  />
                  <Label htmlFor={`cat-${category}`} className="text-sm cursor-pointer">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Sports */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Deportes</h3>
            <div className="space-y-3">
              {sports.map((sport) => (
                <div key={sport} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`sport-${sport}`}
                    checked={selectedSports.includes(sport)}
                    onCheckedChange={() => toggleSelection(sport, selectedSports, setSelectedSports)}
                  />
                  <Label htmlFor={`sport-${sport}`} className="text-sm cursor-pointer">
                    {sport}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Price range */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Rango de Precio</h3>
            <Slider 
              value={priceRange} 
              onValueChange={(value) => setPriceRange(value as [number, number])}
              max={200000} 
              min={0}
              step={5000} 
              className="mb-4" 
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>${priceRange[0].toLocaleString()}</span>
              <span>${priceRange[1].toLocaleString()}</span>
            </div>
          </div>

          {/* Brands */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Marcas</h3>
            <div className="space-y-3">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`brand-${brand}`}
                    checked={selectedBrands.includes(brand)}
                    onCheckedChange={() => toggleSelection(brand, selectedBrands, setSelectedBrands)}
                  />
                  <Label htmlFor={`brand-${brand}`} className="text-sm cursor-pointer">
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Gender */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Género</h3>
            <div className="space-y-3">
              {genders.map((gender) => (
                <div key={gender.value} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`gender-${gender.value}`}
                    checked={selectedGenders.includes(gender.value)}
                    onCheckedChange={() => toggleSelection(gender.value, selectedGenders, setSelectedGenders)}
                  />
                  <Label htmlFor={`gender-${gender.value}`} className="text-sm cursor-pointer">
                    {gender.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" className="flex-1" onClick={handleClearFilters}>
              Limpiar
            </Button>
            <Button className="flex-1" onClick={handleApplyFilters}>
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
