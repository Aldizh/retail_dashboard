import React, { useState } from "react"
import { useNavigate } from "react-router-dom";

import { withTranslation } from "react-i18next"
import { Navbar, Nav, NavItem, NavLink, NavbarToggler, Collapse, Button } from 'reactstrap'

import { hasLoggedInUser, logoutUser } from "../Authentication";
import { useTheme } from '../Themes/ThemeContext';
import "./styles.css"

const NavBar = ({ t }) => {
  let navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true)

  const { currentTheme, toggleTheme } = useTheme();
  const toggleNavbar = () => setIsOpen(!isOpen)

  return (
    <Navbar style={{
      background: currentTheme.background,
      color: currentTheme.text,
      marginBottom: 30,
    }} expand="md">
      <NavbarToggler onClick={toggleNavbar} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="ml-auto" fill pills navbar>
          <NavItem>
            <NavLink style={{ color: currentTheme.text }} onClick={() => navigate("/")}>{t("home")}</NavLink>
          </NavItem>
          <NavItem>
            <NavLink style={{ color: currentTheme.text }} onClick={() => navigate("/create")}>{t("dataEntry")}</NavLink>
          </NavItem>
          <NavItem>
            <NavLink style={{ color: currentTheme.text }} onClick={() => navigate("/small")}>{t("small")}</NavLink>
          </NavItem>
          <NavItem style={{ color: currentTheme.text }}>
            <NavLink style={{ color: currentTheme.text }} onClick={() => navigate("/large")}>{t("big")}</NavLink>
          </NavItem>
        </Nav>
      </Collapse>
      <div>
        {hasLoggedInUser() ? <Button
          secondary="true"
          size="sm"
          block={false}
          onClick={(e) => logoutUser(e)}
          className="navButton"
        >Logout
        </Button> : <div />
        }
      </div>
      <Button size="sm" onClick={toggleTheme}>Toggle Theme</Button>
    </Navbar>
  )
}

export default withTranslation()(NavBar)