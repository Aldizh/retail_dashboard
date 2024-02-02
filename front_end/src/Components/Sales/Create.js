import React from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios"
import { withTranslation } from "react-i18next"

import NavBar from '../../NavBar';
import { isLoggedIn, logoutUser } from "../../Realm";
import Form from "../Form"
import "./styles.css"

const Create = (props) => {
  let  navigate = useNavigate()
  const persistData = (newRecord) => {
    axios
      .post("/api/sales", newRecord)
      .then((response) => {
        if (response.status === 200) {
          // show success here
        }
      })
      .catch((err) => console.log("error", err))
  }

  const onSubmit = async (updated) => {
    persistData(updated)

    // go back to home after insertion
    // TO DO: Show success notification then redirect
    updated.category === "small" ? navigate("/small") : navigate("/large")
  }

  if (!isLoggedIn()) { navigate("/login") }

  return (
    <>
      <NavBar handleLogout={logoutUser} isLoggedIn={isLoggedIn} />
      <Form
        t={props.t}
        onSubmit={onSubmit}
        sale={{}}
        mode={props.t("newSale")}
      />
    </>
  )
}

export default withTranslation()(Create)