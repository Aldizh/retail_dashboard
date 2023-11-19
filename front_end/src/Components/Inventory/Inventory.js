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
  const [pageNumbers, setPageNumbers] = useState([]);
  const [pageGroup, setPageGroup] = useState(0);

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

  useEffect(() => {
    let pages = []
    const max = pageGroup * recordsPerPage + recordsPerPage
    for (let i = pageGroup * recordsPerPage + 1; i <= max; i++) {
      if (i < totalCount / recordsPerPage) pages.push(i)
    }
    setPageNumbers(pages)
  }, [totalCount, pageGroup])

  const handlePageClick = (event) => {
    const pageIndex = Number(event.target.id)
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
      <ul id="page-numbers"
        style={{background: currentTheme.background}}
      >
        <button
          className="nav-button"
          id="prev-button"
          onClick={() => {
            const newPage = (pageGroup - 1) * recordsPerPage
            if (newPage > -1) {
              axios
                .get(`/api/articles?pageNumber=${newPage + 1}`)
                .then(({ data }) => {
                  dispatch(updatePageData(data.data))
                  dispatch(updatePage(newPage + 1))
                })
              setPageGroup(pageGroup - 1)
            }
          }}
        >&lt;</button>
        {pageNumbers.map((number, i) => {
          const pageShift = pageGroup * recordsPerPage
          return (
            <li
              key={number}
              id={number}
              onClick={handlePageClick}
              className={(i + pageShift + 1) === currentPage ? "highlight" : ""}
            >
              {number}
            </li>
          )
        })}
        <button
          className="nav-button"
          id="next-button"
          onClick={() => {
            const newPage = (pageGroup + 1) * recordsPerPage

            if (newPage < totalCount / recordsPerPage) {
              axios
                .get(`/api/articles?pageNumber=${newPage + 1}`)
                .then(({ data }) => {
                  dispatch(updatePageData(data.data))
                  dispatch(updatePage(newPage + 1))
                })
              setPageGroup(pageGroup + 1)
            }
          }}
        >&gt;</button>
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