
import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: 'https://civic-server1.onrender.com',
    timeout: 5000
})

export default axiosInstance
