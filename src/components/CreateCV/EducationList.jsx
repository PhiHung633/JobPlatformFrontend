import { useEffect, useState } from 'react';
import Sidebar from './Sidebar/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const EducationList = () => {
    const [educationData, setEducationData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const selectedCvData = JSON.parse(localStorage.getItem('selectedCvData'));
        let educationFromSelectedCv = [];

        if (selectedCvData && selectedCvData.education) {
            educationFromSelectedCv = selectedCvData.education.split(';').map(item => item.trim());
        }

        const storedEducationData = localStorage.getItem('educationData');
        let educationDataFromStorage = [];

        if (storedEducationData) {
            educationDataFromStorage = storedEducationData.split(';').map(item => item.trim());
        }

        const combinedEducationData = [
            ...new Set([
                ...educationDataFromStorage,
                ...educationFromSelectedCv
            ])
        ];

        setEducationData(combinedEducationData);

        localStorage.setItem('educationData', combinedEducationData.join('; '));
    }, []);

    const handleAddEducation = () => {
        navigate('/education');
    };

    const handleEdit = (entry, index) => {
        const parts = entry.split(' - ');

        const graduationDate = parts[0] ? parts[0].split(' ') : [];
        const graduationMonth = `${graduationDate[0]} ${graduationDate[1]}`.trim();
        const graduationYear = graduationDate[2] ? graduationDate[2].trim() : '';

        const degreeAndField = parts[1] ? parts[1].split(':') : [];
        const degree = degreeAndField[0] ? degreeAndField[0].trim() : '';
        const fieldOfStudy = degreeAndField[1] ? degreeAndField[1].trim() : '';

        const schoolInfo = parts[2] ? parts[2].split(',') : [];
        const schoolName = schoolInfo[0] ? schoolInfo[0].trim() : '';
        const schoolLocation = schoolInfo[1] ? schoolInfo[1].trim() : '';

        navigate('/education', {
            state: {
                entry: {
                    schoolName,
                    schoolLocation,
                    degree,
                    fieldOfStudy,
                    graduationMonth,
                    graduationYear,
                },
                index
            }
        });
    };



    const handleDelete = (index) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa mục này?")) {
            const updatedEducationData = [...educationData];
            updatedEducationData.splice(index, 1);

            const selectedCvData = JSON.parse(localStorage.getItem('selectedCvData'));
            if (selectedCvData) {
                selectedCvData.education = updatedEducationData.join('; ');
                localStorage.setItem('selectedCvData', JSON.stringify(selectedCvData));
            }

            localStorage.setItem('educationData', updatedEducationData.join('; '));
            setEducationData(updatedEducationData);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar currentStep={2} />
            <main className="flex-1 p-10">
                <h2 className="text-3xl font-semibold mb-6">Tóm Tắt Quá Trình Học Tập</h2>

                {educationData.length > 0 ? (
                    educationData.map((entry, index) => {
                        if (typeof entry === 'string') {
                            const parts = entry.split(' - ');
                            const graduationYear = parts[0];
                            const degreeAndField = parts[1] ? parts[1].split(':') : [];
                            const degree = degreeAndField[0] ? degreeAndField[0].trim() : '';
                            const fieldOfStudy = degreeAndField[1] ? degreeAndField[1].trim() : '';
                            const schoolInfo = parts[2] ? parts[2].split(',') : [];
                            const schoolName = schoolInfo[0] ? schoolInfo[0].trim() : '';
                            const schoolLocation = schoolInfo[1] ? schoolInfo[1].trim() : '';

                            return (
                                <div key={index} className="bg-white border rounded-lg shadow-md p-6 mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xl font-semibold">
                                            {degree} | {fieldOfStudy}
                                        </h3>
                                        <div className="flex gap-4">
                                            <button
                                                className="text-blue-600"
                                                onClick={() => handleEdit(entry, index)}
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            <button className="text-red-600" onClick={() => handleDelete(index)}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-lg">{schoolName} | {schoolLocation}</p>
                                    <p className="text-gray-600 text-lg">
                                        Dự kiến tốt nghiệp vào {graduationYear}
                                    </p>
                                </div>
                            );
                        } else {
                            return (
                                <div key={index} className="bg-white border rounded-lg shadow-md p-6 mb-6">
                                    <p className="text-gray-600">Dữ liệu không hợp lệ.</p>
                                </div>
                            );
                        }
                    })
                ) : (
                    <p className="text-gray-600">Không có dữ liệu về quá trình học tập.</p>
                )}

                <button onClick={handleAddEducation} className="mt-6 text-blue-600 font-semibold hover:text-blue-700 transition">
                    + Thêm một quá trình học tập khác
                </button>

                <div className="flex justify-end mt-10">
                    <button className="bg-yellow-500 text-white font-medium py-2 px-6 rounded-lg hover:bg-yellow-600 transition" onClick={() => navigate('/work-history/list')}>
                        Tiếp theo: Lịch sử công việc
                    </button>
                </div>
            </main>
        </div>
    );
};

export default EducationList;
