import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyOrders } from '../services/order';

function Profile() {
  const { user, updateProfile, loading, error, setError } = useAuth();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || '',
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await getMyOrders();
        setOrders(data.orders);
      } catch (err) {
        console.error(err);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: {
          street: form.street,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
          country: form.country,
        },
      });
      setSuccess('Profile updated successfully!');
    } catch {
      // error is set in context
    }
  };

  const statusColors = {
    Pending: '#ffc107',
    Processing: '#17a2b8',
    Shipped: '#6f42c1',
    Delivered: '#28a745',
    Cancelled: '#dc3545',
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '24px' }}>My Account</h2>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', borderBottom: '2px solid #eee', paddingBottom: '0' }}>
        {['profile', 'orders'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '10px 20px',
              fontSize: '1rem',
              fontWeight: activeTab === tab ? 'bold' : 'normal',
              color: activeTab === tab ? '#e94560' : '#555',
              borderBottom: activeTab === tab ? '2px solid #e94560' : '2px solid transparent',
              marginBottom: '-2px',
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div
          style={{
            background: 'white',
            borderRadius: '10px',
            padding: '32px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>

            <h4 style={{ margin: '20px 0 12px' }}>Address</h4>
            <div className="form-group">
              <label>Street</label>
              <input
                type="text"
                name="street"
                value={form.street}
                onChange={handleChange}
                placeholder="123 Main St"
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>City</label>
                <input type="text" name="city" value={form.city} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>State</label>
                <input type="text" name="state" value={form.state} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>ZIP Code</label>
                <input type="text" name="zipCode" value={form.zipCode} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input type="text" name="country" value={form.country} onChange={handleChange} />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ marginTop: '8px' }}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          {ordersLoading ? (
            <div className="spinner" />
          ) : orders.length === 0 ? (
            <p style={{ color: '#777', textAlign: 'center', padding: '40px' }}>
              You have no orders yet.
            </p>
          ) : (
            orders.map((order) => (
              <div
                key={order._id}
                style={{
                  background: 'white',
                  borderRadius: '10px',
                  padding: '20px',
                  marginBottom: '12px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#777' }}>
                    Order #{order._id.slice(-8).toUpperCase()}
                  </span>
                  <span
                    style={{
                      padding: '2px 10px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      background: statusColors[order.orderStatus] + '22',
                      color: statusColors[order.orderStatus],
                    }}
                  >
                    {order.orderStatus}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#555', fontSize: '0.9rem' }}>
                    {order.orderItems.length} item(s)
                  </span>
                  <strong style={{ color: '#e94560' }}>${order.totalPrice.toFixed(2)}</strong>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '6px' }}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;
