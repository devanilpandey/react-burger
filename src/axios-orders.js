import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://react-burger-app-701de.firebaseio.com/'
});

export default instance;