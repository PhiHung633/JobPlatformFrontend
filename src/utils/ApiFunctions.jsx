import axios from "axios"
import { param } from "jquery";

export const api = axios.create({
    baseURL: "https://jobplatformbackend.onrender.com"
})

function getAccessToken() {
    return localStorage.getItem('accessToken');
}

function setAccessToken(token) {
    localStorage.setItem('accessToken', token);
}

function getRefreshToken() {
    return localStorage.getItem('refreshToken');
}

function setRefreshToken(token) {
    return localStorage.setItem('refreshToken', token);
}

api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.request.use(
    (config) => {
        const publicUrls = ['/auth/login', '/auth/register', 'dang-ki-danh-cho-nha-tuyen-dung']; // Danh sách API công khai
        if (publicUrls.some((url) => config.url.includes(url))) {
            return config; // Bỏ qua nếu là API công khai
        }

        const token = getAccessToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

const publicPaths = [
    '/dang-nhap',
    '/dang-ki',
    '/dang-ki-danh-cho-nha-tuyen-dung',
    '/loginGoogle',
    '/',
    '/viec-lam',
    '/viec-lam/:id', // Placeholder cho dynamic routes
    '/cong-ti',
    '/cong-ti/:id',
    '/tim-viec-lam',
    '/tao-cv',
    '/auth/password-reset',
    '/auth/verify-email'
];

// Hàm kiểm tra nếu path hiện tại là công khai
function isPublicPath(pathname) {
    return publicPaths.some((publicPath) => {
        // Kiểm tra nếu có dynamic route (:id)
        const regex = new RegExp(`^${publicPath.replace(':id', '[^/]+')}$`);
        return regex.test(pathname);
    });
}

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Nếu lỗi 401 (Unauthorized) và chưa thử refresh token
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Đánh dấu đã retry

            const refreshToken = getRefreshToken();
            if (!refreshToken) {
                console.error('No refresh token available');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');

                // Nếu đường dẫn hiện tại không phải là công khai, chuyển hướng đến trang đăng nhập
                if (!isPublicPath(window.location.pathname)) {
                    window.location.href = '/dang-nhap';
                }
                return Promise.reject(error);
            }

            try {
                const response = await refreshAccessToken(refreshToken);
                const newAccessToken = response.data.accessToken;
                const newRefreshToken = response.data.refreshToken;

                setAccessToken(newAccessToken);
                setRefreshToken(newRefreshToken);

                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                console.error('Token refresh failed', refreshError);

                if (refreshError.response && refreshError.response.status === 401) {
                    console.error('Refresh token expired or invalid');
                }
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');

                // Nếu đường dẫn hiện tại không phải là công khai, chuyển hướng đến trang đăng nhập
                if (!isPublicPath(window.location.pathname)) {
                    window.location.href = '/dang-nhap';
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export async function loginUser(login) {
    try {
        const response = await api.post("/auth/login", login);
        if (response.status >= 200 && response.status < 300) {
            return { data: response.data, error: null };
        }
    } catch (error) {
        console.log("Error", error.response);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.status };
        }
    }
}

export async function verifyEmail(token) {
    try {
        const params = { token }
        const response = await api.get("/auth/verify-email", { params });
        if (response.status >= 200 && response.status < 300) {
            return { data: response.data, error: null };
        }
    } catch (error) {
        console.log("Error", error.response);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.status };
        }
    }
}

export async function resetPassword(payload) {
    try {
        const response = await api.post("/auth/reset-password", payload);
        if (response.status >= 200 && response.status < 300) {
            return { data: response.data, error: null };
        }
    } catch (error) {
        console.log("Error", error.response);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.status };
        }
    }
}

export async function signUpUser(signup) {
    try {
        const response = await api.post("/auth/signup", signup);
        return response.data;
    } catch (error) {
        console.log("Error", error.response.data)
        console.log("Error", error.response.data)
        if (error.response && error.response.data) {
            throw error.response.data;
        } else {
            throw new Error(`User signup error: ${error.message}`);
        }
    }
}

export async function changePassword(id, oldPassword, newPassword) {
    try {
        const payload = {
            oldPassword: oldPassword,
            newPassword: newPassword
        };

        const response = await api.post(`/users/${id}/change-password`, payload);

        return response.data;
    } catch (error) {
        console.log("Error", error.response ? error.response.data : error.message);

        if (error.response && error.response.data) {
            throw error.response.data;
        } else {
            throw new Error(`Change password error: ${error.message}`);
        }
    }
}

export async function refreshAccessToken(refreshToken) {
    try {
        const response = await api.post('/auth/refresh-token', { refreshToken });
        return { data: response.data, error: null };
    } catch (error) {
        console.error('Refresh token error', error.response);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        }
    }
}

export async function resetPasswordRequest(email) {
    try {
        const response = await api.post("/auth/reset-password-request", { email });
        if (response.status >= 200 && response.status < 300) {
            return { data: response.data, error: null };
        }
    } catch (error) {
        console.error("Error:", error.response);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        }
    }
}


export async function fetchAllJobs(page = 0, size = 10, title = '', related = false, industry = '', address = '') {
    try {
        const params = { page, size };

        if (title) params.title = title;
        if (related !== false) params.related = related;
        if (industry) params.industry = industry;
        if (address) params.address = address;
        params.status = "SHOW"

        const response = await api.get(`/jobs`, { params });

        const data = response.data;
        const totalPages = response.headers['x-total-pages'];
        const totalElements = response.headers['x-total-elements'];

        return {
            data,
            totalPages: parseInt(totalPages, 10),
            totalElements: parseInt(totalElements, 10),
            error: null
        };
    } catch (error) {
        console.log("Error fetching jobs", error.response);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        }
    }
}

export async function updateUser(id, userData) {
    try {
        const response = await api.patch(`/users/${id}`, userData);
        return { data: response.data, error: null };
    } catch (error) {
        console.log("Error updating user", error.response);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        }
    }
}

export async function fetchUserById(id) {
    try {
        const response = await api.get(`/users/${id}`);
        return { data: response.data, error: null };
    } catch (error) {
        console.log("Error fetching user by ID", error.response);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.status };
        }
    }
}

export async function fetchJobById(id) {
    try {
        const response = await api.get(`/jobs/${id}`);
        return { data: response.data, error: null };
    } catch (error) {
        console.log("Error fetching job by ID", error.response);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.status };
        }
    }
}

export async function fetchCompanyById(id) {
    try {
        const response = await api.get(`/companies/id/${id}`);
        return { data: response.data, error: null };
    } catch (error) {
        console.log("Error fetching company by ID", error.response);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        }
    }
}

export async function fetchJobsByCompany(id, page = 0, size = 10) {
    try {
        const params = { page, size };

        const response = await api.get(`/companies/${id}/jobs`, { params });

        const data = response.data;
        const totalPages = response.headers['x-total-pages'];
        const totalElements = response.headers['x-total-elements'];

        return {
            data,
            totalPages: parseInt(totalPages, 10),
            totalElements: parseInt(totalElements, 10),
            error: null
        };
    } catch (error) {
        console.log("Error fetching jobs by company", error.response || error);

        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        } else {
            return { data: null, error: "An unexpected error occurred", status: null };
        }
    }
}

export async function addJobSave(jobId) {
    try {
        const response = await api.post("/job-saves", null, {
            params: { jobId }
        });
        return { data: response.data, error: null };
    } catch (error) {
        console.log("Error adding job save", error.response);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        }
    }
}

export async function deleteJobSave(jobId) {
    try {
        await api.delete("/job-saves", {
            params: { jobId }
        });
        return { data: null, error: null };
    } catch (error) {
        console.log("Error deleting job save", error.response);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        }
    }
}

export async function fetchJobSavesByUser() {
    try {
        const response = await api.get("/job-saves");
        return { data: response.data, error: null };
    } catch (error) {
        console.log("Error fetching job saves", error.response);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        }
    }
}

export async function createCv(cvData) {
    try {
        const response = await api.post("/cvs", cvData);
        return { data: response.data, error: null };
    } catch (error) {
        console.log("Error creating CV", error.response);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        }
    }
}

export async function updateCv(id, cvData) {
    try {
        const response = await api.patch(`/cvs/${id}`, cvData);
        return { data: response.data, error: null };
    } catch (error) {
        console.log("Error updating CV", error.response);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        }
    }
}

export async function deleteCv(id) {
    try {
        const response = await api.delete(`/cvs/${id}`);
        return { data: response.data, error: null };
    } catch (error) {
        console.log("Error deleting CV", error.response);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        }
    }
}

export async function deleteCvUpload(id) {
    try {
        const response = await api.delete(`/uploadedCv/${id}`);
        return { data: response.data, error: null, status: response.status };
    } catch (error) {
        console.log("Error deleting CV", error.response || error.message);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        } else {
            return { data: null, error: "Unexpected error occurred", status: 500 };
        }
    }
}

export async function uploadCv(file, userId) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);

    try {
        const response = await api.post("/uploadedCv", formData, {
            headers: {

            },
        });
        return { data: response.data, error: null };
    } catch (error) {
        const errorMessage = error.response ? error.response.data : "Error uploading file";
        return { data: null, error: errorMessage, status: error.response?.status };
    }
}

export async function fetchCvs(userId = null, page = 0, size = 10) {
    try {
        const params = {
            page,
            size,
        };

        if (userId) {
            params.userId = userId;
        }

        const response = await api.get("/cvs", { params });

        const cvs = response.data;
        const totalPages = response.headers['x-total-pages'];
        const totalElements = response.headers['x-total-elements'];

        return {
            data: {
                cvs,
                totalPages: parseInt(totalPages),
                totalElements: parseInt(totalElements),
            },
            error: null,
        };
    } catch (error) {
        console.log("Error fetching CVs", error.response);
        if (error.response) {
            return {
                data: null,
                error: error.response.data,
                status: error.response.status,
            };
        }
    }
}

export async function fetchCvsFile(userId = null) {
    if (!userId) {
        return {
            data: null,
            error: "User ID is required",
            status: 400,
        };
    }

    try {
        const response = await api.get(`/uploadedCv`, { params: { userId } });
        const cvs = response.data;
        return {
            data: {
                cvs,
            },
            error: null,
        };
    } catch (error) {
        console.log("Error fetching CVs", error.response);
        if (error.response) {
            return {
                data: null,
                error: error.response.data,
                status: error.response.status,
            };
        } else {
            return {
                data: null,
                error: error.message || 'An unknown error occurred',
                status: 520,
            };
        }
    }
}

export async function getCv(id) {
    try {
        const response = await api.get(`/cvs/${id}`);
        return { data: response.data, error: null };
    } catch (error) {
        console.log("Error fetching CV", error.response);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        }
    }
}

export async function getCvFile(id) {
    try {
        const response = await api.get(`/uploadedCv/${id}`);
        return { data: response.data, error: null };
    } catch (error) {
        console.log("Error fetching CV file", error.response);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        }
    }
}

export async function addJob(jobData) {
    try {
        const response = await api.post("/jobs", jobData);
        return { data: response.data, error: null };
    } catch (error) {
        console.log("Error creating job", error.response);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        }
    }
}

export async function fetchJobs(userId, page = 0, size = 10, title = '', related = false) {
    try {
        const response = await api.get('/jobs', {
            params: { userId, page, size, title, related },
        });

        const data = response.data;
        const totalPages = response.headers['x-total-pages'];
        const totalElements = response.headers['x-total-elements'];

        return {
            data,
            totalPages: totalPages ? parseInt(totalPages) : 0,
            totalElements: totalElements ? parseInt(totalElements) : 0,
            error: null
        };
    } catch (error) {
        console.error("Error fetching jobs:", error.response);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        }
    }
}

export async function updateJob(id, jobData) {
    try {
        const response = await api.patch(`/jobs/${id}`, jobData);
        return { data: response.data, error: null };
    } catch (error) {
        console.log("Error updating job", error.response);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        }
    }
}

export async function addCompany(companyData) {
    try {
        const response = await api.post('/companies', companyData);
        return { data: response.data, error: null };
    } catch (error) {
        console.error("Error adding company", error.response);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        }
        return { data: null, error: error.message };
    }
}

export async function updateCompany(id, companyData) {
    try {
        const response = await api.patch(`/companies/${id}`, companyData);
        return { data: response.data, error: null };
    } catch (error) {
        console.log("Error updating company", error.response);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        }
    }
}

export async function getCompanies() {
    try {
        const response = await api.get("/companies"
        );
        console.log("RESSSS", response)
        return { data: response.data, error: null };
    } catch (error) {
        console.log("Error fetching companies", error.response);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        }
        return { data: null, error: error.message };
    }
}

export const getCompanyById = async (id) => {
    try {
        const response = await api.get(`/companies/${id}`);
        return { data: response.data, error: null };
    } catch (error) {
        console.error("Error fetching company", error.response);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        }
        return { data: null, error: error.message };
    }
};

export async function fetchAllCompanies(companyName = '', status = undefined) {
    try {
        const response = await api.get(`/companies`, {
            params: {
                companyName: companyName || undefined,
                status: status || undefined,
            },
        });
        return { data: response.data, error: null };
    } catch (error) {
        console.error("Error fetching companies", error);
        return {
            data: null,
            error: error.response?.data || 'An unexpected error occurred',
            status: error.response?.status || 500,
        };
    }
}

export async function uploadImage(file) {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await api.post("/uploadImage", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return { data: response.data, error: null };
    } catch (error) {
        const errorMessage = error.response ? error.response.data : "Error uploading image";
        return { data: null, error: errorMessage, status: error.response?.status };
    }
}

export async function addApplication(applicationData) {
    try {
        const response = await api.post("/applications", applicationData);

        return { data: response.data, error: null };
    } catch (error) {
        console.log("Error creating application", error.response);

        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        }

        return { data: null, error: error.message, status: null };
    }
}

export async function fetchApplications({ status, jobId, email, phone, name, recruiterId }) {
    try {
        const queryParams = new URLSearchParams();

        if (status) queryParams.append("status", status);
        if (jobId) queryParams.append("jobId", jobId);
        if (email) queryParams.append("email", email);
        if (phone) queryParams.append("phone", phone);
        if (name) queryParams.append("name", name);
        if (recruiterId) queryParams.append("recruiterId", recruiterId);


        const response = await api.get(`/applications?${queryParams.toString()}`);

        return { data: response.data, error: null };
    } catch (error) {
        console.error("Error fetching applications", error.response);

        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        }

        return { data: null, error: error.message, status: null };
    }
}

export async function updateApplicationStatus(id, status) {
    try {
        const response = await api.patch(`/applications/${id}`, { status });
        return { data: response.data, error: null };
    } catch (error) {
        console.log("Error updating application status", error.response);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        }
        return { data: null, error: "Unknown error occurred" };
    }
}

export async function createInterviewInvitation(interviewInvitationDto) {
    try {
        const response = await api.post("/interview-invitations", interviewInvitationDto);
        return { data: response.data, error: null };
    } catch (error) {
        console.log("Error creating interview invitation", error.response);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        }
    }
}

export async function fetchInterviewInvitations(jobId, userId) {
    try {
        const params = {};
        if (jobId) params.jobId = jobId;
        if (userId) params.userId = userId;

        const response = await api.get("/interview-invitations", { params });

        return { data: response.data, error: null };
    } catch (error) {
        console.log("Error fetching interview invitations", error.response);

        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        } else {
            return { data: null, error: error.message, status: null };
        }
    }
}

export async function updateInterviewInvitation(id, interviewInvitationDto) {
    try {
        const response = await api.patch(`/interview-invitations/${id}`, interviewInvitationDto);
        return { data: response.data, error: null };
    } catch (error) {
        console.log("Error updating interview invitation", error.response);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        }
    }
}

export async function addReview(reviewDto) {
    try {
        const response = await api.post("/reviews", reviewDto);
        return { data: response.data, error: null };
    } catch (error) {
        console.log("Error adding review", error.response);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        }
    }
}

export async function fetchAllReviews(jobId, page = 0, size = 10) {
    try {
        const response = await api.get(`/reviews`, {
            params: { jobId, page, size }
        });

        const data = response.data;
        const totalPages = response.headers['x-total-pages'];
        const totalElements = response.headers['x-total-elements'];

        return {
            data,
            totalPages: parseInt(totalPages, 10),
            totalElements: parseInt(totalElements, 10),
            error: null
        };
    } catch (error) {
        console.log("Error fetching reviews", error.response);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        }
    }
}

export async function updateReview(id, reviewDto) {
    try {
        const response = await api.patch(`/reviews/${id}`, reviewDto);
        return { data: response.data, error: null };
    } catch (error) {
        console.log("Error updating review", error.response);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        }
    }
}

export async function deleteReview(id) {
    try {
        await api.delete(`/reviews/${id}`);
        return { data: null, error: null };
    } catch (error) {
        console.log("Error deleting review", error.response);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        }
    }
}

export async function fetchNotifications(userId = null, page = 0, size = 10) {
    try {
        const params = {
            page,
            size,
        };

        if (userId) {
            params.id = userId;
        }
        console.log("USERID", userId)

        const response = await api.get(`users/${userId}/notifications`, { params });

        const notifications = response.data;
        const totalPages = response.headers['x-total-pages'];
        const totalElements = response.headers['x-total-elements'];

        return {
            data: {
                notifications,
                totalPages: parseInt(totalPages),
                totalElements: parseInt(totalElements),
            },
            error: null,
        };
    } catch (error) {
        console.log("Error fetching notifications", error.response);
        if (error.response) {
            return {
                data: null,
                error: error.response.data,
                status: error.response.status,
            };
        }
    }
}

export async function getAllUsers(page, size, role, email) {
    try {
        const response = await api.get('/users', {
            params: { page, size, role, email }
        });
        return { data: response.data, error: null, headers: response.headers };
    } catch (error) {
        console.log("Error fetching users data", error.response);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        }
    }
}

export async function getOverallStatistics(days) {
    try {
        const response = await api.get('/statistics/overall', {
            params: { days }
        });
        return { data: response.data, error: null };
    } catch (error) {
        console.log("Error fetching overall statistics", error.response);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        }
    }
}

export async function getTopJobsStatistics(days) {
    try {
        const response = await api.get('/statistics/top-5-industry-jobs', {
            params: { days }
        });
        return { data: response.data, error: null };
    } catch (error) {
        console.log("Error fetching top-5-industry-jobs statistics", error.response);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        }
    }
}

export async function getTopApplicationsStatistics(days) {
    try {
        const response = await api.get('/statistics/top-5-industry-applications', {
            params: { days }
        });
        return { data: response.data, error: null };
    } catch (error) {
        console.log("Error fetching top-5-industry-applications", error.response);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        }
    }
}

export async function getCountStatusApplications(days) {
    try {
        const response = await api.get('/statistics/application-status', {
            params: { days }
        });
        return { data: response.data, error: null };
    } catch (error) {
        console.log("Error fetching application status count", error.response);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        }
    }
}

export async function getDataThroughTime(days) {
    try {
        const response = await api.get('/statistics/statistic-by-time', {
            params: { days }
        });
        return { data: response.data, error: null };
    } catch (error) {
        console.log("Error fetching statistic", error.response);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        }
    }
}

export async function addFCMToken(FCMToken) {
    try {
        const response = await api.post('/users/fcm-token', { FCMToken });
        return { data: response.data, error: null };
    } catch (error) {
        console.log("Error adding FCM Token", error.response);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        }
    }
}

export async function updateStatusJobs(jobs, status) {
    const results = [];

    for (const job of jobs) {
        try {
            const response = await api.patch(`/jobs/${job}`, { "status": status });
            results.push({ jobId: job, data: response.data, error: null });
        } catch (error) {
            console.log("Error updating job status", error.response);

            results.push({
                jobId: job,
                data: null,
                error: error.response?.data || error.message,
                status: error.response?.status || 500,
            });
        }
    }

    return results;
}

export async function getAllJobs(page = 0, size = 10, title = '', related = false, status = true) {
    try {
        const response = await api.get(`/jobs`, {
            params: { page, size, title, related, status }
        });
        return { data: response.data, error: null, headers: response.headers };
    } catch (error) {
        console.log("Error fetching jobs", error.response);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        }
    }
}

export async function googleLogin(code) {
    try {
        const response = await api.get("/auth/google-login", {
            params: { code },
        });
        return { data: response.data, error: null };
    } catch (error) {
        console.log("Error login google ", error.response);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        }
        return { data: null, error: "Unexpected error", status: 500 };
    }
}

export async function processMomoPayment(paymentData) {
    try {
        const response = await api.post("/momo-payment", paymentData);
        
        return { data: response.data, error: null };
    } catch (error) {
        console.error("Error processing MoMo payment", error.response);
        
        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        }
        return { data: null, error: error.message, status: null };
    }
}

export async function handleMomoCallback(params) {
    try {
        const response = await api.get("/momo-payment/verify", { params });

        return { data: response.data, error: null };
    } catch (error) {
        console.error("Error processing MoMo callback", error.response);

        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        }
        return { data: null, error: "Unexpected error", status: 500 };
    }
}

export async function evaluateCv(id) {
    try {
        const response = await api.get(`/cvs/${id}/evaluation`);
        return { data: response.data, error: null };
    } catch (error) {
        console.log("Error fetching evaluation", error);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        } else {
            return { data: null, error: "Network Error", status: null };
        }
    }
}

export async function evaluateCvFile(id) {
    try {
        const response = await api.get(`/uploadedCv/${id}/evaluation`);
        return { data: response.data, error: null };
    } catch (error) {
        console.log("Error fetching evaluation", error);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        } else {
            return { data: null, error: "Network Error", status: null };
        }
    }
}
