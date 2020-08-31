var otherUser, myInfo, waitingAlert, confirmStartSession, session;

document.getElementById("chatHistoryContainer").style.display = "none";

// MANAGE CHAT WINDOW

const setChatPartnerProfile = (data) => {
    const chatProfile = document.getElementById("chatProfile");
    document.getElementById("profileName").innerHTML = data.name;
    document.getElementById("userChatId").innerHTML = data.id;
    otherUser = {id: data.id, name: data.name};
}

const openChatWindow = (id) => {
    closeChatWindow();
    axios.get(`/api/user/${id}`)
        .then(function (response) {
            document.getElementById("chat").style.display = "block";
            setChatPartnerProfile(response.data[0]);
            socket.emit("chat-opened", {chattingWith: response.data[0].id});

            const myId = document.getElementById("myId").innerHTML;
            getPreviousMessages(id, myId, updateHistoryWindow);
        })
        .catch(function (error) {
            console.log(error);
        });
};

function closeChatWindow() {
    document.getElementById("chat").style.display = "none";
    document.getElementById("userChatId").innerHTML = "";
    document.getElementById("messageText").innerHTML = "";
    document.getElementById("messagesContainer").innerHTML = "";
    socket.emit("chat-closed");
}


// MANAGE CHAT HISTORY WINDOW

const formatProfile = (profile) => {
    const date = Math.round(moment.duration(Date.now() - profile[1]["date"]).asDays());
    return `<div class="profile_chat_container" onclick="openChatWindow(${profile[0]})">
                    <img class="profile_icon_chat background_color_icon"/>
                    <span id="profile${profile[0]}" class="profile_name">${profile[1]["name"]}
                    <div class="message_date" style="font-size: 1rem">${date} days ago</div></span>                  
                  </div>`;
}

const displayProfiles = (profiles) => {
    profiles.forEach(profile => {
        const result = formatProfile(profile);
        document.getElementById("chatHistoryContainer").innerHTML += result;
    });
}

const openChatHistory = () => {
    const chatHistoryProfiles = document.getElementById("chatHistoryContainer");
    chatHistoryProfiles.innerHTML = "";
    axios.get(`/api/message/history`)
        .then(function (response) {
            chatHistoryProfiles.style.display = "block";
            displayProfiles(response.data);

            getConversationsWithUnreadMessages((data) => {
                document.getElementById("chatHistoryVisible").innerHTML = `(${data.length}) Chat`;
                data.forEach(c => {
                    document.getElementById(`profile${c[0]}`).style.fontWeight = "bold";
                });
            })
        })
        .catch(function (error) {
            console.log(error);
        });
}

const closeChatHistory = () => {
    const chatHistoryProfiles = document.getElementById("chatHistoryContainer");
    chatHistoryProfiles.style.display = "none";
    chatHistoryProfiles.innerHTML = "";
}

const getConversationsWithUnreadMessages = (result) => {
    axios.get(`/api/message?status=unread`)
        .then(function (response) {
            result(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
};

const updateHistoryWindow = () => {
    if (document.getElementById("chatHistoryContainer").style.display !== "none") {
        openChatHistory();
    } else {
        getConversationsWithUnreadMessages((data) => {
            document.getElementById("chatHistoryVisible").innerHTML = `(${data.length}) Chat`;
        });
    }
}


// SET EVENT HANDLERS

document.getElementById("sendMessageBtn").onclick = () => {
    event.preventDefault();
    socket.emit('new_message', {
        content: document.getElementById("messageText").value,
        from: document.getElementById("myId").innerHTML,
        to: document.getElementById("userChatId").innerHTML
    });
    addMyMessage({content: document.getElementById("messageText").value, deliveredTime: Date.now()});
    document.getElementById("messageText").value = "";
    if (document.getElementById("chatHistoryContainer").style.display !== "none") {
        openChatHistory();
    }
};

document.getElementById("chatHistoryVisible").onclick = () => {
    const chatHistoryProfiles = document.getElementById("chatHistoryContainer");
    if (chatHistoryProfiles.style.display === "none") {
        socket.emit("chat-history-opened");
        openChatHistory();
    } else {
        closeChatHistory();
        socket.emit("chat-history-closed");
    }
}

const startSessionHandler = () => {
    event.preventDefault();
    const data = {
        to: document.getElementById("userChatId").innerHTML,
        from: document.getElementById("myId").innerHTML,
        fromName: myInfo.name
    };
    socket.emit("start-session-request", data);
    waitingAlert = $.alert({
        content: `Waiting for ${otherUser.name} to reply...`,
        buttons: {
            Cancel: function () {
                socket.emit("session-request-cancelled", data);
            }
        }
    });
}


// CREATE SOCKET

const socket = io.connect("localhost:3000");

socket.on("new_message", (data) => {
    const myId = document.getElementById("myId").innerHTML;
    axios.post(`/api/message?user=${data.from}&user=${myId}`)
        .then((response) => {
            if (document.getElementById("userChatId").innerHTML !== data.from) {
                closeChatWindow();
                openChatWindow(data.from);
            } else {
                addOtherUsersMessage(data);
            }
            updateHistoryWindow();
        });
});

socket.on("offline-user", (data) => {
    $.alert({
        title: "Info",
        content: "User is offline at the moment",
        buttons: {
            Cancel: function () {
                waitingAlert.close();
            }
        }
    });
});

socket.on("user-busy", (data) => {
    $.alert({
        title: "Info",
        content: "User is busy at the moment",
        buttons: {
            Cancel: function () {
                waitingAlert.close();
            }
        }
    });
});

const redirectToSession = (partner) => {
    axios.post(`/session/session`, {partner})
        .then((response) => {
            window.location = "/session/session";
        })
}

socket.on("start-session-request", (data) => {
    axios.get(`/api/user/status`)
        .then((response) => {
            if (response.data.userStatus === "busy") {
                socket.emit("user-busy", {to: data.from});
            } else {
                confirmStartSession = $.confirm({
                    title: 'Confirm!',
                    content: `Start session with ${data.fromName}?`,
                    buttons: {
                        confirm: function () {
                            socket.emit("start-session-confirm", {to: data.from, from: data.to});
                        },
                        cancel: function () {
                            socket.emit("start-session-refused", {to: data.from});
                        }
                    }
                });
            }
        });
});

socket.on("start-session-confirm", (data) => {
    waitingAlert.close();
    axios.post("/api/session", {
        mentee: document.getElementById("myId").innerHTML,
        mentor: data.from,
        startingAt: Date.now()
    })
        .then((response) => {
            socket.emit("send-session-id", {to: data.from, id: response.data})
            redirectToSession(data.from);
        })
});

socket.on("send-session-id", (data) => {
    socket.emit("save-session-id", {id: data.id});
    redirectToSession(data.from);
})

socket.on("start-session-refused", (data) => {
    waitingAlert.close();
    $.alert({
        title: "Info",
        content: "User refused",
        buttons: {
            Ok: function () {

            }
        }
    });
});

socket.on("cancel-session-request", (data) => {
    confirmStartSession.close();
    $.alert({
        title: "Info",
        content: "User cancelled",
        buttons: {
            Ok: function () {

            }
        }
    });
});


getConversationsWithUnreadMessages((data) => {
    document.getElementById("chatHistoryVisible").innerHTML = `(${data.length}) Chat`;
});

const id = document.getElementById("myId").innerHTML;
axios.get(`/api/user/${id}`)
    .then(function (response) {
        myInfo = response.data[0];
    })
    .catch(function (error) {
        console.log(error);
    });

