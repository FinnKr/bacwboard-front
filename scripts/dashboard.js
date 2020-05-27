getBoards();

function getBoards(){
    var content = document.getElementById("dashboard_boards");
    content.innerHTML = '<div class="loader"></div>'
    var reqUrl = url + "/board";
    var req = new XMLHttpRequest();
    req.overrideMimeType("application/json");
    req.open("GET", reqUrl, true);    
    req.setRequestHeader("Authorization", getCookieByName("token"))
    req.onreadystatechange = function() {
        if (this.readyState == 4){
            if (this.status == 200) {                
                var jsonResponse = JSON.parse(req.responseText);
                content.innerHTML = parseBoardsToHtml(jsonResponse);
            } else if (this.status == 401) {
                window.location = UNAUTHORIZED_URL;
            }
        }
    }
    req.send();
}

function createBoard(){
    showModal("create_board_modal");
    var title = document.getElementById("create_board_title");
    var category = document.getElementById("create_board_category");
    var btnSbm = document.getElementById("create_board_submit");
    title.value = "";
    category.value = "Eigene Boards"
    document.querySelectorAll(".create_board_input").forEach(elem => {
        elem.addEventListener("keyup", function(){
            if (!title.value || !category.value) {
                btnSbm.classList.remove("create_board_submit_active");
                btnSbm.classList.add("create_board_submit");
            } else {
                btnSbm.classList.remove("create_board_submit");
                btnSbm.classList.add("create_board_submit_active");
            }
        });
    });
}

function createBoardRequest() {
    var btnSbm = document.getElementById("create_board_submit");
    var title = document.getElementById("create_board_title");
    var category = document.getElementById("create_board_category");
    if (title.value && category.value){        
        const board = JSON.stringify({
            "title": document.getElementById("create_board_title").value,
            "category": document.getElementById("create_board_category").value
        });
        var reqUrl = url + "/board";
        var req = new XMLHttpRequest();
        req.overrideMimeType("application/json");
        req.open("POST", reqUrl, true);
        req.setRequestHeader("Content-type", "application/json");
        req.setRequestHeader("Authorization", getCookieByName("token"));
        req.onreadystatechange = function () {
            if (this.readyState == 4){
                if (this.status == 201) {
                    window.location = DASHBOARD_URL;
                } else if (this.status == 401) {                
                    window.location = UNAUTHORIZED_URL;
                }
            }
        }
        req.send(board);
    } else {
        btnSbm.classList.remove("create_board_submit_active");
        btnSbm.classList.add("create_board_submit");
    }
}

function parseBoardsToHtml(res) {
    var boards_html = "";
    if (res.length >= 1){
        var catTitles = [];
        var i = 0;
        res.forEach(board => {
            if (!(catTitles.some(e => e.category === board.category))){
                catTitles.push(new cat_titles(board.category, `<div id="board_${board.id}" class="boards">${board.title}</div>`));
            } else {
                catTitles.forEach(pair => {
                    if (pair.category == board.category) {                        
                        catTitles[i].titles += `</span><div id="board_${board.id}" class="boards">${board.title}</div>`;
                    }
                    i++;
                });
                i = 0;
            }
        });
        i = 0;
        catTitles.forEach(pair => {
            boards_html += `<div class="board_category"><h2>${pair.category}</h2><div class="board_titles_content">${pair.titles}</div></div>`;
            i++;
        });
    } else {
        boards_html = "<h2>Bisher wurden noch keine Boards erstellt</h2>";
    }
    return boards_html;

}

function cat_titles (category, firstTitle){
    this.category = category;
    this.titles = firstTitle;
}