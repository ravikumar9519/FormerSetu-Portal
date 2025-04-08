import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
const TopSeller = () => {

    const navigate = useNavigate()

    const { Seller } = useContext(AppContext)

    return (
        <div className='flex flex-col items-center gap-4 my-10 text-[#262626] md:mx-10'>
            <h1 className='text-5xl font-medium'>Top Sellers</h1>
            <p className='text-sm text-center sm:w-1/3'>Simply browse through our extensive list of trusted Vegies and their sellers.</p>
            <div className='grid w-full gap-4 px-3 pt-5 grid-cols-auto gap-y-6 sm:px-0'>
                {Seller.slice(0, 10).map((item, index) => (
                    <div onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} className='border  border-green-300 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
                        <img className='bg-[#EAEFFF] h-max' src={item.image} alt="" />
                        <div className='p-4'>
                            <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : "text-gray-500"}`}>
                                <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : "bg-gray-500"}`}></p><p>{item.available ? 'Available' : "Not Available"}</p>
                            </div>
                            <p className="text-[#262626]  font-bold text-lg drop-shadow-[0.5px_0px_0px_black] ">{item.name}</p>
                            <p className="text-[#5C5C5C] font-medium text-lg ">{item.speciality}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={() => { navigate('/Seller'); scrollTo(0, 0) }} className='bg-[#ff5757] text-white px-12 py-3 rounded-full mt-10 font-bold'><p className='text-white drop-shadow-[1px_1px_0px_black] text-lg'>more</p></button>
        </div>

    )
}

export default TopSeller