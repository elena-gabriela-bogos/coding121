const createMentorToggle = (mentor, status) => {
    let statusText = "Pending";
    if (status) {
        statusText = "Accepted";
    }
    let result = `<div class="u-flex" style="margin-top: 2rem">
                    <span style="margin-right: 2rem">Status:</span><span id="mentorStatusText" style="margin-right: 2rem;font-weight: bolder" class="heading-tertiary--grey-dark">${statusText}</span>
                    <label class="switch">`;
    if (status === 1) {
        result += `<input id="mentorStatus" onclick="updateMentorStatus(${mentor.id}, 0)" type="checkbox" checked>`;
    } else {
        result += `<input id="mentorStatus" onclick="updateMentorStatus(${mentor.id}, 1)" type="checkbox">`
    }
    result += `<span class="slide round"> </span></label></div>`;
    return result;
}

const createMentorElement = (mentor, status) => {
    let result = `<div id=${mentor.id} class='grid__4 grid-item mentor'>` +
        "<div class='grid-item__circle grid-item__circle--1'>" +
        "<svg class='grid-item__icon'>" +
        "<use xlink:href='../../../img/sprite.svg#icon-embed2'></use></svg></div>" +
        "<div class='grid-item__text'>" +
        `<p class= 'mentor_name heading-tertiary--grey-dark' >${mentor.name}</p><p class='mentor_details'>${mentor.details}</p> `;
    result += createMentorToggle(mentor, status);
    result += `</div></div>`;
    return result;
}

const displayMentors = (mentors, status) => {
    const mentorList = document.getElementById("mentorList");
    mentorList.innerHTML = "";
    let result = "";
    let newRow = false;
    if (document.getElementsByClassName("mentor").length % 3 === 0) {
        newRow = true;
        result += "<div class='grid'>";
    }
    mentors.forEach(mentor => {
        result += createMentorElement(mentor, status);
    });
    if (newRow) {
        result += "</div>";
    }
    mentorList.innerHTML = result;
}

const getMentors = (status) => {
    axios.get(`/api/mentor?validStatus=${status}`)
        .then(function (response) {
            displayMentors(response.data, status);
        })
        .catch(function (error) {
            console.log(error);
        })
};

const getPendingMentors = () => {
    const target = document.getElementById("pendingMentors");
    target.style.borderBottom = "0.5rem solid";
    document.getElementById("acceptedMentors").style.borderBottom = "0";
    getMentors(0);
}

document.getElementById("pendingMentors").onclick = getPendingMentors;

document.getElementById("acceptedMentors").onclick = () => {
    const target = document.getElementById("acceptedMentors");
    target.style.borderBottom = "0.5rem solid"
    document.getElementById("pendingMentors").style.borderBottom = "0";
    getMentors(1);
}

getPendingMentors();

const updateMentorStatus = (id, status) => {
    axios.post(`/api/mentor/${id}`, {status})
        .then(function (response) {
            if (status) {
                getMentors(0);
            } else {
                getMentors(1);
            }
        })
        .catch(function (error) {
            console.log(error);
        })
}

