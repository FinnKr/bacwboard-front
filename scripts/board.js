function getLists(){
    var content = document.getElementById("board_content");
    content.innerHTML = LOADER_HTML;
    var reqUrl = url + "/list/" + getParams(window.location.href).board_id;
    console.log(reqUrl);
    
    var req = new XMLHttpRequest();
    req.overrideMimeType("application/json");
    req.open("GET", reqUrl, true);
    req.setRequestHeader("Authorization", getCookieByName("token"));
    req.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                var jsonResponse = JSON.parse(req.responseText);
                content.innerHTML = parseListsToHtml(jsonResponse);
            } else if (this.status == 401) {
                window.location = UNAUTHORIZED_URL;
            } else {
                console.log(this.status);
                console.log(this.responseText);
            }
        }
    }
    req.send();
}