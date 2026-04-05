import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { Table, Button } from "reactstrap";
import api from "../../api";

import NavBar from '../../NavBar';
import Totals from "./Totals";
import { formatPrice } from "../../utils/numbers";
import "./styles.css";

const SalesComp = ({ t, category }) => {
  let navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversionRate, setConversionRate] = useState(1);

  // access redux store
  const language = useSelector((state) => state.i18.language)

  useEffect(() => {
    setIsLoading(true);

    const fetchData = async () => {
      try {
        const [salesResponse, currencyResponse] = await Promise.all([
          api.get("/api/sales"),
          api.get("/reference/currencies"),
        ]);

        const { data: salesData } = salesResponse;
        const { data: currencyData } = currencyResponse;

        setData(
          salesData.data.filter((sale) => sale.category === category)
        );

        if (language !== "en") {
          setConversionRate(currencyData.data.rates["ALL"]);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [category]);

  const handleEdit = (id) => {
    navigate(`/sales/${id}`);
  };

  const handleDelete = (id) => {
    api
      .delete(`/api/sales/${id}`)
      .then((response) => {
        if (response.status === 200) {
          console.log("Successfully deleted");
          navigate(`/sales/${id}`);
        }
      })
      .catch((err) => console.error("Error deleting:", err));
  };

  let totalBuys = 0.0;
  let totalSales = 0.0;
  let totalProfit = 0.0;

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div>
      <NavBar />
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
          {data.map(({ _id, name, quantity, buyPrice, sellPrice }, index) => {
            totalBuys += quantity * buyPrice;
            totalSales += quantity * sellPrice;
            totalProfit += quantity * (sellPrice - buyPrice);
            return (
              <tr key={`${index} - ${_id}`}>
                <th scope="row">{_id}</th>
                <td>{name}</td>
                <td>{quantity}</td>
                <td>{formatPrice((buyPrice * conversionRate).toFixed(2), language)}</td>
                <td>{formatPrice((sellPrice * conversionRate).toFixed(2), language)}</td>
                <td>
                  {formatPrice((
                    quantity *
                    conversionRate *
                    (sellPrice - buyPrice)
                  ).toFixed(2), language)}
                </td>
                <td>
                  <Button
                    size="sm"
                    className="btnEdit"
                    color="secondary"
                    onClick={() => handleEdit(_id)}
                  >
                    {t("edit")}
                  </Button>
                  <Button
                    size="sm"
                    className="btnDelete"
                    color="danger"
                    onClick={() => handleDelete(_id)}
                  >
                    {t("delete")}
                  </Button>
                </td>
              </tr>
            );
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
  );
};

export default withTranslation()(SalesComp);