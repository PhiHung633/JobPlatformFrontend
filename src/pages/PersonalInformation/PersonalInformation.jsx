import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { fetchUserById, updateUser, uploadImage } from "../../utils/ApiFunctions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PersonalInformation = () => {
    const [userId, setUserId] = useState("");
    const [userData, setUserData] = useState({
        fullName: "",
        phone: "",
        email: "",
        avatarUrl: "",
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

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
                setIsLoading(true);
                const { data, error } = await fetchUserById(userId);
                setIsLoading(false);
                if (data) {
                    setUserData({
                        fullName: data.fullName,
                        phone: data.phone,
                        email: data.email,
                        avatarUrl: data.avatarUrl,
                    });
                } else {
                    toast.error("Error fetching user data.");
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

    const handleAvatarChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);
            const previewUrl = URL.createObjectURL(file);
            setUserData((prev) => ({ ...prev, avatarUrl: previewUrl }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            let updatedAvatarUrl = userData.avatarUrl;
            if (avatarFile) {
                const result = await uploadImage(avatarFile);
                if (result) {
                    updatedAvatarUrl = result.data;
                } else {
                    toast.error("Failed to upload image. Please try again.");
                    setIsLoading(false);
                    return;
                }
            }
            const updatedData = { ...userData, avatarUrl: updatedAvatarUrl };
            const { data, error } = await updateUser(userId, updatedData);
            setIsLoading(false);
            if (data) {
                toast.success("Cập nhật thông tin thành công!");
                setUserData(updatedData);
            } else {
                toast.error("Error updating user data. Please try again.");
                console.error("Error updating user data:", error);
            }
        } catch (error) {
            setIsLoading(false);
            console.error("Unexpected error:", error);
            toast.error("An unexpected error occurred. Please try again later.");
        }
    };

    return (
        <div className="flex justify-center items-center mt-10 bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Cài đặt thông tin cá nhân
                </h2>
                <div className="mb-6 text-center">
                    <label htmlFor="avatar-upload" className="cursor-pointer">
                        <img
                            src={userData.avatarUrl}
                            alt="Avatar"
                            className="w-24 h-24 rounded-full mx-auto object-cover"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                    "https://media4.giphy.com/media/xTk9ZvMnbIiIew7IpW/giphy.gif?cid=6c09b952souzn361oda9jrwdqfbhyupzrijte9zxczqrfh69&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=g";
                            }}
                        />
                    </label>
                    <input
                        type="file"
                        id="avatar-upload"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                    />
                </div>
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
                        disabled={isLoading}
                    >
                        {isLoading ? "Đang tải..." : "Lưu"}
                    </button>
                </form>
            </div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </div>
    );
};

export default PersonalInformation;
