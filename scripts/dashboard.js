// getBoards();

function getBoards(){
    var reqUrl = url + "/board";
    var req = new XMLHttpRequest();
    req.overrideMimeType("application/json");
    req.open("GET", reqUrl, true);    
    console.log(getCookieByName("token"));
    req.setRequestHeader("authorization", getCookieByName("token"))
    req.onreadystatechange = function() {
        if (this.readyState == 4){
            if (this.status == 200) {
                var jsonResponse = JSON.parse(req.responseText);
            } else if (this.status == 401) {
                document.getElementById("dashboard_content").innerHTML = "<h1><b>401</b> Unauthorized</h1>";
            }
        }
    }
    req.send();
}