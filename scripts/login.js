document.querySelectorAll(".login_input_field").forEach(elem => {
    elem.addEventListener("keyup", function(event){
        if (event.key == "Enter") {
            event.preventDefault();
            document.getElementById("login_submit").click();
        }
    });
});

checkToken();

function checkToken(){
    const token = getCookieByName("token");
    if (token){
        var reqUrl = url + "/user/auth";
        var req = new XMLHttpRequest();
        req.open("GET", reqUrl, true);
        req.setRequestHeader("Authorization", token);
        req.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                window.location = DASHBOARD_URL;
            }
        }
        req.send();
    }
}

function login(){    
    var loginBtn = document.getElementById("login_submit");
    loginBtn.style.backgroundColor = "lightgrey";
    const reqUrl = url + "/user/login"
    var req = new XMLHttpRequest();
    req.overrideMimeType("application/json");
    req.open("POST", reqUrl, true);
    req.setRequestHeader("Content-type", "application/json");
    req.onreadystatechange = function() {
        if (this.readyState == 4){
            switch (this.status) {
                case 200:
                    var jsonResponse = JSON.parse(req.responseText);
                    var expireDate = getExpireDate();
                    document.cookie = "token=" + jsonResponse.token + "; expires=" + expireDate + ";path=/;sameSite=strict";
                    window.location = DASHBOARD_URL;
                    break;
                case 401:
                    showErrMsg("Nutzername oder Passwort falsch");
                    setTimeout(hideErrMsg, 5000);
                    loginBtn.style.backgroundColor = "#5aac44";
                    break;
                default:
                    console.log(this.status);
                    console.log(this.responseText);
                    break;
            }
        }
    }
    const reqBody = JSON.stringify({
        "mail": document.getElementById("login_mail").value,
        "password": document.getElementById("login_password").value
    });
    req.send(reqBody);
}

function showErrMsg(message) {
    var errMsg = document.getElementById("login_response");
    errMsg.innerHTML = message;
    errMsg.style.marginTop = "0";
    errMsg.style.visibility = "visible";
    errMsg.style.opacity = "1";
}

function hideErrMsg() {
    var errMsg = document.getElementById("login_response");
    errMsg.style.opacity = "0";
    errMsg.style.visibility = "hidden";
    setTimeout(function(){ errMsg.style.marginTop = "-50px"; }, 1050);
}

function getExpireDate(){
    var now = new Date();
    var time = now.getTime();
    time += 3600 * 1000;
    now.setTime(time);
    return now.toUTCString();
}