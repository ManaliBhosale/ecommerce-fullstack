import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login, loading, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
      navigate('/');
    } catch {
      // error is set in AuthContext
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Sign In</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', padding: '12px' }}
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '20px', color: '#555' }}>
        Don&apos;t have an account?{' '}
        <Link to="/register" style={{ color: '#e94560', fontWeight: '500' }}>
          Register
        </Link>
      </p>
    </div>
  );
}

export default Login;
