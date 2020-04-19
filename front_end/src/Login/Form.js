import React from 'react';
import { Button, Form } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import axios from 'axios';

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

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
      <ButtonRow>
        <Button onClick={handleLogin}>{t('anonymous')}</Button>
        <Button onClick={handleLoginWithKey}>{t('authenticated')}</Button>
      </ButtonRow>
    </Form>
  );
};

LoginForm.propTypes = {
  loginAnonymous: PropTypes.any,
};

export default withTranslation()(LoginForm);
