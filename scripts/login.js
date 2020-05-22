document.querySelectorAll(".login_input_field").forEach(elem => {
    elem.addEventListener("keyup", function(event){
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("login_submit").click();
        }
    });
});

function login(){    
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
                window.location = window.location.protocol + "//" + window.location.host + "/dashboard/";
            } else if (this.status == 401) {
                document.getElementById("login_response").innerHTML = "Nutzername oder Passwort falsch!";
            }
        }
    }
    const reqBody = JSON.stringify({
        "mail": document.getElementById("login_mail").value,
        "password": document.getElementById("login_password").value
    });
    req.send(reqBody);
}

function getExpireDate(){
    var now = new Date();
    var time = now.getTime();
    time += 3600 * 1000;
    now.setTime(time);
    return now.toUTCString();
}