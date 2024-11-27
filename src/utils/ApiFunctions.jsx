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

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await refreshAccessToken(refreshToken);

                const newAccessToken = response.data.accessToken;
                setAccessToken(newAccessToken);

                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                console.error('Token refresh failed', refreshError);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/dang-nhap';
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

export async function fetchAllJobs(page = 0, size = 10, title = '', related = false, status = true) {
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

export async function deleteJobs(jobs) {
    const results = [];

    for (const job of jobs) {
        try {
            await api.delete(`/jobs/${job}`);
            results.push({ jobId: job, error: null });
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

export async function updateUser(id, payload) {
    try {
        const response = await api.patch(`/users/${id}`, payload);
        return { data: response.data, error: null };
    } catch (error) {
        console.log("Error updating users data", error.response);
        if (error.response) {
            return { data: null, error: error.response.data, status: error.response.status };
        }
    }
}



