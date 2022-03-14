// import { auth } from '../scripts/firebase.js'
// import { getAuth, onAuthStateChanged } from 'firebase/auth';

// console.log("popup main!")

// var name = "";

// onAuthStateChanged(auth, user => {
//     if (user != null) {
//         console.log('logged in!');
//         console.log("current")
//         console.log(user.displayName)
//         name = user.displayName;
//     } else {
//         console.log('No user');
//         name="";
//     }
// });

// document.querySelector('#sign_out').addEventListener('click', () => {
//     auth.signOut();
//     window.location.replace('./popup.html');
// });

// let element = document.getElementById('user');
// element.innerHTML += 'Hello ' + name ;

// function setPageBackgroundColor() {
//   chrome.storage.sync.get("color", ({ color }) => {
//     document.body.style.backgroundColor = color;
//   });
// }

// document.querySelector('.btn__startproject').addEventListener('click', () => {
//     console.log("start project button clicked!")
//     let projectid = document.getElementById("projectid").value;
//     chrome.storage.local.set({ projectinfo: projectid});
//     chrome.storage.local.get(['projectinfo'], function(result){
//         console.log('inside get function');
//         console.log(result);
//         if(result.projectinfo != undefined){
//             console.log(`${result.projectinfo}`);
//             var first = document.getElementById("startStopDisplay");    
//             first.innerHTML = `<p>ProjectId: ${result.projectinfo}</p>`;
//         }
//     });
//     pingSWtoStart();
// })

// // document.querySelector('.btn__stopproject').addEventListener('click', () => {
// //     console.log("Stop button clicked!")
// //     // let projectid = document.getElementById("projectid").value;
// //     // let projectStatus = 'Stop';
// //     chrome.storage.local.remove(chrome.storage.local.get('projectinfo'));
// //     var startStopDisplay = document.getElementById("startStopDisplay");
// //     startStopDisplay.innerHTML = `<strong>ProjectId: ${result.value}</strong> 
// //             <button id="stopProject" class="btn btn__stopproject" >Start Project</button>`;
// //     pingSWtoStop();
// // })
// // function clickFunction() {
    
// //   }
// window.addEventListener('load', (event) => {
//     console.log('page is fully loaded');
//     chrome.storage.local.get(['projectInfo'], function(result){
//         var startStopDisplay = document.getElementById("startStopDisplay");    
//         if(result.projectinfo != undefined){
//             startStopDisplay.innerHTML = `<strong>ProjectId: ${result.value}</strong> 
//             <button id="startProject" class="btn btn__stopproject" >Start Project</button>`;
//         } else{
//             console.log('inside else');
//             startStopDisplay.outerHTML = "<input type='text' id='projectid' placeholder='Enter Project Id1' /><button id='startproject' class='btn btn__startproject' >Start Project</button>"
//         }
//     });
//   });

// // window.addEventListener("load", () => {
// //     // (B1) REPLACE THE ENTIRE <P> ELEMENT WITH <STRONG>
// //     
  
// //     // (B2) WILL STILL BE A <P>, BUT CONTENT WILL BE CHANGED.
// //     // var second = document.getElementById("second");
// //     // second.innerHTML = "<u>FOO</u> <i>BAR</i>";
// //   });

// function pingSWtoStart(){
//     var port = chrome.runtime.connect({
//           name: "Sample Communication"
//         });
//     port.postMessage("StartProject");
//     port.onMessage.addListener(function(msg) {
//         console.log("message recieved" + msg);
//         });
// }

// function pingSWtoStop(){
//     var port = chrome.runtime.connect({
//           name: "Sample Communication"
//         });
//     port.postMessage("StopProject");
//     port.onMessage.addListener(function(msg) {
//         console.log("message recieved" + msg);
//         });
// }



// /*
// <form action=example-server.com">
//     <fieldset>
//         <legend>Contact me</legend>
//         <div class="form-control">
//             <label for="name">Name</label>
//             <input type="name" id="name" placeholder="Enter your name" required />
//         </div>

//         <div class="form-control">
//             <label for="email">Email</label>
//             <input
//                     type="email"
//                     id="email"
//                     placeholder="Enter your email"
//                     required
//             />
//         </div>

//         <div class="form-control">
//             <label for="message">Message</label>
//             <textarea
//                     id="message"
//                     cols="30"
//                     rows="10"
//                     placeholder="Enter your message"
//                     required
//             ></textarea>
//         </div>
//         <input type="submit" value="Send" class="submit-btn" />
//     </fieldset>
// </form>*/