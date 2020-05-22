function getCookieByName(cname){
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);    
    var cookie_array = decodedCookie.split(";");
    for (var i = 0; i < cookie_array.length; i++){
        var cur_cookie = cookie_array[i];
        while (cur_cookie.charAt(0) == " "){
            cur_cookie = cur_cookie.substring(1);
        }
        if (cur_cookie.indexOf(name) == 0) {
            return cur_cookie.substring(name.length, cur_cookie.length);
        }
    }
    return -1;
}