// document.getElementById("loginButton").onclick = (event) => {
//     event.preventDefault();
//     axios({
//         method: 'post',
//         url: 'http://localhost:3000/login',
//         data: {
//             "username": document.getElementById("username").value,
//             "password": document.getElementById("password").value
//         },
//         headers: {'Content-Type': 'application/json'}
//     })
//         .then(function (response) {
//             if (response.data.message === "Invalid username or password") {
//                 document.getElementById("loginMessage").innerHTML = response.data.message;
//             } else {
//                 window.location = '/u/dashboard';
//             }
//             console.log(response);
//         })
//         .catch(function (response) {
//             console.log(response);
//         });
// };