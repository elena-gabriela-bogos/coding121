document.getElementById("audioVideoButton").onclick = () => {
    socket.emit("audio-video-button-pressed");

    showVideoContainers();
    establishConnection(true);
}

document.getElementById("codeButton").onclick = () => {
    socket.emit("code-button-pressed");
    clearVideoAudioWindow();
}

document.getElementById("whiteboardButton").onclick = () => {
    socket.emit("whiteboard-button-pressed");
    clearVideoAudioWindow();
    showWhiteboard();
}

document.getElementById("closeSessionBtn").onclick = () => {
    socket.emit("close-button-pressed");
    window.location = "/login";
}

socket.on("code-button-pressed", (data) => {
    clearVideoAudioWindow();
    clearWhiteboardWindow();
});

socket.on("whiteboard-button-pressed", (data) => {
    //clearVideoAudioWindow();
    showWhiteboard();
});

socket.on("audio-video-button-pressed", (data) => {
    showVideoContainers();
    establishConnection(false);
});

socket.on("close-button-pressed", (data) => {
    clearVideoAudioWindow();
    axios.put("/api/session", {}).then((response) => {
        window.location = "/login";
    });
});