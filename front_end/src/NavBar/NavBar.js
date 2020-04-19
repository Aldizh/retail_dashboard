import React from "react"
import { withTranslation } from "react-i18next"
import { Button } from 'reactstrap';
import useBeforeFirstRender from "../hooks/useBeforeFirstRender"
import "./styles.css"

const NavBar = ({ t, i18n, handleLogout, isLoggedIn }) => {
  useBeforeFirstRender(() => {
    const lang = localStorage.getItem('language');
    if (lang && lang.length) {
      i18n.changeLanguage(lang);
    }
  });

  return (
    <ul>
      <li style={{ float: "right", display: "inline-flex" }}>
        <a href="/">{t("home")}</a>
        {isLoggedIn() && <Button
          secondary="true"
          size="sm"
          block={false}
          onClick={(e) => handleLogout(e)}
        >Logout
        </Button>}
      </li>
    </ul>
  );
};

export default withTranslation()(NavBar);
