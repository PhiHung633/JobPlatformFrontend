import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const Extra = () => {
    const navigate = useNavigate();

    const [languages, setLanguages] = useState([]);
    const [hobbies, setHobbies] = useState([]);
    const [certifications, setCertifications] = useState([]);
    const [portfolios, setPortfolios] = useState([]);

    useEffect(() => {
        const selectedCVdata = localStorage.getItem('selectedCvData')
            ? JSON.parse(localStorage.getItem('selectedCvData'))
            : null;

        const savedLanguages = localStorage.getItem('languagesData')?.split(';') || [];
        const savedHobbies = localStorage.getItem('hobbiesData')?.split(';') || [];
        const savedCertifications = localStorage.getItem('certificationsData')
            ? localStorage.getItem('certificationsData').split(';').map(item => {
                const [date, title] = item.split('-');
                return { date, title };
            })
            : [];
        const savedPortfolios = localStorage.getItem('portfoliosData')?.split(';') || [];

        const combinedLanguages = [
            ...new Set([
                ...savedLanguages,
                ...(selectedCVdata?.languageSkill?.split(';') || []),
            ]),
        ];
        const combinedHobbies = [
            ...new Set([
                ...savedHobbies,
                ...(selectedCVdata?.hobby ? [selectedCVdata.hobby] : []),
            ]),
        ];
        const combinedCertifications = savedCertifications;

        // Nếu dữ liệu từ `selectedCVdata` tồn tại và không bị trùng lặp, thì mới thêm vào.
        if (
            selectedCVdata?.certifications &&
            !savedCertifications.some(
                cert =>
                    cert.date === selectedCVdata.certifications.split('-')[0] &&
                    cert.title === selectedCVdata.certifications.split('-')[1]
            )
        ) {
            combinedCertifications.push({
                date: selectedCVdata.certifications.split('-')[0],
                title: selectedCVdata.certifications.split('-')[1],
            });
        }

        const combinedPortfolios = [
            ...new Set([
                ...savedPortfolios,
                ...(selectedCVdata?.portfolio ? [selectedCVdata.portfolio] : []),
            ]),
        ];

        setLanguages(combinedLanguages);
        setHobbies(combinedHobbies);
        setCertifications(combinedCertifications);
        setPortfolios(combinedPortfolios);
    }, []);


    const saveToLocalStorage = () => {
        const languagesString = languages.join(';');
        const hobbiesString = hobbies.join(';');
        const certificationsString = certifications
            .map(cert => `${cert.date}-${cert.title}`)
            .join(';');
        const portfoliosString = portfolios.join(';');

        localStorage.setItem('languagesData', languagesString);
        localStorage.setItem('hobbiesData', hobbiesString);
        localStorage.setItem('certificationsData', certificationsString);
        localStorage.setItem('portfoliosData', portfoliosString);
    };

    const handleNext = () => {
        saveToLocalStorage();
        navigate('/preview');
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar currentStep={6} />
            <main className="flex-1 p-10">
                <h2 className="text-3xl font-semibold mb-2">Bạn muốn thêm thông tin gì vào không?</h2>
                <p className="text-gray-600 mb-6">Những phần này là tùy chọn.</p>

                <div className="grid grid-cols-2 gap-6">
                    {/* Ngôn ngữ */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Bạn có thể nói những ngôn ngữ nào?
                        </label>
                        {languages.map((language, index) => (
                            <div key={index} className="flex items-center space-x-2 mb-2">
                                <input
                                    type="text"
                                    value={language}
                                    onChange={(e) => {
                                        const newLanguages = [...languages];
                                        newLanguages[index] = e.target.value;
                                        setLanguages(newLanguages);
                                    }}
                                    placeholder="ví dụ: Tiếng Anh"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <FontAwesomeIcon
                                    icon={faTrash}
                                    className="text-gray-500 cursor-pointer"
                                    onClick={() => setLanguages(languages.filter((_, i) => i !== index))}
                                />
                            </div>
                        ))}
                        <button onClick={() => setLanguages([...languages, ""])} className="text-blue-600 border border-dashed border-blue-500 w-full py-2 rounded-lg">
                            + Thêm Ngôn Ngữ
                        </button>
                    </div>

                    {/* Sở thích */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Bạn có sở thích gì?
                        </label>
                        {hobbies.map((hobby, index) => (
                            <div key={index} className="flex items-center space-x-2 mb-2">
                                <input
                                    type="text"
                                    value={hobby}
                                    onChange={(e) => {
                                        const newHobbies = [...hobbies];
                                        newHobbies[index] = e.target.value;
                                        setHobbies(newHobbies);
                                    }}
                                    placeholder="ví dụ: Du lịch"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <FontAwesomeIcon
                                    icon={faTrash}
                                    className="text-gray-500 cursor-pointer"
                                    onClick={() => setHobbies(hobbies.filter((_, i) => i !== index))}
                                />
                            </div>
                        ))}
                        <button onClick={() => setHobbies([...hobbies, ""])} className="text-blue-600 border border-dashed border-blue-500 w-full py-2 rounded-lg">
                            + Thêm Sở Thích
                        </button>
                    </div>

                    {/* Chứng chỉ */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Bạn có chứng chỉ nào không?
                        </label>
                        {certifications.map((certification, index) => (
                            <div key={index} className="flex items-center space-x-2 mb-2">
                                <input
                                    type="text"
                                    value={certification.date}
                                    onChange={(e) => {
                                        const newCertifications = [...certifications];
                                        newCertifications[index].date = e.target.value;
                                        setCertifications(newCertifications);
                                    }}
                                    placeholder="dd/mm/yyyy"
                                    className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="text"
                                    value={certification.title}
                                    onChange={(e) => {
                                        const newCertifications = [...certifications];
                                        newCertifications[index].title = e.target.value;
                                        setCertifications(newCertifications);
                                    }}
                                    placeholder="ví dụ: Đào tạo Kế toán"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <FontAwesomeIcon
                                    icon={faTrash}
                                    className="text-gray-500 cursor-pointer"
                                    onClick={() => setCertifications(certifications.filter((_, i) => i !== index))}
                                />
                            </div>
                        ))}
                        <button onClick={() => setCertifications([...certifications, { date: "", title: "" }])} className="text-blue-600 border border-dashed border-blue-500 w-full py-2 rounded-lg">
                            + Thêm Chứng Chỉ
                        </button>
                    </div>

                    {/* Portfolio */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Websites, Portfolio, Hồ sơ
                        </label>
                        {portfolios.map((portfolio, index) => (
                            <div key={index} className="flex items-center space-x-2 mb-2">
                                <input
                                    type="text"
                                    value={portfolio}
                                    onChange={(e) => {
                                        const newPortfolios = [...portfolios];
                                        newPortfolios[index] = e.target.value;
                                        setPortfolios(newPortfolios);
                                    }}
                                    placeholder="ví dụ: github.com/tenban"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <FontAwesomeIcon
                                    icon={faTrash}
                                    className="text-gray-500 cursor-pointer"
                                    onClick={() => setPortfolios(portfolios.filter((_, i) => i !== index))}
                                />
                            </div>
                        ))}
                        <button onClick={() => setPortfolios([...portfolios, ""])} className="text-blue-600 border border-dashed border-blue-500 w-full py-2 rounded-lg">
                            + Thêm Portfolio
                        </button>
                    </div>
                </div>

                {/* Footer buttons */}
                <div className="flex justify-end mt-8">
                    <button
                        onClick={handleNext}
                        className="bg-yellow-500 text-white font-medium py-2 px-6 rounded-lg hover:bg-yellow-600 transition"
                    >
                        Tiếp theo: Hoàn tất
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Extra;
