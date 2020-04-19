import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import {
  Table,
} from 'reactstrap';
import axios from 'axios';

import { generateId } from '../utils/numbers';
import { inventoryData } from '../mock_data';

class SalesComp extends Component {
  state = { isLoading: false }

  render() {
    const { t, category, data = [], syncData } = this.props

    return (
      <div className="inventory">
        <h3 id="shitjetShumice">Current Inventory</h3>
        <Table>
          <thead>
            <tr>
              <th>{t('barCode')}</th>
              <th>{t('item')}</th>
              <th>{t('quantity')}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((dat, index) => {
              return (
                <tr key={`${index} - ${dat.id}`}>
                  <th>{dat.id}</th>
                  <td>{dat.name}</td>
                  <td>{dat.quantity}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <hr />
        <button style={{margin: '0 10px'}} onClick={() => {
          axios.post('/api/datas', inventoryData.map((item, idx) => ({
            ...item,
            id: generateId(this.state.data) + idx,
          }))).then((res) => {
            syncData()
          }).catch((err) => console.log('bulk insert failed', err));
        }}>
          {t('loadAll')}
        </button>
        <button style={{ margin: '0 10px' }} onClick={() => {
          axios.delete('/api/datas', inventoryData).then((res) => {
            syncData()
          }).catch((err) => console.log('bulk delete failed', err));
        }}>
          {t('deleteAll')}
        </button>
      </div>
    )
  }
}

export default withTranslation()(SalesComp)
