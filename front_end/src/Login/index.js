import React from 'react';
import LoginForm from './Form';

const Login = (props) => (
  <div style={{ margin: 'auto', textAlign: 'center', width: '20%' }}>
    <LoginForm {...props} />
  </div>
);

export default Login;
