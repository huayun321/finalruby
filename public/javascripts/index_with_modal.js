function show_detail() {
    $('#mindex')
        .modal('show')
    ;
};
function show_img(path) {
    var _img = document.getElementById('big_ruby');
    var newImg = new Image;
    newImg.onload = function() {
        _img.src = this.src;
    }
    newImg.src = path;

    $('#imodal')
        .modal('show')
    ;
};

function show_user() {
    $('#user_modal')
        .modal('show')
    ;
};

$( document ).ready(function() {

});