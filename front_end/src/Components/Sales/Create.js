import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import api from "../../api"
import { withTranslation } from "react-i18next"
import { Alert } from "reactstrap"

import NavBar from '../../NavBar';
import Form from "../Form"
import "./styles.css"

const Create = (props) => {
  let navigate = useNavigate()
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  // Auto-dismiss alert after 3 seconds
  useEffect(() => {
    let timer
    if (alertOpen) {
      timer = setTimeout(() => {
        setAlertOpen(false)
      }, 3000)
    }
    return () => clearTimeout(timer)
  }, [alertOpen])

  const persistData = (newRecord) => {
    return api
      .post("/api/sales", newRecord)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          setAlertMessage(`${props.t('newSale')} ${props.t('success') || 'created successfully'}`)
          setAlertOpen(true)
          return true
        }
      })
      .catch((err) => {
        setAlertMessage(`${props.t('error') || 'Error'}: ${err.message}`)
        setAlertOpen(true)
        console.log("error", err)
        return false
      })
  }

  const onSubmit = async (updated) => {
    const success = await persistData(updated)

    // go back to home after insertion (after 2 seconds to show success message)
    if (success) {
      setTimeout(() => {
        updated.category === "small" ? navigate("/small") : navigate("/large")
      }, 2000)
    }
  }

  return (
    <>
      <NavBar />
      {alertOpen && (
        <Alert
          isOpen={alertOpen}
          toggle={() => setAlertOpen(false)}
          color={alertMessage.toLocaleLowerCase().includes('error') ? 'danger' : 'success'}
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
        t={props.t}
        onSubmit={onSubmit}
        sale={{}}
        mode={props.t("newSale")}
      />
    </>
  )
}

export default withTranslation()(Create)