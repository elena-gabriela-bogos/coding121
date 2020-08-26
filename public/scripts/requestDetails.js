const displaySkills = (skills) => {
    let result = "<div class='request__item__skills'>";
    skills.forEach(skill => {
        result += `<span class='request__skill'> ${skill.name} </span>`;
    });
    result += "</div>";
    document.getElementById("skillsList").innerHTML = result;
}

const getRequestSkills = (id) => {
    axios.get(`/api/request/${id}/skills`)
        .then(function (response) {
            const skills = response.data;
            displaySkills(skills);
            let queryString = `/api/mentor?skill=${skills[0].id}`;
            skills.forEach((skill, i) => {
                if (i !== 0) {
                    queryString += `&skill=${skill.id}`;
                }
            });
            axios.get(queryString)
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                })
        })
        .catch(function (error) {
            console.log(error);
        })
}

getRequestSkills(document.getElementById("requestId").innerHTML);

document.getElementById("requestStatus").onclick = () => {
    let status;
    if (event.target.checked) {
        status = "open";
    } else {
        status = "closed";
    }
    const id = document.getElementById("requestId").innerHTML;
    axios.get(`/api/request/${id}?status=${status}`)
        .then(function (response) {
            console.log("da");
            document.getElementById("requestStatusText").innerHTML = status;
        })
        .catch(function (error) {
            console.log(error);
        })
}
