import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Package, 
  DollarSign, 
  Archive,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Save,
  X
} from 'lucide-react';

interface ProductForm {
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category: string;
  brand?: string;
  sport?: string;
  gender?: string;
  image_url?: string;
}

export default function ProductManagementPage() {
  const navigate = useNavigate();
  const { products, loading, createProduct, updateProduct, deleteProduct, fetchProducts } = useProducts();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    description: '',
    price: 0,
    stock_quantity: 0,
    category: '',
    brand: '',
    sport: '',
    gender: 'Unisex',
    image_url: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(() => fetchProducts(), 30000);
    return () => clearInterval(interval);
  }, [searchQuery]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      stock_quantity: 0,
      category: '',
      brand: '',
      sport: '',
      gender: 'Unisex',
      image_url: ''
    });
    setEditingProduct(null);
    setShowCreateForm(false);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock_quantity: product.stock_quantity,
      category: product.category,
      brand: product.brand || '',
      sport: product.sport || product.category,
      gender: product.gender || 'Unisex',
      image_url: product.image_url || ''
    });
    setShowCreateForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
        setSuccessMessage('Producto actualizado exitosamente');
      } else {
        await createProduct(formData);
        setSuccessMessage('Producto creado exitosamente');
      }
      resetForm();
      fetchProducts();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Error al guardar el producto');
      console.error(error);
    }
  };

  const handleDelete = async (productId: number, productName: string) => {
    if (window.confirm(`¿Estás seguro de eliminar el producto "${productName}"?`)) {
      try {
        await deleteProduct(productId);
        setSuccessMessage('Producto eliminado exitosamente');
        fetchProducts();
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        setErrorMessage('Error al eliminar el producto');
        console.error(error);
      }
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock_quantity), 0);
  const lowStock = products.filter(p => p.stock_quantity < 10).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Panel de Admin
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
              <p className="text-gray-600 mt-2">Administra el catálogo de productos</p>
            </div>
            <Button onClick={() => setShowCreateForm(true)} disabled={showCreateForm}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Producto
            </Button>
          </div>
        </div>

        {/* Messages */}
        {successMessage && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
          </Alert>
        )}

        {errorMessage && (
          <Alert className="mb-4 bg-red-50 border-red-200">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Productos</p>
                <p className="text-2xl font-bold">{totalProducts}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valor Inventario</p>
                <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Stock Bajo</p>
                <p className="text-2xl font-bold">{lowStock}</p>
              </div>
              <Archive className="h-8 w-8 text-orange-600" />
            </div>
          </Card>
        </div>

        {/* Create/Edit Form */}
        {showCreateForm && (
          <Card className="p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <Button variant="ghost" size="icon" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre del Producto *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej: Balón de Fútbol Nike"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Categoría *</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Ej: Fútbol, Basketball, Running"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descripción *</Label>
                <textarea
                  id="description"
                  className="w-full p-2 border rounded-md min-h-[100px]"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descripción detallada del producto..."
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Precio ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Stock *</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="image_url">URL de Imagen</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  {editingProduct ? 'Actualizar' : 'Crear'} Producto
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Search */}
        <Card className="p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Buscar productos por nombre o categoría..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </Card>

        {/* Products List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Productos ({filteredProducts.length})</h2>
          
          {loading ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500">Cargando productos...</p>
            </Card>
          ) : filteredProducts.length === 0 ? (
            <Card className="p-8 text-center text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No se encontraron productos</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredProducts.map(product => (
                <Card key={product.id} className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Image */}
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold">{product.name}</h3>
                          <Badge variant="secondary" className="mt-1">{product.category}</Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">${product.price}</p>
                          <p className="text-sm text-gray-600">
                            Stock: <span className={product.stock_quantity < 10 ? 'text-orange-600 font-semibold' : ''}>{product.stock_quantity}</span>
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                      
                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit2 className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(product.id, product.name)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
