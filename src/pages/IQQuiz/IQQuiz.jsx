import { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import SockJS from "sockjs-client/dist/sockjs";
import { over } from "stompjs";
import { ClipLoader } from 'react-spinners';
import { getQuizAttemp, startQuiz, submitQuiz } from "../../utils/ApiFunctions";

const IQQuiz = () => {
    const [searchParams] = useSearchParams();
    const questionCount = Number(searchParams.get("questions")) || 5;
    const timeLimitFromURL = Number(searchParams.get("timeLimit")) || 1;

    const [quiz, setQuiz] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(timeLimitFromURL);
    const [stompClient, setStompClient] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const { questions = [], isReview = false } = location.state || {};


    useEffect(() => {
        const fetchQuiz = async () => {
            const quizId = localStorage.getItem("quizId");
            if (quizId) {
                const { data, error } = await getQuizAttemp(quizId);
                if (data) {
                    console.log("CUUTUI", data)
                    setQuiz(data);
                    setSelectedAnswers(
                        data.questions.reduce((acc, q) => {
                            if (q.selectedAnswer) {
                                acc[q.id] = q.selectedAnswer;
                            }
                            return acc;
                        }, {})
                    );
                    setTimeLeft(calculateTimeLeft(data.startTime, data.timeLimit));
                    console.log("DAYLAA1234", calculateTimeLeft(data.startTime, data.timeLimit))
                    connectWebSocket(quizId);
                    setLoading(false);
                    return;
                }
            }
            startQuiz1();
        };

        fetchQuiz();
    }, []);


    const startQuiz1 = async () => {
        try {
            console.log("TIMENE", timeLimitFromURL);
            console.log("QueSTI", questionCount)
            const { data } = await startQuiz(
                Number(timeLimitFromURL * 60),
                Number(questionCount)
            );
            console.log("DATALADAY", data)
            setQuiz(data);
            localStorage.setItem('quizId', data.id);
            setTimeLeft(timeLimitFromURL * 60);
            setLoading(false);

            const token = localStorage.getItem("accessToken");
            // const socket = new SockJS(`http://localhost:8080/ws?token=${token}`);
            const socket = new SockJS(`https://jobplatformbackend.onrender.com/ws?token=${token}`);
            const stomp = over(socket);
            stomp.connect({}, () => {
                setStompClient(stomp);

                stomp.subscribe(`/quiz/${data.id}/time`, (message) => {
                    console.log("Received WebSocket message:", message.body);
                    setTimeLeft(JSON.parse(message.body).timeLeft);
                });

                stomp.subscribe(`/quiz/result/${data.id}`, (message) => {
                    const messageText = message.body;
                    const match = messageText.match(/Score:\s*(\d+)/);
                    if (match) {
                        const extractedScore = parseInt(match[1], 10);
                        setScore(extractedScore);
                        setShowResult(true);
                    }
                });
            });
        } catch (error) {
            console.error("Error starting quiz:", error);
        }
    };

    const calculateTimeLeft = (startTime, timeLimit) => {
        const start = new Date(startTime).getTime();
        const now = new Date().getTime();
        const elapsedTime = Math.floor((now - start) / 1000);
        return Math.max(timeLimit - elapsedTime, 0);
    };

    const handleAnswerChange = (questionId, selectedAnswer) => {
        setSelectedAnswers((prev) => ({ ...prev, [questionId]: selectedAnswer }));

        if (stompClient) {
            stompClient.send(
                "/app/quiz/answer",
                {},
                JSON.stringify({ quizAttemptId: quiz.id, questionId, answer: selectedAnswer })
            );
        }
    };

    const connectWebSocket = (quizId) => {
        const token = localStorage.getItem("accessToken");
        // const socket = new SockJS(`http://localhost:8080/ws?token=${token}`);
        const socket = new SockJS(`https://jobplatformbackend.onrender.com/ws?token=${token}`);
        const stomp = over(socket);

        stomp.connect({}, () => {
            setStompClient(stomp);

            stomp.subscribe(`/quiz/${quizId}/time`, (message) => {
                console.log("Received WebSocket message:", message.body);
                setTimeLeft(JSON.parse(message.body).timeLeft);
            });

            stomp.subscribe(`/quiz/result/${quizId}`, (message) => {
                const messageText = message.body;
                const match = messageText.match(/Score:\s*(\d+)/);
                if (match) {
                    const extractedScore = parseInt(match[1], 10);
                    setScore(extractedScore);
                    setShowResult(true);
                }
            });
        });
    };


    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            await submitQuiz(quiz.id);
            localStorage.removeItem("quizId");
        } catch (error) {
            console.error("Error submitting quiz:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {

        if (timeLeft <= 0 && !showResult) {
            handleSubmit();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, showResult, timeLimitFromURL]);


    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <ClipLoader color="#4caf50" size={40} />
            </div>
        );
    }

    return (
        <div className="w-full mt-5 p-6 bg-white overflow-hidden">
            {isSubmitting && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-60">
                    <div className="bg-white p-6 rounded-xl shadow-2xl flex flex-col items-center space-y-4">
                        <ClipLoader color="#4caf50" size={40} />
                        <p className="text-lg font-semibold text-gray-700">Đang nộp bài...</p>
                    </div>
                </div>
            )}

            <h1 className="text-3xl font-bold text-center text-green-600 mb-6">IQ Quiz Test</h1>

            {showResult ? (
                <div className="text-center py-10">
                    <h2 className="text-2xl font-bold text-gray-800">Kết quả của bạn:</h2>
                    <p className="text-xl mt-4 text-gray-700">
                        Bạn đạt <span className="font-bold text-green-600">{score}</span> / {quiz?.questions.length} điểm
                    </p>
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-6 px-2 py-3 bg-gray-50 rounded-lg shadow-sm">
                        <span className="text-lg font-semibold text-gray-800">⏰ Thời gian còn lại:</span>
                        <span className="text-red-600 font-extrabold text-xl">
                            {Math.floor(timeLeft / 60)}:{("0" + (timeLeft % 60)).slice(-2)}
                        </span>
                    </div>
                    {isReview ? (
                        <div className="p-4">
                            {questions.map((q, index) => (
                                <div key={q.id} className="mb-6 border p-4 rounded shadow">
                                    <h2 className="font-semibold">
                                        Câu {index + 1}: {q.content}
                                    </h2>
                                    {q.image && <img src={q.image} alt="" className="mt-2 mb-2 max-h-60" />}
                                    <ul className="mt-2">
                                        {q.answers.map((ans, i) => {
                                            const isCorrect = ans === q.correctAnswer;
                                            const isSelected = ans === q.selectedAnswer;
                                            let bgColor = "";

                                            if (isReview) {
                                                if (isCorrect) bgColor = "bg-green-200";
                                                else if (isSelected) bgColor = "bg-red-200";
                                            } else if (isSelected) {
                                                bgColor = "bg-blue-100";
                                            }

                                            return (
                                                <li
                                                    key={i}
                                                    className={`p-2 rounded mt-1 border ${bgColor}`}
                                                >
                                                    {ans}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                    {isReview && (
                                        <p className="mt-2 text-sm text-gray-600">
                                            Đáp án đúng: <strong>{q.correctAnswer}</strong>
                                            <br />
                                            Bạn chọn: <strong>{q.selectedAnswer || "Không chọn"}</strong>
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) :
                        (quiz?.questions.map((q, index) =>
                            q.content && q.answers.length > 0 ? (
                                <div key={q.id} className="mb-8 p-4 border border-gray-200 rounded-xl bg-gray-50 shadow-sm">
                                    <h2 className="font-semibold text-lg text-gray-800">{index + 1}. {q.content}</h2>

                                    {q.image && (
                                        <img
                                            src={q.image}
                                            alt={`Question ${q.id}`}
                                            className="my-4 w-full max-h-64 object-contain rounded-md"
                                        />
                                    )}

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                                        {q.answers.map((option, index) => (
                                            <button
                                                key={index}
                                                className={`p-3 border rounded-lg text-left transition-colors duration-200 ${selectedAnswers[q.id] === option
                                                    ? "bg-blue-500 text-white border-blue-600"
                                                    : "bg-white hover:bg-blue-50 text-gray-800"
                                                    }`}
                                                onClick={() => handleAnswerChange(q.id, option)}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : null
                        ))
                    }

                    {!isReview && (
                        <button
                            className="w-full mt-6 bg-green-600 text-white py-3 rounded-xl shadow-lg hover:bg-green-700 transition-all duration-200"
                            onClick={handleSubmit}
                        >
                            ✅ Nộp bài
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default IQQuiz;
