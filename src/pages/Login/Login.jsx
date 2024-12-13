import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { faLock, faEye, faEyeSlash, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

import { loginUser } from '../../utils/ApiFunctions';
import { useAuth } from '../../service/AuthProvider';

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState({ password: false });
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const { updateRole } = useAuth();


    const navigate = useNavigate();



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        localStorage.removeItem("currentUserRole");

        const result = await loginUser(formData);

        if (result.data) {
            const { accessToken, refreshToken } = result.data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            const decodedToken = jwtDecode(accessToken);
            const userRole = decodedToken.role;
            localStorage.setItem('currentUserRole',userRole)

            updateRole(userRole);

            if (userRole === 'ROLE_JOB_SEEKER') {
                navigate('/');
            } else if (userRole === 'ROLE_RECRUITER') {
                navigate('/dashboard');
            } else if (userRole === 'ROLE_ADMIN') {
                navigate('/admin');
            }
        } else if (result.status === 403) {
            setError('Bạn vui lòng xác thực email!');
        } else if (result.error) {
            setError('Email hoặc mật khẩu của bạn không đúng!');
        }
    };
    const togglePasswordVisibility = (field) => {
        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="flex w-full min-h-screen bg-white">
                <div className="flex w-full md:w-1/2 justify-center p-14">
                    <div className="w-full max-w-md">
                        <h2 className="text-xl font-bold mb-2 text-green-500">Chào mừng bạn đã quay trở lại</h2>
                        <p className='text-base text-gray-400'>Cùng xây dựng một hồ sơ nổi bật và cơ hội việc làm lý tưởng</p>
                        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4 relative">
                                <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-5 text-gray-500" />
                                <input
                                    type="text"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-2 pl-10 border border-gray-300 rounded mt-2"
                                    placeholder="Nhập email"
                                    required
                                />
                            </div>
                            <div className="mb-4 relative">
                                <FontAwesomeIcon icon={faLock} className="absolute left-3 top-5 text-gray-500" />
                                <input
                                    type={showPassword.password ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full p-2 pl-10 border border-gray-300 rounded mt-2"
                                    placeholder="Nhập mật khẩu"
                                    required
                                />
                                <button type="button" onClick={() => togglePasswordVisibility('password')} className="absolute right-3 top-5">
                                    <FontAwesomeIcon icon={showPassword.password ? faEye : faEyeSlash} className="text-gray-500" />
                                </button>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                            >
                                Đăng nhập
                            </button>
                        </form>
                        <div className="flex items-center justify-center mt-6">
                            <span className="text-gray-600">Hoặc đăng nhập bằng</span>
                        </div>
                        <div className="flex justify-between mt-4">
                            <button
                                className="bg-red-500 text-white w-full py-2 mx-1 rounded-lg"
                                onClick={() => {
                                    window.location.href =
                                        "https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http%3A%2F%2Flocalhost%3A5173%2FloginGoogle&response_type=code&client_id=1019353721616-0u30ou5beb58p5av6qfo9lguhtnh7n1s.apps.googleusercontent.com&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+openid&access_type=offline";
                                }}
                            >
                                Google
                            </button>
                        </div>
                        <div className="mt-6 text-center">
                            <Link to={"/quen-mat-khau"} className="text-green-600">Quên mật khẩu?</Link>
                        </div>
                        <div className="mt-4 text-center">
                            <span className="text-gray-600">Chưa có tài khoản?</span>
                            <Link to={"/dang-ki"} className="text-green-600 ml-2">Đăng ký ngay</Link>
                        </div>
                    </div>
                </div>
                <div className="hidden md:flex w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/register.webp')" }}>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
