import axios from 'axios'

const axiosClient = axios.create({
    baseURL: 'http://localhost:8080/api/v1/',
    headers: {
        "Content-Type": 'application/json',
    }
})

axiosClient.interceptors.request.use((config) => {
  // Please patse access token here
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZjQyMDdiZWFkYzAzYzI0ODA3NTk5NSIsImlhdCI6MTcyNzI4ODQyMywiZXhwIjoxNzI3MjkyMDIzfQ.E1j6WF2aqyFtOoA7YeTl8oqx5uKyMk9G7tlCISfJgrk"; 
  
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  
    return config;
  });

export default axiosClient;