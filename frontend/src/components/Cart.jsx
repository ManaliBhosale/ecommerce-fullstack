import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

function Cart() {
  const { cart, cartTotal, updateQuantity, removeFromCart, clearCart, loading } = useCart();

  if (!cart.items || cart.items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2>Your cart is empty</h2>
        <Link to="/products">
          <button className="btn btn-primary" style={{ marginTop: '16px' }}>
            Continue Shopping
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2 style={{ marginBottom: '20px' }}>Shopping Cart</h2>

      {cart.items.map((item) => (
        <div key={item.product?._id} className="cart-item">
          <img
            src={
              item.product?.images?.[0] ||
              'https://via.placeholder.com/80x80?text=No+Image'
            }
            alt={item.product?.name}
          />
          <div className="cart-item-info">
            <h4>{item.product?.name}</h4>
            <p style={{ color: '#e94560', fontWeight: 'bold' }}>
              ${item.product?.price?.toFixed(2)}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              className="btn btn-outline"
              style={{ padding: '4px 10px' }}
              onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
              disabled={item.quantity <= 1 || loading}
            >
              -
            </button>
            <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>
              {item.quantity}
            </span>
            <button
              className="btn btn-outline"
              style={{ padding: '4px 10px' }}
              onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
              disabled={loading}
            >
              +
            </button>
          </div>
          <p style={{ fontWeight: 'bold', minWidth: '70px', textAlign: 'right' }}>
            ${(item.product?.price * item.quantity).toFixed(2)}
          </p>
          <button
            className="btn btn-danger"
            style={{ padding: '6px 12px' }}
            onClick={() => removeFromCart(item.product._id)}
            disabled={loading}
          >
            ✕
          </button>
        </div>
      ))}

      <div className="cart-summary">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span>Subtotal:</span>
          <strong>${cartTotal.toFixed(2)}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span>Tax (10%):</span>
          <strong>${(cartTotal * 0.1).toFixed(2)}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span>Shipping:</span>
          <strong>{cartTotal > 100 ? 'FREE' : '$10.00'}</strong>
        </div>
        <hr style={{ margin: '12px 0' }} />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '1.2rem',
            fontWeight: 'bold',
          }}
        >
          <span>Total:</span>
          <span style={{ color: '#e94560' }}>
            ${(cartTotal + cartTotal * 0.1 + (cartTotal > 100 ? 0 : 10)).toFixed(2)}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          <button
            className="btn btn-outline"
            onClick={clearCart}
            disabled={loading}
          >
            Clear Cart
          </button>
          <Link to="/checkout" style={{ flex: 1 }}>
            <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              Proceed to Checkout
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;
