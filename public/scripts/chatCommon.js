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
    axios.get(`/api/message?user=${id}&user=${myId}`)
        .then((response) => {
            displayPreviousMessages(response.data);

            axios.post(`/api/message?user=${id}&user=${myId}`)
                .then((response) => {
                    seenHandler();
                })
        })
        .catch((error) => {
            console.log(error);
        })
}