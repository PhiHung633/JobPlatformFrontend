import { useState } from 'react';
import { faLock, faEye, faEyeSlash, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from 'react-router-dom';

import { loginUser } from '../../utils/ApiFunctions';

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState({ password: false });
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState(null); // Thêm state để lưu thông báo lỗi

    const navigate=useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("")
        //console.log('Login data:', formData);
        
        const result = await loginUser(formData);
        console.log("Đây nè",result.error);
        if (result.data) {
            console.log('Login successful:', result.data);
            localStorage.setItem('accessToken', result.data.accessToken);
            localStorage.setItem('refreshToken', result.data.refreshToken);
            navigate('/');
        } else if (result.error) {
            setError('Email hoặc mật khẩu của bạn không đúng!');
        }else if(result.status==403){
            setError('Bạn vui lòng xác thực email!');
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
                            <button className="bg-red-500 text-white w-full py-2 mx-1 rounded-lg">Google</button>
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
