const displaySkills = (skills) => {
    const skillsSelect = document.getElementById("requestSkills");
    skills.forEach(skill => {
        let element = document.createElement("option");
        element.value = skill.id;
        element.text = skill.name;
        skillsSelect.appendChild(element);
    });
}

const getSkills = () => {
    axios.get(`/api/skills`)
        .then(function (response) {
            displaySkills(response.data);
        })
        .catch(function (error) {
            console.log(error);
        })
};
getSkills();