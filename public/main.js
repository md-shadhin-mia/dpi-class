const pageContents = document.querySelector(".page-contents");
function showPage(hashname){
    classname = hashname.split("#")[1]
    if(classname)
    {
        for(let i=0; i < pageContents.children.length ; i++){
            if(pageContents.children[i].classList.contains(classname)){
                pageContents.children[i].style.display = "block";
            }else{
                pageContents.children[i].style.display = "none";
            }
        }
    }else{
        //home
        showPage("#home");
    }
}


onhashchange = () =>{
    showPage(location.hash);
}

showPage(location.hash);

//forms
signinForm = document.querySelector("#signin-form");
registerForm = document.querySelector("#register-form");
//signin
signinForm.onsubmit = (e)=>{
    e.preventDefault();
    let signin = e.target;
    fetch("/auth/login", {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({
                email: signin.email.value,
                password: signin.password.value
            })
        })
        .then(response => response.json())
        .then(data=>{
            console.log(data);
        })
        .catch(err => {
            console.error(err);
        });
    console.log(signin.email.value);
}

//register



registerForm.onsubmit = (e)=>{
    e.preventDefault();
    let signup = e.target;
    fetch("/auth/register", {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({
                name:signup.name.value,
                email: signup.email.value,
                password: signup.password.value
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


//classroom create
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