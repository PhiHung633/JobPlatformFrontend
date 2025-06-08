import { useNavigate } from "react-router-dom";
import { FaBrain } from "react-icons/fa";
import { GiArtificialIntelligence } from "react-icons/gi";
import { useState, useEffect } from "react";
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import { getUserQuizAttempts } from "../../utils/ApiFunctions";
import { ClipLoader } from "react-spinners";

const IQHome = () => {
    const navigate = useNavigate();
    const [questionCount, setQuestionCount] = useState(60);
    const [timeLimit, setTimeLimit] = useState(1);
    const [quizAttempts, setQuizAttempts] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);

    const handleTimeLimitChange = (e) => {
        const value = Number(e.target.value);
        if (value > 0 || value === "") {
            setTimeLimit(value);
        }
    };

    useEffect(() => {
        async function fetchData() {
            try {
                setLoadingHistory(true);
                const res = await getUserQuizAttempts();
                if (res?.data) {
                    setQuizAttempts(res.data);
                }
            } catch (err) {
                console.error("Lỗi lấy lịch sử bài làm:", err);
            } finally {
                setLoadingHistory(false);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="flex items-center justify-center bg-gray-100 p-6 min-h-screen">
            <div className="w-full p-8 bg-white rounded-xl shadow-lg text-center">
                <h1 className="text-3xl font-bold text-green-600 mb-4">Trắc Nghiệm IQ</h1>
                <p className="mb-8 text-gray-700">
                    Bạn có muốn kiểm tra trí thông minh của mình? <br />
                    Bài test IQ này sẽ giúp bạn đánh giá khả năng suy luận logic,
                    tư duy toán học và khả năng phân tích của bạn. Hãy thử thách bản thân ngay bây giờ!
                </p>

                <div className="flex flex-wrap items-center justify-center gap-6">
                    <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel id="question-count-label">Số câu hỏi</InputLabel>
                        <Select
                            labelId="question-count-label"
                            value={questionCount}
                            onChange={(e) => setQuestionCount(Number(e.target.value))}
                            label="Số câu hỏi"
                        >
                            <MenuItem value={10}>10 câu</MenuItem>
                            <MenuItem value={20}>20 câu</MenuItem>
                            <MenuItem value={30}>30 câu</MenuItem>
                            <MenuItem value={60}>60 câu</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        label="Thời gian (phút)"
                        type="number"
                        value={timeLimit}
                        onChange={handleTimeLimitChange}
                        inputProps={{ min: 1 }}
                    />
                </div>

                <button
                    className="mt-6 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300"
                    onClick={() =>
                        navigate(`/iq-test?questions=${questionCount}&timeLimit=${timeLimit}`)
                    }
                >
                    Kiểm Tra Ngay
                </button>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                    <div className="flex items-start">
                        <FaBrain className="text-4xl text-green-500 mr-4" />
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                {questionCount} Câu Hỏi Trắc Nghiệm
                            </h2>
                            <p className="text-gray-600">
                                Bạn sẽ chọn mức độ đồng ý hoặc không đồng ý với các câu hỏi về tư duy logic,
                                phân tích, và khả năng giải quyết vấn đề.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <GiArtificialIntelligence className="text-4xl text-green-500 mr-4" />
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                Phân Tích Yếu Tố Tính Cách
                            </h2>
                            <p className="text-gray-600">
                                Bài kiểm tra sẽ giúp bạn hiểu rõ hơn về tư duy logic, khả năng sáng tạo,
                                và phân tích các yếu tố thông minh của bạn.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Lịch sử làm bài */}
                <h2 className="mt-12 text-xl font-bold text-gray-800">Lịch sử làm bài</h2>
                <div className="mt-4 space-y-4 text-left">
                    {loadingHistory ? (
                        <div className="flex justify-center py-6">
                            <ClipLoader size={30} color="#10B981" />
                        </div>
                    ) : quizAttempts.length === 0 ? (
                        <p className="text-gray-500">Bạn chưa có bài làm nào trước đó.</p>
                    ) : (
                        quizAttempts.map((attempt, index) => (
                            <div
                                key={attempt.id}
                                className="p-4 border rounded shadow hover:bg-gray-50 cursor-pointer"
                                onClick={() =>
                                    navigate("/iq-test", {
                                        state: {
                                            questions: attempt.questions,
                                            isReview: true,
                                        },
                                    })
                                }
                            >
                                <h3 className="font-semibold text-green-600">Bài {index + 1}</h3>
                                <p className="text-sm text-gray-600">
                                    Bắt đầu: {new Date(attempt.startTime).toLocaleString()}
                                    <br />
                                    Giới hạn thời gian: {Math.floor(attempt.timeLimit / 60)} phút
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default IQHome;
