const createRequestElement = (request) => {
    return "<div class=\"grid__4 request\">\n" +
        "            <div class=\"grid-item__text\">\n" +
        `                <div class='u-flex request__item__text'><h3 class='heading-secondary--grey-dark' >${request.description}</h3>
                            <span>${Date.now() - request.postedAt}</span></div>\n` +
        "            </div>\n" +
        "        </div>"
}

const displayRequests = (requests) => {
    const requestList = document.getElementById("requestList");
    requestList.innerHTML = "";
    requests.forEach(request => {
        requestList.innerHTML += (createRequestElement(request));
    });
}

const getMyRequests = (status) => {
    axios.get(`/api/request?status=${status}`)
        .then(function (response) {
            displayRequests(response.data);
            console.log(response);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
};

const getOpenRequests = () => {
    const target = document.getElementById("openRequests");
    target.style.borderBottom = "0.5rem solid";
    document.getElementById("closedRequests").style.borderBottom = "0";
    getMyRequests("open");
}

document.getElementById("openRequests").onclick = getOpenRequests;

document.getElementById("closedRequests").onclick = () => {
    const target = document.getElementById("closedRequests");
    target.style.borderBottom = "0.5rem solid"
    document.getElementById("openRequests").style.borderBottom = "0";
    getMyRequests("closed");
}

getOpenRequests();

