import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [localError, setLocalError] = useState('');
  const { register, loading, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setLocalError('');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      navigate('/');
    } catch {
      // error is set in AuthContext
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Create Account</h2>

      {(error || localError) && (
        <div className="alert alert-danger">{localError || error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="John Doe"
          />
        </div>

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
            placeholder="At least 6 characters"
            minLength={6}
          />
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Repeat your password"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', padding: '12px' }}
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '20px', color: '#555' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: '#e94560', fontWeight: '500' }}>
          Sign In
        </Link>
      </p>
    </div>
  );
}

export default Register;
