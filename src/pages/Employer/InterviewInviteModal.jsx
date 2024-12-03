import { useState, useEffect } from "react";
import { createInterviewInvitation, fetchInterviewInvitations, updateInterviewInvitation } from "../../utils/ApiFunctions";

const InterviewInviteModal = ({ isOpen, onClose, cv, onSuccess }) => {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [invitationId, setInvitationId] = useState(null);

    useEffect(() => {
        const fetchContent = async () => {
            if (isOpen && cv?.id) {
                setLoading(true);
                try {
                    const { data, error } = await fetchInterviewInvitations(cv.jobId, cv.userId);
                    if (error) {
                        console.error("Error fetching interview invitations:", error);
                    } else if (data && data.length > 0) {
                        const invitation = data.find((inv) => inv.id === cv.id);
                        if (invitation) {
                            setContent(invitation.content);
                            setInvitationId(invitation.id);
                        }
                    }
                } catch (err) {
                    console.error("Error fetching content:", err);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchContent();
    }, [isOpen, cv]);

    const handleSend = async () => {
        if (!content.trim()) {
            alert("Vui lòng nhập nội dung thư mời.");
            return;
        }

        try {
            if (invitationId) {
                const interviewInvitationDto = { content: content.trim() };
                const { data, error } = await updateInterviewInvitation(invitationId, interviewInvitationDto);
                if (error) {
                    alert("Cập nhật thư mời thất bại: " + error.message);
                    return;
                }
                alert("Thư mời đã được cập nhật thành công!");
                setInvitationId(null);
                onClose();
            } else {
                const interviewInvitationDto = {
                    applicationId: cv.id,
                    content: content.trim(),
                };
                const { data, error } = await createInterviewInvitation(interviewInvitationDto);
                if (error) {
                    alert("Gửi thư mời thất bại: " + error.message);
                    return;
                }
                alert("Thư mời đã được gửi thành công!");
                onClose();
            }
            setContent("");
            onClose();
            onSuccess();
        } catch (err) {
            console.error("Error handling interview invite:", err);
            alert("Đã xảy ra lỗi khi xử lý thư mời. Vui lòng thử lại.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
                <h2 className="text-lg font-bold mb-4">Gửi thư mời phỏng vấn</h2>
                {loading ? (
                    <p>Đang tải...</p>
                ) : (
                    <textarea
                        className="w-full h-32 border border-gray-300 rounded-lg p-2"
                        placeholder="Nhập nội dung thư mời..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                )}
                <div className="flex justify-end mt-4">
                    <button
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg mr-2"
                        onClick={onClose}
                    >
                        Hủy
                    </button>
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                        onClick={handleSend}
                        disabled={loading}
                    >
                        {invitationId ? "Sửa" : "Gửi"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InterviewInviteModal;
