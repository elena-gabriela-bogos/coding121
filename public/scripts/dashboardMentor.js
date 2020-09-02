
const createRequestElement = (request) => {


    let result = "<a href = " + `#` + " class='request__link'><div class=\"grid__4 request\">\n" +
        "            <div class=\"request-item__text\">\n" +
        "               <div class='u-flex request__item__text'>" +
        `                  <div class='u-flex-column'><div class='request__description heading-secondary--grey-dark'><a>Description:${request.description}</div>`
    result += `</div><span>${Math.round(moment.duration(Date.now() - request.postedAt).asDays())} days ago</span></div>` +
        "            </div></div></a>";

    result+=
        "            <div class=\"request-item__text\">\n" +
        "               <div class='u-flex request__item__text'>" +
        `                  <div class='u-flex-column'><div class='request__description heading-secondary--grey-dark'><a>User:${request.name}</div>`;
    result += `<button id=${request.id} class=\'login__submit\' onclick="openChatWindow(${request.id})">Message</button>`;

    return result;

}

const displayRequests = (requests) => {
    const requestList = document.getElementById("suggestedRequests");
    requestList.innerHTML = "";
    requests.forEach(request => {
        requestList.innerHTML += (createRequestElement(request));
        console.log(request);
    });
}



const getMyRequests = (status) => {
    axios.get(`/api/suggested_request?status=${status}`)
        .then(function (response) {
            displayRequests(response.data);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
};

const getOpenRequests = () => {
    const target = document.getElementById("openRequests");
    target.style.borderBottom = "0.5rem solid";
    getMyRequests("open");
}

document.getElementById("openRequests").onclick = getOpenRequests;


getOpenRequests();

