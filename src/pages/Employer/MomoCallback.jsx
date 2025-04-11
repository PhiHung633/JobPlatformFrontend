import { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { handleMomoCallback } from "../../utils/ApiFunctions";

const MomoCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isProcessed = useRef(false);

  useEffect(() => {
    if (isProcessed.current) return;
    isProcessed.current = true;

    const params = Object.fromEntries(searchParams.entries());
    const orderId = params.orderId || "";

    const processCallback = async () => {
      try {
        const { data, error } = await handleMomoCallback(params);

        if (error) {
          alert(`Xử lý thanh toán thất bại: ${error.message || "Có lỗi xảy ra."}`);
        } else {
          alert("Xử lý thanh toán thành công!");
          console.log("Callback Response:", data);
          if(orderId.includes("PREMIUM"))
            navigate("/");
          else
            navigate("/dashboard/tao-cong-viec");
        }
      } catch (err) {
        console.error("Unexpected error in callback processing:", err);
        alert("Có lỗi xảy ra trong quá trình xử lý callback.");
      }
    };

    processCallback();
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg font-medium">Đang xử lý thanh toán...</p>
    </div>
  );
};

export default MomoCallback;
