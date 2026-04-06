import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        ShopCart
      </Link>

      <ul className="navbar-links">
        <li>
          <Link to="/products">Products</Link>
        </li>

        {user ? (
          <>
            <li>
              <Link to="/cart">
                Cart
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
            </li>
            <li>
              <Link to="/profile">{user.name}</Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
