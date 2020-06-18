getLists();

function getLists(){
    window.removeEventListener("click", closeListEditEvent);
    var content = document.getElementById("board_content");
    content.innerHTML = LOADER_HTML;
    var reqUrl = url + "/list/" + getParams(window.location.href).board_id;
    var req = new XMLHttpRequest();
    req.overrideMimeType("application/json");
    req.open("GET", reqUrl, true);
    req.setRequestHeader("Authorization", getCookieByName("token"));
    req.onreadystatechange = function() {
        if (this.readyState == 4) {
            switch (this.status) {
                case 200:
                    var jsonResponse = JSON.parse(req.responseText);                
                    content.innerHTML = parseListsToHtml(jsonResponse);
                    getListentries();
                    break;
                case 401:
                    window.location = UNAUTHORIZED_URL;
                    break;
                case 404:
                    content.innerHTML = "<h1>Dieses Board existiert nicht</h1>";
                    break;
                default:
                    console.log(this.status);
                    console.log(this.responseText);
                    break;
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
            switch (this.status) {
                case 201:
                    getLists();
                    break;
                case 401:
                    window.location = UNAUTHORIZED_URL;
                    break;
                case 404:
                    console.log("Not found");
                    break;
                case 422:
                    console.log("Duplicate");
                    break;
                default:
                    console.log(this.status);
                    console.log(this.responseText);
                    break;
            }
        }
    }
    const list = JSON.stringify({
        "title": list_title,
        "board_id": board_id
    });
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
                switch (this.status) {
                    case 201:
                        getListentries();
                        var curInput = document.getElementById(`add-list-entry-input-${list_id}`);
                        curInput.value = "";
                        curInput.focus();
                        break;
                    case 401:
                        window.location = UNAUTHORIZED_URL;
                        break;
                    case 404:
                        console.log("Not found");
                        break;
                    default:
                        console.log(this.status);
                        console.log(this.responseText);
                        break;
                }
            }
        }
        const listentry = JSON.stringify({
            "title": listentry_title,
            "list_id": list_id
        });
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
            if (this.readyState == 4){
                switch (this.status) {
                    case 200:
                        var jsonResponse = JSON.parse(req.responseText);                
                        parseListentriesToHtml(jsonResponse);
                        break;
                    case 401:
                        window.location = UNAUTHORIZED_URL;
                        break;
                    case 404:
                        content.innerHTML = "<h1>Dieses Board existiert nicht</h1>";
                        break;
                    default:
                        console.log(this.status);
                        console.log(this.responseText);
                        break;
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
    req.setRequestHeader("Content-type", "application/json");
    req.setRequestHeader("Authorization", getCookieByName("token"));
    req.onreadystatechange = function() {
        if (this.readyState == 4){
            switch (this.status) {
                case 200:
                    getListentries();
                    break;
                case 401:
                    window.location = UNAUTHORIZED_URL;
                    break;
                case 304:
                    console.log("Not modified");
                    break;
                case 404:
                    console.log("Not found");
                    break;
                default:
                    console.log(this.status);
                    console.log(this.responseText);
                    break;
            }
        }
    }
    const changeInfo = JSON.stringify({
        "id": listEntryId,
        "upperId": upperListEntryId,
        "list_id": listId
    });
    req.send(changeInfo);
}

function changeBoardTitleRequest(newTitle){
    var reqUrl = url + "/board/" + getParams(window.location.href).board_id;
    var req = new XMLHttpRequest();
    req.overrideMimeType("application/json");
    req.open("PUT", reqUrl, true);
    req.setRequestHeader("Content-type", "application/json");
    req.setRequestHeader("Authorization", getCookieByName("token"));
    req.onreadystatechange = function(){
        if (this.readyState == 4){
            switch (this.status) {
                case 200:
                    getLists();
                    break;
                case 401:
                    window.location = UNAUTHORIZED_URL;
                    break;
                default:
                    showErrMsg(JSON.parse(this.responseText).message);
                    setTimeout(hideErrMsg, 3000);
                    break;
            }
        }
    }
    const newTitleJson = JSON.stringify({
        "title": newTitle
    });
    req.send(newTitleJson);
}

function addSharedUserRequest(sharedMail){
    var reqUrl = url + "/share";
    var req = new XMLHttpRequest();
    req.overrideMimeType("application/json");
    req.open("POST", reqUrl, true);
    req.setRequestHeader("Content-type", "application/json");
    req.setRequestHeader("Authorization", getCookieByName("token"));
    req.onreadystatechange = function (){
        if (this.readyState == 4){
            switch (this.status) {
                case 201:
                    showSuccessMsg("Shared");
                    setTimeout(hideSuccessMsg, 1500);
                    break;
                case 401:
                    window.location = UNAUTHORIZED_URL;
                    break;
                default:
                    showErrMsg(JSON.parse(this.responseText).message);
                    setTimeout(hideErrMsg, 3000);
                    break;
            }
        }
    }
    const sharedUser = JSON.stringify({
        "shared_user_mail": sharedMail,
        "board_id": getParams(window.location.href).board_id
    });
    req.send(sharedUser);
}

function changeListTitleRequest(listid, title, oldContent){
    var reqUrl = url + "/list/" + listid;
    var req = new XMLHttpRequest();
    req.overrideMimeType("application/json");
    req.open("PUT", reqUrl, true);
    req.setRequestHeader("Content-type", "application/json");
    req.setRequestHeader("Authorization", getCookieByName("token"));
    req.onreadystatechange = function () {
        if (this.readyState == 4){
            switch (this.status) {
                case 200:
                    getLists();
                    break;
                case 401:
                    window.location = UNAUTHORIZED_URL;
                    break;
                case 404:
                    // not found
                    break;
                default:
                    console.log(req.status);
                    console.log(req.responseText);
                    break;
            }
        }
    }
    const newTitle = JSON.stringify({
        "title": title
    });
    req.send(newTitle);
}

function deleteListentryRequest(listentryid) {
    var reqUrl = url + "/list/entry/" + listentryid;
    var req = new XMLHttpRequest();
    req.overrideMimeType("application/json");
    req.open("DELETE", reqUrl, true);
    req.setRequestHeader("Authorization", getCookieByName("token"));
    req.onreadystatechange = function () {
        if (this.readyState == 4){
            switch (this.status) {
                case 200:
                    getListentries();
                    break;
                case 401:
                    window.location = UNAUTHORIZED_URL;
                    break;
                case 404:
                    // not found
                    break;
                default:
                    console.log(req.status);
                    console.log(req.responseText);
                    break;
            }
        }
    }
    req.send();
    
}

function deleteBoardRequest(){
    document.body.classList.add("waiting");
    var reqUrl = url + "/board/" + getParams(window.location.href).board_id;
    var req = new XMLHttpRequest();
    req.overrideMimeType("application/json");
    req.open("DELETE", reqUrl, true);
    req.setRequestHeader("Authorization", getCookieByName("token"));
    req.onreadystatechange = function () {
        if (this.readyState == 4){
            switch (this.status) {
                case 200:
                    showDashboard();
                    break;
                case 401:
                    window.location = UNAUTHORIZED_URL;
                    break;
                case 404:
                    console.log("not found")
                    break;
                default:
                    console.log(this.status);
                    console.log(req.responseText);                    
            }
        }
    }
    req.send();
}

function deleteListRequest(listid) {
    document.body.classList.add("waiting");
    var reqUrl = url + "/list/" + listid;
    var req = new XMLHttpRequest();
    req.overrideMimeType("application/json");
    req.open("DELETE", reqUrl, true);
    req.setRequestHeader("Authorization", getCookieByName("token"));
    req.onreadystatechange = function () {
        if (this.readyState == 4){
            switch (this.status) {
                case 200:
                    getLists();
                    document.body.classList.remove("waiting");
                    break;
                case 401:
                    window.location = UNAUTHORIZED_URL;
                    break;
                case 404:
                    console.log("not found")
                    break;
                default:
                    console.log(this.status);
                    console.log(req.responseText);                    
            }
        }
    }
    req.send();
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

function manageBoard(el){
    showModal("manage_board_modal");
    var boardTitleInput = document.getElementById("manage_board_title");
    var boardTitleSubmit = document.getElementById("change_title_submit");
    var oldTitle = document.getElementById("board-title").innerText;
    boardTitleInput.value = oldTitle;
    boardTitleInput.addEventListener("keyup", () => {
        if (!boardTitleInput.value.trim() || boardTitleInput.value == document.getElementById("board-title").innerText) {
            boardTitleSubmit.classList.remove("manage_board_submit_active");
            boardTitleSubmit.classList.add("manage_board_submit");
        } else {
            boardTitleSubmit.classList.remove("manage_board_submit");
            boardTitleSubmit.classList.add("manage_board_submit_active");
        }
    });
    var accessUserInput = document.getElementById("add_shared_user");
    var accessUserSubmit = document.getElementById("add_user_submit");
    accessUserInput.value = "";
    accessUserInput.addEventListener("keyup", () => {
        if (!accessUserInput.value.trim()) {
            accessUserSubmit.classList.remove("manage_board_submit_active");
            accessUserSubmit.classList.add("manage_board_submit");
        } else {
            accessUserSubmit.classList.remove("manage_board_submit");
            accessUserSubmit.classList.add("manage_board_submit_active");
        }
    });
}

function changeBoardTitle(){
    var newTitle = document.getElementById("manage_board_title").value;
    var boardTitleSubmit = document.getElementById("change_title_submit");
    if (!newTitle.trim()){
        boardTitleSubmit.classList.remove("manage_board_submit_active");
        boardTitleSubmit.classList.add("manage_board_submit");
    } else {
        changeBoardTitleRequest(newTitle);
    }
}

function addSharedUser(){
    var sharedMail = document.getElementById("add_shared_user").value;
    var addUserSubmit = document.getElementById("add_user_submit");
    if (!sharedMail.trim()){
        addUserSubmit.classList.remove("manage_board_submit_active");
        addUserSubmit.classList.add("manage_board_submit");
    } else {
        addSharedUserRequest(sharedMail);
    }
}

function changeListTitle(listid, ele){
    el = ele.parentElement;
    var oldTitle = el.firstChild.innerText;
    var tempInput = document.createElement("input");
    tempInput.id = `change-list-${listid}`;
    tempInput.placeholder = "Titel";
    tempInput.value = oldTitle;
    tempInput.classList.add("change-list-title-input");
    // el.onclick = () => {return};
    tempInput. addEventListener("keyup", event => {
        if (event.keyCode === 13){
            event.preventDefault();
            if (tempInput.value.trim() && tempInput.value.trim() != oldTitle) {
                changeListTitleRequest(listid, tempInput.value, el.firstChild);
            } else {
                getLists();
            }
        }
    });
    var deleteList = document.createElement("div");
    deleteList.id = `delete-list-${listid}`;
    deleteList.innerHTML = "&#xA;&#x1F5D1;";
    deleteList.onclick = () => {deleteListRequest(listid);};
    deleteList.classList.add("delete-list-btn");
    var changeTitleForm = document.createElement("div");
    changeTitleForm.id = `change-list-title-form-${listid}`;
    changeTitleForm.classList.add("change-list-form");
    changeTitleForm.setAttribute("oldTitle", oldTitle);
    changeTitleForm.appendChild(tempInput);
    changeTitleForm.appendChild(deleteList);
    el.firstChild.replaceWith(changeTitleForm);
    window.addEventListener("click", closeListEditEvent);
    tempInput.focus();
}

function closeListEditEvent(event){
    var tarCL = event.target.classList;
    if (!tarCL.contains("delete-list-btn") && !tarCL.contains("change-list-title-input") && !tarCL.contains("list-title") && !tarCL.contains("title-std")){
        document.querySelectorAll(".change-list-form").forEach(elem => {
            const oldTitle = elem.getAttribute("oldTitle");
            console.log(elem.id.substring(23));
            
            elem.innerHTML = `<b class="title-std" onclick="changeListTitle(${elem.id.substring(23)}, this)">${oldTitle}</b>`;
            // elem.setAttribute("onclick", "changeListTitle(1,this)");
            //elem.onclick = () => {changeListTitle(elem.id.substring(11), elem);};
            window.removeEventListener("click", closeListEditEvent);
        });
    }
}

function deleteListentry(event){
    event.preventDefault();
    deleteListentryRequest(event.dataTransfer.getData("text").substring(18));
}

function testenIs(event){
    event.preventDefault();
    return false;
}

function showErrMsg(message) {
    var errMsg = document.getElementById("edit_response");
    errMsg.innerHTML = message;
    errMsg.style.marginTop = "0";
    errMsg.style.visibility = "visible";
    errMsg.style.opacity = "1";
    errMsg.style.width = "80%";
}

function hideErrMsg() {
    var errMsg = document.getElementById("edit_response");
    errMsg.style.opacity = "0";
    errMsg.style.visibility = "hidden";
    setTimeout(function(){ errMsg.style.marginTop = "-50px"; }, 1050);
}

function showSuccessMsg(message) {
    var errMsg = document.getElementById("edit_response");
    errMsg.innerHTML = message;
    errMsg.style.marginTop = "0";
    errMsg.style.visibility = "visible";
    errMsg.style.opacity = "1";
    errMsg.style.width = "80%";
    errMsg.style.backgroundColor = "green";
    errMsg.style.border = "1px solid green";
}

function hideSuccessMsg() {
    var errMsg = document.getElementById("edit_response");
    errMsg.style.opacity = "0";
    errMsg.style.visibility = "hidden";
    setTimeout(function(){ 
        errMsg.style.marginTop = "-50px";
        errMsg.style.backgroundColor = "rgb(235, 90, 70)";
        errMsg.style.border = "1px solid #EB5A46";
    }, 1050);
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
    return `<div id="list-wrapper"><div id="list_${list_id}" class="list-element"><div id="list-title-${list_id}" class="list-title"><b onclick="changeListTitle(${list_id}, this)" class="title-std">${list_title}</b></div><div id="list-content-${list_id}" class="list-content"></div><div id="create-listentry">${createListEntryBtnHtml(list_id)}</div></div></div>`;
}

function createListInputHtml(board_id){
    return `<div id="create-list-form"><input type="text" id="create-list-input" placeholder="Titel hinzufügen"><button id="create-list-submit" onclick="createListRequest(${board_id})"><b>+</b></button></div>`;
}

function showDashboard(){
    window.location = DASHBOARD_URL;
}