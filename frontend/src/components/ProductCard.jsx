import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await addToCart(product._id, 1);
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };

  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : 'https://via.placeholder.com/300x200?text=No+Image';

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`}>
        <img src={imageUrl} alt={product.name} />
      </Link>
      <div className="product-card-body">
        <p className="product-card-category">{product.category}</p>
        <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
          <h3 className="product-card-title">{product.name}</h3>
        </Link>
        <p className="product-card-price">${product.price.toFixed(2)}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <span style={{ color: '#f5a623' }}>{'★'.repeat(Math.round(product.rating))}</span>
          <span style={{ fontSize: '0.8rem', color: '#777' }}>({product.numReviews})</span>
        </div>
        <button
          className="btn btn-primary"
          style={{ width: '100%' }}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
