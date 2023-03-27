import React from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { Close } from '@mui/icons-material';


function Tag({ label, onDelete }) {

  return (
    <div className='tag'>
      <div>{label}</div>
      <div className='close-button' onClick={() => onDelete(label)}><CloseIcon /></div>
    </div>
  )
}

export default Tag