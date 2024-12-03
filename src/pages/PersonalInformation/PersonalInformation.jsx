import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { fetchUserById, updateUser } from "../../utils/ApiFunctions";

const PersonalInformation = () => {
    const [userId, setUserId] = useState("");
    const [userData, setUserData] = useState({
        fullName: "",
        phone: "",
        email: "",
    });

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserId(decodedToken.user_id);
        }
    }, []);

    useEffect(() => {
        if (userId) {
            const fetchUserData = async () => {
                const { data, error } = await fetchUserById(userId);
                if (data) {
                    setUserData({
                        fullName: data.fullName,
                        phone: data.phone,
                        email: data.email,
                    });
                } else {
                    console.error("Error fetching user data:", error);
                }
            };
            fetchUserData();
        }
    }, [userId]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setUserData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data, error } = await updateUser(userId, userData);
            if (data) {
                alert("Cập nhật thông tin thành công!");
                console.log("Updated user data:", data);
            } else {
                console.error("Error updating user data:", error);
                alert("Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            alert("Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.");
        }
    };

    return (
        <div className="flex justify-center items-center mt-10 bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Cài đặt thông tin cá nhân
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                    <span className="text-red-500">*</span> Các thông tin bắt buộc
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="fullName"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Họ và tên <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            value={userData.fullName}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Số điện thoại
                        </label>
                        <input
                            type="text"
                            id="phone"
                            value={userData.phone}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                        />
                    </div>

                    <div className="mb-6">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={userData.email}
                            disabled
                            className="mt-1 block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200"
                    >
                        Lưu
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PersonalInformation;
