import { useState, useEffect } from "react";
import HistoryApplies from "../../components/HistoryApplies/HistoryApplies";
import ProfileManager from "../../components/ProfileManager/ProfileManager";
import { fetchApplications } from "../../utils/ApiFunctions";
import { jwtDecode } from "jwt-decode";

const getEmailFromToken = () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            return decodedToken.sub;
        } catch (error) {
            console.error("Token invalid or expired", error);
            return null;
        }
    }
    return null;
};

const JobApplied = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("Trạng thái");

    const getApplications = async (status) => {
        setLoading(true);
        setError(null);

        try {
            const email = getEmailFromToken();
            if (!email) {
                setError("Không tìm thấy email từ token!");
                setLoading(false);
                return;
            }

            const { data, error } = await fetchApplications({
                email: email,
                status: status !== "Trạng thái" ? status : undefined,
            });

            if (data) {
                setApplications(data);
            } else {
                setError(error);
            }
        } catch (err) {
            setError(err.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getApplications(selectedStatus);
    }, [selectedStatus]);

    return (
        <div className="bg-gray-100 min-h-screen w-full">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-wrap lg:flex-nowrap gap-4">
                    <div className="w-full lg:w-2/3">
                        <HistoryApplies
                            applications={applications}
                            loading={loading}
                            error={error}
                            onStatusChange={setSelectedStatus}
                        />
                    </div>
                    <div className="w-full lg:w-1/3 ml-24">
                        <ProfileManager />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobApplied;

