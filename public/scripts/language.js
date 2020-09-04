const toggleLanguages = (current, substitute) => {
    let activeLanguage = document.getElementById("activeLanguage");
    let otherLanguage = document.getElementById("otherLanguage");
    if (current !== substitute) {
        let active = activeLanguage.children[1];
        active.remove();
        activeLanguage.appendChild(document.getElementById(substitute));
        otherLanguage.appendChild(active);
        hideLanguage(current);
        showLanguage(substitute);
        axios.post("/api/user/language", {lang: substitute})
            .then((response) => {
            })
            .catch((err) => {
                console.log(err);
            })
    }
}

document.getElementById("ro").onclick = () => {
    toggleLanguages(document.getElementById("activeLanguage").children[1].id, "ro");
}

document.getElementById("en").onclick = () => {
    toggleLanguages(document.getElementById("activeLanguage").children[1].id, "en");
}

const showLanguage = (lang) => {
    [...document.getElementsByClassName(lang)].forEach(element => {
        element.style.removeProperty('display');
    })
}

const hideLanguage = (lang) => {
    [...document.getElementsByClassName(lang)].forEach(element => {
        element.style.display = "none";
    })
}
showLanguage("ro");
hideLanguage("en");

