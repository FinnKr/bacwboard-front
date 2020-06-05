getLists();

function getLists(){
    var content = document.getElementById("board_content");
    content.innerHTML = LOADER_HTML;
    var reqUrl = url + "/list/" + getParams(window.location.href).board_id;
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
            } else if (this.status == 404) {
                content.innerHTML = "<h1>Dieses Board existiert nicht</h1>";
            } else {
                console.log(this.status);
                console.log(this.responseText);
            }
        }
    }
    req.send();
}

function createListRequest(board_id){
    var list_title = document.getElementById("create-list-input").value;
    var reqUrl = url + "/list";
    var req = new XMLHttpRequest();
    req.overrideMimeType("application/json");
    req.open("POST", reqUrl, true);
    req.setRequestHeader("Content-type", "application/json");
    req.setRequestHeader("Authorization", getCookieByName("token"));
    req.onreadystatechange = function() {
        if (this.readyState == 4){
            if (this.status == 201) {
                // created
                getLists();
            } else if (this.status == 401) {
                window.location = UNAUTHORIZED_URL;
            } else if (this.status == 404) {
                // not found
                console.log("not found");
            } else if (this.status == 422) {
                // duplicate
                console.log("duplicate");
            } else {
                console.log(this.status);
                console.log(this.responseText);
            }
        }
    }
    const list = JSON.stringify({
        "title": list_title,
        "board_id": board_id
    });
    console.log(list);
    req.send(list);
}

function createList(board_id, elem) {
    var container = elem.parentElement;
    container.innerHTML = createListInputHtml(board_id);
    var form = document.getElementById("create-list-form");
    var doms = [form, elem]    
    Array.from(form.getElementsByTagName("*")).forEach(el => {
        doms.push(el);
    });
    window.onclick = function() {
        if(!(doms.includes(this.event.target))){
            container.innerHTML = elem.outerHTML;            
        }
    }
}

function parseListsToHtml(res){
    var content_html = ""
    res.forEach(function(list, index, array){
        if (!(index == array.length -1)){
            content_html += createListHtml(list.id, list.title);
        } else {
            // last element
            document.getElementById("board-title").innerHTML = `${list.board_title}`;
            content_html = `<div id="lists_${list.board_id}" class="board-lists">` + content_html + createListBtnHtml(list.board_id) + "</div>";
        }
    });
    return content_html;
}

function createListBtnHtml(board_id){
    return `<div id="create-list"><div id="create-list-btn" onclick="createList(${board_id}, this)"><b>+</b>Liste hinzufügen</div></div>`;
}

function createListHtml(list_id, list_title){
    return `<div id="list-wrapper"><div id="list_${list_id}" class="list-element">${list_title}</div></div>`;
}

function createListInputHtml(board_id){
    return `<div id="create-list-form"><input type="text" id="create-list-input" placeholder="Titel hinzufügen"><button id="create-list-submit" onclick="createListRequest(${board_id})"><b>+</b></button></div>`;
}

function showDashboard(){
    window.location = DASHBOARD_URL;
}