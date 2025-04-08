import { useContext } from 'react'
import { SellerContext } from './context/SellerContext';
import { AdminContext } from './context/AdminContext';
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddSeller from './pages/Admin/AddSeller';
import SellerList from './pages/Admin/SellerList';
import Login from './pages/Login';
import SellerAppointments from './pages/Seller/SellerAppointments';
import SellerDashboard from './pages/Seller/SellerDashboard';
import SellerProfile from './pages/Seller/SellerProfile';

const App = () => {

  const { dToken } = useContext(SellerContext)
  const { aToken } = useContext(AdminContext)

  return dToken || aToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          <Route path='/' element={<></>} />
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/all-appointments' element={<AllAppointments />} />
          <Route path='/add-Seller' element={<AddSeller />} />
          <Route path='/Seller-list' element={<SellerList />} />
          <Route path='/Seller-dashboard' element={<SellerDashboard />} />
          <Route path='/Seller-appointments' element={<SellerAppointments />} />
          <Route path='/Seller-profile' element={<SellerProfile />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <ToastContainer />
      <Login />
    </>
  )
}

export default App