let myId = document.getElementById("myId").innerHTML;
let partnerId = document.getElementById("partnerId").innerHTML;

document.getElementById("sendMessageBtn").onclick = () => {
    event.preventDefault();
    socket.emit('new_message', {
        content: document.getElementById("messageText").value,
        from: myId,
        to: partnerId
    });
    addMyMessage({content: document.getElementById("messageText").value, deliveredTime: Date.now()});
    document.getElementById("messageText").value = "";
};

getPreviousMessages(myId, partnerId, () => {

});

socket.on("new_message", (data) => {
    axios.post(`/api/message?user=${data.from}&user=${myId}`)
        .then((response) => {
            if (data.from == partnerId) {
                addOtherUsersMessage(data);
            }
        });
});

socket.on("start-session-request", (data) => {
    socket.emit("user-busy", {to: data.from});
});