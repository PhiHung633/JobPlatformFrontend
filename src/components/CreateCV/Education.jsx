import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import InputField from './InputField/InputField';

const Education = () => {
    const [formData, setFormData] = useState([]);
    const [currentEntry, setCurrentEntry] = useState({
        schoolName: '',
        schoolLocation: '',
        degree: '',
        fieldOfStudy: '',
        graduationMonth: '',
        graduationYear: ''
    });

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const data = localStorage.getItem('educationData');
        if (data) {
            const parsedData = data.split(';').map(item => item.trim()).filter(item => item !== '');
            setFormData(parsedData); 
        } else {
            setFormData([]); 
        }
    }, []);

    useEffect(() => {
        if (location.state && location.state.entry) {
            setCurrentEntry(location.state.entry);
        } else {
            setCurrentEntry({
                schoolName: '',
                schoolLocation: '',
                degree: '',
                fieldOfStudy: '',
                graduationMonth: '',
                graduationYear: ''
            });
        }
    }, [location.state]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentEntry({
            ...currentEntry,
            [name]: value
        });
    };

    const handleNext = () => {
        const requiredFields = ['schoolName', 'schoolLocation', 'degree', 'fieldOfStudy', 'graduationMonth', 'graduationYear'];
    
        for (let field of requiredFields) {
            if (!currentEntry[field]) {
                alert(`Vui lòng nhập đầy đủ thông tin: ${
                    field === 'schoolName' ? 'Tên trường' :
                    field === 'schoolLocation' ? 'Địa chỉ trường' :
                    field === 'degree' ? 'Bằng cấp' :
                    field === 'fieldOfStudy' ? 'Ngành học' :
                    field === 'graduationMonth' ? 'Tháng tốt nghiệp' :
                    'Năm tốt nghiệp'}.`);
                return;
            }
        }
    
        const formattedEntry = `${currentEntry.graduationMonth} ${currentEntry.graduationYear} - ${currentEntry.degree}: ${currentEntry.fieldOfStudy} - ${currentEntry.schoolName}, ${currentEntry.schoolLocation}`;
    
        const existingData = localStorage.getItem('educationData');
        const updatedData = existingData ? `${existingData}; ${formattedEntry}` : formattedEntry;
    
        localStorage.setItem('educationData', updatedData);
    
        navigate('/education/list');
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar currentStep={2} />
            <main className="flex-1 p-10">
                <h2 className="text-3xl font-semibold mb-2">Hãy cho chúng tôi biết về quá trình học tập của bạn</h2>
                <p className="text-gray-600 mb-6">
                    Điền vào thông tin về quá trình học tập của bạn cho đến nay, kể cả khi bạn là sinh viên hiện tại hoặc chưa tốt nghiệp.
                </p>

                <div className="grid grid-cols-2 gap-6 mb-8">
                    <InputField label="Tên Trường" placeholder="Ví dụ: Đại học Texas"
                        name="schoolName" value={currentEntry.schoolName} onChange={handleChange} required />
                    <InputField label="Địa Chỉ Trường" placeholder="Ví dụ: Texas"
                        name="schoolLocation" value={currentEntry.schoolLocation} onChange={handleChange} required />
                    <InputField label="Bằng Cấp" placeholder="Ví dụ: Cử nhân"
                        name="degree" value={currentEntry.degree} onChange={handleChange} required />
                    <InputField label="Ngành Học" placeholder="Ví dụ: Khoa học Máy tính"
                        name="fieldOfStudy" value={currentEntry.fieldOfStudy} onChange={handleChange} required />

                    <div>
                        <label className="block text-gray-700 mb-2">Ngày Tốt Nghiệp (Hoặc Ngày Dự Kiến Tốt Nghiệp)</label>
                        <div className="grid grid-cols-2 gap-2">
                            <select name="graduationMonth" value={currentEntry.graduationMonth} onChange={handleChange} className="border rounded px-3 py-2">
                                <option value="">Chọn Tháng</option>
                                {["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"].map(month => (
                                    <option key={month} value={month}>{month}</option>
                                ))}
                            </select>
                            <select name="graduationYear" value={currentEntry.graduationYear} onChange={handleChange} className="border rounded px-3 py-2">
                                <option value="">Chọn Năm</option>
                                {[...Array(51)].map((_, i) => {
                                    const year = new Date().getFullYear() - 25 + i;
                                    return <option key={year} value={year}>{year}</option>;
                                })}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button onClick={handleNext} className="bg-yellow-400 text-white py-2 px-8 rounded">
                        Tiếp theo
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Education;
