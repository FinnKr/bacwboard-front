// getBoards();

function getBoards(){
    var reqUrl = url + "/board";
    var req = new XMLHttpRequest();
    req.overrideMimeType("application/json");
    req.open("GET", reqUrl, true);    
    req.setRequestHeader("Authorization", getCookieByName("token"))
    req.onreadystatechange = function() {
        if (this.readyState == 4){
            if (this.status == 200) {
                var jsonResponse = JSON.parse(req.responseText);
            } else if (this.status == 401) {
                document.getElementById("dashboard_content").innerHTML = UNAUTHORIZED_HTML;
            }
        }
    }
    req.send();
}

function createBoard(){
    showModal("create_board_modal");
    document.getElementById("INPUTFELDER")
}

function createBoardRequest() {
    var reqUrl = url + "/board";
    var req = new XMLHttpRequest();
    req.overrideMimeType("application/json");
    req.open("POST", reqUrl, true);
    req.setRequestHeader("Content-type", "application/json");
    req.setRequestHeader("Authorization", getCookieByName("token"));
    req.onreadystatechange = function () {
        if (this.readyState == 4){
            if (this.status == 201) {
                var jsonResponse = JSON.parse(req.responseText);
            } else if (this.status == 401) {
                document.getElementById("dashboard_content").innerHTML = UNAUTHORIZED_HTML;
            }
        }
    }
}