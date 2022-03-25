
const htmlPages={
    home:`
        <div class="home">
            <div style="display: flex;align-items: center; justify-content: center;" class="p-2">
                <h3 style="flex-grow: 1;">Welcome to DPI Class</h3>
                <a class="btn primary m-2" href="#createClass">New</a>
            </div>
            <div class="search input-group">
                <input type="search" name="search" id="home-search" placeholder="Find a Class">
            </div>
            <div class="classlist">
                <div class="classes" id="homepagedah">
                    <img src="/image/circlespainer.svg" alt="loading">
                </div>
            </div>
        </div>
    `,
    signin:`
        <div class="signin">
            <form id="signin-form" autocomplete="off">
                <div class="caption">
                    <h2 class="text-primary">Let's Sign You In.</h2>
                    <h3>Welcome Back.</h3>
                </div>
                <div class="input-group">
                    <label for="email">Email:</label>
                    <input type="email" class="form-control" id="email" required>
                </div>
                <div class="input-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" required >
                </div>
                <button type="submit" class="btn primary w100">Sign in</button>
            </form>
            <div class="alternate">Don't have an account? <a href="#register">Register</a></div>
        </div>
    `,
    register:`
        <div class="register" >
            <form id="register-form" autocomplete="off">
                <div class="caption">
                    <h2 class="text-primary">Let's Register You In.</h2>
                    <h3>Welcome to DPI-Class.</h3>
                </div>
                <div class="input-group">
                    <label for="name">Name: </label>
                    <input type="text" id="name" required>
                </div>
                <div class="input-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" required>
                </div>
                <div class="input-group">
                    <label for="password">Password: </label>
                    <input type="password" id="password" required>
                </div>
                <div class="input-group">
                    <label for="re-password">Confarm Password: </label>
                    <input type="password" id="re-password" required>
                </div>
                <button type="submit" class="btn primary w100">register</button>
            </form>
            <div class="alternate">Alredy have an account? <a href="#signin">Signin</a></div>
        </div>
    `,
    createClass:`
        <div class="create-class" >
            <form id="create-class-form">
                <h2>Create New class</h2>
                <div class="input-group">
                    <label for="title">Title</label>
                    <input type="text" name="title" id="title" required>
                </div>
                <div class="input-group">
                    <label for="description">Description</label>
                    <textarea name="description" id="description" cols="30" rows="10"></textarea>    
                </div>
            <div>
                <button type="submit" class="btn primary m-2">POST</button>
                <a href="#home" class="btn secondary m-2">Cancel</a>
            </div>
            </form>
        </div>
    `,
    classroom:`
        <div class="classroom">
            <div class="head" id="class-hader">
                <img src="/image/circlespainer.svg" alt="loading" style="margin-left: 40%;">
            </div>
            <div class="body">
                <div class="content-view">
                    <form style="margin: 4px;" id="class-content-form">
                        <div class="input-group">
                            <label for="content">adding a new info</label>
                            <textarea name="content" id="content" cols="10" rows="2"></textarea>
                        </div>
                        <button type="submit" class="btn primary w100">Post</button>
                    </form>
                    <div class="contents" id="classcontent-views">
                        <img src="/image/circlespainer.svg" alt="loading" style="margin-left: 40%;">
                    </div>
                </div>
                <div class="attendace-view">

                </div>
            </div>
        </div>
    `,
}
var youUser = {}
const pageContents = document.querySelector(".page-contents");
var classId = "";
var loginTargetUrl = "";
function showPage(hashname){
    classnames = hashname.split("#")
    if(classnames[1])
    {
        if(classnames[1] != "home" &&
         classnames[1] != "signin" &&
         classnames[1] != "register" &&
        !localStorage.getItem("auth")
        )
        {
            loginTargetUrl = hashname;
            location.href = "#signin";
            return ;
        }else{
            pageContents.innerHTML = htmlPages[classnames[1]];
        }
    }else{
        //home
        showPage("#home");
    }
    switch (classnames[1]) {
        case "classroom":
            //load and view a single class
            classId = classnames[2];
            viewClassroom();
            break;
        case "home":
            if(localStorage.getItem("auth"))
                viewClasses();
            else
                viewBasicHome();
            break;
        default:
            break;
    }
    initEvenHandle();
}
//get Header here
function getRequestHeader(){
    let auth = JSON.parse(localStorage.getItem("auth"));
    let token = null;
    let headers = {
        "Content-Type": "application/json"
    }
    if(auth)
    {
        token = auth.token;
        headers = {...headers, "Authorization": "Bearer "+token}
    }
    return headers;
}
//join to the class

if(location.pathname.startsWith("/join/"))
{
    let id = location.pathname.split("/")[2];
    // axios.get("/classroom/join/"+id, {headers:getRequestHeader()})
    // .then(({data})=>{
    //     if(data._id){
    //         console.log(data);
    //         location.href = "/#classroom#"+data._id;
    //     }
    // })
    // .catch(err => {
    //     console.error(err);
    // });
    history.pushState(0, 0, "/")
    location.href = "/#classroom#"+id;
    console.log(id);
}

//upload content





onhashchange = () =>{
    showPage(location.hash);
}

//log out section
function logout(){
    localStorage.clear();
    location.href = "/";
}


//auth checking for header


function viewAuthMenus(){
    var header = document.getElementById("authcheck");
    if(localStorage.getItem("auth")){
        let avaterElem = document.querySelector("#header-user-avater");
        let userCtrl = document.querySelector("#user-ctrl")
        axios.get('/auth', {headers:getRequestHeader()})
        .then(res =>{
            youUser = res.data;
            avaterElem.innerHTML = `
                <div class="avater-img">
                
                    ${
                        res.data.profileurl? 
                        `<img src="${res.data.profileurl}" alt="shadhin" style="width: 100%;">`
                        :`<span style="display: flex;justify-content: center;font-size: 18px;align-items: center;height: 100%;">${res.data.name[0].toUpperCase()}</span>`
                    }
                </div>
                <div class="text-primary text-bold p-2">
                    ${res.data.name}
                </div>
            `;

            userCtrl.innerHTML = 
            `<div class="user-photo">
                ${
                    res.data.profileurl? 
                    `<img src="${res.data.profileurl}" alt="shadhin" style="width: 100%;">`
                    :`<span style="display: flex;justify-content: center;font-size: 85px;align-items: center;height: 100%;">${res.data.name[0].toUpperCase()}</span>`
                }
                
            </div>
            <div class="m-2 p-2">
                <h2 class="text-primary">${res.data.name}</h2>
            </div>
            <div class="p-2">
                <h4>${res.data.email}</h4>
            </div>
            <div class="m-2 p-2">
                <a href="#" onclick="logout()" class="btn secondary">Logout</a>
            </div>`;
            if(!res.data.profileurl){
                setTimeout(()=>{
                    openOverflowDialog();
                    // 
                },2000);
            }
            header.classList.add("authed")
        })
        .catch((error)=>{
            if(error.response)
                console.error(error.response.data);
            //fake authentication
            localStorage.clear();
        });
        
    }
}
viewAuthMenus();

//user loging in function
function logedIn(){
    if(loginTargetUrl){
        location.hash = loginTargetUrl
        loginTargetUrl = ""
    }else{
        location.hash = ""
    }
    viewAuthMenus();
}
//signin
function signinSubmitHandle(e){
    e.preventDefault();
    let signin = e.target;
    axios.post("/auth/login",
    {
        email: signin.email.value,
        password: signin.password.value
    },
    {
        "headers": getRequestHeader()
    })
    .then(({data})=>{
        if(data.token){
            localStorage.setItem("auth", JSON.stringify(data));
            logedIn();
        }
     })
     .catch(err => {
        if(err.response.data)
        {
            console.log(err.response.data);
        }
       console.error(err);
    });
}
//register from
function registerSubmitHandle(e){
    e.preventDefault();
    let signup = e.target;

    axios.post("/auth/register",
    {
        name:signup.name.value,
        email: signup.email.value,
        password: signup.password.value
    },
    {
        "headers": getRequestHeader()
    })
    .then(({data})=>{
        if(data.token){
            localStorage.setItem("auth", JSON.stringify(data));
            logedIn();
        }
     })
     .catch(err => {
         if(err.response.data)
         {
             console.log(err.response.data);
         }
        console.error(err);
    });
}
//create classroom

function createClassHandle(e){
    e.preventDefault();
    let datas = e.target;
    axios.post("/classroom",{
        title: datas.title.value,
        description: datas.description.value
    },
    {
        headers:getRequestHeader()
    }
    ).then(({data})=>{
        datas.title.value = ""
        datas.description.value = ""
        console.log(data);
        location.href = "#"
    })
    .catch(err => {
        if(err.response){
            console.error(err.response.data);
        }
    });
}
//create class content
function createContentHandle(e){
    e.preventDefault();
    let datas = e.target;
    if(datas.content.value)
    {
        axios.post("/classroom/content/"+classId,{
            text:datas.content.value
        },
        {headers:getRequestHeader()})
        .then(({data})=>{
            console.log(data);
            viewsContent();
            datas.content.value = "";
        })
        .catch(err => {
            console.error(err);
        });
    }
}

function initEvenHandle(){
    if(document.querySelector("#signin-form")){
        document.querySelector("#signin-form").onsubmit = signinSubmitHandle;
    }
    if(document.querySelector("#register-form")){
        document.querySelector("#register-form").onsubmit = registerSubmitHandle;
    }
    if(document.querySelector("#create-class-form")){
        document.querySelector("#create-class-form").onsubmit = createClassHandle;
    }
    if(document.querySelector("#class-content-form")){
        document.querySelector("#class-content-form").onsubmit = createContentHandle;
    }
}

/*
//forms
var signinForm = document.querySelector("#signin-form");
var registerForm = document.querySelector("#register-form");
var createClassForm = document.querySelector("#create-class-form");
var classContentForm = document.querySelector("#class-content-form");

//signin
signinForm.onsubmit = 

//register
registerForm.onsubmit = (e)=>{
}


// classroom create
createClassForm.onsubmit = (e)=>{
}

classContentForm.onsubmit = (e)=>{
    
    
}

*/


//load home page
/*
<div class="classes">
<div class="class-item">
    <div class="item-head">
        <a href="#classroom#6230137a8ed53bf0d06c69aa" class="text-primary">titile</a>
        <span class="batch">1</span>
    </div>
    <p>shadhin</p>
</div>
    
<div class="class-item">
    <div class="item-head">
        <a href="#classroom#62301c566074949be27ecdcb" class="text-primary">this work good thing</a>
        <span class="batch">1</span>
    </div>
    <p>year of this clas</p>
    </div><div class="class-item">
    <div class="item-head">
        <a href="#classroom#62309886f374ccf75d6949fc" class="text-primary">mynew class</a>
        <span class="batch">1</span>
    </div>
    <p>it woriking</p>
    </div><div class="class-item">
    <div class="item-head">
        <a href="#classroom#623577d775ff4b9410bc6156" class="text-primary">my new class</a>
        <span class="batch">1</span>
    </div>
    <p>123123</p>
    </div>
</div>


*/

function homeView()
{
    if(localStorage.getItem("auth")){

    }
}


//load contents
function viewBasicHome(){
    document.getElementById("homepagedah").innerHTML =
    `
        <img src="/image/labrotory.png" style="width: 100%;" alt="loading">
        <div class="basichome">
            <h1>Join now to class Easy</h1>
            <a href="#signin" class="btn primary m-2">Sing in</a>
            <a href="#register" class="btn secondary m-2">Sign up</a>
        </div>
    `;
}
function viewClasses(){
    let classes = document.getElementById("homepagedah");
    if(localStorage.getItem("auth")){
        //dashboard home
        axios.get("/classroom", {headers:getRequestHeader()})
        .then(({data})=>{
            classes.innerHTML = "";
            if(data.length)
            {
                data.forEach(cls => {
                    let item = document.createElement("div");
                    item.className = "class-item";
                    item.innerHTML = `
                    <div class="item-head">
                        <a href="#classroom#${cls._id}" class="text-primary">${cls.title}</a>
                        <span class="batch">${cls.students.length}</span>
                    </div>
                    <p>${cls.description}</p>
                    `;
                    classes.appendChild(item);
                });
            }
        })
        .catch(err => {
            console.error(err);
            viewBasicHome();
        });
    }else{
        //basic home
    }
}


//load notify
async function loadNotify(){
    let respo = await axios.get("/classroom/notify", {headers:getRequestHeader()});
    let ntfc = localStorage.getItem("notifycount");
    let count = respo.data.c;
    if(ntfc){
        let ntfcObj = JSON.parse(ntfc);      
        if(ntfcObj.tcn != count.tcn || ntfcObj.tl != count.tl){
            viewsContent();
            // console.log("update", count, ntfcObj);
            localStorage.setItem("notifycount", JSON.stringify(count));
        }
    }else{
        localStorage.setItem("notifycount",JSON.stringify(count));
    }
    setTimeout(loadNotify, 300);
}
//join to classroom
function joinToClass(){
    axios.get("/classroom/join/"+classId, {headers:getRequestHeader()})
    .then(({data})=>{
        if(data._id){
            viewClassroom();
        }
    })
    .catch(err => {
        console.error(err);
    });
}
//load classroom
function viewClassroom(){
    axios.get("/classroom/"+classId, {headers:getRequestHeader()})
            .then(({data})=>{
                console.log(data);
                let isStudent = data.students.filter(std=>std._id==youUser._id).length;
                console.log(isStudent);
                let render =`
                                <div class="title">
                                    <h3 class="text-bold">
                                        <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" fill="currentColor">
                                            <path fill-rule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"></path>
                                        </svg>
                                        ${data.title}</h3>
                                </div>
                                <div class="audience text-gray">
                                ${data.students.length} user 
                                </div>
                                <div class="actions m-2 p-2">
                                    <button class="btn secondary m-2" id="class-share-button">Share</button>
                                    <div class="share-menu">
                                        <div class="input-group">
                                            <input type="text" value="${location.origin+"/join/"+data._id}" id="share-menu-fill">
                                            <button class="btn" onclick="clipboardCopy('share-menu-fill')">copy</button>
                                        </div>
                                        <table style="padding: 8px;background: #fff;" id="link-qrcode"></table>
                                    </div>
                                    ${!isStudent?'<button class="btn primary"}" onclick="joinToClass()">join</button>'
                                    :'<button class="btn danger"}" onclick="confirm(\'Are you leave this class?\')?joinToClass():0">Leave</button>'}
                                </div>
                                <div class="tabs">
                                    <ul class="tabmenu">
                                        <li class="tab-item active" id="content-tab">content</li>
                                        <li class="tab-item" id="attendance-tab">attendance</li>
                                    </ul>
                                </div>
                                `;
                
                document.querySelector(".classroom > #class-hader").innerHTML = render;
                document.querySelector("#class-share-button").addEventListener(
                    "click", 
                    openCloser(()=>{
                            document.querySelector(".share-menu").classList.toggle("open");
                        },".share-menu")
                    );
                document.querySelector(".tabs .tabmenu").onclick = function(e){
                    if(e.target.id == "attendance-tab"){
                        document.querySelector(".classroom .body").classList.add("attendance")
                    }else{
                        document.querySelector(".classroom .body").classList.remove("attendance")
                    }
                    for (let index = 0; index < this.children.length; index++){
                        const element = this.children[index];
                        element.classList.remove("active");
                    }
                    e.target.classList.add("active");
                }
                var qrcode = new QRCode(document.getElementById("link-qrcode"),{
                    text:location.origin+"/join/"+data._id,
                    width:280,
                    height: 280,
                    colorDark: "#020000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                });

                //attendance view
                viewAttendance(data.host._id == youUser._id);
                viewsContent();
            })
            .catch(err => {
                console.error(err);
            });
}


//load class contex
function viewsContent(){
    let classContentView = document.getElementById("classcontent-views")
    axios.get("/classroom/content/"+classId,{headers:getRequestHeader()})
    .then(({data})=>{
        classContentView.innerHTML = ""
        if(data.length){
            data.forEach(ctx => {
                let item = document.createElement("div");
                item.className = "content-item";
                item.id = ctx._id;
                item.innerHTML = `
                <div class="head">
                    <div class="avater-img">
                        <img src="${ctx.user.profileurl}" alt="shadhin" style="width: 100%;">
                    </div>
                    <h3 class="text-bold p-2">${ctx.user.name}</h3>
                </div>
                <div class="text p-2">
                    <p>${ctx.text}</p>
                </div>
                <div class="foot">
                    <span>${ctx.likes.length}</span>
                    <div class="btn m-2" ${ctx.likes.filter(ur=> ur._id == youUser._id).length? "style='color:red;'":""} id="like" onclick="linkeToContent('${ctx._id}')">❤</div>
                </div>
                `;
                classContentView.appendChild(item);
            });
        }
    })
    .catch(err => {
        console.error(err);
    });
}


//load attendance 
function viewAttendance(isHost=false){
    
    axios.get("/classroom/attendance/"+classId, {headers:getRequestHeader()})
    .then(({data})=>{
        let newSession = `
            <div class="new-session">
                <button class="btn primary" id="starting-attendance-settion">Start a Settion Now</button>
            </div>
        `;
        document.querySelector(".body .attendace-view").innerHTML = `
                        <h2 class="text-gray text-center">No Attendance Session</h2>
                        ${isHost?newSession:""}
                    `;
        console.log(data);
        
        if(document.getElementById("starting-attendance-settion")){
            document.getElementById("starting-attendance-settion").onclick = (e)=>
            {
                document.querySelector(".body .attendace-view").innerHTML = `
                <form id="new-attendance-form">
                    <div class="input-group">
                        <label for="end_session">Select Settion Time</label>
                        <select name="end_session" id="end_session">
                            <option value="5">5 Minute</option>
                            <option value="10">10 Minute</option>
                            <option value="15">15 Minute</option>
                        </select>
                    </div>
                    <button class="btn primary" type="submit">Start</button>
                </form>
                `;
                if(document.getElementById("new-attendance-form"))
                {
                    document.getElementById("new-attendance-form").onsubmit =  submitNewAttendance;
                }
            }
        }
    }).catch(err => {
        console.error(err);
    });
}

function submitNewAttendance(event){
    event.preventDefault();
    const form = event.target;
    axios.post("/classroom/attendance/"+classId, {
        end_session:form.end_session.value
    }, {headers:getRequestHeader()})
    .then(({data})=>{
        console.log(data);
    }).catch(err => {
        console.error(err);
    });
}
//linke to content
function linkeToContent(id)
{
    axios.get("/classroom/content/like/"+id, {headers:getRequestHeader()})
    .then(({data})=>{
        document.getElementById(data._id).innerHTML = `
        <div class="head">
            <div class="avater-img">
                <img src="${data.user.profileurl}" alt="shadhin" style="width: 100%;">
            </div>
            <h3 class="text-bold p-2">${data.user.name}</h3>
        </div>
        <div class="text p-2">
            <p>${data.text}</p>
        </div>
        <div class="foot">
            <span>${data.likes.length}</span>
            <div class="btn m-2" ${data.likes.filter(ur=> ur._id == youUser._id).length? "style='color:red;'":""} id="like" onclick="linkeToContent('${data._id}')">❤</div>
        </div>
        `;
    })
    .catch(err => {
        console.error(err);
    });
}
//chage profile image
function changeProfile(fileInput){
    let selectFile = fileInput.target.files;
    if(FileReader){
        let fr = new FileReader();
        //FileReader support
        fr.onload = function(){
            let temp = document.querySelector("#editorAndViewer").innerHTML;
            document.querySelector("#editorAndViewer").innerHTML = "";
            let img = document.createElement("img");
            img.style.width = "100%";
            img.src = fr.result;
            document.querySelector("#editorAndViewer").appendChild(img);
            let croper = new Cropper(img, {aspectRatio:1/1});
            document.querySelector("#btn-inputfile").classList.add("hide");
            document.querySelector("#btn-crop").classList.remove("hide");
            document.querySelector("#btn-crop #btn-action").onclick = ()=>{
                croper.getCroppedCanvas().toBlob((blob)=>{
                        document.querySelector("#editorAndViewer").innerHTML = temp;
                        let proimg = document.createElement("img");
                        proimg.style.width = "100%";
                        proimg.src = URL.createObjectURL(blob);
                        document.querySelector("#showImage").appendChild(proimg);
                        document.querySelector("#btn-crop").innerHTML=
                        `
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" height="22px" viewBox="0 0 254.95 22" style="enable-background:new 0 0 254.95 22;" xml:space="preserve" width="270px">
                            <style type="text/css">
                                .st0{fill:#FFFFFF;stroke:#8E8D8D;stroke-width:22;stroke-linecap:round;stroke-miterlimit:10;}
                                #progress{stroke:var(--primary);transition: all 0.3s linear;d:path("M10, 11 L10, 11");}
                            </style>
                            <line class="st0" y1="11" x1="10" y2="11" x2="250"></line>
                            <path class="st0" id="progress"></path>
                        </svg>
                        `;
                        //uploading
                        let data = new FormData();
                        data.append('profile', blob, "profile.png");
                        
                        let config = {
                            headers: {
                                ...getRequestHeader(),
                                'Content-Type' : 'multipart/form-data'
                            },
                            onUploadProgress: data => {
                                load = Math.round((240*data.loaded)/data.total);
                                document.getElementById("progress").style.d = `path("M10, 11 L${load+10}, 11")`;
                            }
                        };
                        axios.post("/profile", data, config).then(response => {
                            if(response.data){
                                setTimeout(()=>finishOverflowDialog(), 400);
                                location.href = "#home";
                            }
                        }).catch(error => console.log('error', error))
                    });
            }
        }
        fr.readAsDataURL(selectFile[0]);
    }
}
document.querySelector("#openfile").onchange = changeProfile;
var prsarveDialog = "";
function openOverflowDialog(){
    prsarveDialog = document.querySelector("#overflow-dialog").innerHTML;
    document.querySelector("#overflow-dialog").classList.toggle("open");
}
function finishOverflowDialog(){
    document.querySelector("#overflow-dialog").innerHTML = prsarveDialog;
    document.querySelector("#overflow-dialog").classList.toggle("open");
    viewAuthMenus();
}


/*

    fetch("/classroom", {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMmI0ZThlZTUyYmM2YjM5MTZjNzY4MSIsImVtYWlsIjoic2hhZGhpbjEwQGdtYWlsLmNvbSIsImlhdCI6MTY0NzAwNTMyNn0.ODrlCN9eNUiat89BxgSfowe-i6s-ehH7IWijO2W26Ms"
        },
        //   "body": "{\"title\":\"My Graphics Class\",\"description\":\"This is simple Description\"}"
        "body":JSON.stringify({
                    title: "simple title",
                    description: "Shadhin is my name"
                })
    })
    .then(response => {
        console.log(response);
    })
    .catch(err => {
        console.error(err);
    });



*/

function openCloser(action, selector=""){
    let trac = false;
    let toggle = ()=>{
        trac = ! trac;
        if(trac){
            document.addEventListener("click", outliteHandle);
        }else{
            document.removeEventListener("click", outliteHandle);
        }
        action(trac);
    }
    let outliteHandle = (event) =>{
        if(selector)
        {
            let target = event.target;
            if(!target.closest(selector))
            {
                toggle();
            }
        }else{
            toggle();
        }
    }
    let handle = (event)=>{
        event.stopPropagation();
        if(typeof action == "function")
        {
            toggle();
        }
    }
    return handle;
}
//copy text
function clipboardCopy() {
    var copyText = document.getElementById("myInput");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);

    var tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = "Copied: " + copyText.value;
}

// toggle menus
var menus = document.querySelectorAll(".menu-toggle, .avater");
if(menus)
{
    for (let index = 0; index < menus.length; index++) {
        const element = menus[index];
        const toggler = (event)=>{
            element.classList.toggle("open");
            if(element.dataset.toggleid){
                document.querySelector("#"+element.dataset.toggleid).classList.toggle("open");
            }
        }
        element.addEventListener("click",openCloser(toggler, ".more-option"));
    }
}

//add cliboard
function clipboardCopy(id) {
    /* Get the text field */
    var copyText = document.getElementById(id);
  
    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */
  
     /* Copy the text inside the text field */
    navigator.clipboard.writeText(copyText.value);
    /* Alert the copied text */
} 


//call global
showPage(location.hash);

setTimeout(loadNotify, 100);