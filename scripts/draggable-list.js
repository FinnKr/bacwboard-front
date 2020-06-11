function allowDrop(event){
    var tar = event.target;
    var tarCL = tar.classList;
    if (tarCL.contains("listentry-wrapper")) {
        removeShadow();
        var shadow = setShadow();
        var parent = tar.parentNode;
        if (parent){
            parent.insertBefore(shadow, tar.nextSibling);
        }
    } else if(tarCL.contains("list-entry-item")){
        removeShadow();
        var shadow = setShadow();
        var parent = tar.parentNode.parentNode;
        if (parent){
            parent.insertBefore(shadow, tar.parentNode.nextSibling);
        }
    } else if (tar.id == "list-wrapper"){
        removeShadow();
        var shadow = setShadow();
        tar.getElementsByClassName("list-content")[0].appendChild(shadow);
    } else if (tarCL.contains("list-title")){
        removeShadow();
        var shadow = setShadow();
        tar.nextSibling.insertBefore(shadow, tar.nextSibling.firstChild);
    } else if (tar.id == "create-listentry"){
        removeShadow();
        var shadow = setShadow();
        tar.parentNode.getElementsByClassName("list-content")[0].appendChild(shadow);
    } else if (containsInList(tarCL, ["create-listentry-btn", "create-listentry-form", "add-list-entry-input", "add-list-entry"]) 
                || tar.id == "add-listentry-btns" || tar.id == "hide-listentry-btn"){
        removeShadow();
        var shadow = setShadow();
        tar.closest("#create-listentry").parentNode.getElementsByClassName("list-content")[0].appendChild(shadow);
    } else if (tarCL.contains("list-element")) {
        removeShadow();
        var shadow = setShadow();
        tar.getElementsByClassName("list-content")[0].appendChild(shadow);
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
        oldShadow.replaceWith(document.getElementById(data));
    }
    // if (event.target.getAttribute("draggable") == "true"){
    //     event.target.parentNode.insertBefore(document.getElementById(data), event.target.nextSibling);
    // } else {
    //     event.target.appendChild(document.getElementById(data));
    // }
}

function setShadow(){
    event.preventDefault();
    var shadow = document.createElement('div');
    shadow.id = "dropped-pos-style";
    return shadow;
}

function removeShadow(){
    var oldShadow = document.getElementById("dropped-pos-style");
    if (oldShadow){
        oldShadow.remove();
    }
}