import { faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';
import CVSelectionPopup from './CvSelectionPopup';
import { fetchCvs, fetchCvsFile } from '../../utils/ApiFunctions';

const ProfileManager = ({ userId=2 }) => {
    const [isJobSearchOn, setIsJobSearchOn] = useState(false);
    const [isAllowedNTD, setIsAllowedNTD] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const [onlineCVs, setOnlineCVs] = useState([]);
    const [uploadedCVs, setUploadedCVs] = useState([]);
    const [selectedCVCount, setSelectedCVCount] = useState(0);
    const [resetSelection, setResetSelection] = useState(false); 


    useEffect(() => {
        const fetchCVsData = async () => {
            try {
                const onlineResponse = await fetchCvs(userId, 0, 10);
                const uploadedResponse = await fetchCvsFile(userId);

                if (onlineResponse.data) {
                    setOnlineCVs(onlineResponse.data.cvs);
                }

                if (uploadedResponse.data) {
                    setUploadedCVs(uploadedResponse.data.cvs);
                }
            } catch (error) {
                console.error("Error fetching CVs:", error);
            }
        };

        fetchCVsData();
    }, [userId]);

    const handleToggleJobSearch = () => {
        if (!isJobSearchOn) {
            setShowPopup(true);
        } else {
            setIsJobSearchOn(false);
        }
    };

    const handleToggleNTD = () => {
        setIsAllowedNTD(!isAllowedNTD);
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    const enableJobSearch = () => {
        setIsJobSearchOn(true);
        setShowPopup(false);
    };

    const handleConfirm = () => {
        console.log("Bật tìm việc ngay!");
        enableJobSearch();
    };

    const handleSelectionChange = (selectedCVs) => {
        const totalSelected = selectedCVs.online.length + selectedCVs.uploaded.length;
        setSelectedCVCount(totalSelected);
    };

    const handleNoNeed = () => {
        setSelectedCVCount(0);
        setResetSelection(true);  
        closePopup();           
    };
    useEffect(() => {
        if (resetSelection) {
            setResetSelection(false);
        }
    }, [resetSelection]);

    return (
        <div className='bg-white p-2 rounded-xl shadow-lg w-80'>
            <h2 className='text-xl font-bold text-gray-900 mb-4'>Quản lý Hồ Sơ</h2>

            <div className={`mb-6 border-2 ${isJobSearchOn ? 'border-green-400' : 'border-gray-400'}  rounded-xl py-6`}>
                <label className="inline-flex items-center cursor-pointer px-3">
                    <input type="checkbox" className="sr-only peer" checked={isJobSearchOn} onChange={handleToggleJobSearch} />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer-checked:bg-green-600 dark:bg-gray-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                        {isJobSearchOn ? 'Trạng thái tìm việc đang bật' : 'Đang Tắt tìm việc'}
                    </span>
                </label>

                <p className='text-gray-600 text-sm px-3'>
                    Trạng thái Bật tìm việc sẽ tự động tắt sau <strong>3 ngày</strong>. Nếu bạn vẫn còn nhu cầu tìm việc, hãy Bật tìm việc trở lại.
                </p>

                <div className='mt-3 px-5 flex items-center justify-between bg-gray-50 border border-gray-300 rounded-xl'>
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <FontAwesomeIcon icon={faFile} className='text-gray-500' />
                        </div>
                        <label className='ml-2 text-sm text-gray-700'>{selectedCVCount} CV đang được chọn</label>
                    </div>
                    <button className='bg-gray-100 text-sm text-gray-700 rounded-[9%] hover:bg-gray-200' onClick={handleToggleJobSearch}>
                        Thay đổi
                    </button>
                </div>
            </div>

            <div className={`mb-4 border-2 ${isAllowedNTD ? 'border-green-400' : 'border-gray-400'}  rounded-xl py-6`}>
                <label className="inline-flex items-center cursor-pointer px-3">
                    <input type="checkbox" className="sr-only peer" checked={isAllowedNTD} onChange={handleToggleNTD} />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-300">
                        {isAllowedNTD ? 'Cho phép NTD tìm kiếm hồ sơ' : 'Chưa cho phép NTD tìm kiếm hồ sơ'}
                    </span>
                </label>
                <p className='text-gray-600 text-sm ml-3'>
                    Khi có cơ hội việc làm phù hợp, NTD sẽ liên hệ và trao đổi với bạn qua:
                </p>
                <ul className='ml-3 text-gray-600 text-sm list-none'>
                    <li>1. Nhắn tin qua Top Connect trên TopCV</li>
                    <li>2. Email và Số điện thoại của bạn</li>
                </ul>
            </div>

            <CVSelectionPopup
                show={showPopup}
                onClose={closePopup}
                onConfirm={handleConfirm}
                cvOnline={onlineCVs}
                cvUpload={uploadedCVs}
                onSelectionChange={handleSelectionChange}
                onNoNeed={handleNoNeed}
                resetSelection={resetSelection}  
            />
        </div>
    );
};

export default ProfileManager;
