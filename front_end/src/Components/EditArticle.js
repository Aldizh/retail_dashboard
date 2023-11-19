import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { Col, Input } from "reactstrap";
import { withTranslation } from "react-i18next";
import { findIndex, isNil, propEq } from "ramda";
import axios from "axios";

import {
  updatePageData,
  updateTotalCount
} from '../redux/inventory_reducer'
import ButtonGroup from "../Components/ButtonGroup";
import { useTheme } from '../Themes/ThemeContext';
import { escapeHTML } from "../utils/string";

const EditArticle = ({ setAlertMessage, setAlertOpen, t }) => {
  const [id, setId] = useState(0);
  const [item, setItem] = useState({});
  const [editMode, setEditMode] = useState(false);
  const { currentTheme } = useTheme();

  // access redux store
  const dispatch = useDispatch()
  const currentPage = useSelector((state) => state.page.currentPage)

  useEffect(() => {
    axios
      .get(`/api/articles`)
      .then(({ data }) => {
        dispatch(updateTotalCount(data.data.length))
      })
  }, [])

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
        axios
          .get(`/api/articles?pageNumber=${currentPage}`)
          .then(({ data }) => {
            dispatch(updatePageData(data.data))
          })
      }
    }
  };

  const updateArticle = async () => {
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
        if (response.status === 200) {
          axios
            .get(`/api/articles?pageNumber=${currentPage}`)
            .then(({ data }) => {
              dispatch(updatePageData(data.data))
            })
        }
      });
    } else createArticle();
  };

  return (
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
          onChange={(e) => {
            e.persist()
            setItem(previousItem => ({...previousItem, name: e.target.value }))
          }}
        />
        <Input
          type="number"
          placeholder={t("quantityNew")}
          value={item.quantity || ""}
          onChange={(e) => {
            e.persist()
            setItem((previousItem) => ({...previousItem, quantity: parseFloat(e.target.value) }))
          }}
        />
        <Input
          type="number"
          placeholder={t("buyPriceNew")}
          value={item.buyPrice || ""}
          onChange={(e) => {
            e.persist()
            setItem(previousItem => ({...previousItem, buyPrice: e.target.value }))
          }}
        />
        <ButtonGroup
          updateHandler={updateArticle}
          deleteHandler={deleteArticle}
          updateText={editMode ? t("correct") : t("inventoryEntry")}
          deleteText={t("delete")}
        />
      </div>
    </Col>
  );
};

export default withTranslation()(EditArticle);