import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    if (!form.fullName || !form.email || !form.mobileNumber || !form.password || !form.confirmPassword) {
      return 'All fields are required.';
    }
    if (!EMAIL_REGEX.test(form.email)) {
      return 'Please enter a valid email address.';
    }
    if (!/^\d{10}$/.test(form.mobileNumber)) {
      return 'Please enter a valid 10-digit mobile number.';
    }
    if (form.password.length < 6) {
      return 'Password must be at least 6 characters long.';
    }
    if (form.password !== form.confirmPassword) {
      return 'Password and Confirm Password do not match.';
    }
    return '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post('/auth/register', form);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-brand-panel d-none d-md-flex">
        <h1>Solace CRM</h1>
        <p>Create an account to start managing your agents and customer relationships.</p>
      </div>
      <div className="auth-form-panel">
        <div className="auth-form-card">
          <h2>Create account</h2>
          <p className="subtitle">Register to get started</p>

          {error && <div className="alert alert-danger py-2">{error}</div>}
          {success && <div className="alert alert-success py-2">{success}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label" htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className="form-control"
                value={form.fullName}
                onChange={handleChange}
                placeholder="John Doe"
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="mobileNumber">Mobile Number</label>
              <input
                type="tel"
                id="mobileNumber"
                name="mobileNumber"
                className="form-control"
                value={form.mobileNumber}
                onChange={handleChange}
                placeholder="9876543210"
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                value={form.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-control"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
              />
            </div>
            <button type="submit" className="btn btn-crm-primary w-100" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <div className="auth-switch-link">
            Already have an account? <Link to="/login">Log in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
