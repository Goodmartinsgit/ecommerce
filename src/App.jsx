// import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { ProductContext, ProductProvider } from './context/ProductContext'
import { ToastContainer } from 'react-toastify'
// // In main.jsx or App.jsx
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
    <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        pauseOnHover
        theme="colored" // optional, adds nice look
      />

      
      <Outlet/>
    
    </>
    
    
  )
}

export default App
