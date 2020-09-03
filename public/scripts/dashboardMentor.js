const createRequestElement = (request) => {


    let result = "<a href = " + `#` + " class='request__link'><div class=\"grid__4 request\">\n" +
        "            <div class=\"request-item__text\">\n" +
        "               <div class='u-flex request__item__text'>" +
        `                  <div class='u-flex-column'><div class='request__description heading-secondary--grey-dark'><a>Description:${request.description}</div>`
    let daysText = "<span class='en'> days ago</span><span class='ro' style='display: none'> zile in urma</span>";
    if (document.getElementById("activeLanguage").children[1].id === "ro") {
        daysText = "<span class='en' style='display: none'> days ago</span><span class='ro'> zile in urma</span>";
    }
    result += `</div><span>${Math.round(moment.duration(Date.now() - request.postedAt).asDays())}${daysText}</span></div>` +
        "            </div></div></a>";

    result +=
        "            <div class=\"request-item__text\">\n" +
        "               <div class='u-flex request__item__text'>" +
        `                  <div class='u-flex-column'><div class='request__description heading-secondary--grey-dark'><a>User:${request.name}</div>`;
    let message = "<span class='en'>Message</span><span class='ro' style='display: none'>Trimite mesaj</span>";
    if (document.getElementById("activeLanguage").children[1].id === "ro") {
        message = "<span class='en' style='display: none'>Message</span><span class='ro'>Trimite mesaj</span>";
    }
    result += `<button id=${request.id} class=\'login__submit\' onclick="openChatWindow(${request.id})">${message}</button>`;

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

