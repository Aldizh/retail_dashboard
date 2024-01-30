import React from 'react';
import { withTranslation } from 'react-i18next';
import { CardFooter, CardText } from 'reactstrap';

import { useTheme } from '../Themes/ThemeContext';
import './styles.css';

const Footer = (props) => {
  const { currentTheme } = useTheme();
 
  return (
    <CardFooter style={{ background: currentTheme.background, color: currentTheme.text }}>
      <CardText>&copy; {new Date().getFullYear()} {props.t("title")}.</CardText>
      <CardText>All Rights Reserved.</CardText>
    </CardFooter>
  )
}

export default withTranslation()(Footer);
