import React, { useState, useEffect } from "react";
import { Form, Label, FormGroup, Input, Button } from "reactstrap";

import { useTheme } from '../../Themes/ThemeContext';

const NewSale = ({ sale, onSubmit, editMode, t }) => {
  const { currentTheme } = useTheme();
  const {
    _id = "",
    name = "",
    quantity = "",
    buyPrice = "",
    sellPrice = "",
    category = "",
  } = sale;

  const [state, setState] = useState({
    id: _id,
    name,
    quantity,
    buyPrice: parseFloat(buyPrice) || 0,
    sellPrice: parseFloat(sellPrice) || 0,
    category,
  });

  useEffect(() => {
    setState({
      id: _id,
      name,
      quantity,
      buyPrice: parseFloat(buyPrice) || 0,
      sellPrice: parseFloat(sellPrice) || 0,
      category,
    });
  }, [sale]);

  const onChangeName = (e) => {
    setState((prevState) => ({ ...prevState, name: e.target.value }));
  };

  const onChangeBuyPrice = (e) => {
    setState((prevState) => ({ ...prevState, buyPrice: parseFloat(e.target.value) }));
  };

  const onChangeSellPrice = (e) => {
    setState((prevState) => ({ ...prevState, sellPrice: parseFloat(e.target.value) }));
  };

  const onChangeQuantity = (e) => {
    setState((prevState) => ({ ...prevState, quantity: parseFloat(e.target.value) }));
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const { id, name, quantity, buyPrice, sellPrice, category } = state;

    let updated = {
      name,
      quantity,
      buyPrice,
      sellPrice,
      category,
    };

    if (id) updated.id = id;

    onSubmit(updated);
  };

  return (
    <div style={{
      background: currentTheme.background,
      color: currentTheme.text,
      textAlign: 'center'
    }}
    >
      <Form onSubmit={submitHandler}>
        <FormGroup>
          <Label for="categorySelect">{t("category")}</Label>
          <Input
            type="select"
            id="categorySelect"
            name="category"
            placeholder="Select category"
            value={state.category}
            onChange={(e) => setState((prev) => ({ ...prev, category: e.target.value }))}
          >
            <option value="big">{t("big")}</option>
            <option value="small">{t("small")}</option>
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="name">{t("item")}</Label>
          <Input id="name" type="text" placeholder="Kiwis" value={state.name} onChange={onChangeName} />
        </FormGroup>
        <FormGroup>
          <Label for="quantity">{t("quantity")}</Label>
          <Input
            id="quantity"
            type="number"
            placeholder="10"
            value={state.quantity}
            onChange={onChangeQuantity}
          />
        </FormGroup>
        <FormGroup>
          <Label for="buy_price">{t("buyPrice")}</Label>
          <Input
            id="buy_price"
            type="number"
            step="0.1"
            placeholder="$0.4"
            value={state.buyPrice}
            onChange={onChangeBuyPrice}
          />
        </FormGroup>
        <FormGroup>
          <Label for="sell_price">{t("sellPrice")}</Label>
          <Input
            id="sell_price"
            type="number"
            step="0.1"
            placeholder="$0.6"
            value={state.sellPrice}
            onChange={onChangeSellPrice}
          />
        </FormGroup>
        <Button className="formBtn" color="success">
          {editMode ? t("updateSale") : t("newSale")}
        </Button>
      </Form>
    </div>
  );
};

export default NewSale;