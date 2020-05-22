const url = "http://localhost:8081"

function createSet(){
    var req = new XMLHttpRequest();
    req.overrideMimeType("application/json");
    req.open("GET", url, true);
    req.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var jsonResponse = JSON.parse(req.responseText);
            document.getElementById("setAreaContent").innerHTML += newSet(jsonResponse);
        }
    }
    req.send();
}

function newSet(res){
    console.log(res);
    return "Created";
}