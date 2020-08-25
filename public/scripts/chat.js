const displayPreviousMessages = (messages) => {
    const myId = document.getElementById("myId").innerHTML;
    messages.forEach(message => {
        if (message.user_id1 == myId) {
            addMyMessage(message);
        } else {
            addOtherUsersMessage(message);
        }
    })
}

const setChatPartnerProfile = (data) => {
    const chatProfile = document.getElementById("chatProfile");
    chatProfile.innerHTML = '<img class="profile_icon_message background_color_icon"/>';
    chatProfile.innerHTML += `<span class="profile_name">${data.name}</span>`;
    document.getElementById("userChatId").innerHTML = data.id;
}

const openChatWindow = (id) => {
    closeChatWindow();
    axios.get(`/api/user/${id}`)
        .then(function (response) {
            document.getElementById("chat").style.display = "block";
            setChatPartnerProfile(response.data[0]);
            socket.emit("chat-opened", {chattingWith: response.data[0].id});

            const myId = document.getElementById("myId").innerHTML;
            axios.get(`/api/message?user=${id}&user=${myId}`)
                .then((response) => {
                    displayPreviousMessages(response.data);
                })
                .catch((error) => {
                    console.log(error);
                })
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


const formatMessageDate = (time) => {
    const date = new Date(time);
    if (date.getFullYear() === new Date(Date.now()).getFullYear()) {
        return date.toLocaleString("en-GB", {
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    return date.toLocaleString("en-GB", {
        year: '2-digit',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

const addOtherUsersMessage = (message) => {
    const date = formatMessageDate(message.deliveredTime);
    let result = `<div class='other_user_message_container'>
                <img class="profile_icon_message background_color_icon"/>
                <span class="other_user_message color-section--secondary">${message.content}
                    <div class="message_date">${date}</div>
                </span>
                </div>`;
    document.getElementById("messagesContainer").innerHTML += result;
    updateScroll();
}


const addMyMessage = (message) => {
    const date = formatMessageDate(message.deliveredTime);
    let result = `<div class='my_message_container'>        
                <span class="my_message">${message.content}
                    <div class="message_date">${date}</div>
                </span>
                <img class="profile_icon_message background_color_icon2"/>
                </div>`;
    document.getElementById("messagesContainer").innerHTML += result;
    updateScroll();
}

const updateScroll = () => {
    let messageList = document.getElementById("messagesContainer");
    messageList.scrollTop = messageList.scrollHeight;
}

const socket = io.connect("localhost:3000");

socket.on("new_message", (data) => {
    if (document.getElementById("userChatId").innerHTML !== data.from) {
        closeChatWindow();
        openChatWindow(data.from);
        if (document.getElementById("chatHistoryContainer").style.display !== "none") {
            openChatHistory();
        }
    } else {
        addOtherUsersMessage(data);
    }
});

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

const formatProfile = (profile) => {
    const date = Math.round(moment.duration(Date.now() - profile[1]["date"]).asDays());
    return `<div class="profile_chat_container" onclick="openChatWindow(${profile[0]})">
                    <img class="profile_icon_chat background_color_icon"/>
                    <span class="profile_name">${profile[1]["name"]}
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
    const myId = document.getElementById("myId").innerHTML;
    axios.get(`/api/message?user=${myId}`)
        .then(function (response) {
            chatHistoryProfiles.style.display = "block";
            displayProfiles(response.data);
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

document.getElementById("chatHistoryContainer").style.display = "none";



