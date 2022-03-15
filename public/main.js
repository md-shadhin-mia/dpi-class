const pageContents = document.querySelector(".page-contents");
function showPage(hashname){
    classnames = hashname.split("#")
    if(classnames[1])
    {
        for(let i=0; i < pageContents.children.length ; i++){
            if(pageContents.children[i].classList.contains(classnames[1])){
                pageContents.children[i].style.display = "block";
            }else{
                pageContents.children[i].style.display = "none";
            }
        }
    }else{
        //home
        showPage("#home");
    }
    if(classnames[2]){
        switch (classnames[1]) {
            case "classroom":
                let id = classnames[2];
                fetch("/classroom/"+id, {
                    "method": "GET",
                    "headers": getRequestHeader()
                })
                .then(response => response.json())
                .then(data=>{
                    console.log(data);
                    let render = `<h2>
                                    ${data.title}
                                    <span>(${data.students.length})</span>
                                    </h2>
                                  <h3>${data.host.name}</h3>`;
                    document.querySelector(".classroom > .head").innerHTML = render;
                })
                .catch(err => {
                    console.error(err);
                });
                break;
            default:
                break;
        }
    }
}

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
    fetch("/classroom/"+id, {
            "method": "GET",
            "headers": getRequestHeader()
            }
    )
    .then(res=>res.json())
    .then(data=>{
        if(data._id){
            console.log(data);
            location.href = "/#classroom#"+data._id;
        }
    })
    .catch(err => {
        console.error(err);
    });
    history.pushState(0, 0, "/")
    console.log(id);
}

onhashchange = () =>{
    showPage(location.hash);
}

showPage(location.hash);
//auth checking for header
var header = document.getElementById("authcheck");

function viewAuthMenus(){
    if(localStorage.getItem("auth")){
        header.classList.add("authed")
    }
}
viewAuthMenus();


//forms
signinForm = document.querySelector("#signin-form");
registerForm = document.querySelector("#register-form");
createClassForm = document.querySelector("#create-class-form");

//signin
signinForm.onsubmit = (e)=>{
    e.preventDefault();
    let signin = e.target;
    fetch("/auth/login", {
            "method": "POST",
            "headers": getRequestHeader(),
            "body": JSON.stringify({
                email: signin.email.value,
                password: signin.password.value
            })
        })
        .then(response => response.json())
        .then(data=>{
            if(data.token){
                localStorage.setItem("auth", JSON.stringify(data));
                location.href = ""
                viewAuthMenus();
            }
        })
        .catch(err => {
            console.error(err);
        });
}

//register
registerForm.onsubmit = (e)=>{
    e.preventDefault();
    let signup = e.target;
    fetch("/auth/register", {
            "method": "POST",
            "headers": getRequestHeader(),
            "body": JSON.stringify({
                name:signup.name.value,
                email: signup.email.value,
                password: signup.password.value
            })
        })
        .then(response => response.json())
        .then(data=>{
            if(data.token){
                localStorage.setItem("auth", JSON.stringify(data));
                location.hash = ""
                viewAuthMenus();
            }
        })
        .catch(err => {
            console.error(err);
        });
}


// classroom create
createClassForm.onsubmit = (e)=>{
    e.preventDefault();
    let datas = e.target;
    fetch("/classroom", {
        "method": "POST",
        "headers": getRequestHeader(),
        "body":JSON.stringify({
                    title: datas.title.value,
                    description: datas.description.value
                })
    })
    .then(response => response.json())
    .then(data=>{
        console.log(data);
    })
    .catch(err => {
        console.error(err);
    });
}




//load contents
var classes = document.createElement("div");
classes.className = "classes"

function viewClasses(){
    let token = JSON.parse(localStorage.getItem("auth")).token;
    fetch("/classroom", {
        "method": "GET",
        "headers": getRequestHeader()
    })
    .then(response => response.json())
    .then(data=>{
        classes.innerHTML = "";
        data.forEach(cls => {
            let item = document.createElement("div");
            item.className = "class-item"
            item.innerHTML = `
                    <a href="#classroom#${cls._id}">
                        <h3>${cls.title}</h3>
                        <p>${cls.description}</p>
                    </a>
            `;
            classes.appendChild(item);
        });
        document.querySelector(".home").appendChild(classes);
    })
    .catch(err => {
        console.error(err);
    });
}

if(localStorage.getItem("auth")){
    viewClasses()
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