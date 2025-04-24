import axios from 'axios';
export default axios.create({
  baseURL: 'https://todo-api.onrender.com',   // change to your Render URL
});
