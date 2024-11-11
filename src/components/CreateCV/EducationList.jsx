import { useEffect, useState } from 'react';
import Sidebar from './Sidebar/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const EducationList = () => {
    const [educationData, setEducationData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Lấy dữ liệu giáo dục từ localStorage
        const data = localStorage.getItem('educationData');
        if (data) {
            setEducationData(JSON.parse(data));
        }
    }, []);

    const handleAddEducation = () => {
        navigate('/education');
    };

    const handleEdit = (entry, index) => {
        navigate('/education', { state: { entry, index } });
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar currentStep={2} />
            <main className="flex-1 p-10">
                <h2 className="text-3xl font-semibold mb-6">Tóm Tắt Quá Trình Học Tập</h2>

                {educationData.length > 0 ? (
                    educationData.map((entry, index) => (
                        <div key={index} className="bg-white border rounded-lg shadow-md p-6 mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl font-semibold">
                                    {entry.degree} | {entry.fieldOfStudy}
                                </h3>
                                <div className="flex gap-4">
                                    <button
                                        className="text-blue-600"
                                        onClick={() => handleEdit(entry, index)}
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                    <button className="text-red-600">
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-gray-600 text-lg">{entry.schoolName} | {entry.schoolLocation}</p>
                            <p className="text-gray-600 text-lg">
                                Dự kiến tốt nghiệp vào {entry.graduationMonth} {entry.graduationYear}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600">Không có dữ liệu về quá trình học tập.</p>
                )}

                <button onClick={handleAddEducation} className="mt-6 text-blue-600 font-semibold hover:text-blue-700 transition">
                    + Thêm một quá trình học tập khác
                </button>

                <div className="flex justify-end mt-10">
                    <button className="bg-yellow-500 text-white font-medium py-2 px-6 rounded-lg hover:bg-yellow-600 transition" onClick={() => navigate('/work-history')}>
                        Tiếp theo: Lịch sử công việc
                    </button>
                </div>
            </main>
        </div>
    );
};

export default EducationList;
