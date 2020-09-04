//import LanguagesFrameworks from "../../src/domain/languages-frameworks";
//import {dbConn} from "../../config/db.config";

$(document).ready(function(){
    $('input.typeahead').typeahead({
        name: 'dracu',
        remote: 'http://localhost:3000/setUpMentor/search/?key=%QUERY',
        limit: 10
    });
    // $('input.typeahead').onclick(function (){
    //     name:'addLF',
    //
    // })
});

const createLFElement = (lf_name)=>{
    let result=`<div id=${lf_name} class='grid__4 grid-item LF'>` +
        "<div class='grid-item__text'>" +
        `<p class= 'mentor_name heading-tertiary--grey-dark' >${lf_name}</p>`+
        '<label for="YoE" class="login__label">Years of experience</label>'+
        "<div>" +
        '<input type="number" id="YoE" name="YoE" class="YoE paragraph login__input color-section--grey-light" value="1">';
    result += `</div></div></div>`;
    return result;
}

function add_LF() {
    let lf = document.getElementById("search").value;
    let toAdd = createLFElement(lf);
    let result = "";
    if(document.getElementsByClassName("LF").length%3===0){
        result += "<div class='grid'>";
        result +=toAdd
        result += "</div>";
        const LFList = document.getElementById("LFList");
        LFList.innerHTML = LFList.innerHTML + result;
        LFList.style.borderBottom = "0.5rem solid"

    }
    else{
        const no = document.getElementsByClassName("grid");
        const grid = no[no.length-5];
        console.log(grid);
        grid.innerHTML = grid.innerHTML + toAdd;
    }
}

function submitLF(id){
    const namesH = document.getElementsByClassName("mentor_name");
    const YoEH = document.getElementsByClassName("YoE");
    let skills = [];
    for(let i = 0; i<namesH.length; i++){
        skills.push({"name": namesH[i].innerHTML,"years": YoEH[i].value})
    }
    axios.post("/setUpMentor/submitSkills",{"skills":skills}).then(()=>{

        console.log("ceva")
        window.location="/m/dashboard"
        }
    )

}
// const displayLF = ()=>{
//     const lf = document.getElementById("addLF")
//     const lfList = document.getElementById("LFList");
//     lfList.innerHTML = "";
//     let result = "";
//     let newRow = false;
//

//
// }
