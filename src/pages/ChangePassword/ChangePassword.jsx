import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { changePassword } from "../../utils/ApiFunctions";

const ChangePassword = () => {
    const [userId, setUserId] = useState("");
    const [email, setEmail] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
        return passwordRegex.test(password);
    };
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserId(decodedToken.user_id);
            setEmail(decodedToken.sub);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword === "" || confirmPassword === "" || oldPassword === "") {
            setError("Vui lòng điền đầy đủ thông tin.");
            setMessage("");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("");
            setError("Mật khẩu mới và nhập lại mật khẩu không khớp.");
            return;
        }

        try {
            if (!validatePassword(newPassword)) {
                setError("Mật khẩu hiện tại phải ít nhất 6 ký tự, có 1 chữ hoa, chữ thường và số.");
                setMessage("");
                return;
            }

            const response = await changePassword(userId, oldPassword, newPassword);
            console.log("RESSS", response);

            setError("");
            setMessage("Đổi mật khẩu thành công!");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            console.log("ERROR", error);

            setMessage("");
            if (error) {
                if (error.error === "You don't have permission to do this action") {
                    setError("Mật khẩu hiện tại không đúng");
                } else {
                    setError(error.response?.data?.error || "Có lỗi xảy ra, vui lòng thử lại.");
                }
            } else {
                setError(error.message || "Có lỗi xảy ra, vui lòng thử lại.");
            }
        }
    };


    return (
        <div className="flex justify-center items-center mt-12 bg-gray-100">
            <div className="bg-white w-full max-w-md p-6 rounded-md shadow-md">
                <h2 className="text-xl font-semibold mb-4">Thay đổi mật khẩu đăng nhập</h2>

                <form onSubmit={handleSubmit}>
                    {/* Email đăng nhập */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-1">Email đăng nhập</label>
                        <input
                            type="email"
                            value={email}
                            readOnly
                            className="w-full px-4 py-2 border rounded-md bg-gray-200 text-gray-700"
                        />
                    </div>

                    {/* Mật khẩu hiện tại */}
                    <div className="mb-4 relative">
                        <label className="block text-gray-700 font-medium mb-1">Mật khẩu hiện tại</label>
                        <input
                            type={showOldPassword ? "text" : "password"}
                            placeholder="Nhập mật khẩu hiện tại"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md"
                        />
                        <FontAwesomeIcon
                            icon={showOldPassword ? faEye : faEyeSlash}
                            className="absolute right-3 mt-3 text-gray-500 cursor-pointer"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                        />
                    </div>

                    {/* Mật khẩu mới */}
                    <div className="mb-4 relative">
                        <label className="block text-gray-700 font-medium mb-1">Mật khẩu mới</label>
                        <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Nhập mật khẩu mới"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md"
                        />
                        <FontAwesomeIcon
                            icon={showNewPassword ? faEye : faEyeSlash}
                            className="absolute right-3 mt-3 text-gray-500 cursor-pointer"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        />
                    </div>

                    {/* Nhập lại mật khẩu mới */}
                    <div className="mb-6 relative">
                        <label className="block text-gray-700 font-medium mb-1">Nhập lại mật khẩu mới</label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Nhập lại mật khẩu mới"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md"
                        />
                        <FontAwesomeIcon
                            icon={showConfirmPassword ? faEye : faEyeSlash}
                            className="absolute right-3 mt-3 text-gray-500 cursor-pointer"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        />
                    </div>

                    {/* Nút Lưu */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="bg-green-500 text-white font-medium px-6 py-2 rounded-md hover:bg-green-600"
                        >
                            Lưu
                        </button>
                    </div>
                </form>

                {/* Thông báo */}
                {message && !error && (
                    <div className="mt-4 text-center text-sm text-green-500">{message}</div>
                )}
                {error && (
                    <div className="mt-4 text-center text-sm text-red-500">{error}</div>
                )}
            </div>
        </div>
    );
};

export default ChangePassword;
