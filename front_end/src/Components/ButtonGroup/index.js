import React from 'react'

const ButtonGroup = ({updateHandler, deleteHandler, updateText, deleteText}) => (
  <div style={{ display: 'flex' }}>
    <button onClick={updateHandler} style={{ marginRight: '10px' }} className="btn btn-success">
      {updateText}
    </button>
    <button onClick={deleteHandler} style={{ marginLeft: '10px' }} className="btn btn-danger">
      {deleteText}
    </button>
  </div>
)

export default ButtonGroup