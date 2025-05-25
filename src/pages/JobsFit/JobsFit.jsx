import { useCallback, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { ClipLoader } from 'react-spinners';

import ProfileManager from "../../components/ProfileManager/ProfileManager"
import SuitableJobs from "../../components/SuitableJobs/SuitableJobs"
import { fetchCvs, fetchUserById, findBestJob, processMomoPayment } from "../../utils/ApiFunctions";

const JobsFit = () => {
    const [userId, setUserId] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [cvId, setCvId] = useState("");
    const [isPremium, setIsPremium] = useState(false);
    const [bestJobs, setBestJobs] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [amountToDeposit, setAmountToDeposit] = useState("100.000");
    const [userEmail, setUserEmail] = useState("");
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserId(decodedToken.user_id);
            setUserEmail(decodedToken.sub);
        }
    }, []);

    useEffect(() => {
        if (!userId) return;
        const getCvsData = async () => {
            const response = await fetchCvs(userId, currentPage, 10);
            if (!response.error) {
                setCvId(response.data.cvs[0].id);
            } else {
                console.log("Error:", response.error);
            }
        };

        // const getUploadedCvs = async () => {
        //     const response = await fetchCvsFile(userId);
        //     console.log("rESSNE", response)
        //     if (!response.error) {
        //         setUploadedCvs(response.data.cvs || []);
        //     } else {
        //         console.log("Error fetching uploaded CVs:", response.error);
        //     }
        // };

        getCvsData();
        // getUploadedCvs();
    }, [userId, currentPage]);

    useEffect(() => {
        if (!cvId) return;
        const fetchBestJobs = async () => {
            const response = await findBestJob(cvId, 10);
            if (response.data) {
                setBestJobs(response.data);
            } else {
                console.log("Erorr finding best jobs", response.error);
            }
        }
        fetchBestJobs();
    }, [cvId]);

    const fetchUser = useCallback(async () => {
        if (!userId) return;
        setIsLoadingUser(true);
        try {
            const { data, error } = await fetchUserById(userId);
            if (data) setIsPremium(data.isPremium);
            else console.error(error);
        } finally {
            setIsLoadingUser(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    // useEffect(() => {
    //     const onVis = () => {
    //         if (document.visibilityState === "visible") fetchUser();
    //     };
    //     document.addEventListener("visibilitychange", onVis);
    //     window.addEventListener("focus", fetchUser);
    //     return () => {
    //         document.removeEventListener("visibilitychange", onVis);
    //         window.removeEventListener("focus", fetchUser);
    //     };
    // }, [fetchUser]);

    const formatCurrency = (value) => {
        if (!value) return "";
        return parseInt(value.replace(/\D/g, ""), 10).toLocaleString("vi-VN");
    };

    const handlePayment = async () => {
        if (!amountToDeposit || parseInt(amountToDeposit.replace(/\D/g, ""), 10) <= 0) {
            alert("Vui lòng nhập số tiền hợp lệ.");
            return;
        }

        const paymentData = {
            // amount: parseInt(amountToDeposit.replace(/\D/g, ""), 10),
            amount: 100000,
            account: userEmail,
            type: "PREMIUM"
        };

        try {
            const { data, error } = await processMomoPayment(paymentData);

            if (error) {
                alert(`Thanh toán thất bại: ${error.message || "Có lỗi xảy ra."}`);
                return;
            }

            if (data?.shortLink) {
                alert("Đang chuyển hướng đến cổng thanh toán...");
                window.location.href = data.shortLink;
                setShowModal(false);
            } else {
                alert("Không tìm thấy liên kết thanh toán.");
            }
        } catch (err) {
            console.error("Unexpected error:", err);
            alert("Có lỗi xảy ra trong quá trình xử lý thanh toán.");
        }
    };

    if (isLoadingUser) {
        return (
            <div className="flex items-center justify-center h-screen">
                <ClipLoader
                    size={50}    
                    color="#3B82F6"
                    loading={true}
                />
            </div>
        );
    }
    return (
        <>
            <div className="bg-gray-100 min-h-screen w-full">
                <div className="container m-0 my-auto mx-auto px-4 py-8">
                    <div className="flex flex-wrap lg:flex-nowrap gap-4">
                        <div className="w-full lg:w-2/3">
                            {isPremium ? (
                                <SuitableJobs bestJobs={bestJobs} />
                            ) : (
                                <div className="p-8 bg-white rounded-xl shadow text-center">
                                    <h2 className="text-2xl font-semibold mb-4">
                                        Bạn cần nâng cấp VIP để xem tính năng này
                                    </h2>
                                    <button
                                        onClick={() => setShowModal(true)}
                                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    >
                                        Nạp VIP
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="w-full lg:w-1/3 ml-24">
                            <ProfileManager />
                        </div>
                    </div>
                </div>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded-xl shadow-lg w-96 p-6">
                            <h3 className="text-xl font-semibold text-gray-800">Nạp tiền</h3>
                            <p className="mt-4 text-sm font-semibold text-red-600">
                                (*) Lưu ý: Với{" "}
                                <span className="text-blue-500 font-bold">100.000 VNĐ</span>, bạn sẽ
                                được nâng cấp tài khoản VIP
                            </p>
                            <p className="mt-4 text-gray-600">Nhập số tiền bạn muốn nạp:</p>
                            <input
                                type="text"
                                value={amountToDeposit}
                                onChange={(e) => {
                                    const formatted = formatCurrency(e.target.value);
                                    setAmountToDeposit(formatted);
                                }}
                                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            <div className="mt-6 flex justify-end space-x-4">
                                <button
                                    onClick={handlePayment}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                                >
                                    Thanh toán
                                </button>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-xl hover:bg-gray-400 focus:ring-2 focus:ring-gray-200 focus:outline-none"
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default JobsFit
