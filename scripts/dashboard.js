getBoards();

function getBoards() {
    getOwnBoards();
    getSharedBoards();
}

function getOwnBoards(){
    var content = document.getElementById("dashboard_boards");
    content.innerHTML = LOADER_HTML;
    var reqUrl = url + "/board";
    var req = new XMLHttpRequest();
    req.overrideMimeType("application/json");
    req.open("GET", reqUrl, true);
    req.setRequestHeader("Authorization", getCookieByName("token"));
    req.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                var jsonResponse = JSON.parse(req.responseText);
                content.innerHTML = parseBoardsToHtml(jsonResponse, "own");
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

function getSharedBoards(){
    var content = document.getElementById("dashboard_shared_boards");
    content.innerHTML = '<p><i>Freigegebene Boards werden geladen</i></p>' + LOADER_HTML;
    var reqUrl = url + "/share";
    var req = new XMLHttpRequest();
    req.overrideMimeType("application/json");
    req.open("GET", reqUrl, true);
    req.setRequestHeader("Authorization", getCookieByName("token"));
    req.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                var jsonResponse = JSON.parse(req.responseText);
                content.innerHTML = parseBoardsToHtml(jsonResponse, "shared");
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

function createBoard(el) {
    showModal("create_board_modal");
    var currentCategory = "Eigene Boards";
    var elCL = el.classList;
    for (var i = 0, l = elCL.length; i < l; ++i) {
        var curClass = elCL[i];
        if (/catid_.*/.test(curClass)) {
            var curCatId = curClass.substring(6);
            if (curCatId != "-1") {
                currentCategory = document.getElementsByClassName("catidc_" + curCatId)[0].firstChild.innerHTML;
            }
        }
    }
    var title = document.getElementById("create_board_title");
    var category = document.getElementById("create_board_category");
    var btnSbm = document.getElementById("create_board_submit");
    title.value = "";
    category.value = currentCategory;
    document.querySelectorAll(".create_board_input").forEach(elem => {
        elem.addEventListener("keyup", function () {
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
    if (title.value && category.value && btnSbm.classList.contains("create_board_submit_active")) {
        btnSbm.classList.remove("create_board_submit_active");
        btnSbm.classList.add("create_board_submit");
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
            if (this.readyState == 4) {
                if (this.status == 201) {
                    window.location = DASHBOARD_URL;
                } else if (this.status == 401) {
                    window.location = UNAUTHORIZED_URL;
                } else if (this.status == 422) {
                    showErrMsg("Ein Board mit diesem Titel existiert bereits");
                    setTimeout(hideErrMsg, 5000);
                } else {
                    console.log(this.status + "\n" + this.responseText);
                }
            }
        }
        req.send(board);
    } else {
        btnSbm.classList.remove("create_board_submit_active");
        btnSbm.classList.add("create_board_submit");
    }
}

function showErrMsg(message) {
    var errMsg = document.getElementById("create_response");
    errMsg.innerHTML = message;
    errMsg.style.marginTop = "0";
    errMsg.style.visibility = "visible";
    errMsg.style.opacity = "1";
    errMsg.style.width = "80%";
}

function hideErrMsg() {
    var errMsg = document.getElementById("create_response");
    errMsg.style.opacity = "0";
    errMsg.style.visibility = "hidden";
    setTimeout(function(){ errMsg.style.marginTop = "-50px"; }, 1050);
}

function parseBoardsToHtml(res, boards_type) {
    var boards_html = "";
    if (res.length >= 1) {
        var catTitles = [];
        var i = 0;
        res.forEach(board => {
            var catName = board.category.name;
            var boardHtml = makeBoardHtml(board.id, board.title);
            if (!(catTitles.some(e => e.category === catName))) {
                catTitles.push(new cat_titles(catName, boardHtml, board.category_id));
            } else {
                catTitles.forEach(pair => {
                    if (pair.category == catName) {
                        catTitles[i].titles += boardHtml;
                    }
                    i++;
                });
                i = 0;
            }
        });
        boards_html = makeBoardsHtml(catTitles);
        if (boards_type == "shared") {
            boards_html = "<h1>Freigegebende Boards</h1>" + boards_html;
        } else if (boards_type == "own") {
            boards_html = "<h1>Persönliche Boards</h1>" + boards_html;
        }
    } else {
        if (boards_type == "own") {
            boards_html = EMPTY_BOARDS_HTML + makeCreateBoardHtml(-1);
        } else if (boards_type == "shared") {
            boards_html = EMPTY_SHARED_BOARDS_HTML;
        }
    }
    return boards_html;
}

function openBoard(elem) {
    var board_id = elem.id.substring(6);
    window.location = BOARD_URL + "?board_id=" + board_id;
    
}

function cat_titles(category, firstTitle, category_id) {
    this.category = category;
    this.titles = firstTitle;
    this.category_id = category_id;
}

function makeBoardHtml(id, title) {
    return `<div id="board_${id}" class="boards" onclick="openBoard(this)">${title}</div>`;
}

function makeBoardsHtml(catTitles) {
    var boards_html = "";
    catTitles.forEach(pair => {
        boards_html += `<div class="board_category catidc_${pair.category_id}"><h2>${pair.category}</h2><div class="board_titles_content">${pair.titles}${makeCreateBoardHtml(pair.category_id)}</div></div>`;
    });
    return boards_html;
}

function makeCreateBoardHtml(category_id) {
    return `<div id="dashboard_create"><p id="dashboard_create_button" class="catid_${category_id}" onclick="createBoard(this)">Neues Board erstellen</p></div>`;
}