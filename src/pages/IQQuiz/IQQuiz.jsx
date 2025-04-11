import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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

    useEffect(() => {
        const fetchQuiz = async () => {
            const quizId = localStorage.getItem("quizId");
            if (quizId) {
                const { data, error } = await getQuizAttemp(quizId);
                if (data) {
                    console.log("CUUTUI",data)
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
            const socket = new SockJS(`http://localhost:8080/ws?token=${token}`);
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
        const socket = new SockJS(`http://localhost:8080/ws?token=${token}`);
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
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg flex items-center justify-center">
                        <ClipLoader color="#4caf50" size={40} />
                        <p className="mt-2 text-lg font-semibold">Đang nộp bài...</p>
                    </div>
                </div>
            )}
            <h1 className="text-2xl font-bold text-center mb-4">IQ Quiz Test</h1>
            {showResult ? (
                <div className="text-center min-h-screen">
                    <h2 className="text-xl font-bold">Kết quả của bạn:</h2>
                    <p className="text-lg mt-2">Bạn đạt {score} / {quiz?.questions.length} điểm</p>
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">Thời gian còn lại:</span>
                        <span className="text-red-500 font-bold text-xl">
                            {Math.floor(timeLeft / 60)}:{("0" + (timeLeft % 60)).slice(-2)}
                        </span>
                    </div>
                    {quiz?.questions.map((q) => (
                        q.content && q.answers.length > 0 && (
                            <div key={q.id} className="mb-4">
                                <h2 className="font-semibold">{q.id}. {q.content}</h2>
                                {q.image && (
                                    <img src={q.image} alt={`Question ${q.id}`} className="my-2 max-w-full rounded-md border"/>
                                )}
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {q.answers.map((option, index) => (
                                        <button
                                            key={index}
                                            className={`p-2 border rounded-lg text-left ${selectedAnswers[q.id] === option ? "bg-blue-300" : "bg-gray-100"
                                                }`}
                                            onClick={() => handleAnswerChange(q.id, option)}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )
                    ))}
                    <button
                        className="w-full mt-4 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                        onClick={handleSubmit}
                    >
                        Nộp bài
                    </button>
                </>
            )}
        </div>
    );
};

export default IQQuiz;
