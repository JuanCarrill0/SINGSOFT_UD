import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white overflow-hidden">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div className="space-y-6 z-10">
            <div className="inline-block px-4 py-1 bg-yellow-400 text-black rounded-full text-sm">
              Nueva Colección 2025
            </div>
            <h2 className="text-4xl lg:text-5xl xl:text-6xl">
              Alcanza Tus Metas Deportivas
            </h2>
            <p className="text-lg text-blue-100 max-w-lg">
              Encuentra el mejor equipamiento para tu rendimiento. 
              Calidad profesional al mejor precio.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Comprar Ahora
              </Button>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Ver Colección
              </Button>
            </div>
            <div className="flex gap-8 pt-4">
              <div>
                <div className="text-3xl">500+</div>
                <div className="text-sm text-blue-200">Productos</div>
              </div>
              <div>
                <div className="text-3xl">50K+</div>
                <div className="text-sm text-blue-200">Clientes</div>
              </div>
              <div>
                <div className="text-3xl">4.8★</div>
                <div className="text-sm text-blue-200">Valoración</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative h-[400px] lg:h-[500px]">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1759156207343-9dfefd8b7d33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdGhsZXRpYyUyMHNwb3J0cyUyMGJhbm5lcnxlbnwxfHx8fDE3NjA0MDU3Njd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Hero sports equipment"
              className="w-full h-full object-cover rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl opacity-20"></div>
    </section>
  );
}
