$( document ).ready(function() {
    //sidebar setting
    $('.sidebar').first().sidebar({

    }).sidebar('attach events', '#btn_sidebar');

    //initial canvas and crop canvas and some global var
    var canvas = new fabric.Canvas('canvas');
    var m_canvas = new fabric.Canvas('modal-canvas');
    var stamp = null;

    //initial canvas from template.json
    canvas.loadFromJSON(json, canvas.renderAll.bind(canvas));

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
                canvas.add(iimg);
                canvas.remove(stamp);

            });
        });

        $('#myModal').modal('hide');
        m_canvas.clear();
    });

    //on click imgbox img
    $('#imgbox > img').click(function(e) {
        stamp = canvas.getActiveObject();
        console.log("===========e.target.src" + e.target.src);
        console.log("===========img click");
//        function handle_img_click(e) {
        if(!canvas.getActiveObject()) {
            return alert('请先在画板中选择一个图案，再点击图片剪切。');
        };
//            canvas.getActiveObject().clone(function (o) {
////                o.opacity = 0.5;
//                stamp = o;
//                console.log(o);
//                console.log("===========getActiveObject");
////                stamp.hasControls = false;
//            });
        //load img
        fabric.Image.fromURL(e.target.src, function (oimg) {
            if (oimg.width > 750) {
                oimg.height = oimg.height * (750 / oimg.width);
                oimg.width = 750;
            }
            m_canvas.centerObject(oimg);
            m_canvas.add(oimg);
            oimg.setCoords();

            var circle = new fabric.Circle({
                radius: stamp.radius, fill: '#cccccc', left: 0, top: 0, opacity: 0.5
            });

            stamp = circle;


            m_canvas.centerObject(stamp);
            m_canvas.add(stamp).setActiveObject(stamp);
            stamp.setCoords();
        });
        $('#my_modal').modal('show');


        //});
    });



});
