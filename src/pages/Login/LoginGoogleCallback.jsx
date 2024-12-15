import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { addFCMToken, googleLogin } from "../../utils/ApiFunctions";
import { getToken } from "firebase/messaging";
import { messaging } from "../../utils/firebase";

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

    const requestNotificationPermission = async () => {
        try {
            // Check if the user has already granted permission
            const permission = Notification.permission;

            if (permission === "granted") {
                // If permission is granted, retrieve the token
                const currentToken = await getToken(messaging, {
                    vapidKey: "BH076IGPbTBV8Boh8I6vKX-7QpyT9OD4AQ0icfUxN7eUM7QEJ35F1Yk8qxFqHCeS9ftln3UsXR8rlduennz0kMQ",
                });
                if (currentToken) {
                    console.log("FCM Token:", currentToken);
                    await addFCMToken(currentToken)
                } else {
                    console.log("No registration token available. Request permission to generate one.");
                }
            } else if (permission === "default") {
                // Request permission if not explicitly granted or denied
                const permissionResult = await Notification.requestPermission();
                if (permissionResult === "granted") {
                    const currentToken = await getToken(messaging, {
                        vapidKey: "BH076IGPbTBV8Boh8I6vKX-7QpyT9OD4AQ0icfUxN7eUM7QEJ35F1Yk8qxFqHCeS9ftln3UsXR8rlduennz0kMQ",
                    });
                    console.log("FCM Token:", currentToken);
                    await addFCMToken(currentToken)
                } else {
                    console.warn("Notification permission not granted.");
                }
            } else {
                console.warn("Notifications are denied by the user.");
            }
        } catch (error) {
            console.error("Permission denied or error:", error);
        }
    };

    const handleGoogleLogin = async (code) => {
        console.log("CODEEE", code)
        const result = await googleLogin(code);
        console.log("RESULtNE", result)
        if (result.data) {
            const { accessToken, refreshToken } = result.data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            const decodedToken = jwtDecode(accessToken);
            const userRole = decodedToken.role;
            console.log("UAKITA", userRole)
            localStorage.setItem('currentUserRole', userRole)
            requestNotificationPermission();
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
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <p>Đang xử lý đăng nhập Google...</p>
        </div>
    );
};

export default LoginGoogleCallback;
