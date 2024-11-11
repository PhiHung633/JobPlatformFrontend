import { faCheck, faEye, faMessage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';

const HistoryApplies = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSelected, setIsSelected] = useState('Trạng thái');
    const dropDownRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleClickoutSide = (event) => {
        if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    const handleSelect = (item) => {
        setIsSelected(item);
        setIsOpen(false);
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickoutSide);
        return () => {
            document.removeEventListener('mousedown', handleClickoutSide);
        };
    });

    return (
        <div className='bg-gray-100 min-h-screen w-full'>
            <div className='container mx-auto p-6 bg-white rounded-xl shadow-lg max-w-3xl ml-24'>
                <div className='flex justify-between items-center mb-5'>
                    <div className='text-lg font-bold'>
                        Việc làm đã ứng tuyển
                    </div>
                    <div className='relative inline-block' ref={dropDownRef}>
                        <button
                            className='bg-white border border-gray-300 rounded-md px-4 py-2 flex items-center justify-between w-52 transition duration-200 ease'
                            onClick={toggleDropdown}
                        >
                            {isSelected}
                            <span className='ml-2 text-gray-400'>&#9660;</span>
                        </button>
                        <ul className={`absolute mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto w-full py-2 z-10 ${isOpen ? 'block' : 'hidden'}`}>
                            {['Trạng thái', 'Đã ứng tuyển', 'NTD đã xem hồ sơ', 'Hồ sơ phù hợp', 'Hồ sơ chưa phù hợp'].map((item) => (
                                <li
                                    key={item}
                                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${isSelected === item ? 'text-green-500 font-bold' : ''}`}
                                    onClick={() => handleSelect(item)}
                                >
                                    {item}
                                    {isSelected === item && (
                                        <FontAwesomeIcon icon={faCheck} className='float-right text-green-500' />
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Job Listing 1 */}
                <div className='border border-gray-200 rounded-md mb-4 p-4'>
                    <div className='flex'>
                        <div className='flex-shrink-0 bg-white rounded-lg h-24 w-24 border border-gray-200 p-2'>
                            <img src="https://static.topcv.vn/company_logos/d4c67a384eb78e85932514b49bd1af54-6078f0c4ab999.jpg" className="h-full w-full object-contain" alt='Company Logo'/>
                        </div>
                        <div className='ml-5'>
                            <div className='flex items-center justify-between mb-2'>
                                <a href='#' className='text-base font-semibold text-gray-900 hover:underline'>
                                    Game Developer
                                </a>
                                <label className='text-green-600 font-semibold text-base ml-50'>
                                    20 - 60 triệu
                                </label>
                            </div>
                            <div className='text-gray-600 mb-2'>
                                <a href='#' className='text-gray-600 hover:underline'>
                                    CÔNG TY TNHH TNT MEDIA & ISOCIAL
                                </a>
                            </div>
                            <div className='text-sm text-gray-500 mb-2'>
                                Thời gian ứng tuyển: 09-10-2024 16:04
                            </div>
                            <div className='flex items-center space-x-6'>
                                <p className='text-sm text-gray-500'>
                                    CV đã ứng tuyển: <a href='#' className='text-green-600 underline'>CV tải lên</a>
                                </p>
                                <div className='ml-auto space-x-3'>
                                    <a href='#' className='inline-flex items-center bg-green-100 text-green-600 rounded-full px-3 py-1 text-sm transition duration-300 ease hover:bg-green-200'>
                                        <FontAwesomeIcon icon={faMessage} className='mr-2' />
                                        Nhắn tin
                                    </a>
                                    <a href='#' className='inline-flex items-center bg-green-100 text-green-600 rounded-full px-3 py-1 text-sm transition duration-300 ease hover:bg-green-200'>
                                        <FontAwesomeIcon icon={faEye} className='mr-2' />
                                        Xem CV
                                    </a>
                                </div>
                            </div>
                            <div className='border-t border-gray-300 mt-3 pt-3 flex justify-between'>
                                <div className='text-sm text-gray-600'>
                                    Trạng thái: <span className='text-blue-500'>Hồ sơ chưa phù hợp</span>
                                </div>
                                <div className='text-sm text-gray-600 text-right'>
                                    Vào lúc: 09-10-2024 20:26
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Job Listing 2 */}
                <div className='border border-gray-200 rounded-md mb-4 p-4'>
                    <div className='flex'>
                        <div className='flex-shrink-0 bg-white rounded-lg h-24 w-24 border border-gray-200 p-2'>
                            <img src="https://static.topcv.vn/company_logos/d4c67a384eb78e85932514b49bd1af54-6078f0c4ab999.jpg" className="h-full w-full object-contain" alt='Company Logo'/>
                        </div>
                        <div className='ml-5'>
                            <div className='flex items-center justify-between mb-2'>
                                <a href='#' className='text-base font-semibold text-gray-900 hover:underline'>
                                    Thực tập sinh FrontEnd Developer
                                </a>
                                <label className='text-green-600 font-semibold text-base ml-50'>
                                    3 - 5 triệu
                                </label>
                            </div>
                            <div className='text-gray-600 mb-2'>
                                <a href='#' className='text-gray-600 hover:underline'>
                                    CÔNG TY CP ỨNG DỤNG DI ĐỘNG XANH
                                </a>
                            </div>
                            <div className='text-sm text-gray-500 mb-2'>
                                Thời gian ứng tuyển: 13-06-2024 10:10
                            </div>
                            <div className='flex items-center space-x-6'>
                                <p className='text-sm text-gray-500'>
                                    CV đã ứng tuyển: <a href='#' className='text-green-600 underline'>CV tải lên</a>
                                </p>
                                <div className='ml-auto space-x-3'>
                                    <a href='#' className='inline-flex items-center bg-green-100 text-green-600 rounded-full px-3 py-1 text-sm transition duration-300 ease hover:bg-green-200'>
                                        <FontAwesomeIcon icon={faMessage} className='mr-2' />
                                        Nhắn tin
                                    </a>
                                    <a href='#' className='inline-flex items-center bg-green-100 text-green-600 rounded-full px-3 py-1 text-sm transition duration-300 ease hover:bg-green-200'>
                                        <FontAwesomeIcon icon={faEye} className='mr-2' />
                                        Xem CV
                                    </a>
                                </div>
                            </div>
                            <div className='border-t border-gray-300 mt-3 pt-3 flex justify-between'>
                                <div className='text-sm text-gray-600'>
                                    Trạng thái: <span className='text-blue-500'>Đã ứng tuyển</span>
                                </div>
                                <div className='text-sm text-gray-600 text-right'>
                                    Vào lúc: 13-06-2024 10:10
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HistoryApplies;
