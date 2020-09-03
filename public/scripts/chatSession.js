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

getPreviousMessages(partnerId, myId, () => {

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

const profilePicture = document.getElementById("profile_picture");
axios.get(`/api/user/${partnerId}`)
    .then((response) => {
        let picture = response.data[0].picture;
        if (picture) {
            profilePicture.innerHTML += `<img class="profile_icon_chat" src="${picture}" style="height: 2rem;width: 2rem"/>`;
        } else {
            profilePicture.innerHTML += '<img class="profile_icon_chat background_color_icon" style="height: 2rem;width: 2rem"/>';
        }
    })