export const bindSocketButtonEvents = (socket, io) => {
    socket.on("audio-video-button-pressed", () => {
        io.to(socket.handshake.session.partnerId).emit("audio-video-button-pressed");
    });

    socket.on("code-button-pressed", () => {
        io.to(socket.handshake.session.partnerId).emit("code-button-pressed");
    });

    socket.on("whiteboard-button-pressed", () => {
        io.to(socket.handshake.session.partnerId).emit("whiteboard-button-pressed");
    });
}