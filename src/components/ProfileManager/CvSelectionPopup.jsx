import { useEffect, useState } from "react";

const CVSelectionPopup = ({
    show,
    onClose,
    onNoNeed,
    onConfirm,
    cvOnline = [],
    cvUpload = [],
    onSelectionChange,
    resetSelection  
}) => {
    const [selectedCVs, setSelectedCVs] = useState({
        online: [],
        uploaded: [],
    });
    useEffect(() => {
        if (resetSelection) {
            setSelectedCVs({ online: [], uploaded: [] }); 
        }
    }, [resetSelection]);

    const handleCheckboxChange = (e, cvId, type) => {
        const isChecked = e.target.checked;
        setSelectedCVs((prev) => {
            const updatedList = isChecked
                ? [...prev[type], cvId]
                : prev[type].filter((id) => id !== cvId);
            const updatedState = { ...prev, [type]: updatedList };

            onSelectionChange(updatedState);

            return updatedState;
        });
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
                {/* Header */}
                <div className="bg-green-500 text-white rounded-t-lg p-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">Bật tìm việc ngay để không bỏ lỡ</h2>
                        <p className="text-sm">những cơ hội đặc biệt hấp dẫn</p>
                    </div>
                    <button
                        onClick={onNoNeed}
                        className="text-white hover:text-gray-200 text-xl font-bold"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <p className="text-sm text-gray-600">
                        Vui lòng lựa chọn các CV bạn muốn bật tìm việc <br />
                        Hoặc click "Tôi không có nhu cầu" để bỏ qua
                    </p>

                    {/* CV ONLINE Section */}
                    {cvOnline.length > 0 && (
                        <div className="border-t border-gray-200 pt-4">
                            <h3 className="font-semibold mb-2">CV ONLINE</h3>
                            {cvOnline.map((cv) => (
                                <div
                                    key={cv.id}
                                    className="flex items-center justify-between p-2 border border-gray-300 rounded-md"
                                >
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox h-4 w-4 text-green-500"
                                            onChange={(e) =>
                                                handleCheckboxChange(e, cv.id, "online")
                                            }
                                        />
                                        <div>
                                            <span className="text-sm">{cv.jobPosition}</span>
                                            <p className="text-xs text-gray-500">
                                                Cập nhật ngày: {new Date(cv.createdAt).toLocaleDateString('en-GB')}
                                            </p>
                                        </div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* CV UPLOAD Section */}
                    {cvUpload.length > 0 && (
                        <div className="border-t border-gray-200 pt-4">
                            <h3 className="font-semibold mb-2">CV UPLOAD</h3>
                            {cvUpload.map((cv) => (
                                <div
                                    key={cv.id}
                                    className="flex items-center justify-between p-2 border border-gray-300 rounded-md"
                                >
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox h-4 w-4 text-green-500"
                                            onChange={(e) =>
                                                handleCheckboxChange(e, cv.id, "uploaded")
                                            }
                                        />
                                        <div>
                                            <span className="text-sm">{cv.cvName}</span>
                                            <p className="text-xs text-gray-500">
                                                Cập nhật ngày: {new Date(cv.uploadedAt).toLocaleDateString('en-GB')}
                                            </p>
                                        </div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}

                    <p className="text-sm text-gray-600">
                        Khi bật tìm việc, bạn đồng thời cho phép NTD tìm kiếm và xem các CV đã chọn của mình.
                    </p>
                </div>

                {/* Footer */}
                <div className="flex justify-between bg-gray-100 p-4 rounded-b-lg">
                    <button
                        onClick={onNoNeed}
                        className="px-4 py-2 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400"
                    >
                        Tôi không có nhu cầu
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-green-500 text-white text-sm rounded-md hover:bg-green-600"
                    >
                        Bật tìm việc ngay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CVSelectionPopup;
