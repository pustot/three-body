import axios from 'axios'

const base_url = process.env.REACT_APP_ENV === 'development'?'http://localhost:5000/':'http://yangchnx.com:5000/';

export default axios.create({
  baseURL: base_url,
  responseType: 'json'
})