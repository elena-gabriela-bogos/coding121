import Message from "../domain/message";
import {v4 as uuidv4} from 'uuid';


export const bindSocketChatEvents = (socket, io) => {
    socket.on('new_message', (data) => {
        const newMessage = new Message(data);
        Message.create(newMessage, (err, messageId) => {
            if (err) {
                console.log(err);
            } else {
                io.to(data.to).emit('new_message', {
                    content: newMessage.content,
                    from: data.from,
                    deliveredTime: newMessage.deliveredTime
                });
            }
        });
    });

    socket.on('chat-opened', (data) => {
        socket.handshake.session.chatOpen = true;
        socket.handshake.session.chattingWith = data.chattingWith;
    });

    socket.on('chat-closed', () => {
        socket.handshake.session.chatOpen = false;
        socket.handshake.session.chattingWith = null;
    });
    socket.on('chat-history-opened', (data) => {
        socket.handshake.session.chatHistoryOpen = true;
    });

    socket.on('chat-history-closed', () => {
        socket.handshake.session.chatHistoryOpen = false;
    });

    socket.on('start-session-request', (data) => {
        if (data.to in io.sockets.adapter.rooms) {
            const roomId = uuidv4();
            socket.join(roomId);
            io.to(data.to).emit("start-session-request", {from: data.from, fromName: data.fromName, room: roomId});
        } else {
            io.to(data.from).emit("offline-user");
        }
    });
    socket.on('start-session-confirm', (data) => {
        socket.handshake.session.busy = true;
        socket.join(data.room);
        // console.log(io.sockets.adapter.rooms[data.room].sockets);
        io.to(data.to).emit("start-session-confirm", {room: data.room});
    });

    socket.on('start-session-refused', (data) => {
        io.to(data.to).emit("start-session-refused");
    });

    socket.on('session-request-cancelled', (data) => {
        io.to(data.to).emit("cancel-session-request");
    });

    socket.on("user-busy", (data) => {
        io.to(data.to).emit("user-busy");
    });
}