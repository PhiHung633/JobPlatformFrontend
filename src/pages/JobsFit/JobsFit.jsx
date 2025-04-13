import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";


import ProfileManager from "../../components/ProfileManager/ProfileManager"
import SuitableJobs from "../../components/SuitableJobs/SuitableJobs"
import { fetchCvs, findBestJob } from "../../utils/ApiFunctions";

const JobsFit = () => {
    const [userId, setUserId] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [cvId, setCvId] = useState("");
    const [bestJobs, setBestJobs] = useState([]);
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserId(decodedToken.user_id);
        }
    }, []);
    useEffect(() => {
        if (!userId) return;
        const getCvsData = async () => {
            const response = await fetchCvs(userId, currentPage, 10);
            if (!response.error) {
                setCvId(response.data.cvs[0].id);
            } else {
                console.log("Error:", response.error);
            }
        };

        // const getUploadedCvs = async () => {
        //     const response = await fetchCvsFile(userId);
        //     console.log("rESSNE", response)
        //     if (!response.error) {
        //         setUploadedCvs(response.data.cvs || []);
        //     } else {
        //         console.log("Error fetching uploaded CVs:", response.error);
        //     }
        // };

        getCvsData();
        // getUploadedCvs();
    }, [userId, currentPage]);

    useEffect(() => {
        if (!cvId) return;
        const fetchBestJobs = async () => {
            const response = await findBestJob(cvId, 10);
            if (response.data) {
                setBestJobs(response.data);
            } else {
                console.log("Erorr finding best jobs", response.error);
            }
        }
        fetchBestJobs();
    }, [cvId]);
    return (
        <>
            <div className="bg-gray-100 min-h-screen w-full">
                <div className="container m-0 my-auto mx-auto px-4 py-8">
                    <div className="flex flex-wrap lg:flex-nowrap gap-4">
                        <div className="w-full lg:w-2/3">
                            <SuitableJobs bestJobs={bestJobs} />
                        </div>

                        <div className="w-full lg:w-1/3 ml-24">
                            <ProfileManager />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default JobsFit
