import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { FaSearch, FaSmile, FaPaperPlane, FaCheck } from "react-icons/fa";
import SockJS from "sockjs-client/dist/sockjs";
import Stomp from "stompjs";
import { jwtDecode } from "jwt-decode";
import { MoreVert } from "@mui/icons-material";
import { ClipLoader } from 'react-spinners';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { deleteMessage, fetchAllReceiver, fetchApplications, fetchChatMessages, fetchJobById, fetchUserById, updateMessage } from "../../utils/ApiFunctions";
import { useSearchParams } from "react-router-dom";


function formatDate(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

const Message = () => {
    const [input, setInput] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [messages, setMessages] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const emojiPickerRef = useRef(null);
    //const [stompClient, setStompClient] = useState(null);
    const [userId, setUserId] = useState("");
    const [email, setUserEmail] = useState("");
    const [applications, setApplications] = useState([]);
    const [role, setRole] = useState("");
    //const [selectedStatus, setSelectedStatus] = useState("Trạng thái");
    const stompClientRef = useRef(null);
    const [selectedMessageId, setSelectedMessageId] = useState(null);
    const [editingMessage, setEditingMessage] = useState(null);
    const [avatar, setAvatar] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [applicationsWithAvatar, setApplicationsWithAvatar] = useState([]);
    const menuRef = useRef(null);

    const toggleMenu = (messageId) => {
        setSelectedMessageId((prevId) => (prevId === messageId ? null : messageId));
    };
    const handleEmojiClick = (emoji) => {
        setInput((prev) => prev + emoji.emoji);
    };

    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        totalPages: 0,
        totalElements: 0,
        currentPage: 0,
    });
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoading1, setIsLoading1] = useState(false);
    const [isLoadingApplications, setIsLoadingApplications] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [searchParams] = useSearchParams();
    const targetEmailFromParam = searchParams.get("email");
    const targetUserIdFromParam = searchParams.get("userId");
    const hasInitializedChat = useRef(false);


    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setSelectedMessageId(null);
        }
    };

    // const filteredContacts = contacts.filter(contact => {
    //     const name = contact.recruiterName || contact.fullName || "";
    //     const company = contact.companyName || "";

    //     return (
    //         // (role === "ROLE_JOB_SEEKER" ? contact.companyName !== null : contact.companyName === null) &&
    //         (name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //             company.toLowerCase().includes(searchTerm.toLowerCase()))
    //     );
    // });

    useEffect(() => {
        setIsLoading1(true);

        setTimeout(() => {
            const filtered = contacts.filter(contact => {
                const name = contact.recruiterName || contact.fullName || "";
                const company = contact.companyName || "";

                return (
                    name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    company.toLowerCase().includes(searchTerm.toLowerCase())
                );
            });

            setFilteredContacts(filtered);
            console.log(filtered)
            setIsLoading1(false);
        }, 300);

    }, [contacts, searchTerm]);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserId(decodedToken.user_id);
            setUserEmail(decodedToken.sub);
            setRole(decodedToken.role);
        }
    }, []);

    useEffect(() => {
        const loadMessages = async () => {
            setIsLoading(true);
            console.log("DAYMAPHAIKO", currentChat)
            const targetEmail = role === "ROLE_JOB_SEEKER"
                ? currentChat.recruiterEmail ?? currentChat.email
                : currentChat.email;
            const { data, error, headers } = await fetchChatMessages(email, targetEmail, 0, 10);
            if (error) {
                setError(error);
            } else {
                setMessages(data);
                setPagination({
                    totalPages: parseInt(headers['x-total-pages']),
                    totalElements: parseInt(headers['x-total-elements']),
                    currentPage: 0,
                });
                setHasMore(data.length > 0);
            }
            setIsLoading(false);
        };
        loadMessages();
    }, [email, currentChat, role]);

    const loadMoreMessages = async () => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);
        const nextPage = pagination.currentPage + 1;
        const targetEmail = role === "ROLE_JOB_SEEKER" ? currentChat.recruiterEmail ?? currentChat.email : currentChat.email;
        const { data, error } = await fetchChatMessages(email, targetEmail, nextPage, 10);
        if (error) {
            setError(error);
        } else {
            setMessages((prev) => [...prev, ...data]);
            setPagination((prev) => ({
                ...prev,
                currentPage: nextPage,
            }));
            setHasMore(data.length > 0);
        }
        setIsLoading(false);
    };

    // Xử lý sự kiện cuộn
    const handleScroll = (e) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 10;
        if (bottom) {
            loadMoreMessages();
        }
    };

    useEffect(() => {
        const getApplications = async () => {
            if (!role) return;

            setIsLoadingApplications(true);
            // Xác định tham số API dựa trên role
            const params = role === "ROLE_JOB_SEEKER"
                ? { email: email }
                : { recruiterId: userId };

            const { data, error } = await fetchApplications(params);

            if (error) {
                setError(error);
            } else {
                console.log("DATA", data);

                if (role === "ROLE_RECRUITER") {
                    const enrichedData = await Promise.all(
                        data.map(async (cv) => {
                            let userInfo = {};
                            let jobInfo = {};

                            const userResult = await fetchUserById(cv.userId);
                            userInfo = userResult.data
                                ? {
                                    name: userResult.data.fullName,
                                    email: userResult.data.email,
                                    phone: userResult.data.phone,
                                }
                                : {};

                            const jobResult = await fetchJobById(cv.jobId);
                            jobInfo = jobResult.data
                                ? {
                                    position: jobResult.data.title || "Không xác định",
                                }
                                : { position: "Không xác định" };

                            return {
                                ...cv,
                                ...userInfo,
                                ...jobInfo,
                            };
                        })
                    );

                    console.log("ENRICHED DATA", enrichedData);
                    setApplications(enrichedData);
                } else {
                    console.log("CHINHLANO", data)
                    setApplications(data);
                }
            }
            setIsLoadingApplications(false);
        };

        getApplications();
    }, [role, email, userId]);

    useEffect(() => {
        if (!email) return;

        const loadContacts = async () => {
            const { data, error } = await fetchAllReceiver();
            console.log("UAKITA", data)
            if (error) {
                setError(error);
            } else {
                console.log("DAYLACON", data)
                setAvatar(data.avatarUrl || data.companyImage)
                console.log("DUNGMATA", avatar)
                setContacts(data || []);
            }
        };

        loadContacts();
    }, [email]);

    useEffect(() => {
        const initChat = async () => {
            if (!targetEmailFromParam || !targetUserIdFromParam || hasInitializedChat.current) return;

            hasInitializedChat.current = true;//

            const foundInContacts = contacts.find(
                (c) => c.email === targetEmailFromParam || c.recruiterEmail === targetEmailFromParam
            );
            if (foundInContacts) {
                setCurrentChat(foundInContacts);
                return;
            }

            const foundInApplications = applicationsWithAvatar.find(
                (c) => c.email === targetEmailFromParam || c.recruiterEmail === targetEmailFromParam
            );
            if (foundInApplications) {
                setContacts((prev) => {
                    if (!prev.some((c) => c.email === foundInApplications.email)) {
                        return [...prev, foundInApplications];
                    }
                    return prev;
                });
                setCurrentChat(foundInApplications);
                return;
            }

            const res = await fetchUserById(targetUserIdFromParam);
            if (res.data) {
                const tempContact = {
                    id: res.data.id,
                    email: res.data.email,
                    fullName: res.data.fullName,
                    avatarUrl: res.data.avatarUrl,
                };
                setContacts((prev) => {
                    if (!prev.some((c) => c.email === tempContact.email)) {
                        return [...prev, tempContact];
                    }
                    return prev;
                });
                setCurrentChat(tempContact);
            } else {
                toast.error("Không tìm thấy người dùng để bắt đầu cuộc trò chuyện.");
            }
        };

        initChat();
    }, [contacts, applicationsWithAvatar, targetEmailFromParam, targetUserIdFromParam]);


    useEffect(() => {
        function handleClickOutside(event) {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (stompClientRef.current) return;

        const token = localStorage.getItem('accessToken');
        const socket = new SockJS(`http://localhost:8080/ws?token=${token}`);
        // const socket = new SockJS(`https://jobplatformbackend.onrender.com/ws?token=${token}`);
        const client = Stomp.over(socket);

        client.connect({}, () => {
            console.log("Connected to WebSocket");

            client.subscribe("/user/queue/messages", (msg) => {
                const receivedMessage = JSON.parse(msg.body);
                const formattedMessage = {
                    id: receivedMessage.id || crypto.randomUUID(),
                    sender: receivedMessage.sender || "",
                    receiver: receivedMessage.receiver || "",
                    content: receivedMessage.content,
                    time: receivedMessage.time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    deletedAt: receivedMessage.deletedAt ?? null,
                };
                setMessages((prev) => [...prev, formattedMessage]);
                // toast.info(`📩 Tin nhắn mới từ ${receivedMessage.sender} với nội dung: ${receivedMessage.content}`, {
                //     position: "top-right",
                //     autoClose: 5000,
                //     hideProgressBar: false,
                //     closeOnClick: true,
                //     pauseOnHover: true,
                //     draggable: true,
                //     progress: undefined,
                // });
            });
        });

        stompClientRef.current = client; // Lưu client vào useRef

        return () => {
            if (stompClientRef.current && stompClientRef.current.connected) {
                console.log("Disconnecting WebSocket");
                stompClientRef.current.disconnect();
                stompClientRef.current = null;
            }
        };
    }, []);

    const handleSendMessage = () => {
        if (!stompClientRef.current || !currentChat || input.trim() === "") return;

        const tempId = crypto.randomUUID();

        const chatMessage = {
            id: tempId,
            receiver: role === "ROLE_JOB_SEEKER" ? currentChat.recruiterEmail ?? currentChat.email : currentChat.email,
            content: input,
            sender: email,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            deletedAt: null,
        };

        // Gửi tin nhắn qua WebSocket
        stompClientRef.current.send("/app/chat", {}, JSON.stringify(chatMessage));

        // Thêm tin nhắn vào state
        setMessages((prev) => [...prev, chatMessage]);

        // Reset input
        setInput("");
    };

    const handleStartChat = (company) => {
        const isEmailExists = contacts.some((c) => c.email === company.recruiterEmail);

        if (!isEmailExists) {
            setAvatar(company.avatarUrl || company.companyImage)
            setContacts([...contacts, company]);
        }
        setCurrentChat(company);
    };

    const handleDeleteMessage = async (id) => {
        const response = deleteMessage(id);
        if (!response.error) {
            setMessages((prevMessages) => prevMessages.filter((msg) => msg.id != id));
            setSelectedMessageId(null);
        } else {
            console.log("Lỗi xóa tin nhắn", response.error);
        }
    }

    // const handleEditMessage = (msg) => {
    //     setEditingMessage(msg);
    //     setInput(msg.content);
    // }

    const handleUpdateMessage = async () => {
        if (!editingMessage) return;

        const response = await updateMessage(editingMessage.id, input);

        // if (response.error) {
        //     console.error("Failed to update message:", error);
        //     return;
        // }
        if (response) {
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === editingMessage.id ? { ...msg, content: input } : msg
                )
            );

            setEditingMessage(null);
            setInput("");
        }
    };
    useEffect(() => {
        const fetchApplications = async () => {
            const emailMap = new Map();
            const filtered = [];

            applications.forEach((company) => {
                if (role === "ROLE_JOB_SEEKER") {
                    if (!emailMap.has(company.recruiterEmail)) {
                        emailMap.set(company.recruiterEmail, true);
                        filtered.push(company);
                    }
                } else {
                    const key = `${company.email}-${company.jobId}`;
                    if (!emailMap.has(key)) {
                        emailMap.set(key, true);
                        filtered.push(company);
                    }
                }
            });

            if (role === "ROLE_RECRUITER") {
                const enriched = await Promise.all(
                    filtered.map(async (app) => {
                        const res = await fetchUserById(app.userId);
                        return {
                            ...app,
                            avatarUrl: res.data?.avatarUrl || "", // fallback rỗng
                        };
                    })
                );
                setApplicationsWithAvatar(enriched);
            } else {
                setApplicationsWithAvatar(filtered);
            }
        };

        fetchApplications();
    }, [applications, role]);


    console.log("UADAYMA", role)
    return (
        <div className="flex h-[650px] bg-white">
            {/* Sidebar */}
            <div className="w-1/4 bg-white-200 p-4 border-r h-[650px]">
                <div className="flex items-center mb-4 bg-white p-2 border rounded-full">
                    <FaSearch className="text-gray-500 ml-2" />
                    <input
                        type="text"
                        placeholder="Tìm công ty, tên nhà tuyển dụng..."
                        className="w-full p-2 border-none outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="mt-5">
                    <h2 className="font-bold">
                        {role === "ROLE_JOB_SEEKER" ? "Nhà tuyển dụng " : "Ứng viên "}
                    </h2>
                    {isLoading1 ? <ClipLoader color="#4caf50" size={40} />
                        : filteredContacts
                            .map((contact) => (
                                <div
                                    key={contact.id}
                                    className="flex items-center gap-2 mt-2 cursor-pointer"
                                    onClick={() => setCurrentChat(contact)}
                                >
                                    <img
                                        src={role === "ROLE_JOB_SEEKER" ? contact.companyImage : contact.avatarUrl}
                                        alt="Avatar"
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-bold">{contact.recruiterName || contact.fullName}</span>
                                        <span className="text-gray-400">{role === "ROLE_JOB_SEEKER" ? contact.companyName : contact.email}</span>
                                    </div>
                                </div>
                            ))
                    }
                </div>
            </div>

            {/* Chat Section */}
            <div className="flex flex-col border-r flex-1 h-[650px]">
                {currentChat ? (
                    <>
                        {/* Header của trang chat */}
                        <div className="p-4 bg-white border-b flex gap-4">
                            <img src={role === "ROLE_JOB_SEEKER" ? currentChat.companyImage : currentChat.avatarUrl} alt="Avatar" className="w-12 h-12 rounded-full object-cover" />
                            <div>
                                <p className="font-bold">{currentChat.recruiterName || currentChat.fullName}</p>
                                <p className="text-sm text-gray-300">{currentChat.companyName}</p>
                            </div>
                        </div>

                        {/* Danh sách tin nhắn */}
                        <div className="flex-1 p-4 overflow-auto overflow-x-hidden" onScroll={handleScroll}>
                            {messages
                                .filter((msg) =>
                                    (msg.deletedAt === null) &&
                                    ((msg.sender === email && msg.receiver === (role === "ROLE_JOB_SEEKER" ? currentChat.recruiterEmail ?? currentChat.email : currentChat.email)) ||
                                        (msg.sender === (role === "ROLE_JOB_SEEKER" ? currentChat.recruiterEmail ?? currentChat.email : currentChat.email) && msg.receiver === email))
                                )
                                .map((msg) => (
                                    <div key={msg.id} className={`mb-4 flex ${msg.sender === email ? "justify-end" : "items-end"}`}>
                                        {msg.sender !== email && (
                                            <img src={role === "ROLE_JOB_SEEKER" ? currentChat.companyImage : currentChat.avatarUrl || avatar} alt="avatar" className="w-10 h-10 rounded-full mr-2" />
                                        )}
                                        <div className="relative group">
                                            <div className={`p-3 rounded-xl max-w-md ${msg.sender === email ? "bg-green-200" : "bg-gray-100"}`}>
                                                <p>{msg.content}</p>
                                            </div>
                                            {msg.sender === email && (
                                                <button
                                                    onClick={() => toggleMenu(msg.id)}
                                                    className="absolute top-1/2 left-[-40px] transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                                                >
                                                    <MoreVert />
                                                </button>
                                            )}
                                            {selectedMessageId === msg.id && (
                                                <div ref={menuRef} className="absolute top-full right-0 mt-2 w-32 bg-gray-800  text-white rounded-lg shadow-lg text-sm z-10">
                                                    <button onClick={() => handleDeleteMessage(msg.id)} className="block w-full px-4 py-2 hover:bg-gray-700">Xóa</button>
                                                    {/* <button onClick={() => handleEditMessage(msg)} className="block w-full px-4 py-2 hover:bg-gray-700">Chỉnh sửa</button> */}
                                                </div>
                                            )}
                                            <span className="absolute left-1/2 -translate-x-1/2 z-50 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-100">
                                                {msg.time || new Date(new Date(msg.createdAt).getTime() + 7 * 60 * 60 * 1000).toLocaleString("vi-VN")}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            {isLoading && <p className="text-center text-gray-500">Đang tải...</p>}
                        </div>

                        {/* Input */}
                        <div className="relative p-4 border-t bg-white flex items-center">
                            <button className="mr-2 text-green-500 text-2xl relative" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                                <FaSmile />
                            </button>
                            {showEmojiPicker && (
                                <div ref={emojiPickerRef} className="absolute bottom-12 left-0 bg-white shadow-lg border rounded-lg z-10">
                                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                                </div>
                            )}
                            <input
                                type="text"
                                className="flex-1 p-2 border rounded-lg outline-none"
                                placeholder="Nhập tin nhắn..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && (editingMessage ? handleUpdateMessage() : handleSendMessage())}
                            />
                            {editingMessage ? (
                                <button className="ml-2 text-green-500 text-2xl" onClick={handleUpdateMessage}>
                                    <FaCheck />
                                </button>
                            ) : (
                                <button className="ml-2 text-green-500 text-2xl" onClick={handleSendMessage}>
                                    <FaPaperPlane />
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400">{role === "ROLE_JOB_SEEKER" ? " Chọn một công ty để bắt đầu nhắn tin " : "Chọn một ứng viên để bắt đầu nhắn tin"}</div>
                )}
            </div>

            {/* Applied Jobs */}
            <div className="w-1/4 bg-white p-4 border-r h-[650px]">
                <h2 className="font-bold mb-4">
                    {role === "ROLE_JOB_SEEKER" ? "TIN TUYỂN DỤNG ĐÃ ỨNG TUYỂN" : "ỨNG VIÊN ĐÃ ỨNG TUYỂN"}
                </h2>
                <div className="space-y-4">
                    {isLoadingApplications ? (
                        <div className="flex justify-center items-center">
                            <ClipLoader color="#4caf50" size={40} />
                        </div>
                    ) : (
                        applicationsWithAvatar.map((company) => (
                            <div
                                key={company.id}
                                className="flex items-center gap-3 bg-gray-100 p-2 rounded-lg"
                            >
                                <img
                                    src={
                                        role === "ROLE_JOB_SEEKER"
                                            ? company.companyImage
                                            : company.avatarUrl || "/default-avatar.png"
                                    }
                                    alt="Avatar"
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div className="flex flex-col flex-1">
                                    <span className="font-bold text-sm truncate max-w-[120px] block">
                                        {role === "ROLE_JOB_SEEKER"
                                            ? company.recruiterName
                                            : company.name}
                                    </span>
                                    <span className="text-gray-500 text-xs truncate max-w-[120px] block">
                                        {role === "ROLE_JOB_SEEKER"
                                            ? company.companyName
                                            : company.position}
                                    </span>
                                </div>
                                <button
                                    className="text-green-500 border bg-green-100 border-green-500 px-3 py-1 rounded-full text-xs"
                                    onClick={() => handleStartChat(company)}
                                >
                                    Nhắn tin
                                </button>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
};
export default Message;
