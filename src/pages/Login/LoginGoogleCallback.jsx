import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { googleLogin } from "../../utils/ApiFunctions";

const LoginGoogleCallback = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const code = params.get("code");

        if (code) {
            handleGoogleLogin(code);
        } else {
            navigate("/");
        }
    }, [location, navigate]);

    const handleGoogleLogin = async (code) => {
        console.log("CODEEE",code)
        const result = await googleLogin(code);
        console.log("RESULtNE",result)
        if (result.data) {
            const { accessToken, refreshToken } = result.data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            const decodedToken = jwtDecode(accessToken);
            const userRole = decodedToken.role;
            console.log("UAKITA",userRole)
            localStorage.setItem('currentUserRole',userRole)

            if (userRole === 'ROLE_JOB_SEEKER') {
                navigate('/');
            } else if (userRole === 'ROLE_RECRUITER') {
                navigate('/dashboard');
            } else if (userRole === 'ROLE_ADMIN') {
                navigate('/admin');
            }
        } else if (result.status === 403) {
            console.log('Bạn vui lòng xác thực email!');
        } else if (result.error) {
            console.log('Không thể đăng nhập bằng Google. Vui lòng thử lại!');
        }
    };;

    return (
        <div className="flex justify-center items-center h-screen">
            <p>Đang xử lý đăng nhập Google...</p>
        </div>
    );
};

export default LoginGoogleCallback;
