var moved_to_shadow = false;
function allowDrop(event){
    var tar = event.target;
    var tarCL = tar.classList;
    var dragEl = document.getElementById(event.dataTransfer.getData("text"));
    if (dragEl.classList.contains("list-element")){
        var height = event.dataTransfer.getData("height") + "px";
        dragEl.hidden = true;
        var shadow = document.getElementById("dropped-pos-style-list");
        if (!shadow){
            shadow = setListShadow(height);
            dragEl.parentElement.parentElement.insertBefore(shadow, dragEl.parentElement.nextSibling);
        }

        // If left sibling of shadow == dragged element: Pick next Sibling
        var sh_left = shadow.previousSibling;
        if (sh_left){
            if(sh_left.firstChild.id == dragEl.id){
                sh_left = shadow.previousSibling.previousSibling;
            }
        }

        // If right siblig of shadow == dragged element: Pick next Siblig
        // If picked sibling == create List button: Pick next sibling (=Null)
        var sh_right = shadow.nextSibling;
        if (sh_right){
            if(sh_right.firstChild.id == dragEl.id){
                sh_right = shadow.nextSibling.nextSibling
            }
            if (sh_right.id == "create-list"){
                sh_right = sh_right.nextSibling;
            }
        }

        if (tar.id == "dropped-pos-style-list"){
            moved_to_shadow = true;
        }

        if (moved_to_shadow){
            if (tar.id == "list-wrapper") {
                // Case: Shadow left
                if (sh_right && !sh_left){
                    removeListShadow();
                    shadow = setListShadow(height);
                    dragEl.parentElement.parentElement.insertBefore(shadow, sh_right.nextSibling);
                }
    
                // Case: Shadow right
                if (sh_left && !sh_right){
                    removeListShadow();
                    shadow = setListShadow(height);
                    dragEl.parentElement.parentElement.insertBefore(shadow, sh_left);
                }
    
                // Case: Shadow between
                if (sh_left && sh_right){
                    // Moved to left
                    if (sh_left == tar){
                        removeListShadow();
                        shadow = setListShadow(height);
                        dragEl.parentElement.parentElement.insertBefore(shadow, sh_left);
                    }
    
                    // Moved to right
                    if (sh_right == tar){
                        removeListShadow();
                        shadow = setListShadow(height);
                        dragEl.parentElement.parentElement.insertBefore(shadow, sh_right.nextSibling);
                    }
                }

                moved_to_shadow = false;
            } 
        }
        if (shadow){
            event.preventDefault();
        }
    } else {
        if (!(tar.id == "dropped-pos-style")){
            removeShadow();
            }
        if (tarCL.contains("listentry-wrapper")) {
            var shadow = setShadow();
            var parent = tar.parentNode;
            if (parent){
                parent.insertBefore(shadow, tar.nextSibling);
            }
        } else if(tarCL.contains("list-entry-item")){
            var shadow = setShadow();
            var parent = tar.parentNode.parentNode;
            if (parent){
                parent.insertBefore(shadow, tar.parentNode.nextSibling);
            }
        } else if (tar.id == "list-wrapper"){
            var shadow = setShadow();
            tar.getElementsByClassName("list-content")[0].appendChild(shadow);
        } else if (tarCL.contains("list-title")){
            var shadow = setShadow();
            tar.nextSibling.insertBefore(shadow, tar.nextSibling.firstChild);
        } else if (tarCL.contains("title-std")){
            var shadow = setShadow();
            tar.parentElement.nextSibling.insertBefore(shadow, tar.parentElement.nextSibling.firstChild);
        } else if (tar.id == "create-listentry"){
            var shadow = setShadow();
            tar.parentNode.getElementsByClassName("list-content")[0].appendChild(shadow);
        } else if (containsInList(tarCL, ["create-listentry-btn", "create-listentry-form", "add-list-entry-input", "add-list-entry"]) 
                    || tar.id == "add-listentry-btns" || tar.id == "hide-listentry-btn"){
            var shadow = setShadow();
            tar.closest("#create-listentry").parentNode.getElementsByClassName("list-content")[0].appendChild(shadow);
        } else if (tarCL.contains("list-element")) {
            var shadow = setShadow();
            tar.getElementsByClassName("list-content")[0].appendChild(shadow);
        } else if (tar.id == "delete_drop") {
            // console.log("deleteDragOver");
        } else {
            //console.log(tar);
        }
    }
}

function containsInList(tarList, searchList){
    var res = false;
    searchList.forEach(element => {
        if (tarList.contains(element)){
            res = true;
            return res;
        }
    });
    return res;
}

function drag(event){    
    event.dataTransfer.setData("text", event.target.id);
    event.dataTransfer.setData("height", event.target.clientHeight);
}

function drop(event){
    var data = event.dataTransfer.getData("text");
    //console.log(data);
    var dragElem = document.getElementById(data);
    if (dragElem.classList.contains("list-element")){
        var oldShadow = document.getElementById("dropped-pos-style-list");
        if (oldShadow){
            event.preventDefault();
            var listElem = dragElem;
            oldShadow.replaceWith(listElem.parentElement);
            listElem.hidden = false;
            var listId = data.substring(5);
            var upperListId = -1;
            if (listElem.parentElement.previousSibling){
                upperListId = listElem.parentElement.previousSibling.firstChild.id.substring(5);
            }
            console.log(listId, upperListId);
            moveListRequest(listId, upperListId);
        }
    } else {
        var oldShadow = document.getElementById("dropped-pos-style");
        if (oldShadow){
            event.preventDefault();
            var listentryElem = dragElem;
            oldShadow.replaceWith(listentryElem);
            var listEntryId = data.substring(18);
            var upperListEntryId = -1;
            if (listentryElem.previousElementSibling){
                var upperListEntryHtmlId = listentryElem.previousElementSibling.id;
                upperListEntryId = upperListEntryHtmlId.substring(18);
            }
            var listId = listentryElem.parentElement.id.substring(13);
            moveListentryRequest(listEntryId, upperListEntryId, listId);
        }
    }
}

function setListShadow(height){
    event.preventDefault();
    var listShadow = document.createElement('div');
    listShadow.id = "dropped-pos-style-list";
    listShadow.style.height = height;
    listShadow.style.width = "275px";
    listShadow.ondragover = function(){return false};
    listShadow.setAttribute("ondrop", "drop(event)");
    return listShadow;
}

function removeListShadow(){
    var oldShadow = document.getElementById("dropped-pos-style-list");
    if (oldShadow){
        oldShadow.remove();
    }
}

function setShadow(){
    event.preventDefault();
    var shadow = document.createElement('div');
    shadow.id = "dropped-pos-style";
    shadow.ondragover = function(){return false};
    shadow.setAttribute("ondrop", "drop(event)");
    return shadow;
}

function removeShadow(){
    var oldShadow = document.getElementById("dropped-pos-style");
    if (oldShadow){
        oldShadow.remove();
    }
}