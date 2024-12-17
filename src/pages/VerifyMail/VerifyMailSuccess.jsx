import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios"; // Import axios for HTTP requests
import "./VerifyMailSuccess.css"; // Custom CSS for styling
import { verifyEmail } from "../../utils/ApiFunctions";

const VerifyMailSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [statusMessage, setStatusMessage] = useState("Đang xác minh email...");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");

    const verify = async () => {
      if (!token) {
        setStatusMessage("Token không hợp lệ hoặc không tồn tại.");
        return;
      }

      try {
        // Send the token to your server for verification
        const response = await verifyEmail(token);

        // Check response and update UI
        if (response.data.success) {
          setStatusMessage("Email của bạn đã được xác nhận thành công!");
          setIsSuccess(true);
        } else {
          setStatusMessage(response.data.message || "Xác minh thất bại. Token không hợp lệ.");
        }
      } catch (error) {
        console.error("Error verifying email:", error);
        setStatusMessage("Có lỗi xảy ra trong quá trình xác minh. Vui lòng thử lại sau.");
      }
    };

    verify(); // Call the verification function
  }, [searchParams]); // Run effect when the query parameters change

  const handleGoToLogin = () => {
    navigate("/dang-nhap"); // Navigate to the login page
  };

  return (
    <div className="success-container">
      <div className="success-message">
        <h2
          style={{
            color: isSuccess ? "green" : "red", // Green for success, red for failure
          }}
        >
          {isSuccess ? "Thành công!" : "Xác minh thất bại"}
        </h2>
        <p>{statusMessage}</p>
        <button className="success-button" onClick={handleGoToLogin}>
          Về trang đăng nhập
        </button>
      </div>
    </div>
  );
};

export default VerifyMailSuccess;
