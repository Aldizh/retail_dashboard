import React, { Component } from "react"
import { Redirect } from "react-router"
import { withTranslation } from "react-i18next"
import { Container, Row, Col, Input, Alert } from "reactstrap"
import axios from "axios"
import { findIndex, isNil, propEq } from "ramda"

import "../i18n"
import Inventory from "../Components/Inventory/"
import ButtonGroup from "../Components/ButtonGroup"
import Translator from "../Components/Translator"
import { escapeHTML } from "../utils/string"
import { isLoggedIn  } from "../Realm"

// bootstrap styles
import "bootstrap/dist/css/bootstrap.min.css"
import "./styles.css"

class App extends Component {
  constructor(props) {
    // Required step: always call the parent class' constructor
    super(props)

    let defaultLang = "en"
    const lang = localStorage.getItem("language")
    if (lang && lang.length) defaultLang = lang

    // Set the state directly. Use props if necessary.
    this.state = {
      data: [],
      item: {},
      id: 0,
      editMode: false,
      language: defaultLang,
      alertOpen: false,
      alertMessage: ""
    }
    this.updateArticles = this.updateArticles.bind(this)
    this.refreshArticles = this.refreshArticles.bind(this)
    this.deleteArticle = this.deleteArticle.bind(this)
    this.handleAlert = this.handleAlert.bind(this)
  }

  // when component mounts, first thing it does is fetch all existing data in our db
  // then we incorporate a polling logic so that we can easily see if our db has
  // changed and implement those changes into our UI
  componentDidMount() {
    const lang = localStorage.getItem("language")
    if (lang && lang.length) {
      this.props.i18n.changeLanguage(lang, (err) => {
        if (err) return console.log("something went wrong loading", err)
      })
    }
    this.refreshArticles()
  }

  // our first get method that uses our backend api to
  // fetch data from our data base
  refreshArticles() {
    axios.get(`/api/articles`)
      .then((res) => {
        const { data } = res.data
        this.setState({ data })
      }).catch(err => console.log('error...', err))
  }

  // Delete article with the given ID
  async deleteArticle() {
    const { _id } = this.state.item
    const { data: allArticles } = await axios.get(`/api/articles/all`)
    const { data: deleted, status } = await axios.delete(`/api/articles/${_id}`)
    if (status === 200) {
      const deleteIndex = findIndex(propEq("_id", deleted.data._id))(
        allArticles.data,
      )
      if (deleteIndex === -1) {
        alert("No such records exist in our database")
      } else {
        this.setState({ id: "", item: {}, alertOpen: true, alertMessage: "Item deleted successfully" })
        this.refreshArticles()
      }
    }
  }

  // our update method that uses our backend api
  // to overwrite existing data base information
  async updateArticles() {
    let recordToUpdate = {}
    const { item, editMode } = this.state
    const { _id: idToUpdate, name = "", quantity, buyPrice } = item
    const { data } = await axios.get(`/api/articles/${idToUpdate}`)
    const existingDat = data.data

    if (editMode) {
      this.setState({ alertOpen: true, alertMessage: "Item updated successfully" })

      recordToUpdate = {
        ...existingDat,
        name: escapeHTML(name) || existingDat.name,
        quantity: quantity || existingDat.quantity,
        buyPrice: buyPrice || existingDat.buyPrice,
      }

      axios
        .put(`/api/articles/${idToUpdate}`, recordToUpdate)
        .then((response) => {
          if (response.status === 200) this.refreshArticles()
        })
    } else this.createArticle()
  }

  handleAlert() {
    this.setState({ alertOpen: !this.state.alertOpen })
  }

  onIdUpdate = (e) => {
    let id = e.target.value
    this.setState({ id, editMode: false })

    if (isNil(id) || id === "") {
      this.setState({ item: {} })
      return
    }
    axios.get(`/api/articles/${id}`)
      .then((res) => {
        if (res.data.success) this.setState({ item: res.data.data, editMode: true })
        else this.setState({ item: {}, editMode: false })
      })
  }

  onLanguageHandle = (event) => {
    const newLang = event.target.value
    this.setState({ language: newLang })
    localStorage.setItem("language", newLang)
    this.props.i18n.changeLanguage(newLang, (err) => {
      if (err) return console.log("something went wrong loading", err)
    })
  }

  // our put method that uses our backend api
  // to create new query into our data base
  createArticle() {
    const { name, quantity, buyPrice, category } = this.state.item
    const newRecord = {
      name,
      quantity,
      buyPrice,
      category,
    }
    axios.post("/api/articles", newRecord).then((response) => {
      if (response.status === 200) {
        const newData = this.state.data
        newData.push(newRecord)
        this.setState({ data: newData })
      }
    })
  }

  // This is our main UI (dashboard) entry point
  render() {
    const { t } = this.props
    const { data, item } = this.state

    if (!isLoggedIn()) {
      return <Redirect to='/login'/>
    }

    return (
      <div>
        <Translator
          onLanguageHandle={this.onLanguageHandle}
          currentLanguage={this.state.language}
        ></Translator>
        <Container>
          <Alert
            isOpen={this.state.alertOpen}
            toggle={this.handleAlert}
            color="success"
            fade={true}
          >
            {this.state.alertMessage}
          </Alert>
          <Row>
            <Col lg="6" sm="12" xs="12">
              <Inventory
                initialData={data}
                refreshArticles={this.refreshArticles}
              />
            </Col>
            <Col lg="6" sm="12" xs="12">
              <h3>{t("dataCorrection")}</h3>
              <div className="editDiv">
                <Input
                  type="text"
                  placeholder={t("barCode")}
                  value={this.state.id || ""}
                  onChange={this.onIdUpdate}
                />
                <Input
                  type="text"
                  placeholder={t("nameNew")}
                  value={item.name || ""}
                  onChange={(e) =>
                    this.setState({ item: { ...item, name: e.target.value } })
                  }
                />
                <Input
                  type="number"
                  placeholder={t("quantityNew")}
                  value={item.quantity || ""}
                  onChange={(e) =>
                    this.setState({
                      item: { ...item, quantity: parseFloat(e.target.value) },
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder={t("buyPriceNew")}
                  value={item.buyPrice || ""}
                  onChange={(e) =>
                    this.setState({
                      item: { ...item, buyPrice: parseFloat(e.target.value) },
                    })
                  }
                />
                <ButtonGroup
                  updateHandler={this.updateArticles}
                  deleteHandler={this.deleteArticle}
                  updateText={
                    this.state.editMode ? t("correct") : t("inventoryEntry")
                  }
                  deleteText={t("delete")}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default withTranslation()(App)