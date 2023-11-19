import React, { useState, useEffect } from "react";
import axios from "axios";
import { withTranslation } from "react-i18next";
import Form from "../Form";

const ShowSale = ({ t, location }) => {
  const [sale, setSale] = useState({});

  useEffect(() => {
    const fetchSaleData = async () => {
      const id = location.pathname.split("/")[2];

      try {
        const { data } = await axios.get(`/api/sales/${id}`);
        setSale(data.data);
      } catch (err) {
        console.log("err", err);
      }
    };

    fetchSaleData();
  }, [location.pathname]);

  const onSubmit = (updated) => {
    axios
      .put(`/api/sales/${updated._id}`, updated)
      .then((response) => {
        if (response.status === 200) {
          const parentLocation =
            sale.category === "big" ? "/large" : "/small";
          // go back to parent page
          window.location = parentLocation;
        }
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  return sale.name ? (
    <Form
      t={t}
      onSubmit={onSubmit}
      sale={sale}
      mode={t("updateSale")}
    />
  ) : (
    <div>Loading...</div>
  );
};

export default withTranslation()(ShowSale);