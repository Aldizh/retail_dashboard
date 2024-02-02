import React from 'react';
import { Button, Form } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import axios from 'axios';

const LoginForm = ({ loginAnonymous, loginWithKey, t }) => {
  const handleLogin = () => {
    loginAnonymous().then((authResponse) => {
      const { _accessToken } = authResponse
      axios.post("/set/cookie", {
        token: _accessToken
      }).then(res => {
        if (res.status === 200) window.location.reload();
      }).catch(err => {
        console.log("Error setting cookie", err.message);
      })
    });
  };

  const handleLoginWithKey = () => {
    loginWithKey().then((authResponse) => {
      const { _accessToken } = authResponse
      axios.post("/set/cookie", {
        token: _accessToken
      }).then(res => {
        if (res.status === 200) window.location.reload();
      }).catch(err => {
        console.log("Error setting cookie", err.message);
      })
    });
  };

  return (
    <Form>
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
  loginAnonymous: PropTypes.any,
};

export default withTranslation()(LoginForm);
