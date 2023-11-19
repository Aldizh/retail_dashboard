import { useState } from 'react'

export const useInputChange = (data) => {
  const [input, setInput] = useState(data)

  const handleInputChange = (e) => {
    e.persist()
    setInput({
      ...input,
      [e.currentTarget.name]: e.currentTarget.value
  })
  }

  return [input, handleInputChange]
}