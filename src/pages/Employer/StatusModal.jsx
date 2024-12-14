import { Button } from "@mui/material";
import { useState } from "react";

const StatusModal = ({ isOpen, onClose, onSave }) => {
    const [selectedStatus, setSelectedStatus] = useState("");

    const handleSave = () => {
        if (selectedStatus) {
            onSave(selectedStatus);
            onClose();
        }
    };

    return (
        isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-xl shadow-lg w-80">
                    <h2 className="text-lg font-bold mb-4">Cập nhật trạng thái</h2>
                    <select
                        className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="" disabled>
                            Chọn trạng thái
                        </option>
                        <option value="PENDING">PENDING</option>
                        <option value="REJECTED">REJECTED</option>
                        <option value="ACCEPTED">ACCEPTED</option>
                        <option value="INTERVIEWING">INTERVIEWING</option>
                    </select>
                    <div className="flex justify-end gap-2">
                        <Button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg"
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                        >
                            Lưu
                        </Button>
                    </div>
                </div>
            </div>
        )
    );
};

export default StatusModal
