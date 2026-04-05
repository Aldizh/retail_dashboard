import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert } from "reactstrap";

import api from "../../api";
import { withTranslation } from "react-i18next";
import Form from "../Form";

const ShowSale = ({ t }) => {
  const [sale, setSale] = useState({});
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    let timer
    if (alertOpen) {
      timer = setTimeout(() => setAlertOpen(false), 3000)
    }
    return () => clearTimeout(timer)
  }, [alertOpen])

  useEffect(() => {
    const fetchSaleData = async () => {
      const id = location.pathname.split("/")[2];

      try {
        const { data } = await api.get(`/api/sales/${id}`);
        setSale(data.data);
      } catch (err) {
        console.log("err", err);
      }
    };

    fetchSaleData();
  }, [location.pathname]);

  const onSubmit = async (updated) => {
    try {
      const response = await api.put(`/api/sales/${updated._id}`, updated)
      if (response.status === 200) {
        setAlertMessage(`${t('updateSale')} ${t('success') || 'updated successfully'}`)
        setAlertOpen(true)
        const parentLocation = sale.category === "big" ? "/large" : "/small"
        // go back to parent page after showing alert
        setTimeout(() => {
          navigate(parentLocation)
        }, 2000)
      }
    } catch (err) {
      setAlertMessage(`${t('error') || 'Error'}: ${err.message}`)
      setAlertOpen(true)
      console.log("error", err)
    }
  };

  return sale.name ? (
    <>
      {alertOpen && (
        <Alert
          color={alertMessage.toLocaleLowerCase().includes('error') ? 'danger' : 'success'}
          isOpen={alertOpen}
          toggle={() => setAlertOpen(false)}
          style={{
            margin: '12px 20px 0 20px',
            padding: '10px 15px',
            fontSize: '0.95rem',
            borderRadius: '6px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          {alertMessage}
        </Alert>
      )}
      <Form
        t={t}
        onSubmit={onSubmit}
        sale={sale}
        mode={t("updateSale")}
      />
    </>
  ) : (
    <div>Loading...</div>
  );
};

export default withTranslation()(ShowSale);