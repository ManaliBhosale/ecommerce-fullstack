import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/product';

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await getProducts({ limit: 8 });
        setFeaturedProducts(data.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          color: 'white',
          borderRadius: '16px',
          padding: '60px 40px',
          marginBottom: '40px',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
          Welcome to <span style={{ color: '#e94560' }}>ShopCart</span>
        </h1>
        <p style={{ fontSize: '1.1rem', marginBottom: '28px', opacity: 0.9 }}>
          Discover amazing products at unbeatable prices
        </p>
        <Link to="/products">
          <button className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1rem' }}>
            Shop Now
          </button>
        </Link>
      </div>

      {/* Categories Section */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px' }}>Browse by Category</h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty'].map((cat) => (
            <Link key={cat} to={`/products?category=${cat}`} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  background: 'white',
                  borderRadius: '8px',
                  padding: '12px 20px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'transform 0.2s',
                  color: '#1a1a2e',
                }}
                onMouseEnter={(e) => (e.target.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => (e.target.style.transform = 'translateY(0)')}
              >
                {cat}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div>
        <h2 style={{ marginBottom: '20px' }}>Featured Products</h2>
        {loading ? (
          <div className="spinner" />
        ) : featuredProducts.length === 0 ? (
          <p style={{ color: '#777' }}>No products available yet.</p>
        ) : (
          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link to="/products">
            <button className="btn btn-secondary">View All Products</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
