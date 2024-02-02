import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { Table, Button } from "reactstrap";
import axios from "axios";

import NavBar from '../../NavBar';
import { isLoggedIn, logoutUser } from "../../Realm";
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
    const source = axios.CancelToken.source();
    setIsLoading(true);

    const fetchData = async () => {
      try {
        const [salesResponse, currencyResponse] = await Promise.all([
          axios.get("/api/sales", { cancelToken: source.token }),
          axios.get("/reference/currencies", { cancelToken: source.token }),
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

    return () => {
      source.cancel("Landing Component got unmounted");
    };
  }, [category]);

  const handleEdit = (id) => {
    navigate(`/sales/${id}`);
  };

  const handleDelete = (id) => {
    axios
      .delete(`/api/sales/${id}`)
      .then((response) => {
        if (response.status === 200) {
          console.log("Successfully deleted");
          navigate(`/sales/${id}`);
        }
      })
      .catch((err) => console.error("Error deleting:", err));
  };

  if (!isLoggedIn()) { navigate("/login") }

  let totalBuys = 0.0;
  let totalSales = 0.0;
  let totalProfit = 0.0;

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div>
      <NavBar handleLogout={logoutUser} isLoggedIn={isLoggedIn} />
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