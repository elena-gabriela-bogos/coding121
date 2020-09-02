let otherUserPicture, myPicture;

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

const updateScroll = () => {
    let messageList = document.getElementById("messagesContainer");
    messageList.scrollTop = messageList.scrollHeight;
}

const addOtherUsersMessage = (message) => {
    const date = formatMessageDate(message.deliveredTime);
    let result = `<div class='other_user_message_container'>`;
    if (otherUserPicture) {
        result += `<img class="profile_icon_message" src="data:image/png;base64,${otherUserPicture}"/>`;
    } else {
        result += `<img class="profile_icon_message background_color_icon"/>`;
    }
    result += `<span class="other_user_message color-section--secondary">${message.content}
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
                </span>`;
    if (myPicture) {
        result += `<img class="profile_icon_message" src="data:image/png;base64,${myPicture}"/>`;
    } else {
        result += `<img class="profile_icon_message background_color_icon2"/>`;
    }
    result += `</div>`;
    document.getElementById("messagesContainer").innerHTML += result;
    updateScroll();
}

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

const getPreviousMessages = (id, myId, seenHandler) => {
    axios.get(`/api/user/${id}`)
        .then((response) => {
            otherUserPicture = response.data[0].picture;
            axios.get(`/api/user/${myId}`)
                .then((response) => {
                    myPicture = response.data[0].picture;
                    axios.get(`/api/message?user=${id}&user=${myId}`)
                        .then((response) => {
                            displayPreviousMessages(response.data);

                            axios.post(`/api/message?user=${id}&user=${myId}`)
                                .then((response) => {
                                    seenHandler();
                                })
                        })
                })
        })
        .catch((error) => {
            console.log(error);
        })
}