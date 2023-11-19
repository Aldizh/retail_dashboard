import React, { Component } from "react"
import { withTranslation } from "react-i18next"
import { Table, Button } from "reactstrap"
import axios from "axios"
import { Redirect } from "react-router"

import { isLoggedIn  } from "../../Realm"
import Totals from "./Totals"
import "./styles.css"

// track network call so we can cancel on unmount
let source = axios.CancelToken.source()
class SalesComp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      isLoading: false,
      conversionRate: 1
    }

    source = axios.CancelToken.source()
  }

  async componentDidMount() {
    this.setState({ isLoading: true })
    const salesPromise = axios.get("/api/sales", {
      cancelToken: source.token
    })
    const currencyPromise = axios.get("/reference/currencies", {
      cancelToken: source.token
    })
    return Promise.all([salesPromise, currencyPromise])
      .then((res) => {
        const [{ data: salesData }, { data: currencyData }] = res

        this.setState({
          isLoading: false,
          conversionRate: currencyData.data.rates['ALL'],
          data: salesData.data.filter(
            (sale) => sale.category === this.props.category,
          ),
        })
      })
      .catch((err) => {
        console.log("err", err)
        this.setState({ isLoading: false })
      })
  }

  handleEdit(id) {
    window.location = `/sales/${id}`
  }

  handleDelete(id) {
    axios
      .delete(`/api/sales/${id}`)
      .then((response) => {
        if (response.status === 200) {
          console.log("successfully deleted")
          window.location.reload()
        }
      })
      .catch((err) => console.log("error", err))
  }

  componentWillUnmount() {
    if (source) {
      source.cancel("Landing Component got unmounted")
    }
  }

  render() {
    const { conversionRate, isLoading } = this.state
    const stateData = this.state.data || []
    const { t, category } = this.props
    const data = stateData.filter((sale) => sale.category === category)

    const handleEdit = (id) => this.handleEdit(id)
    const handleDelete = (id) => this.handleDelete(id)

    let totalBuys = 0.0
    let totalSales = 0.0
    let totalProfit = 0.0

    if (!isLoggedIn()) {
      return <Redirect to='/login'/>
    }

    return isLoading ? (
      <div>Loading...</div>
    ) : (
      <div>
        <Table responsive size="sm">
          <thead>
            <tr>
              <th>{t("barCode")}</th>
              <th>{t("item")}</th>
              <th>{t("quantity")}</th>
              <th>{t("buyPrice")}</th>
              <th>{t("sellPrice")}</th>
              <th>{t("profit")}</th>
              <th>{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((dat, index) => {
              totalBuys += dat.quantity * dat.buyPrice
              totalSales += dat.quantity * dat.sellPrice
              totalProfit += dat.quantity * (dat.sellPrice - dat.buyPrice)
              return (
                <tr key={`${index} - ${dat._id}`}>
                  <th scope="row">{dat._id}</th>
                  <td>{dat.name}</td>
                  <td>{dat.quantity}</td>
                  <td>{(dat.buyPrice * conversionRate).toFixed(2)}</td>
                  <td>{(dat.sellPrice * conversionRate).toFixed(2)}</td>
                  <td>
                    {(
                      dat.quantity *
                      conversionRate *
                      (dat.sellPrice - dat.buyPrice)
                    ).toFixed(2)}
                  </td>
                  <td>
                    <Button size="sm" className="btnEdit" color="secondary" onClick={() => handleEdit(dat._id)}>
                      {t("edit")}
                    </Button>
                    <Button size="sm" className="btnDelete" color="danger" onClick={() => handleDelete(dat._id)}>
                      {t("delete")}
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
        <hr />
        <Totals
          totalBuys={totalBuys}
          totalSales={totalSales}
          totalProfit={totalProfit}
          t={t}
        />
      </div>
    )
  }
}

export default withTranslation()(SalesComp)