import React from 'react';
import { useLocation } from 'react-router-dom';
import { LoginPage } from './LoginPage';
import { SignupPage } from './SignupPage';

export const AuthPage: React.FC = () => {
  const location = useLocation();
  const isSignup = location.pathname.includes('signup');

  return isSignup ? <SignupPage /> : <LoginPage />;
};

export { LoginPage } from './LoginPage';
export { SignupPage } from './SignupPage';
