const formatTechnologies = (technologies) => {
    let result = "<div class='request__item__skills'>"
    technologies.forEach(t => {
        result += `<span class="request__skill"> ${t} </span>`
    });
    return result + "</div>";
}

const createRequestElement = (request) => {
    let result = "<a href = " + `/u/dashboard/request/${request.id}` + " class='request__link'><div class=\"grid__4 request\">\n" +
        "            <div class=\"request-item__text\">\n" +
        "               <div class='u-flex request__item__text'>" +
        `                  <div class='u-flex-column'><div class='request__description heading-secondary--grey-dark'>${request.description}</div>`
    result += formatTechnologies(request.technologies);
    result += `</div><span>${Math.round(moment.duration(Date.now() - request.postedAt).asDays())} days ago</span></div>` +
        "            </div></div></a>";
    return result;
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
        })
        .catch(function (error) {
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
