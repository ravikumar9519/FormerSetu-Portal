import { useContext } from 'react'
import { useEffect } from 'react'
import { SellerContext } from '../../context/SellerContext'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

const SellerDashboard = () => {

  const { dToken, dashData, getDashData, cancelAppointment, completeAppointment } = useContext(SellerContext)
  const { slotDateFormat, currency } = useContext(AppContext)


  useEffect(() => {

    if (dToken) {
      getDashData()
    }

  }, [dToken, getDashData])
  console.log(dashData);
  
  return dashData && (
    <div className='m-5'>

      <div className='flex flex-wrap gap-3'>
        <div className='flex items-center gap-2 p-4 transition-all bg-white border-2 border-gray-100 rounded cursor-pointer min-w-52 hover:scale-105'>
          <img className='w-14' src={assets.earning_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{currency} {dashData.earnings}</p>
            <p className='text-gray-400'>Earnings</p>
          </div>
        </div>
        <div className='flex items-center gap-2 p-4 transition-all bg-white border-2 border-gray-100 rounded cursor-pointer min-w-52 hover:scale-105'>
          <img className='w-14' src={assets.appointments_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.appointments}</p>
            <p className='text-gray-400'>Appointments</p>
          </div>
        </div>
        <div className='flex items-center gap-2 p-4 transition-all bg-white border-2 border-gray-100 rounded cursor-pointer min-w-52 hover:scale-105'>
          <img className='w-14' src={assets.buyer_logo} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.buyers}</p>
            <p className='text-gray-400'>buyers</p></div>
        </div>
      </div>

      <div className='bg-white'>
        <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>
          <img src={assets.list_icon} alt="" />
          <p className='font-semibold'>Latest Bookings</p>
        </div>

        <div className='pt-4 border border-t-0'>
          {dashData.latestAppointments.slice(0, 5).map((item, index) => (
            <div className='flex items-center gap-3 px-6 py-3 hover:bg-gray-100' key={index}>
              <img className='w-10 rounded-full' src={item.userData.image} alt="" />
              <div className='flex-1 text-sm'>
                <p className='font-medium text-gray-800'>{item.userData.name}</p>
                <p className='text-gray-600 '>Booking on {slotDateFormat(item.slotDate)}</p>
              </div>
              {item.cancelled
                ? <p className='text-xs font-medium text-red-400'>Cancelled</p>
                : item.isCompleted
                  ? <p className='text-xs font-medium text-green-500'>Completed</p>
                  : <div className='flex'>
                    <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                    <img onClick={() => completeAppointment(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
                  </div>
              }
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default SellerDashboard