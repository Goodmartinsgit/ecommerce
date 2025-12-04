import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import PageTransitionLoader from './components/PageTransitionLoader'

function App() {

  return (
    <>
      <PageTransitionLoader />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        pauseOnHover
        theme="colored"
      />

      <Outlet/>
    </>
  )
}

export default App
