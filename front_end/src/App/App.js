import React, { useState, useEffect } from "react";
import { Redirect } from "react-router";
import { withTranslation } from "react-i18next";
import { Container, Row, Col, Input, Alert, FormGroup } from "reactstrap";
import axios from "axios";
import { findIndex, isNil, propEq } from "ramda";

import "../i18n";
import { useTheme } from '../Themes/ThemeContext';
import Inventory from "../Components/Inventory/";
import ButtonGroup from "../Components/ButtonGroup";
import { isLoggedIn } from "../Realm";
import { escapeHTML } from "../utils/string";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

const App = ({ t, i18n }) => {
  const [data, setData] = useState([]);
  const [item, setItem] = useState({});
  const [id, setId] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [language, setLanguage] = useState("en")

  const { currentTheme } = useTheme();

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language])

  const onLanguageHandle = (event) => {
    const newLang = event.target.value;
    setLanguage(newLang);
  };

  useEffect(() => refreshArticles(), []);

  const refreshArticles = () => {
    axios.get(`/api/articles`).then((res) => {
      const { data } = res.data;
      setData(data);
    }).catch(err => console.log('error...', err));
  };

  const deleteArticle = async () => {
    const { _id } = item;
    const { data: allArticles } = await axios.get(`/api/articles/all`);
    const { data: deleted, status } = await axios.delete(`/api/articles/${_id}`);
    if (status === 200) {
      const deleteIndex = findIndex(propEq("_id", deleted.data._id))(allArticles.data);
      if (deleteIndex === -1) {
        alert("No such records exist in our database");
      } else {
        setId("");
        setItem({});
        setAlertOpen(true);
        setAlertMessage("Item deleted successfully");
        refreshArticles();
      }
    }
  };

  const updateArticles = async () => {
    let recordToUpdate = {};
    const { _id: idToUpdate, name = "", quantity, buyPrice } = item;
    const { data } = await axios.get(`/api/articles/${idToUpdate}`);
    const existingData = data.data;

    if (editMode) {
      setAlertOpen(true);
      setAlertMessage("Item updated successfully");

      recordToUpdate = {
        ...existingData,
        name: escapeHTML(name) || existingData.name,
        quantity: quantity || existingData.quantity,
        buyPrice: buyPrice || existingData.buyPrice,
      };

      axios.put(`/api/articles/${idToUpdate}`, recordToUpdate).then((response) => {
        if (response.status === 200) refreshArticles();
      });
    } else createArticle();
  };

  const handleAlert = () => {
    setAlertOpen(!alertOpen);
  };

  const onIdUpdate = (e) => {
    let id = e.target.value;
    setId(id);
    setEditMode(false);

    if (isNil(id) || id === "") {
      setItem({});
      return;
    }
    axios.get(`/api/articles/${id}`).then((res) => {
      if (res.data.success) {
        setItem(res.data.data);
        setEditMode(true);
      } else {
        setItem({});
        setEditMode(false);
      }
    });
  };

  const createArticle = () => {
    const { name, quantity, buyPrice, category } = item;
    const newRecord = {
      name,
      quantity,
      buyPrice,
      category,
    };
    axios.post("/api/articles", newRecord).then((response) => {
      if (response.status === 200) {
        const newData = data;
        newData.push(newRecord);
        setData(newData);
      }
    });
  };

  if (!isLoggedIn()) {
    return <Redirect to="/login" />;
  }

  return (
    <div style={{ color: currentTheme.text }}>
      <Container>
        <FormGroup className="translationButtons" style={{background: currentTheme.background}}>
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
        <Alert isOpen={alertOpen} toggle={handleAlert} color="success" fade={true}>
          {alertMessage}
        </Alert>
        <Row>
          <Col lg="6" sm="12" xs="12">
            <Inventory
              initialData={data}
              refreshArticles={refreshArticles}
            />
          </Col>
          <Col lg="6" sm="12" xs="12">
            <h3 style={{ background: currentTheme.background}}>{t("dataCorrection")}</h3>
            <div className="editDiv">
              <Input
                type="text"
                placeholder={t("barCode")}
                value={id || ""}
                onChange={onIdUpdate}
              />
              <Input
                type="text"
                placeholder={t("nameNew")}
                value={item.name || ""}
                onChange={(e) => setItem({ ...item, name: e.target.value })}
              />
              <Input
                type="number"
                placeholder={t("quantityNew")}
                value={item.quantity || ""}
                onChange={(e) => setItem({ ...item, quantity: parseFloat(e.target.value) })}
              />
              <Input
                type="number"
                placeholder={t("buyPriceNew")}
                value={item.buyPrice || ""}
                onChange={(e) => setItem({ ...item, buyPrice: parseFloat(e.target.value) })}
              />
              <ButtonGroup
                updateHandler={updateArticles}
                deleteHandler={deleteArticle}
                updateText={editMode ? t("correct") : t("inventoryEntry")}
                deleteText={t("delete")}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default withTranslation()(App);