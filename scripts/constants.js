const url = "http://localhost:8081";

const UNAUTHORIZED_URL = window.location.protocol + "//" + window.location.host + "/unauthorized";
const DASHBOARD_URL = window.location.protocol + "//" + window.location.host + "/dashboard";
const LOGIN_URL = window.location.protocol + "//" + window.location.host + "/login";
const BOARD_URL = window.location.protocol + "//" + window.location.host + "/board";

const LOADER_HTML = '<div class="loader"></div>';
const EMPTY_SHARED_BOARDS_HTML = "<h1>Freigegebene Boards</h1><p>Keine freigegebenen Boards :(</p><p>Bitte den Besitzer eines Boards um die Freigabe</p>";
const EMPTY_BOARDS_HTML = "<h1>Persönliche Boards</h1><h2>Bisher wurden noch keine Boards erstellt</h2>";