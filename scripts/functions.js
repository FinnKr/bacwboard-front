/**
 * Get the value of a cookie with specified name
 * @param   {String}    cname   The name of the cookie to find
 * @return  {String}            The value of the cookie
 */
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
};

/**
 * Get the URL parameters
 * source: https://css-tricks.com/snippets/javascript/get-url-variables/
 * @param   {String} url_string The URL
 * @return  {Obejct}            The URL parameters
 */
function getParams(url_string){
    var params = {};
    var parser = document.createElement("a");
    parser.href = url_string;
    var query = parser.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
};

/**
 * Deletes all cookies and returns the user to the login page
 * 
*/
function logout(){
    document.cookie = "";
    window.location = LOGIN_URL;
}