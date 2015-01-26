$( document ).ready(function() {
    //sidebar setting
    $('.sidebar').first().sidebar({

    }).sidebar('attach events', '#btn_sidebar');

    //initial canvas and crop canvas and some global var
    var canvas = new fabric.Canvas('canvas');
    canvas.setBackgroundColor('white', canvas.renderAll.bind(canvas));
    var m_canvas = new fabric.Canvas('modal-canvas');
    var stamp = null;

    //initial canvas from template.json
    canvas.loadFromJSON(json, canvas.renderAll.bind(canvas));
    canvas.getObjects().map(function(o) {
        o.set('lockMovementY', true);
        o.set('lockMovementX', true);
        o.set('hasControls', false);
        return;
    });

    //on click save
    $('#save').click(function() {
        var png = canvas.toDataURL();
        window.location.replace(png);
    });

    //on click crop
    $('#crop').click(function() {
        stamp.opacity = 0;
        //crop
        var dataUrl = null;
        dataUrl = m_canvas.toDataURL({
            top: stamp.top,
            left: stamp.left,
            width: stamp.width * stamp.scaleX,
            height: stamp.height *  stamp.scaleY
        });

        stamp = canvas.getActiveObject();

        fabric.Image.fromURL(dataUrl, function(iimg) {
            console.log('load img');
            iimg.top =  stamp.top;
            iimg.left = stamp.left;

            stamp.opacity =1;
            var stam_png = stamp.toDataURL();
            fabric.Image.fromURL(stam_png, function(mimg) {
                console.log('load mask');
                iimg.filters.push( new fabric.Image.filters.Mask( { 'mask': mimg, channel:3} ) );

                iimg.applyFilters(canvas.renderAll.bind(canvas));
                iimg.lockMovementY = true;
                iimg.lockMovementX = true;
                iimg.hasControls = false;
                canvas.add(iimg);
                canvas.remove(stamp);

            });
        });

        $('#myModal').modal('hide');
        m_canvas.clear();
    });

    //on click imgbox img
    //$('#imgbox > img').click(function(e) {
    function handle_img_click(e) {
        var img_src = e.target.src || $(e.target).children().first().attr('src');
        //stamp = canvas.getActiveObject();
        console.log("===========e.target.src" + e.target.src);
        console.log("===========img click");
//        function handle_img_click(e) {
        if(!canvas.getActiveObject()) {
            return alert('请先在画板中选择一个图案，再点击图片剪切。');
        };
        stamp = fabric.util.object.clone(canvas.getActiveObject());
        stamp.hasControls = false;
        stamp.opacity = 0.5;
        stamp.lockMovementY = false;
        stamp.lockMovementX = false;

//        load img
        fabric.Image.fromURL(img_src, function (oimg) {
            if (oimg.width > 750) {
                oimg.height = oimg.height * (750 / oimg.width);
                oimg.width = 750;
            }
            m_canvas.centerObject(oimg);
            m_canvas.add(oimg);
            oimg.setCoords();



            m_canvas.centerObject(stamp);
            m_canvas.add(stamp).setActiveObject(stamp);
            stamp.setCoords();
        });
        $('#my_modal').modal('show');



    };



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
        var files = evt.target.files;

        //loop throuth the FileList and render image files as thumbnails.
        for (var i = 0, f; f = files[i]; i++) {

            //only process image files.
            if (!f.type.match('image.*')) {
                continue;
            }

            var reader = new FileReader();

            //closure to capture the file information.
            reader.onload = (function(theFile) {
                return function (e) {
                    //Render thumbnail.
                    var thumb = ['<a class="item"><img  src="',
                        e.target.result,
                        '" title="', escape(theFile.name),
                        '"/></a>'].join('');
                    $('.sidebar').append($(thumb).click(function(e){handle_img_click(e)}));
                };
            })(f);

            //read in the image file as a data URL.
            reader.readAsDataURL(f);
        }
    }

    document.getElementById('files').addEventListener('change',
        handleFileSelect, false);


    $('#img-add').click(function() {
        $('#files').click();
        return false;
    });

});
