import {Server as SocketServer} from 'socket.io';
import socketAuthMidware from './middleware/authSocket.js';

export const connected_Users = {};
export const init_socket = (server) => {

    const io = new SocketServer(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    })

    io.use(socketAuthMidware);

    io.on('connection', (socket) => {
        console.log(`User '${socket.user.name}' Connected.`);

        connected_Users[socket.user._id] = socket;

        socket.on("disconnect", () => {

            console.log(`User '${socket.user.name}' Disconnected.`);

            delete connected_Users[socket.user._id];

        });
    });

    return io;

}