import React, { Component } from 'react'

class Form extends Component {
  constructor(props) {
    super(props);

    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeBuyPrice = this.onChangeBuyPrice.bind(this);
    this.onChangeQuantity = this.onChangeQuantity.bind(this);
    this.onChangeSellPrice = this.onChangeSellPrice.bind(this);
    this.submitHandler = this.submitHandler.bind(this);

    const {
      _id = "",
      name = "",
      quantity = "",
      buyPrice = "",
      sellPrice = "",
      category = "",
    } = this.props.sale

    this.state = {
      id: _id,
      name,
      quantity,
      buyPrice,
      sellPrice,
      category
    };
  }

  onChangeName(e) {
    this.setState({ name: e.target.value });
  }

  onChangeBuyPrice(e) {
    this.setState({ buyPrice: parseFloat(e.target.value) });
  }

  onChangeSellPrice(e) {
    this.setState({ sellPrice: parseFloat(e.target.value) });
  }

  onChangeQuantity(e) {
    this.setState({ quantity: parseFloat(e.target.value) });
  }

  submitHandler(e){
    e.preventDefault();

    const { onSubmit } = this.props

    const {
      saleId, name, quantity, buyPrice, sellPrice, category,
    } = this.state;

    const updated = {
      saleId, name, quantity, buyPrice, sellPrice, category
    }

    onSubmit(updated)
  }

  render() {
    const { t, editMode } = this.props
    const { category, name, quantity, buyPrice, sellPrice } = this.state

    return (
      <div className="createFormContainer">
        <form className="add-form" onSubmit={this.submitHandler}>
          <div className="form-control">
            <label>{t('category')}</label>
            <select
              value={category}
              name="cars"
              id="categorySelect"
              onChange={(e) => this.setState({ category: e.target.value })}
            >
              <option value="big">{t('big')}</option>
              <option value="small">{t('small')}</option>
            </select>
          </div>
          <div className="form-control">
            <label>{t('item')}</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder=""
              value={name}
              onChange={this.onChangeName}
            />
          </div>
          <div className="form-control">
            <label>{t('quantity')}</label>
            <input
              id="quantity"
              type="number"
              name="quantity"
              placeholder=""
              value={quantity}
              onChange={this.onChangeQuantity}
            />
          </div>
          <div className="form-control">
            <label>{t('buyPrice')}</label>
            <input
              id="buy_price"
              type="number"
              name="buy_price"
              step="0.1"
              placeholder=""
              value={buyPrice}
              onChange={this.onChangeBuyPrice}
            />
          </div>
          <div className="form-control">
            <label>{t('sellPrice')}</label>
            <input
              id="sell_price"
              type="number"
              step="0.1"
              name="sell_price"
              placeholder=""
              value={sellPrice}
              onChange={this.onChangeSellPrice}
            />
          </div>
          <div style={{ margin: 10 }}>
            <input type="submit" value={editMode ? t('updateSale') : t('newSale')} className="btn btn-success btn-block" />
          </div>
        </form>
      </div>
    )
  }
}

export default Form
