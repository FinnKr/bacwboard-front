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
                getListentries();
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

function createListentryRequest(list_id) {
    var listentry_title = document.getElementById(`add-list-entry-input-${list_id}`).value.trim();
    if (listentry_title) {
        var reqUrl = url + "/list/entry";
        var req = new XMLHttpRequest();
        req.overrideMimeType("application/json");
        req.open("POST", reqUrl, true);
        req.setRequestHeader("Content-type", "application/json");
        req.setRequestHeader("Authorization", getCookieByName("token"));
        req.onreadystatechange = function() {
            if (this.readyState == 4){
                if (this.status == 201) {
                    // created
                    console.log("created");
                    getListentries();
                    var curInput = document.getElementById(`add-list-entry-input-${list_id}`);
                    curInput.value = "";
                    curInput.focus();
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
        const listentry = JSON.stringify({
            "title": listentry_title,
            "list_id": list_id
        });
        console.log(listentry);
        req.send(listentry);
    }
}

function getListentries(){
    var content = document.getElementById("board_content");
    var board_id = getParams(window.location.href).board_id;
    if (!board_id) {
        content.innerHTML = "<h1>Dieses Board existiert nicht</h1>";
    } else {
        var reqUrl = url + "/list/entry?board_id=" + board_id;
        var req = new XMLHttpRequest();
        req.overrideMimeType("application/json");
        req.open("GET", reqUrl, true);
        req.setRequestHeader("Authorization", getCookieByName("token"));
        req.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    var jsonResponse = JSON.parse(req.responseText);                
                    parseListentriesToHtml(jsonResponse);
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
}

function moveListentryRequest(listEntryId, upperListEntryId, listId){
    var reqUrl = url + "/list/entry/changeorder";
    var req = new XMLHttpRequest();
    req.overrideMimeType("application/json");
    req.open("PUT", reqUrl, true);
    req.onreadystatechange = function() {
        if (this.readyState == 4){
            if (this.status == 200){
                getListentries();
            } else if (this.status == 401) {
                window.location = UNAUTHORIZED_URL;
            } else if (this.status == 304) {
                console.log("Not modified");                
            } else if (this.status == 404) {
                console.log("Moved listentry not found");
            }
        }
    }
    const changeInfo = {
        id: listEntryId,
        upperId: upperListEntryId,
        list_id: listId
    }
    req.send(changeInfo);
}

function createList(board_id, elem) {
    var container = elem.parentElement;
    container.innerHTML = createListInputHtml(board_id);
    var form = document.getElementById("create-list-form");
    var doms = [form, elem]    
    Array.from(form.getElementsByTagName("*")).forEach(el => {
        doms.push(el);
    });
    var inputField = document.getElementById("create-list-input");
    inputField.addEventListener("keyup", function(event){
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("create-list-submit").click();
        }
    });
    inputField.focus();
    window.onclick = function() {
        if(!(doms.includes(this.event.target))){
            container.innerHTML = elem.outerHTML;            
        }
    }
}

function parseListsToHtml(res){
    res.sort((a, b) => { return a.order_number - b.order_number });
    var content_html = "";
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

function parseListentriesToHtml(res){
    res.sort((a, b) => { return a.order_number - b.order_number });
    document.querySelectorAll(".list-content").forEach(content => {
        content.innerHTML = "";
    });
    res.forEach(listentry => {
        var listcontent = document.getElementById(`list-content-${listentry.list_id}`);
        listcontent.innerHTML += listEntryHtml(listentry.id, listentry.title);
    });
}

function createListEntry(btn_el, list_id){
    var wrapper = btn_el.parentElement;
    wrapper.innerHTML = `<div id="create-listentry-form-${list_id}" class="create-listentry-form">` + listEntryInput(list_id) + `<div id="add-listentry-btns">` + addListEntryBtnHtml(list_id) + hideListentryFormHtml(list_id) + "</div></div>";
    var input_element = document.getElementById(`add-list-entry-input-${list_id}`);
    input_element.addEventListener("keyup", function(event){
        if (event.keyCode === 13){
            event.preventDefault();
            document.getElementById(`add-list-entry-${list_id}`).click();
        }
    });
    input_element.focus();
}

function hideListentryForm(list_id){
    document.getElementById(`create-listentry-form-${list_id}`).parentElement.innerHTML = createListEntryBtnHtml(list_id);
}

function listEntryHtml(listentry_id, listentry_title){
    return `<div id="listentry-wrapper-${listentry_id}" class="listentry-wrapper" draggable="true" ondragstart="drag(event)"><div id="list-entry-item-${listentry_id}" class="list-entry-item">${listentry_title}</div></div>`;
}

function createListEntryBtnHtml(list_id) {
    return `<div id="create-listentry-btn-${list_id}" class="create-listentry-btn" onclick="createListEntry(this, ${list_id})"><b>+</b> Einen Eintrag hinzufügen</div>`;
}

function hideListentryFormHtml(list_id){
    return `<div id="hide-listentry-btn" onclick="hideListentryForm(${list_id})">&times;</div>`
}

function listEntryInput(list_id){
    return `<input type="text" placeholder="Titel des neuen Eintrags" id="add-list-entry-input-${list_id}" class="add-list-entry-input">`;
}

function addListEntryBtnHtml(list_id){
    return `<div id="add-list-entry-${list_id}" class="add-list-entry" onclick="createListentryRequest(${list_id})">Eintrag hinzufügen</div>`;
}

function createListBtnHtml(board_id){
    return `<div id="create-list"><div id="create-list-btn" onclick="createList(${board_id}, this)"><b>+</b>Liste hinzufügen</div></div>`;
}

function createListHtml(list_id, list_title){
    return `<div id="list-wrapper"><div id="list_${list_id}" class="list-element"><div id="list-title-${list_id}" class="list-title"><b>${list_title}</b></div><div id="list-content-${list_id}" class="list-content"></div><div id="create-listentry">${createListEntryBtnHtml(list_id)}</div></div></div>`;
}

function createListInputHtml(board_id){
    return `<div id="create-list-form"><input type="text" id="create-list-input" placeholder="Titel hinzufügen"><button id="create-list-submit" onclick="createListRequest(${board_id})"><b>+</b></button></div>`;
}

function showDashboard(){
    window.location = DASHBOARD_URL;
}