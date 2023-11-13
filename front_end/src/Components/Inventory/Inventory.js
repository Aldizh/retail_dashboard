import React, { useState, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import {
  Table,
} from 'reactstrap';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux'

import { updatePage, updatePageData, updateTotalCount } from '../../redux/inventory_reducer'
import { useTheme } from '../../Themes/ThemeContext';
import ButtonGroup from '../ButtonGroup';
import { formatPrice } from '../../utils/numbers';
import inventoryData from '../../data/inventory';
import './styles.css';

const Inventory = ({ t }) => {  
  const dispatch = useDispatch()
  const pageData = useSelector((state) => state.page.pageData)
  const currentPage = useSelector((state) => state.page.currentPage)
  const totalCount = useSelector((state) => state.page.totalCount)
  const recordsPerPage = useSelector((state) => state.page.recordsPerPage)

  const { currentTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`/api/articles?pageNumber=${currentPage}`)
      .then(({ data }) => {
        dispatch(updatePageData(data.data))
      })
  }, [currentPage])

  useEffect(() => {
    axios
      .get(`/api/articles`)
      .then(({ data }) => {
        dispatch(updateTotalCount(data.data.length))
      })
  }, [])

  const handlePageClick = (event) => {
    const pageIndex = Number(event.target.id) - 1
    dispatch(updatePage(pageIndex))
  }

  const handleDataLoad = async () => {
    setIsLoading(true);
    await axios.post("/api/articles", inventoryData).catch((err) => {
      setIsLoading(false);
      throw new Error(err);
    });

    const updated = await axios.get("/api/articles")
    dispatch(updateTotalCount(updated.data.data.length))

    // pagination data
    let pageNum = Math.ceil(totalCount / recordsPerPage)
    dispatch(updatePage(pageNum))

    setIsLoading(false);
  }

  const handleBulkDelete = async () => {
    setIsLoading(true);
    const res = await axios.delete("/api/articles").catch((err) => {
      setIsLoading(false);
      throw new Error(err);
    });
  
    setIsLoading(false);
    if (res.status === 200) {
      console.log("successfully deleted test data");
    }

    const updated = await axios.get("/api/articles")
    dispatch(updateTotalCount(updated.data.data.length))
  
    // pagination
    let pageNum = Math.ceil(totalCount / recordsPerPage)
    dispatch(updatePage(pageNum))
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
        updateHandler={handleDataLoad}
        deleteHandler={handleBulkDelete}
        updateText={t('loadAll')}
        deleteText={t('deleteAll')}
        isLoading={isLoading}
      />
    </div>
  );
}

export default withTranslation()(React.memo(Inventory));