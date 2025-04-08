import { useContext, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const Dashboard = () => {

  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext)
  const { slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken, getDashData])

  return dashData && (
    <div className='m-5'>
      <div className='flex flex-wrap gap-3'>
        <div className='flex items-center gap-2 p-4 transition-all bg-white border-2 border-gray-100 rounded cursor-pointer min-w-52 hover:scale-105'>
          <img className='w-14' src={assets.seller_logo} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData?.Seller || 0}</p>
            <p className='text-gray-400'>Seller</p>
          </div>
        </div>
        <div className='flex items-center gap-2 p-4 transition-all bg-white border-2 border-gray-100 rounded cursor-pointer min-w-52 hover:scale-105'>
          <img className='w-14' src={assets.appointments_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData?.appointments || 0}</p>
            <p className='text-gray-400'>Deal</p>
          </div>
        </div>
        <div className='flex items-center gap-2 p-4 transition-all bg-white border-2 border-gray-100 rounded cursor-pointer min-w-52 hover:scale-105'>
          <img className='w-14' src={assets.buyer_logo} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData?.buyers || 0}</p>
            <p className='text-gray-400'>Buyer</p>
          </div>
        </div>
      </div>
  
      <div className='bg-white'>
        <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>
          <img src={assets.list_icon} alt="" />
          <p className='font-semibold'>Latest Selling</p>
        </div>
  
        <div className='pt-4 border border-t-0'>
          {dashData?.latestAppointments?.slice(0, 5).map((item, index) => (
            <div className='flex items-center gap-3 px-6 py-3 hover:bg-gray-100' key={index}>
              <img className='w-10 rounded-full' src={item?.SelData?.image || assets.logo} alt="" />
              <div className='flex-1 text-sm'>
                <p className='font-medium text-gray-800'>{item?.SelData?.name || "N/A"}</p>
                <p className='text-gray-600 '>Sold on {slotDateFormat(item?.slotDate || Date.now())}</p>
              </div>
              {item?.cancelled ? (
                <p className='text-xs font-medium text-red-400'>Cancelled</p>
              ) : item?.isCompleted ? (
                <p className='text-xs font-medium text-green-500'>Completed</p>
              ) : (
                <img onClick={() => cancelAppointment(item?._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard