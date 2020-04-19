import React from 'react';
import { withTranslation } from 'react-i18next';
import { CardFooter } from 'reactstrap';
import './styles.css';

const Footer = (props) => (
  <div className="footer">
    <CardFooter>
      &copy;
      {(new Date()).getFullYear()}
      {' '}
      {props.t('title')}
      . All Rights Reserved.
    </CardFooter>
  </div>
);

export default withTranslation()(Footer);
