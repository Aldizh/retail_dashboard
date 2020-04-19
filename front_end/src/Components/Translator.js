import React from "react"
import { Input, FormGroup } from "reactstrap"

const Translator = ({ onLanguageHandle, currentLanguage }) => (
  <FormGroup className="translationButtons">
    <Input
      checked={currentLanguage === "en"}
      name="language"
      onChange={onLanguageHandle}
      value="en"
      type="radio"
    />
    English &nbsp;
    <Input
      name="language"
      value="es"
      checked={currentLanguage === "es"}
      type="radio"
      onChange={onLanguageHandle}
    />
    Spanish &nbsp;
    <Input
      name="language"
      value="al"
      checked={currentLanguage === "al"}
      type="radio"
      onChange={onLanguageHandle}
    />
    Albanian
  </FormGroup>
)

export default Translator