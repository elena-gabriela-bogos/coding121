document.getElementById("audioVideoButton").onclick = () => {
    socket.emit("audio-video-button-pressed");

    showVideoContainers();
    establishConnection(true);
}

document.getElementById("codeButton").onclick = () => {
    socket.emit("code-button-pressed");

    clearVideoAudioWindow();
}

document.getElementById("click_whiteboard").onclick = () => {
    socket.emit("whiteboard-button-pressed");

    clearVideoAudioWindow();
}

socket.on("code-button-pressed", (data) => {
    clearVideoAudioWindow();
});

socket.on("whiteboard-button-pressed", (data) => {
    clearVideoAudioWindow();
});

socket.on("audio-video-button-pressed", (data) => {
    showVideoContainers();
    establishConnection(false);
});