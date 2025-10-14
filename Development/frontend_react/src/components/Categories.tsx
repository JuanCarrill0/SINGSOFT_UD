import { Dumbbell, Bike, ShoppingBag, Trophy, Shirt, Footprints } from "lucide-react";
import { Card } from "./ui/card";

const categories = [
  {
    id: 1,
    name: "Fitness",
    icon: Dumbbell,
    count: 120,
    color: "bg-red-100 text-red-600",
  },
  {
    id: 2,
    name: "Ciclismo",
    icon: Bike,
    count: 85,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: 3,
    name: "Calzado",
    icon: Footprints,
    count: 200,
    color: "bg-green-100 text-green-600",
  },
  {
    id: 4,
    name: "Deportes",
    icon: Trophy,
    count: 150,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    id: 5,
    name: "Ropa",
    icon: Shirt,
    count: 300,
    color: "bg-purple-100 text-purple-600",
  },
  {
    id: 6,
    name: "Accesorios",
    icon: ShoppingBag,
    count: 95,
    color: "bg-pink-100 text-pink-600",
  },
];

export function Categories() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl mb-2">Categorías Populares</h2>
          <p className="text-gray-600">Explora nuestras categorías de productos deportivos</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card
                key={category.id}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-sm mb-1">{category.name}</h3>
                    <p className="text-xs text-gray-500">{category.count} items</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
