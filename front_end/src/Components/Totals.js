import React from 'react'

export default ({ totalBuys, totalSales, totalProfit, t }) => (
  <>
    <h3>{t('totals')}</h3>
    <div style={{ justifyContent: 'space-evenly', display: 'flex' }}>
      <p>{t('totalBuys')}:{' '}{totalBuys.toFixed(2)}</p>
      <p>{t('totalSales')}:{' '}{totalSales.toFixed(2)}</p>
      <p>{t('totalProfit')}:{' '}{totalProfit.toFixed(2)}</p>
    </div>
  </>
)
