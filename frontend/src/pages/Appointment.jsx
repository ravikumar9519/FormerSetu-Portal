/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedSeller from '../components/RelatedSeller';
import axios from 'axios';
import { toast } from 'react-toastify';

const Appointment = () => {
    const { SelId } = useParams();
    const { Seller, currencySymbol, backendUrl, token, getSellerData } = useContext(AppContext);
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    const [SelInfo, setSelInfo] = useState(null);
    const [SelSlots, setSelSlots] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime, setSlotTime] = useState('');

    const navigate = useNavigate();

    // 🔹 Fetch seller details
    const fetchSelInfo = useCallback(() => {
        const seller = Seller.find((Sel) => Sel._id === SelId);
        setSelInfo(seller || null);
    }, [Seller, SelId]);

    // 🔹 Get available slots
    const getAvailableSlots = useCallback(() => {
        if (!SelInfo) return;

        setSelSlots([]);

        let today = new Date();
        let allSlots = [];

        for (let i = 0; i < 7; i++) {
            let currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);

            let endTime = new Date();
            endTime.setDate(today.getDate() + i);
            endTime.setHours(21, 0, 0, 0);

            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(Math.max(10, currentDate.getHours() + 1));
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
            } else {
                currentDate.setHours(10);
                currentDate.setMinutes(0);
            }

            let timeSlots = [];

            while (currentDate < endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                let day = currentDate.getDate();
                let month = currentDate.getMonth() + 1;
                let year = currentDate.getFullYear();

                const slotDate = `${day}_${month}_${year}`;
                const isSlotAvailable = !SelInfo.slots_booked?.[slotDate]?.includes(formattedTime);

                if (isSlotAvailable) {
                    timeSlots.push({ datetime: new Date(currentDate), time: formattedTime });
                }

                currentDate.setMinutes(currentDate.getMinutes() + 30);
            }

            allSlots.push(timeSlots);
        }

        setSelSlots(allSlots);
    }, [SelInfo]);

    // 🔹 Book an appointment
    const bookAppointment = async () => {
        if (!token) {
            toast.warning('Login to book an appointment');
            return navigate('/login');
        }

        if (!SelSlots[slotIndex]?.length) {
            toast.error('No available slots');
            return;
        }

        const date = SelSlots[slotIndex][0].datetime;
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        const slotDate = `${day}_${month}_${year}`;

        try {
            const { data } = await axios.post(`${backendUrl}/api/user/book-appointment`, { SelId, slotDate, slotTime }, { headers: { token } });

            if (data.success) {
                toast.success(data.message);
                getSellerData();
                navigate('/my-appointments');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    // 🔹 Fetch seller info once when Seller list updates
    useEffect(() => {
        if (Seller.length > 0) {
            fetchSelInfo();
        }
    }, [Seller, fetchSelInfo]);

    // 🔹 Fetch available slots when Seller info is available
    useEffect(() => {
        if (SelInfo) {
            getAvailableSlots();
        }
    }, [SelInfo, getAvailableSlots]);

    // 🔹 Debugging log
    console.log("SelInfo:", SelInfo);

    return SelInfo ? (
        <div>
            {/* ---------- Seller Details ----------- */}
            <div className='flex flex-col gap-4 sm:flex-row'>
                <div>
                    <img 
                        className='w-full rounded-lg bg-primary sm:max-w-72' 
                        src={SelInfo?.image || assets.defaultSeller} 
                        alt={SelInfo?.name || "Seller"} 
                    />
                </div>

                <div className='flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
                    <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>{SelInfo?.name} 
                        <img className='w-5' src={assets.verified_icon} alt="" />
                    </p>
                    <div className='flex items-center gap-2 mt-1 text-gray-600'>
                        <p>{SelInfo?.degree} - {SelInfo?.speciality}</p>
                        <button className='py-0.5 px-2 border text-xs rounded-full'>{SelInfo?.experience}</button>
                    </div>
                    <p className='mt-4 font-medium text-gray-600'>Price: 
                        <span className='text-gray-800'>{currencySymbol}{SelInfo?.fees}</span>
                    </p>
                </div>
            </div>

            {/* Booking slots */}
            <div className='sm:ml-72 sm:pl-4 mt-8 font-medium text-[#565656]'>
                <p>Schedule Buying</p>
                <div className='flex items-center w-full gap-3 mt-4 overflow-x-scroll'>
                    {SelSlots.map((item, index) => (
                        <div onClick={() => setSlotIndex(index)} key={index} 
                             className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-red-500 text-white' : 'border border-[#DDDDDD]'}`}>
                            <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                            <p>{item[0] && item[0].datetime.getDate()}</p>
                        </div>
                    ))}
                </div>

                <div className='flex items-center w-full gap-3 mt-4 overflow-x-scroll'>
                    {SelSlots[slotIndex]?.map((item, index) => (
                        <p onClick={() => setSlotTime(item.time)} key={index} 
                           className={`text-sm font-light px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-red-500 text-white' : 'text-[#949494] border border-[#B4B4B4]'}`}>
                            {item.time.toLowerCase()}
                        </p>
                    ))}
                </div>

                <button onClick={bookAppointment} className='px-20 py-3 my-6 text-lg font-semibold text-white bg-red-500 rounded-full'>buy now</button>
            </div>

            <RelatedSeller speciality={SelInfo?.speciality} SelId={SelId} />
        </div>
    ) : <p>Loading...</p>;
};

export default Appointment;
