import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';

const Skill = () => {
    const [skills, setSkills] = useState([{ name: '', rating: 0 }]);
    const navigate = useNavigate();

    // Tải dữ liệu kỹ năng từ localStorage khi component được render
    useEffect(() => {
        const storedSkills = localStorage.getItem('skillsData');
        if (storedSkills) {
            setSkills(JSON.parse(storedSkills));
        }
    }, []);

    const handleSkillChange = (index, event) => {
        const updatedSkills = [...skills];
        updatedSkills[index].name = event.target.value;
        setSkills(updatedSkills);
    };

    const handleRatingChange = (index, rating) => {
        const updatedSkills = [...skills];
        updatedSkills[index].rating = rating;
        setSkills(updatedSkills);
    };

    const handleAddSkill = () => {
        setSkills([...skills, { name: '', rating: 0 }]);
    };

    const handleDeleteSkill = (index) => {
        const updatedSkills = skills.filter((_, i) => i !== index);
        setSkills(updatedSkills);
    };

    const handleNext = () => {
        // Lưu dữ liệu kỹ năng vào localStorage
        localStorage.setItem('skillsData', JSON.stringify(skills));
        navigate('/summary');
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar currentStep={4} />
            <main className="flex-1 p-10">
                <h2 className="text-3xl font-semibold mb-2">Những kỹ năng nào bạn muốn làm nổi bật?</h2>
                <p className="text-gray-600 mb-6">Viết ra các kỹ năng của bạn cùng với mức độ đánh giá của chúng.</p>

                {skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-4 mb-4">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => handleRatingChange(index, star)}
                                    className={`text-xl ${star <= skill.rating ? 'text-yellow-400' : 'text-gray-400'}`}
                                >
                                    <FontAwesomeIcon icon={faStar} />
                                </button>
                            ))}
                        </div>
                        <input
                            type="text"
                            placeholder="Tên Kỹ Năng"
                            value={skill.name}
                            onChange={(e) => handleSkillChange(index, e)}
                            className="border rounded-lg p-2 flex-1"
                        />
                        <button
                            onClick={() => handleDeleteSkill(index)}
                            className="text-red-600 text-xl"
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </div>
                ))}

                <button
                    onClick={handleAddSkill}
                    className="flex items-center gap-2 text-blue-600 font-semibold mt-4 border-2 border-dashed border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition"
                >
                    + Thêm Kỹ Năng
                </button>

                <div className="flex justify-end mt-10">
                    <button
                        onClick={handleNext}
                        className="bg-yellow-500 text-white font-medium py-2 px-6 rounded-lg hover:bg-yellow-600 transition"
                    >
                        Tiếp theo: Tóm tắt
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Skill;
