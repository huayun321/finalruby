finalruby
=========



##index

##bbs

##用户

##ruby


##整理

##路由
    ###先做路由
    index
    ruby
    bbs
    user

##界面
    bbs
    user
    ruby


##25
###在前端列出模板
    已完成初步
    todo 需要在后台完成模板的删除和修改
        界面问题需要修改
        例如底部的定位
        tag的颜色 随什么而定 有待完成
###修正前端一些问题
    ### 上传图片 本地上传图片
    ###各图形的切图
    ###pusher问题  已完成

###如果有时间
再完成上传
bbs发帖
###保存时的 form验证




###使用socketio 制作 canvas图片的 保存 并显示上传之进度
    逻辑
    1、canvas to dataurl 得到base 64的图片
    2、使用函数将 base64 图片 转换为 html5 blob
    3、使用 socket io blob stream 将 blob图片 并客户其他 参数 stream到 server
    4、socket server 将 图片流入 gridstream
        并触发事件 将 上传进度 发送至客户端
        并生成缩略图
        保存 ruby modal
            tag modal

