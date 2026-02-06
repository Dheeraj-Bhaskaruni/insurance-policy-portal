import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { usePageTitle } from '../../hooks/usePageTitle';
import { login, clearError } from '../../store/authSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

import './LoginPage.css';

const LoginPage: React.FC = () => {
  usePageTitle('Sign In');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">IC</div>
          <h1 className="login-title">InsureCorp Portal</h1>
          <p className="login-subtitle">Sign in to manage policies and claims</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            autoComplete="current-password"
          />

          <Button type="submit" fullWidth loading={loading} size="lg">
            Sign In
          </Button>
        </form>

        <div className="login-demo">
          <p className="login-demo-title">Demo Accounts</p>
          <div className="login-demo-accounts">
            <button
              className="demo-account"
              onClick={() => {
                setEmail('admin@insurecorp.com');
                setPassword('admin123');
              }}
            >
              <strong>Admin</strong>
              <span>admin@insurecorp.com</span>
            </button>
            <button
              className="demo-account"
              onClick={() => {
                setEmail('agent@insurecorp.com');
                setPassword('agent123');
              }}
            >
              <strong>Agent</strong>
              <span>agent@insurecorp.com</span>
            </button>
            <button
              className="demo-account"
              onClick={() => {
                setEmail('customer@example.com');
                setPassword('customer123');
              }}
            >
              <strong>Customer</strong>
              <span>customer@example.com</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
