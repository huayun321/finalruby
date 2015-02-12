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

    var user_id = '';
    var like_icon = null;
        var socket = io.connect('http://localhost:3000/index');

        socket.on("connect",function() {
            console.log("on connect");
        });

        socket.on('ok', function() {
            $('#' + like_icon + ' > i').toggleClass('red');
            if($('#' + like_icon + ' > span').text() == '收藏') {
                $('#' + like_icon + ' > span').text('取消收藏')
            } else {
                $('#' + like_icon + ' > span').text('收藏')
            }
        });

        socket.on('error', function(data) {
            alert(data);
        });



    function like(ruby_id) {
        like_icon = ruby_id;
        user_id = $('#user_id').val();
        socket.emit('like', {user_id:user_id, ruby_id:ruby_id});
    }

    function unlike(ruby_id) {
        like_icon = ruby_id;
        user_id = $('#user_id').val();
        socket.emit('unlike', {user_id:user_id, ruby_id:ruby_id});
    }

