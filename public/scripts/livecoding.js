const showCodeEditor = () => {
    document.getElementById("option").innerHTML = '<div id="codeInputPane" contentEditable="true">\n';
    startCoding();
}
function getEl(id) {
    "use strict";
    return document.getElementById(id);

}
function startCoding()

{



    const editor = getEl("codeInputPane");

/*

    var keywords = [];
    var arrayLength = python.length;
    for (var i = 0; i < arrayLength; i++) {
        keywords.push(python[i].keyword);
    }
*/
    $("#codeInputPane").on("keyup", function (e) {
        const text = editor.innerHTML;
        socket.send(text);




    });
    socket.on('message', (data) => {
        "use strict"
        editor.innerHTML = data;
    });






}