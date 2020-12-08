import io from "socket.io-client";
import Cookies from "js-cookie";

// this creates a single socket instance so that the client is only ever makes a connection one time even if this variable is imported in multiple files
// that said, if the user opens the program in two seperate windows or tabs, they will make two connections which is not ideal
let socket = io(process.env.REACT_APP_SOCKET_STRING, {
    withCredentials: true,
    extraHeaders: {
        "my-custom-header": "abcd"
    },
    query: {
        username: Cookies.get('username')
    }
});

export default socket;