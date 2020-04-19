import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import {
  Table,
} from 'reactstrap';
import axios from 'axios';

import ButtonGroup from '../ButtonGroup'
import { formatPrice } from '../../utils/numbers';
import { inventoryData } from '../../mock_data';
import './styles.css'

class SalesComp extends Component {
  constructor(props){
    super(props)
    this.state = {
      data: [],
      totalCount: 0,
      isLoading: false,
      recordsPerPage: 10,
      currentPage: 1
    }

    this.handlePageClick = this.handlePageClick.bind(this)
    this.updateCurrentPage = this.updateCurrentPage.bind(this)
    this.handleCreateUpdate = this.handleCreateUpdate.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  // Also refresh the data when updating page number
  updateCurrentPage(newPage){
    this.setState({currentPage: newPage})
  }

  handlePageClick(event){
    const pageIndex = Number(event.target.id) - 1
    this.updateCurrentPage(pageIndex + 1)
  }

  handleCreateUpdate() {
    axios
      .post("/api/articles", inventoryData)
      .then((res) => {
        console.log("successfully inserted these records: ", res.data.data)
        this.props.refreshArticles() // ensures redux state is updated properly
        const totalCount = this.props.totalCount
        let pageNum = Math.ceil(totalCount / this.state.recordsPerPage)
        this.updateCurrentPage(pageNum || 1)
      })
      .catch((err) => console.log("bulk insert failed", err))
  }

  handleDelete() {
    axios
      .delete("/api/articles", {
        data: inventoryData,
      })
      .then((res) => {
        if (res.status === 200) console.log("successfully deleted test data")
        this.props.refreshArticles()
      })
      .catch((err) => console.log("bulk delete failed", err))
  }

  render() {
    const { currentPage, recordsPerPage } = this.state
    const { t, totalCount, initialData: data  } = this.props

    // Logic for displaying page numbers
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalCount / recordsPerPage); i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="inventory">
        <h3 id="shitjetShumice">Current Inventory</h3>
        <Table dark>
          <thead>
            <tr>
              <th>{t('barCode')}</th>
              <th>{t('item')}</th>
              <th>{t('quantity')}</th>
              <th>{t('buyPrice')}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((dat, index) => {
              return (
                <tr key={`${index} - ${dat._id}`}>
                  <th>{dat._id}</th>
                  <td>{dat.name}</td>
                  <td>{dat.quantity}</td>
                  <td>{formatPrice(dat.buyPrice)}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <ul id="page-numbers">
          {pageNumbers.map((number, i) => (
            <li
              key={number}
              id={number}
              onClick={this.handlePageClick}
              className={i + 1 === currentPage ? "highlight" : ""}
            >
              {number}
            </li>
          ))}
        </ul>
        <ButtonGroup
          updateHandler={this.handleCreateUpdate}
          deleteHandler={this.handleDelete}
          updateText={t('loadAll')}
          deleteText={t('deleteAll')}
        />
      </div>
    )
  }
}

export default withTranslation()(SalesComp)
