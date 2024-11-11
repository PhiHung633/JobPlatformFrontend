import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';

const Summary = () => {
    const [summary, setSummary] = useState('');
    const navigate = useNavigate();

    // Tải dữ liệu tóm tắt từ localStorage khi component được render
    useEffect(() => {
        const storedSummary = localStorage.getItem('summaryData');
        if (storedSummary) {
            setSummary(storedSummary);
        }
    }, []);

    const handleNext = () => {
        // Lưu dữ liệu tóm tắt vào localStorage
        localStorage.setItem('summaryData', summary);
        navigate('/extra');
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar currentStep={5} />
            <main className="flex-1 p-10">
                <h2 className="text-3xl font-semibold mb-2">Tóm tắt về các thông tin khác của bạn</h2>
                <p className="text-gray-600 mb-6">Viết về kinh nghiệm và các thông tin khác của bạn.</p>

                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="summary">
                        Tóm tắt nghề nghiệp:
                    </label>
                    <textarea
                        id="summary"
                        placeholder="Viết tóm tắt kinh nghiệm và các thông tin khác của bạn tại đây..."
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex justify-end mt-8">
                    <button
                        onClick={handleNext}
                        className="bg-yellow-500 text-white font-medium py-2 px-6 rounded-lg hover:bg-yellow-600 transition"
                    >
                        Tiếp theo: Các phần bổ sung
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Summary;
