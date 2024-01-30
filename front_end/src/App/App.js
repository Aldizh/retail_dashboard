import React, { useState, useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { Redirect } from "react-router";
import { withTranslation } from "react-i18next";
import { Container, Row, Col, Input, Alert, FormGroup } from "reactstrap";

import "../i18n";
import { isLoggedIn } from "../Realm";
import { useTheme } from '../Themes/ThemeContext';
import Inventory from "../Components/Inventory/";
import EditArticle from "../Components/EditArticle"
import { updateLanguage } from "../redux/i18_reducer"

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

const App = ({ i18n }) => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [language, setLanguage] = useState("en")

  const { currentTheme } = useTheme();
  const isDark = (currentTheme.text === "#fff")

  const dispatch = useDispatch()

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language])

  useEffect(() => {
    let timer;
    if (alertOpen) timer = setTimeout(() => { setAlertOpen(false) }, 3 * 1000);

    return () => {
      timer && clearTimeout(timer);
    };
  }, [alertOpen])

  const onLanguageHandle = (event) => {
    const newLang = event.target.value;
    dispatch(updateLanguage(newLang))
    setLanguage(newLang);
  };

  const handleAlert = () => {
    setAlertOpen(!alertOpen);
  };

  if (!isLoggedIn()) {
    return <Redirect to="/login" />;
  }

  return (
    <div style={{ color: currentTheme.text, backgroundColor: currentTheme.background }}>
      <Container>
        <FormGroup
          className="translationButtons"
          style={{ background: currentTheme.background }}
        >
          <Input
            checked={language === "en"}
            name="language"
            onChange={onLanguageHandle}
            value="en"
            type="radio"
          />
          English &nbsp;
          <Input
            name="language"
            value="es"
            checked={language === "es"}
            type="radio"
            onChange={onLanguageHandle}
          />
          Spanish &nbsp;
          <Input
            name="language"
            value="al"
            checked={language === "al"}
            type="radio"
            onChange={onLanguageHandle}
          />
          Albanian
        </FormGroup>
        <Alert
          isOpen={alertOpen}
          toggle={handleAlert}
          color="success"
          fade={true}
        >
          {alertMessage}
        </Alert>
        <Row>
          <Col lg="6" sm="12" xs="12">
            <Inventory isDark={isDark} />
          </Col>
          <Col lg="6" sm="12" xs="12">
            <EditArticle
              setAlertOpen={setAlertOpen}
              setAlertMessage={setAlertMessage}
              isDark={isDark}
            />
            </Col>
        </Row>
      </Container>
    </div>
  );
};

export default withTranslation()(App);