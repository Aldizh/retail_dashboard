import React from "react"
import { Redirect } from "react-router"
import axios from "axios"
import { withTranslation } from "react-i18next"

import { isLoggedIn  } from "../../Realm"
import Form from "../Form"
import "./styles.css"

const Create = (props) => {
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
    window.location = updated.category === "small" ? "pakice" : "/large"
  }

  if (!isLoggedIn()) {
    return <Redirect to='/login'/>
  }

  return (
    <Form
      t={props.t}
      onSubmit={onSubmit}
      sale={{}}
      mode={props.t("newSale")}
    />
  )
}

export default withTranslation()(Create)