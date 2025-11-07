import { Hero } from "../components/Hero";
import { Categories } from "../components/Categories";
import { ProductCard } from "../components/ProductCard";
import { ProductFilters } from "../components/ProductFilters";
import { Button } from "../components/ui/button";
import { LayoutGrid, List, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useProducts } from "../hooks/useProducts";
import { Alert, AlertDescription } from "../components/ui/alert";

interface DashboardPageProps {
  viewMode: "grid" | "list";
  setViewMode: (m: "grid" | "list") => void;
  onAddToCart: (product: { id: number; name: string; price: number; image: string }) => void;
}

export default function DashboardPage({ viewMode, setViewMode, onAddToCart }: DashboardPageProps) {
  const { products, loading, error, refreshProducts } = useProducts();

  return (
    <main>
      <Hero />
      <Categories />

      {/* Products section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Section header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h2 className="text-3xl mb-2">Productos Destacados</h2>
              <p className="text-gray-600">Descubre nuestra selección de productos premium</p>
            </div>
            <div className="flex items-center gap-2">
              <ProductFilters />
              <Select defaultValue="popular">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Más Popular</SelectItem>
                  <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
                  <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
                  <SelectItem value="rating">Mejor Valorados</SelectItem>
                  <SelectItem value="new">Más Recientes</SelectItem>
                </SelectContent>
              </Select>
              <div className="hidden sm:flex border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Error state */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>
                {error}
                <Button 
                  variant="link" 
                  className="ml-2"
                  onClick={refreshProducts}
                >
                  Reintentar
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Loading state */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Cargando productos...</p>
              </div>
            </div>
          )}

          {/* Products grid */}
          {!loading && !error && (
            <>
              {products.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-600 text-lg">No hay productos disponibles</p>
                </div>
              ) : (
                <div className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1"
                }`}>
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      {...product}
                      onAddToCart={onAddToCart}
                    />
                  ))}
                </div>
              )}

              {/* Load more */}
              {products.length > 0 && (
                <div className="text-center mt-12">
                  <Button variant="outline" size="lg" onClick={refreshProducts}>
                    Actualizar Productos
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Features banner */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl">🚚</div>
              <h3 className="text-lg">Envío Gratis</h3>
              <p className="text-sm text-gray-600">En compras superiores a $50.000</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">🔄</div>
              <h3 className="text-lg">Devoluciones Fáciles</h3>
              <p className="text-sm text-gray-600">30 días para cambios y devoluciones</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">💳</div>
              <h3 className="text-lg">Pago Seguro</h3>
              <p className="text-sm text-gray-600">Múltiples métodos de pago disponibles</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
