from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.schemas.product_schema import ProductCreate, ProductResponse
from app.crud.product_crud import get_products, get_product, create_product, delete_product, search_products

router = APIRouter()

@router.get("/products", response_model=list[ProductResponse])
def read_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_products(db, skip=skip, limit=limit)

@router.get("/products/search", response_model=list[ProductResponse])
def search_products_endpoint(
    q: Optional[str] = Query(None, description="Búsqueda por nombre, descripción o marca"),
    category: Optional[str] = Query(None, description="Filtrar por categoría"),
    brand: Optional[str] = Query(None, description="Filtrar por marca"),
    sport: Optional[str] = Query(None, description="Filtrar por deporte"),
    gender: Optional[str] = Query(None, description="Filtrar por género"),
    min_price: Optional[float] = Query(None, description="Precio mínimo"),
    max_price: Optional[float] = Query(None, description="Precio máximo"),
    in_stock: bool = Query(False, description="Solo productos en stock"),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Endpoint de búsqueda avanzada de productos.
    Permite filtrar por múltiples criterios simultáneamente.
    """
    return search_products(
        db=db,
        search_query=q,
        category=category,
        brand=brand,
        sport=sport,
        gender=gender,
        min_price=min_price,
        max_price=max_price,
        in_stock_only=in_stock,
        skip=skip,
        limit=limit
    )

@router.get("/products/{product_id}", response_model=ProductResponse)
def read_product(product_id: int, db: Session = Depends(get_db)):
    db_product = get_product(db, product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@router.post("/products", response_model=ProductResponse)
def create_new_product(product: ProductCreate, db: Session = Depends(get_db)):
    return create_product(db, product)

@router.delete("/products/{product_id}")
def delete_existing_product(product_id: int, db: Session = Depends(get_db)):
    if not delete_product(db, product_id):
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}