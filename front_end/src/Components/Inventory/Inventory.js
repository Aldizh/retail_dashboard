import React, { useState, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import {
  Table,
} from 'reactstrap';
import axios from 'axios';

import { useTheme } from '../../Themes/ThemeContext';
import ButtonGroup from '../ButtonGroup';
import { formatPrice } from '../../utils/numbers';
import inventoryData from '../../data/inventory';
import './styles.css';

function SalesComp({ t, refreshArticles }) {
  const { currentTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [pageData, setPageData] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const recordsPerPage = 15
  
  useEffect(() => {
    axios.get(`/api/articles`)
      .then(({ data }) => {
        setTotalCount(data.data.length)
      })
  }, [])

  useEffect(() => {
    axios.get(`/api/articles?pageNumber=${currentPage}`)
      .then(({ data }) => setPageData(data.data))
  }, [totalCount, currentPage])

  const handlePageClick = (event) => {
    const pageIndex = Number(event.target.id) - 1
    setCurrentPage(pageIndex)
  }

  const handleCreateUpdate = async () => {
    setIsLoading(true);
    await axios.post("/api/articles", inventoryData).catch((err) => {
      console.log("bulk insert failed", err);
      setIsLoading(false);
    });

    const updated = await axios.get("/api/articles")
    const totalCount = updated.data.data.length
    setTotalCount(totalCount)

    // pagination data
    let pageNum = Math.ceil(totalCount / recordsPerPage)
    setCurrentPage(pageNum)

    refreshArticles(); // ensures redux state is updated properly
    setIsLoading(false);
  }

  const handleDelete = async () => {
    setIsLoading(true);
    const res = await axios.delete("/api/articles").catch((err) => {
      console.log("bulk delete failed", err);
      setIsLoading(false);
    });
  
    setIsLoading(false);
    if (res.status === 200) {
      console.log("successfully deleted test data");
      refreshArticles();
    }

    const updated = await axios.get("/api/articles")
  
    // pagination
    const totalCount = updated.data.data.length
    setTotalCount(totalCount)
    let pageNum = Math.ceil(totalCount / recordsPerPage)
    setCurrentPage(pageNum)
  }

  const pageNumbers = []
  for (let i = 1; i <= Math.ceil(totalCount / recordsPerPage); i++) {
    pageNumbers.push(i)
  }

  return (
    <div style={{
        color: currentTheme.text,
        textAlign: 'center'
      }}
    >
      <h3 style={{
        background: currentTheme.background}}
        id="shitjetShumice">{t('inventory')}</h3>
      <Table responsive size="sm">
        <thead>
          <tr>
            <th>{t('barCode')}</th>
            <th>{t('item')}</th>
            <th>{t('quantity')}</th>
            <th>{t('buyPrice')}</th>
          </tr>
        </thead>
        <tbody>
          {pageData.map((dat, index) => (
            <tr key={`${index} - ${dat._id}`}>
              <th>{dat._id}</th>
              <td>{dat.name}</td>
              <td>{dat.quantity}</td>
              <td>{formatPrice(dat.buyPrice)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ul id="page-numbers"  style={{
        background: currentTheme.background}}>
        {pageNumbers.map((number, i) => (
          <li
            key={number}
            id={number}
            onClick={handlePageClick}
            className={i === currentPage ? "highlight" : ""}
          >
            {number}
          </li>
        ))}
      </ul>
      <ButtonGroup
        updateHandler={handleCreateUpdate}
        deleteHandler={handleDelete}
        updateText={t('loadAll')}
        deleteText={t('deleteAll')}
        isLoading={isLoading}
      />
    </div>
  );
}

export default withTranslation()(SalesComp);