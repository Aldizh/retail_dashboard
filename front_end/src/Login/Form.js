import React, { useState } from 'react';
import { Button, Form, Alert } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import api from '../api';

const LoginForm = ({ loginAnonymous, loginWithKey, t }) => {
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      setError(null);
      await loginAnonymous();
      // Authentication successful, reload to enter the app
      window.location.reload();
    } catch (err) {
      console.log("Error during anonymous login", err.message);
      setError(err.message);
    }
  };

  const handleLoginWithKey = async () => {
    try {
      setError(null);
      await loginWithKey();
      // Authentication successful, reload to enter the app
      window.location.reload();
    } catch (err) {
      console.log("Error during API key login", err.message);
      setError(err.message);
    }
  };

  return (
    <Form>
      {error && (
        <Alert color="danger" style={{ marginBottom: '1rem' }}>
          {error}
        </Alert>
      )}
      <div style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
      }}>
        <Button onClick={handleLogin}>{t('anonymous')}</Button>
        <Button onClick={handleLoginWithKey}>{t('authenticated')}</Button>
      </div>
    </Form>
  );
};

LoginForm.propTypes = {
  loginAnonymous: PropTypes.func.isRequired,
  loginWithKey: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(LoginForm);
