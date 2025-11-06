from fastapi import FastAPI
from app.database import engine, Base

# Importar modelos
from app.models.user import User
from app.models.product import Product
from app.models.order import Order
from app.models.payment import Payment

# Crear tablas
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SportGear Online API",
    description="Backend for SportGear Online E-commerce",
    version="1.0.0"
)

# Routers - sin caracteres especiales
try:
    from app.routes.user_routes import router as user_router
    from app.routes.product_routes import router as product_router
    from app.routes.order_routes import router as order_router
    from app.routes.payment_routes import router as payment_router
    
    app.include_router(user_router, prefix="/api/v1", tags=["users"])
    app.include_router(product_router, prefix="/api/v1", tags=["products"])
    app.include_router(order_router, prefix="/api/v1", tags=["orders"])
    app.include_router(payment_router, prefix="/api/v1", tags=["payments"])
    
    print("All routes loaded successfully")
except ImportError as e:
    print(f"Some routes not available: {e}")

@app.get("/")
def root():
    return {"message": "SportGear Online API is running!"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "database": "PostgreSQL"}