export const bindSocketAudioVideoEvents = (socket, io) => {
    socket.on("audio-video-button-pressed", () => {
        io.to(socket.handshake.session.partnerId).emit("audio-video-button-pressed");
    });

    socket.on("code-button-pressed", () => {
        io.to(socket.handshake.session.partnerId).emit("code-button-pressed");
    });

    socket.on("whiteboard-button-pressed", () => {
        io.to(socket.handshake.session.partnerId).emit("whiteboard-button-pressed");
    });

    socket.on("offer", payload => {
        io.to(payload.target).emit("offer", payload);
    });

    socket.on("answer", payload => {
        io.to(payload.target).emit("answer", payload);
    });

    socket.on("ice-candidate", incoming => {
        io.to(incoming.target).emit("ice-candidate", incoming.candidate);
    });

    socket.on("quit-call", incoming => {
        io.to(incoming.target).emit("quit-call");
    });
}