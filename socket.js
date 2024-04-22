import {Server as SocketServer} from 'socket.io';
import socketAuthMidware from './middleware/authSocket.js';
import { Conversation } from './db.js';

export const connectedUsers = {};
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

        connectedUsers[socket.user._id] = socket;

        socket.on("disconnect", () => {

            console.log(`User '${socket.user.name}' Disconnected.`);

            delete connectedUsers[socket.user._id];

        });

        socket.on("read_receipt", async (payload) => {

            // console.log("Received read receipt event!");

            if(!payload.convo_id) throw new Error("Conversation ID not provided");

            const convo = await Conversation.findById(payload.convo_id)

            if(!convo) throw new Error("Conversation not found");

            const msg = convo.messages.find((msg) => msg._id == payload.message._id)

            if(!msg) throw new Error("message not found");

            msg.read = true;

            convo._doc.messages = [...convo._doc.messages.filter((msg1) => msg1._id !== msg.id), msg];
            if(connectedUsers[payload.message.sender]) {
                connectedUsers[payload.message.sender].emit("message_read", {convo_id: payload.convo_id, message_id: payload.message._id});
            }

            await convo.save()

        });
    });

    return io;

}