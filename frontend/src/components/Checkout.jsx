import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/order';

function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    paymentMethod: 'COD',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const orderItems = cart.items.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        image: item.product.images?.[0] || '',
        price: item.product.price,
        quantity: item.quantity,
      }));

      const orderData = {
        orderItems,
        shippingAddress: {
          street: form.street,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
          country: form.country,
        },
        paymentMethod: form.paymentMethod,
      };

      const { data } = await createOrder(orderData);
      await clearCart();
      navigate(`/`);
      alert(`Order placed successfully! Order ID: ${data.order._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const tax = cartTotal * 0.1;
  const shipping = cartTotal > 100 ? 0 : 10;
  const total = cartTotal + tax + shipping;

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '24px' }}>Checkout</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div
          style={{
            background: 'white',
            borderRadius: '10px',
            padding: '24px',
            marginBottom: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <h3 style={{ marginBottom: '16px' }}>Shipping Address</h3>

          <div className="form-group">
            <label>Street Address</label>
            <input
              type="text"
              name="street"
              value={form.street}
              onChange={handleChange}
              required
              placeholder="123 Main St"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                placeholder="New York"
              />
            </div>
            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                required
                placeholder="NY"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>ZIP Code</label>
              <input
                type="text"
                name="zipCode"
                value={form.zipCode}
                onChange={handleChange}
                required
                placeholder="10001"
              />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={form.country}
                onChange={handleChange}
                required
                placeholder="United States"
              />
            </div>
          </div>
        </div>

        <div
          style={{
            background: 'white',
            borderRadius: '10px',
            padding: '24px',
            marginBottom: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <h3 style={{ marginBottom: '16px' }}>Payment Method</h3>
          <div className="form-group">
            <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
              <option value="COD">Cash on Delivery</option>
              <option value="CreditCard">Credit Card</option>
              <option value="PayPal">PayPal</option>
            </select>
          </div>
        </div>

        <div
          style={{
            background: 'white',
            borderRadius: '10px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <h3 style={{ marginBottom: '16px' }}>Order Summary</h3>
          {cart.items?.map((item) => (
            <div
              key={item.product?._id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
                fontSize: '0.9rem',
              }}
            >
              <span>
                {item.product?.name} × {item.quantity}
              </span>
              <span>${(item.product?.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <hr style={{ margin: '12px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span>Subtotal:</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span>Tax:</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span>Shipping:</span>
            <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 'bold',
              fontSize: '1.1rem',
            }}
          >
            <span>Total:</span>
            <span style={{ color: '#e94560' }}>${total.toFixed(2)}</span>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '20px', padding: '14px' }}
            disabled={loading}
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Checkout;
