import { useEffect, useState } from 'react';
import Sidebar from './Sidebar/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const WorkHistoryList = () => {
    const [workHistories, setWorkHistories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Tải dữ liệu lịch sử công việc từ localStorage khi component được render
        const storedWorkHistories = JSON.parse(localStorage.getItem('workHistories')) || [];
        setWorkHistories(storedWorkHistories);
    }, []);

    const handleEdit = (index) => {
        navigate(`/work-history`, { state: { entry: workHistories[index], index } });
    };

    const handleDelete = (index) => {
        const updatedWorkHistories = workHistories.filter((_, i) => i !== index);
        setWorkHistories(updatedWorkHistories);
        localStorage.setItem('workHistories', JSON.stringify(updatedWorkHistories));
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
                                {entry.location} | {entry.startMonth} {entry.startYear} - {entry.endMonth ? `${entry.endMonth} ${entry.endYear}` : "Hiện tại"}
                            </p>
                            <p className="text-gray-600">{entry.jobDescription}</p>
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
