export const bindSocketAudioVideoEvents = (socket, io) => {
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