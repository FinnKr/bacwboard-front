document.querySelectorAll(".login_input_field").forEach(elem => {
    elem.addEventListener("keyup", function(event){
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("login_submit").click();
        }
    });
});

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
            if (this.status == 200) {                
                var jsonResponse = JSON.parse(req.responseText);
                var expireDate = getExpireDate();
                document.cookie = "token=" + jsonResponse.token + "; expires=" + expireDate + ";path=/;sameSite=strict";
                window.location = DASHBOARD_URL;
            } else if (this.status == 401) {
                showErrMsg("Nutzername oder Passwort falsch");
                setTimeout(hideErrMsg, 5000);
                loginBtn.style.backgroundColor = "#5aac44";
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