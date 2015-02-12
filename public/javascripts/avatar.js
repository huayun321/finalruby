$( document ).ready(function() {
    var user_id = '';

    //socket.io thing
    $(function() {
        var socket = io.connect('http://918diy.com:3000/bbs');

        socket.on("connect",function() {
            console.log("on connect");
        });

        socket.on('progress', function(data) {
            console.log('progress === ' + data.progress+'%');
            $('#bar').css('display', 'block');
            $('#bar > div').css('width', data.progress+'%');
        });

        //uploaded

        socket.on('end-upload', function() {
            $('#upload_ok').css('display', 'block');
        });

        socket.on('err', function(data) {
            $('#upload_err').css('display', 'block');
            $('#upload_err > p').text(data.err);
        });

        function dataURItoBlob(dataURI) {
            // convert base64/URLEncoded data component to raw binary data held in a string
            var byteString;
            if (dataURI.split(',')[0].indexOf('base64') >= 0)
                byteString = atob(dataURI.split(',')[1]);
            else
                byteString = unescape(dataURI.split(',')[1]);

            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

            // write the bytes of the string to a typed array
            var ia = new Uint8Array(byteString.length);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            return new Blob([ia], {type:mimeString});
        }

        $('#post').click(function() {

            user_id = $('#user_id').val();

            var sum = $('#img_box').children().length;
            if(sum <= 0 ) {
                alert('请上传一张图片');
            } else {
                $('#post').addClass('disabled');
                $('#img-add').addClass('disabled');
            }


            $('#img_box > img').each(function() {
                var base64img = $(this).prop('src');
                var blob = dataURItoBlob(base64img);
                console.log('uploading...',blob);

                var stream = ss.createStream();
                var blobStream = ss.createBlobReadStream(blob);
                ss(socket).emit('avatar', stream, {size:blob.size, user_id:user_id});
                blobStream.pipe(stream);
            });

        });

    });

    /*
     *  browser upload img
     * */
    function browser_check() {
        if (window.File && window.FileReader && window.FileList &&
            window.Blob) {
            //All the File APIs are supported.
        } else {
            alert('当前网页浏览器版本过低，请下载新版浏览器。建议使用新版google浏览器或火狐浏览器。');
        }
    }

    browser_check();


    function handleFileSelect(evt) {
        $('#img_box').empty();
        var files = evt.target.files;

        //loop throuth the FileList and render image files as thumbnails.
        for (var i = 0, f; f = files[i]; i++) {

            //only process image files.
            if (!f.type.match('image.*')) {
                continue;
            }
            if (i >= 4) {
                continue;
            }

            var reader = new FileReader();

            //closure to capture the file information.
            reader.onload = (function (theFile) {
                return function (e) {
                    //Render thumbnail.
                    var thumb = ['<img class="ui image"  src="',
                        e.target.result,
                        '" title="', escape(theFile.name),
                        '"/>'].join('');
                    $('#img_box').append(thumb);
                };
            })(f);

            //read in the image file as a data URL.
            reader.readAsDataURL(f);
        }
    }

    document.getElementById('files').addEventListener('change',
        handleFileSelect, false);


    $('#img-add').click(function () {
        $('#files').click();
        return false;
    });



});