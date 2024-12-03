import { useEffect, useState } from 'react';
import Sidebar from './Sidebar/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const WorkHistoryList = () => {
    const [workHistories, setWorkHistories] = useState([]);
    const navigate = useNavigate();

    const parseWorkHistoryData = (workHistoriesString) => {
        // Kiểm tra nếu không có dữ liệu hoặc không phải chuỗi
        if (!workHistoriesString || typeof workHistoriesString !== 'string') return [];
    
        // Loại bỏ khoảng trắng thừa và tách các mục theo dấu ";"
        const entries = workHistoriesString.split(';').map(entry => entry.trim());
    
        return entries.map(workHistory => {
            const parts = workHistory.split(' - ').map(part => part.trim()); // Loại bỏ khoảng trắng thừa trong mỗi phần
    
            if (parts.length < 5) return null; // Bỏ qua entry không hợp lệ
    
            const [
                startDate,   // Ví dụ: "Tháng 11 2011"
                jobTitle,    // Ví dụ: "Lập trình viên frontend"
                employer,    // Ví dụ: "Công ty FPT"
                location,    // Ví dụ: "Thu Duc Ho Chi Minh City"
                endDate      // Ví dụ: "Tháng 10 2014"
            ] = parts;
    
            const parseDate = (date) => {
                if (date === 'Hiện tại') return { month: 'Hiện tại', year: 'Hiện tại' };
                const dateParts = date.split(' '); // Tách "Tháng 11 2011" thành ["Tháng", "11", "2011"]
                return {
                    month: `${dateParts[0]} ${dateParts[1] || ''}`.trim(), // Lấy "Tháng 11"
                    year: dateParts[2] || '', // Lấy "2011"
                };
            };
    
            const { month: startMonth, year: startYear } = parseDate(startDate);
            const { month: endMonth, year: endYear } = parseDate(endDate);
    
            return {
                startMonth: startMonth,
                startYear: startYear,
                jobTitle: jobTitle.trim(),
                employer: employer.trim(),
                location: location.trim(),
                endMonth: endMonth,
                endYear: endYear,
            };
        }).filter(entry => entry !== null); // Bỏ qua các entry không hợp lệ
    };
    
    
    useEffect(() => {
        const selectedCvData = JSON.parse(localStorage.getItem('selectedCvData')) || {};
        let workHistoriesFromSelectedCv = [];
    
        if (selectedCvData && selectedCvData.workExperience) {
            workHistoriesFromSelectedCv = parseWorkHistoryData(selectedCvData.workExperience);
        }
    
        const storedData = localStorage.getItem('workHistories');
        console.log("STOREDATA",storedData)
        let workHistoriesFromStorage = [];
    
        if (storedData) {
            workHistoriesFromStorage = parseWorkHistoryData(storedData);
        }
        console.log("WORKNE",workHistoriesFromStorage)
        const combinedWorkHistories = [
            ...workHistoriesFromSelectedCv,
            ...workHistoriesFromStorage
        ].filter((entry, index, self) =>
            index === self.findIndex((e) => (
                e.startMonth === entry.startMonth && e.jobTitle === entry.jobTitle
            ))
        );
        console.log("WORKNE",combinedWorkHistories)

    
        setWorkHistories(combinedWorkHistories);
    
        const formattedData = combinedWorkHistories.map(entry => {
            const startDate = `${entry.startMonth} ${entry.startYear}`;
            const endDate = entry.endMonth === 'Hiện tại' ? 'Hiện tại' : `${entry.endMonth} ${entry.endYear}`;
            return `${startDate} - ${entry.jobTitle} - ${entry.employer} - ${entry.location} - ${endDate}`;
        }).join(' ; ');
    
        localStorage.setItem('workHistories', formattedData);
    }, []);


    const handleEdit = (index) => {
        navigate(`/work-history`, { state: { entry: workHistories[index], index } });
    };

    const handleDelete = (index) => {
        const updatedWorkHistories = workHistories.filter((_, i) => i !== index);
        setWorkHistories(updatedWorkHistories);
    
        const updatedData = updatedWorkHistories.map(entry => {
            const startDate = `${entry.startMonth} ${entry.startYear}`;
            const endDate = entry.endMonth === 'Hiện tại' ? 'Hiện tại' : `${entry.endMonth} ${entry.endYear}`;
            return `${startDate} - ${entry.jobTitle} - ${entry.employer} - ${entry.location} - ${endDate}`;
        }).join(' ; ');
    
        localStorage.setItem('workHistories', updatedData);
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar currentStep={3} />
            <main className="flex-1 p-10">
                <h2 className="text-3xl font-semibold mb-6">Tóm tắt Lịch sử Công việc</h2>

                {workHistories.length > 0 ? (
                    workHistories.map((entry, index) => (
                        <div key={index} className="bg-white border rounded-lg shadow-md p-6 mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl font-semibold">{entry.jobTitle} tại {entry.employer}</h3>
                                <div className="flex gap-4">
                                    <button
                                        className="text-blue-600"
                                        onClick={() => handleEdit(index)}
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                    <button
                                        className="text-red-600"
                                        onClick={() => handleDelete(index)}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-gray-600 text-lg">
                                {entry.location} | {entry.startMonth} {entry.startYear} - {entry.endMonth === 'Hiện tại' && entry.endYear ? 'Hiện tại' : `${entry.endMonth} ${entry.endYear}`}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600">Không có lịch sử công việc nào.</p>
                )}

                <button
                    onClick={() => navigate('/work-history')}
                    className="mt-6 text-blue-600 font-semibold hover:text-blue-700 transition"
                >
                    + Thêm vị trí khác
                </button>

                <div className="flex justify-end mt-10">
                    <button
                        className="bg-yellow-500 text-white font-medium py-2 px-6 rounded-lg hover:bg-yellow-600 transition"
                        onClick={() => navigate('/skill')}
                    >
                        Tiếp theo: Kỹ năng
                    </button>
                </div>
            </main>
        </div>
    );
};

export default WorkHistoryList;
