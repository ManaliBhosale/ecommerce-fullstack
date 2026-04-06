import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, addReview } from '../services/product';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await getProduct(id);
        setProduct(data.product);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await addToCart(product._id, quantity);
      setSuccess('Added to cart!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Failed to add to cart');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    setError('');
    try {
      await addReview(id, { rating: reviewRating, comment: reviewComment });
      setSuccess('Review submitted!');
      setReviewComment('');
      // Refresh product
      const { data } = await getProduct(id);
      setProduct(data.product);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <div className="spinner" />;
  if (!product) return <p>Product not found.</p>;

  const imageUrl =
    product.images?.length > 0
      ? product.images[0]
      : 'https://via.placeholder.com/500x400?text=No+Image';

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          background: 'white',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
          marginBottom: '32px',
        }}
      >
        <img
          src={imageUrl}
          alt={product.name}
          style={{ width: '100%', borderRadius: '8px', objectFit: 'cover' }}
        />

        <div>
          <p style={{ color: '#777', fontSize: '0.85rem', marginBottom: '8px', textTransform: 'uppercase' }}>
            {product.category}
          </p>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>{product.name}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ color: '#f5a623', fontSize: '1.2rem' }}>
              {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}
            </span>
            <span style={{ color: '#777' }}>({product.numReviews} reviews)</span>
          </div>

          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e94560', marginBottom: '16px' }}>
            ${product.price.toFixed(2)}
          </p>

          <p style={{ color: '#555', marginBottom: '20px', lineHeight: '1.7' }}>
            {product.description}
          </p>

          <p style={{ marginBottom: '16px' }}>
            <strong>Stock:</strong>{' '}
            <span style={{ color: product.stock > 0 ? '#28a745' : '#dc3545' }}>
              {product.stock > 0 ? `${product.stock} available` : 'Out of Stock'}
            </span>
          </p>

          {product.stock > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <label>Qty:</label>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                style={{
                  width: '70px',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              />
            </div>
          )}

          <button
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px' }}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
        }}
      >
        <h2 style={{ marginBottom: '20px' }}>Customer Reviews</h2>

        {product.reviews.length === 0 ? (
          <p style={{ color: '#777' }}>No reviews yet. Be the first to review!</p>
        ) : (
          product.reviews.map((review, idx) => (
            <div
              key={idx}
              style={{
                borderBottom: '1px solid #eee',
                paddingBottom: '16px',
                marginBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <strong>{review.name}</strong>
                <span style={{ color: '#f5a623' }}>{'★'.repeat(review.rating)}</span>
              </div>
              <p style={{ color: '#555' }}>{review.comment}</p>
            </div>
          ))
        )}

        {user && (
          <div style={{ marginTop: '24px' }}>
            <h3 style={{ marginBottom: '16px' }}>Write a Review</h3>
            <form onSubmit={handleReviewSubmit}>
              <div className="form-group">
                <label>Rating</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>
                      {r} Star{r !== 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Comment</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows="3"
                  required
                  placeholder="Share your experience..."
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={reviewLoading}>
                {reviewLoading ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
