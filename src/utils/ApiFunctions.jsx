import axios from "axios"

export const api = axios.create({
    baseURL: "http://localhost:8080"
})

function getAccessToken() {
    return localStorage.getItem('accessToken');
}

function setAccessToken(token) {
    localStorage.setItem('accessToken', token);
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

// api.interceptors.response.use(
//     (response) => {
//         return response;
//     },
//     async (error) => {
//         const originalRequest = error.config;

//         if (error.response && error.response.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;

//             const refreshToken = localStorage.getItem('refreshToken');
//             if (!refreshToken) {
//                 console.error('No refresh token available');
//                 localStorage.removeItem('accessToken');
//                 localStorage.removeItem('refreshToken');
//                 window.location.href = '/dang-nhap';
//                 return Promise.reject(error);
//             }

//             try {
//                 const response = await refreshAccessToken(refreshToken);

//                 const newAccessToken = response.data.accessToken;
//                 setAccessToken(newAccessToken);

//                 originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

//                 return api(originalRequest);
//             } catch (refreshError) {
//                 console.error('Token refresh failed', refreshError);
//                 localStorage.removeItem('accessToken');
//                 localStorage.removeItem('refreshToken');
//                 window.location.href = '/dang-nhap';
//                 return Promise.reject(refreshError);
//             }
//         }

//         return Promise.reject(error);
//     }
// );

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

export async function signUpUser(signup) {
    try {
        const response = await api.post("/auth/signup", signup);
        return response.data;
    } catch (error) {
        console.log("Error", error.response.data)
        if (error.response && error.response.data) {
            throw error.response.data;
        } else {
            throw new Error(`User signup error: ${error.message}`);
        }
    }
}

export async function refreshAccessToken(refreshToken) {
    try {
        const response = await api.post('/auth/refresh-token', { refreshToken });
        return { data: response.data, error: null };
    } catch (error) {
        console.log('Refresh token error', error.response);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.status };
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


export async function fetchAllJobs(page = 0, size = 10, title = '', related = false, industry = '') {
    try {
        const params = { page, size };

        if (title) params.title = title;
        if (related !== false) params.related = related;
        if (industry) params.industry = industry;

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

export async function fetchAllCompanies(companyName = '') {
    try {
        const response = await api.get(`/companies`, {
            params: { companyName: companyName || undefined },
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

        const response = await api.get(`/users/${userId}/notifications`, { params });

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

