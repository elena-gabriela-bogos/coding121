document.getElementById("audioVideoButton").onclick = () => {
    socket.emit("audio-video-button-pressed");

    showVideoContainers();
    establishConnection(true);
}

document.getElementById("codeButton").onclick = () => {
    socket.emit("code-button-pressed");
    clearVideoAudioWindow();
    showCodeEditor();
}

document.getElementById("whiteboardButton").onclick = () => {
    socket.emit("whiteboard-button-pressed");
    clearVideoAudioWindow(); 
    showWhiteboard();
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