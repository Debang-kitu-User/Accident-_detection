import React from 'react'

const Trial = ({cur,next}) => {
  return (
    <div><button onClick={()=>{
        next(!cur)
    }}>
        click me</button></div>
    
  )
}

export default Trial