import axios from 'axios'

const API_BASE_URL = 'https://codeb-ims.onrender.com/api'

export const registerUser = async (formData) => {
  return await axios.post(`${API_BASE_URL}/register`, formData)
}
