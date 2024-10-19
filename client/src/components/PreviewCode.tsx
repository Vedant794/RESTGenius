// import React, { useEffect, useState } from 'react'
import useSchema from './context/schemaContext'

function PreviewCode() {
  const {schemas} = useSchema()

  return (
    <div>{schemas}</div>
  )
}

export default PreviewCode
