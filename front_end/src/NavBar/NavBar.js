import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios"

import { withTranslation } from "react-i18next"
import { Navbar, Nav, NavItem, NavLink, NavbarToggler, Collapse, Button } from 'reactstrap'

import { useTheme } from '../Themes/ThemeContext';
import "./styles.css"

const NavBar = ({ t, handleLogout, isLoggedIn, loginWithGoogle }) => {
  let navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true)

  const { currentTheme, toggleTheme } = useTheme();
  const toggleNavbar = () => setIsOpen(!isOpen)

  useEffect(() => {
    // check for google authentication here
    const url = new URL(window.location.href)
    const code = url.searchParams.get('code')

    if (!isLoggedIn() && code) {
      axios.get(`/api/auth_callback?code=${code}`).then(res => {
        const token = res.data?.data?.id_token
        if (token) loginWithGoogle(token).then(() => {
          navigate("/")
        })
      })
    }
  }, [])

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
        {isLoggedIn() ? <Button
          secondary="true"
          size="sm"
          block={false}
          onClick={(e) => handleLogout(e)}
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