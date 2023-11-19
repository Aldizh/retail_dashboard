import React from "react"
import { Form, Label, FormGroup, FormFeedback, Input, Button } from "reactstrap"
import { useInputChange } from '../hooks/useInputChange'

const NewSale = (props) => {
  const { t, mode, onSubmit, sale } = props
  const [input, handleInputChange] = useInputChange(sale)

  const submitHandler = (e) => {
    e.stopPropagation()
    e.preventDefault()

    onSubmit(input)
  }

  return (
    <div className="createFormContainer">
      <Form onSubmit={submitHandler}>
        <FormGroup>
          <Label for="categorySelect">
            {t("category")}
          </Label>
          <Input
            type="select"
            id="categorySelect"
            name="category"
            placeholder="Select category"
            value={input.category}
            onChange={handleInputChange}
          >
            <option value="big">{t("big")}</option>
            <option value="small">{t("small")}</option>
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="name">
            {t("item")}
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Kiwis"
            value={input.name}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="quantity">
            {t("quantity")}
          </Label>
          <Input
            invalid={input.quantity < 0}
            id="quantity"
            name="quantity"
            type="number"
            placeholder="10"
            value={input.quantity}
            onChange={handleInputChange}
          />
          <FormFeedback>
            Oh noes! quantity can not be negative
          </FormFeedback>
        </FormGroup>
        <FormGroup>
          <Label for="buy_price">
            {t("buyPrice")}
          </Label>
          <Input
            id="buy_price"
            type="number"
            name="buyPrice"
            step="0.1"
            placeholder="$0.4"
            value={input.buyPrice}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="sell_price">
            {t("sellPrice")}
          </Label>
          <Input
            id="sell_price"
            type="number"
            name="sellPrice"
            step="0.1"
            placeholder="$0.6"
            value={input.sellPrice}
            onChange={handleInputChange}
          />
        </FormGroup>
        <Button
          className="formBtn"
          color="success"
        >
          {mode}
        </Button>
      </Form>
    </div>
  )
}

export default NewSale