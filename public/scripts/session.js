const socket = io.connect("localhost:3000");

$(document).ready( function() {
     $('#click_whiteboard').click(function(){
        document.getElementById('option').innerHTML='<div class="colors"><div class="color black"></div> <div class="color red"></div> <div class="color green"></div><div class="color blue"></div> <div class="color yellow"></div></div> <br/>  <canvas height= "500" width= "800" class="whiteboard" ></canvas>';
     
    });
});
