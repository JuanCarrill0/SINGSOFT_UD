from fastapi import FastAPI
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base

# Importar modelos (sin User - ahora está en MySQL)
from app.models.product import Product
from app.models.order import Order
from app.models.payment import Payment
from app.models.shipment import Shipment

# Crear tablas
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SportGear Online API",
    description="Backend for SportGear Online E-commerce - Business Logic (PostgreSQL)",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========== HEALTH CHECK ENDPOINTS ==========
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy", 
        "service": "Python FastAPI Backend - SportGear Online",
        "timestamp": datetime.now().isoformat(),
        "database": "PostgreSQL"
    }

@app.get("/api/health/detailed")
async def detailed_health_check():
    return {
        "status": "healthy",
        "service": "Python FastAPI Backend - SportGear Online",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0",
        "environment": "development",
        "database": "PostgreSQL",
        "description": "Business Logic Backend"
    }

# Routers - sin user_routes (usuarios están en MySQL)
try:
    from app.routes.product_routes import router as product_router
    from app.routes.order_routes import router as order_router
    from app.routes.payment_routes import router as payment_router
    from app.routes.shipment_routes import router as shipment_router
    
    app.include_router(product_router, prefix="/api/v1", tags=["products"])
    app.include_router(order_router, prefix="/api/v1", tags=["orders"])
    app.include_router(payment_router, prefix="/api/v1", tags=["payments"])
    app.include_router(shipment_router, prefix="/api/v1", tags=["shipments"])
    
    print("✅ All routes loaded successfully")
    print("📊 Database: PostgreSQL (Business Logic)")
    print("👤 Users: MySQL via http://localhost:8080")
except ImportError as e:
    print(f"⚠️ Some routes not available: {e}")

@app.get("/")
def root():
    return {
        "message": "SportGear Online API is running!",
        "database": "PostgreSQL",
        "auth_service": "http://localhost:8080",
        "endpoints": {
            "products": "/api/v1/products",
            "orders": "/api/v1/orders",
            "payments": "/api/v1/payments",
            "shipments": "/api/v1/shipments"
        }
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy", 
        "database": "PostgreSQL",
        "auth_service": "MySQL (via Spring Boot)"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
