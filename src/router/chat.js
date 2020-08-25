import Message from "../domain/message";

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
}