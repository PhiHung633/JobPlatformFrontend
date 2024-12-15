import { useEffect, useState } from 'react';
import Sidebar from './Sidebar/Sidebar';
import InputField from './InputField/InputField';
import { useNavigate, useLocation } from 'react-router-dom';

const WorkHistory = () => {
    const [formData, setFormData] = useState({
        jobTitle: '',
        employer: '',
        location: '',
        startMonth: '',
        startYear: '',
        endMonth: '',
        endYear: '',
        jobDescription: ''
    });
    const [workHistories, setWorkHistories] = useState([]);
    const [currentlyWorking, setCurrentlyWorking] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const data = localStorage.getItem('workHistories');
        if (data) {
            const parsedData = data.split(';').map(item => {
                const parts = item.trim().split(' - ');
                return {
                    startMonth: parts[0]?.split(' ')[0] || '',
                    startYear: parts[0]?.split(' ')[1] || '',
                    jobTitle: parts[1] || '',
                    employer: parts[2] || '',
                    location: parts[3] || '',
                    endMonth: parts[4]?.includes('Hiện tại') ? '' : parts[4]?.split(' ')[0] || '',
                    endYear: parts[4]?.includes('Hiện tại') ? '' : parts[4]?.split(' ')[1] || '',
                    jobDescription: parts[5] || '' // Lấy mô tả công việc
                };
            }).filter(item => item.jobTitle);
            setWorkHistories(parsedData);
        }

        if (location.state && location.state.entry) {
            setFormData(location.state.entry);
            setCurrentlyWorking(!location.state.entry.endMonth && !location.state.entry.endYear);
        }
    }, [location.state]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleCheckboxChange = () => {
        setCurrentlyWorking(!currentlyWorking);
        if (!currentlyWorking) {
            setFormData({
                ...formData,
                endMonth: '',
                endYear: ''
            });
        }
    };

    const formatWorkHistoryData = (workHistoriesArray) => {
        return workHistoriesArray
            .map(entry => {
                const start = `${entry.startMonth || ''} ${entry.startYear || ''}`.trim();
                const end = entry.endMonth && entry.endYear
                    ? `${entry.endMonth || ''} ${entry.endYear || ''}`.trim()
                    : 'Hiện tại';
                return `${start} - ${entry.jobTitle || ''} - ${entry.employer || ''} - ${entry.location || ''} - ${end} - ${entry.jobDescription || ''}`;
            })
            .join(';');
    };


    const handleNext = () => {
        const updatedEntry = {
            startMonth: formData.startMonth || '',
            startYear: formData.startYear || '',
            jobTitle: formData.jobTitle || '',
            employer: formData.employer || '',
            location: formData.location || '',
            endMonth: currentlyWorking ? '' : (formData.endMonth || ''),
            endYear: currentlyWorking ? '' : (formData.endYear || ''),
            jobDescription: formData.jobDescription || '' // Thêm mô tả công việc
        };

        const updatedHistories = [...workHistories];
        if (location.state && typeof location.state.index === 'number') {
            updatedHistories[location.state.index] = updatedEntry;
        } else {
            updatedHistories.push(updatedEntry);
        }

        const workHistoryString = formatWorkHistoryData(updatedHistories);
        localStorage.setItem('workHistories', workHistoryString);

        setWorkHistories(updatedHistories);
        setFormData({
            jobTitle: '',
            employer: '',
            location: '',
            startMonth: '',
            startYear: '',
            endMonth: '',
            endYear: '',
            jobDescription: ''
        });
        setCurrentlyWorking(false);

        navigate('/work-history/list');
    };




    return (
        <div className="flex min-h-screen">
            <Sidebar currentStep={3} />

            <main className="flex-1 p-10 bg-gray-50">
                <h2 className="text-3xl font-semibold mb-6">Xem hoặc chỉnh sửa công việc </h2>
                <p className="text-gray-600 mb-6">
                    Bắt đầu từ công việc mà bạn làm gần đây nhất.
                </p>

                <div className="grid grid-cols-2 gap-6 mb-8">
                    <InputField
                        label="Chức vụ"
                        placeholder="Ví dụ: Nhân viên bán hàng"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleChange}
                    />
                    <InputField
                        label="Công ty"
                        placeholder="Ví dụ: H&M"
                        name="employer"
                        value={formData.employer}
                        onChange={handleChange}
                    />
                    <InputField
                        label="Địa điểm"
                        placeholder="Ví dụ: Cebu City, Cebu, Philippines"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                    />
                    <div className="col-span-2 flex gap-6">
                        <div className="flex-1">
                            <label className="block text-gray-700 mb-2">Ngày bắt đầu</label>
                            <div className="flex gap-2">
                                <select
                                    name="startMonth"
                                    value={formData.startMonth}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value="">Chọn tháng</option>
                                    {["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"].map((month) => (
                                        <option key={month} value={month}>{month}</option>
                                    ))}
                                </select>
                                <select
                                    name="startYear"
                                    value={formData.startYear}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value="">Chọn năm</option>
                                    {[...Array(51)].map((_, i) => {
                                        const year = new Date().getFullYear() - 25 + i;
                                        return <option key={year} value={year}>{year}</option>;
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="flex-1">
                            <label className="block text-gray-700 mb-2">Ngày kết thúc</label>
                            <div className="flex gap-2">
                                <select
                                    name="endMonth"
                                    value={formData.endMonth}
                                    onChange={handleChange}
                                    disabled={currentlyWorking}
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value="">Chọn tháng</option>
                                    {["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"].map((month) => (
                                        <option key={month} value={month}>{month}</option>
                                    ))}
                                </select>
                                <select
                                    name="endYear"
                                    value={formData.endYear}
                                    onChange={handleChange}
                                    disabled={currentlyWorking}
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value="">Chọn năm</option>
                                    {[...Array(51)].map((_, i) => {
                                        const year = new Date().getFullYear() - 25 + i;
                                        return <option key={year} value={year}>{year}</option>;
                                    })}
                                </select>
                            </div>
                            <label className="inline-flex items-center mt-5 ml-1">
                                <input
                                    type="checkbox"
                                    checked={currentlyWorking}
                                    onChange={handleCheckboxChange}
                                    className="mr-2"
                                />
                                Tôi đang làm việc tại đây
                            </label>
                        </div>
                    </div>
                    <div className="col-span-2">
                        <label className="block text-gray-700 mb-2">Mô tả công việc:</label>
                        <textarea
                            name="jobDescription"
                            value={formData.jobDescription}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-blue-500"
                            rows="4"
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button onClick={handleNext} className="bg-yellow-500 text-white font-medium py-2 px-6 rounded-lg hover:bg-yellow-600 transition">
                        Tiếp theo
                    </button>
                </div>
            </main>
        </div>
    );
};

export default WorkHistory;
