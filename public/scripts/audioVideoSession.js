let userVideo;
let partnerVideo;
let peerRef;
let otherUser = null;
let userStream;
let streamRef;

function callUser(userID) {
    console.log("callUser");
    otherUser = userID;
    peerRef = createPeer(userID);
    userStream.getTracks().forEach(track => peerRef.addTrack(track, userStream));
}

function createPeer(userID) {
    console.log("createPeer" + userID);
    const peer = new RTCPeerConnection();

    peer.onicecandidate = handleICECandidateEvent;
    peer.ontrack = handleTrackEvent;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);

    return peer;
}

function handleICECandidateEvent(e) {
    console.log("handleICECandidateEvent");
    if (e.candidate) {
        const payload = {
            target: otherUser,
            candidate: e.candidate,
        }
        socket.emit("ice-candidate", payload);
    }
}

function handleNewICECandidateMsg(incoming) {
    console.log("handleNewIceCandidateMsg");
    const candidate = new RTCIceCandidate(incoming);

    peerRef.addIceCandidate(candidate)
        .catch(e => console.log(e));
}

function handleTrackEvent(e) {
    console.log("handleAddTrack");
    partnerVideo.srcObject = e.streams[0];
}

function handleNegotiationNeededEvent(userID) {
    console.log("handleOnNegotiationNeededEvent");
    peerRef.createOffer().then(offer => {
        return peerRef.setLocalDescription(offer);
    }).then(() => {
        const payload = {
            target: userID,
            caller: socket.id,
            sdp: peerRef.localDescription
        };
        socket.emit("offer", payload);
    }).catch(e => console.log(e));
}

function handleReceiveCall(incoming) {
    console.log("handleReceiveCall");
    peerRef = createPeer(incoming.caller);
    const desc = new RTCSessionDescription(incoming.sdp);
    peerRef.setRemoteDescription(desc).then(() => {
        userStream.getTracks().forEach(track => peerRef.addTrack(track, userStream));
    }).then(() => {
        return peerRef.createAnswer();
    }).then(answer => {
        return peerRef.setLocalDescription(answer);
    }).then(() => {
        const payload = {
            target: incoming.caller,
            caller: socket.id,
            sdp: peerRef.localDescription
        }
        otherUser = incoming.caller;
        socket.emit("answer", payload);
    })
}

function handleAnswer(message) {
    console.log("handleAnswer");
    const desc = new RTCSessionDescription(message.sdp);
    peerRef.setRemoteDescription(desc).catch(e => console.log(e));
}

const showVideoContainers = () => {
    document.getElementById("audioVideoButton").disabled = true;
    document.getElementById("option").innerHTML =
        '<video autoplay id="remote-video"></video>' +
        '<video autoplay id="local-video"></video>';
}

const establishConnection = (caller) => {
    userVideo = document.getElementById("local-video");
    partnerVideo = document.getElementById("remote-video");
    userVideo.srcObject = streamRef;
    userStream = streamRef;
    if (caller) {
        callUser(document.getElementById("partnerId").innerHTML);
    }
}

const clearVideoAudioWindow = () => {
    otherUser = null;
    if (partnerVideo && partnerVideo.srcObject) {
        partnerVideo.srcObject.getTracks().forEach(track => {
            track.stop()
        });
        partnerVideo.srcObject = null;
    }
    document.getElementById("option").innerHTML = "";
    document.getElementById("audioVideoButton").disabled = false;
}

// (navigator.getUserMedia ||
//     navigator.webkitGetUserMedia ||
//     navigator.mediaDevices.getUserMedia ||
//     navigator.msGetUserMedia)
navigator.mediaDevices.getUserMedia({audio: true, video: true}).then(stream => {
    socket.on("offer", handleReceiveCall);

    socket.on("answer", handleAnswer);

    socket.on("ice-candidate", handleNewICECandidateMsg);

    streamRef = stream;
});




