function allowDrop(event){
    var tar = event.target;
    var tarCL = tar.classList;
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
}

function drop(event){
    var oldShadow = document.getElementById("dropped-pos-style");
    if (oldShadow){
        event.preventDefault();
        var data = event.dataTransfer.getData("text");
        var listentryElem = document.getElementById(data);
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