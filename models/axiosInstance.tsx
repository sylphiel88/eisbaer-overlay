import axios from "axios";

const HEADERS = {
    "Access-Control-Allow-Origin":"*",
    "Content-Type":"application/json",
    "withCredentials":"true"
}

export default axios.create({
    headers:HEADERS
})