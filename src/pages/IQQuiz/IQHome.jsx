import { useNavigate } from "react-router-dom";
import { FaBrain } from "react-icons/fa"; // Import icon
import { GiArtificialIntelligence } from "react-icons/gi";
import { useState } from "react";
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";

const IQHome = () => {
    const navigate = useNavigate();
    const [questionCount, setQuestionCount] = useState(60);
    const [timeLimit, setTimeLimit] = useState(1);

    const handleTimeLimitChange = (e) => {
        const value = Number(e.target.value);
        if (value > 0 || value === '') {
            setTimeLimit(value);
        }
    };

    return (
        <div className="flex items-center justify-center bg-gray-100 p-6">
            <div className="w-full p-8 text-center">
                {/* Ảnh minh họa */}
                {/* <img
                    src="https://source.unsplash.com/500x300/?brain,thinking"
                    alt="IQ Test"
                    className="mx-auto mb-6 rounded-lg shadow-md"
                /> */}

                <h1 className="text-3xl font-bold text-green-600">Trắc Nghiệm IQ</h1>
                <p className="mt-4 text-gray-700">
                    Bạn có muốn kiểm tra trí thông minh của mình? <br />
                    Bài test IQ này sẽ giúp bạn đánh giá khả năng suy luận logic,
                    tư duy toán học và khả năng phân tích của bạn. Hãy thử thách bản thân ngay bây giờ!
                </p>
                <div className="flex items-center justify-center space-x-5">
                    <div className="mt-4">
                        <FormControl sx={{ m: 1, minWidth: 80 }}>
                            <InputLabel id="question-count-label">Chọn số câu hỏi</InputLabel>
                            <Select
                                labelId="question-count-label"
                                id="question-count-label"
                                value={questionCount}
                                onChange={(e) => setQuestionCount(Number(e.target.value))}
                                className=" w-36"
                                label="Chọn số câu hỏi"
                            >
                                <MenuItem value={10}>10 câu</MenuItem>
                                <MenuItem value={20}>20 câu</MenuItem>
                                <MenuItem value={30}>30 câu</MenuItem>
                                <MenuItem value={60}>60 câu</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    <div className="mt-4">
                        <TextField
                            label="Nhập số phút"
                            type="number"
                            value={timeLimit}
                            onChange={handleTimeLimitChange}
                            inputProps={{ min: 1 }}
                            className="mt-2 w-40"
                        />
                    </div>
                </div>

                <button
                    className="mt-6 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-greem-600 transition duration-300"
                    onClick={() => navigate(`/iq-test?questions=${questionCount}&timeLimit=${timeLimit}`)}
                >
                    Kiểm Tra Ngay
                </button>

                <div className="mt-32 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    {/* Số lượng câu hỏi */}
                    <div className="flex items-start">
                        <FaBrain className="text-4xl text-green-500 mr-4" />
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">{questionCount} Câu Hỏi Trắc Nghiệm</h2>
                            <p className="text-gray-600">
                                Bạn sẽ chọn mức độ đồng ý hoặc không đồng ý với các câu hỏi về tư duy logic,
                                phân tích, và khả năng giải quyết vấn đề.
                            </p>
                        </div>
                    </div>

                    {/* Lợi ích của bài test */}
                    <div className="flex items-start">
                        <GiArtificialIntelligence className="text-4xl text-green-500 mr-4" />
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Phân Tích Yếu Tố Tính Cách</h2>
                            <p className="text-gray-600">
                                Bài kiểm tra sẽ giúp bạn hiểu rõ hơn về tư duy logic, khả năng sáng tạo,
                                và phân tích các yếu tố thông minh của bạn.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IQHome;
