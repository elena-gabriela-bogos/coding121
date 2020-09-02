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


   // var socket = io('http://localhost:3001');

    const editor = getEl("codeInputPane");



    var keywords = [];
    var arrayLength = python.length;
    for (var i = 0; i < arrayLength; i++) {
        keywords.push(python[i].keyword);
    }
    console.log(keywords);

    $("#codeInputPane").on("keyup", function (e) {
        const text = editor.innerHTML;
        socket.send(text);


        if (e.keyCode == 32) {
            for (i = 0; i < arrayLength; i++) {
               // $("#codeInputPane").highlight(keywords[i]);
                $("#codeInputPane").mark(keywords[i]);
            }
        }

    });

    function highlight(text) {
        var inputText = document.getElementById("codeInputPane");
        var innerHTML = inputText.innerHTML;
        var index = innerHTML.indexOf(text);
        if (index >= 0) {
            innerHTML = innerHTML.substring(0,index) + "<span class='highlight'>" + innerHTML.substring(index,index+text.length) + "</span>" + innerHTML.substring(index + text.length);
            inputText.innerHTML = innerHTML;
        }
    }

    socket.on('message', (data) => {
        "use strict"
        editor.innerHTML = data;
    });


}