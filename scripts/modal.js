function showModal(modalname){
    var modal = document.getElementById(modalname);
    modal.style.display = "block";
    document.getElementsByClassName("close_modal")[0].onclick = function() {
        hideModal(modalname);
    }
    window.onclick = function() {
        if (this.event.target == modal){
            modal.style.display = "none";
        }
    }
}

function hideModal(modalname) {
    var modal = document.getElementById(modalname);
    modal.style.display = "none";
}