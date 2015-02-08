finalruby
=========



##index

##bbs

##用户
1、添加用户模型user.js
注册
登录
登出
验证
检测
修改
资料
##搜索
    标题搜索
    是否给ruby加标题


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
    步骤
    1、初始化并测试socket io 到 express
        初始化socket.io-stream 并测试
    2、测试上传一个 简单数据
    3、测试上传 blog图片
    4、测试上传进度
    5、测试上传图片兼数据 到mongodb
        初始化一个id 一个write stream
        pipe
        on data on error on end
        gm
        ruby
###发帖 发评论 发图
    1、列出类别
    2、发帖
        发帖页面
        上传图片
            单张 单张 上传
            最后
            todo 数据验证
            todo util image js redirect url 在部署时候需要修改
    3、列出帖
        单个社区列表页面
            todo 分页
            todo post schema 用户的索引 {user:id, username:username}
        单个帖页面
            post schema 改结构 categoryid category userid user
    4、回帖