var socket = "";
var vue = new Vue({
    el: "#app",
    data: {
        ClassFlag: 1,
        text: '',
        bt_status: 0,
        area_status: false,
        chatMessage: [{name: '小明', tiwen: '请用python写一个for循环', daan: '好的下面是...'},],
        loginFlag: false,
        registerFlag: false,
        is_account: false,
        community_input: '',
        prims_ai: ''
    },

    methods: {
        // 定位到输入框
        t: function (){
            const t = this.$refs.textarea;
            console.log(t)
            alert("测试")
            t.scrollIntoView();
        },
        // gpt
        c: function () {
            socket = io.connect('http://127.0.0.1:8000');
            // 测试
            socket.on('connect', () =>{
                console.log("连接成功")
            })
            socket.on('disconnect', ()=>{
                console.log('断开连接')
            })
            // 我方
            socket.on('me', (data)=>{
                console.log("me:"+data)
                var html = "<article class=\"media\" style=\"padding: 20px 32px 10px 32px\">\n" +
                    "           <figure class=\"media-left\">\n" +
                    "           <p class=\"image is-32x32\">\n" +
                    "           <img src=\"https://bulma.io/images/placeholders/128x128.png\">\n" +
                    "           </figure>\n" +
                    "           <div class=\"media-content\">\n" +
                    "           <div class=\"content\">\n" +
                    "           <strong>生</strong> <small>@johnsmith</small> <small>31m</small>\n" +
                    "           <br>\n" +
                    "               <div>"+ data+ "</div>\n" +
                    "           </div>\n" +
                    "           </div>\n" +
                    "           </article>"
                $("#msgDiv").append(html+'<br>')

            })
            // ai
            socket.on('ai', (data)=>{
                // console.log('ai:'+data)
                var html = " <article class=\"media\" style=\"padding: 20px 32px 10px 32px; background-color: rgba(238,238,238,0.27); \" ><figure class=\"media-left\"><p class=\"image is-32x32\"> <img src=\"https://bulma.io/images/placeholders/128x128.png\"> </figure> <div class=\"media-content\"> <div class=\"content\"> <strong>ChatGPT</strong> <small>2023-01-01</small> <small>31m</small> <br> <div class=\'dazi'\></div> </div> <nav class=\"level is-mobile\"> <div class=\"level-left\"> <a class=\"level-item\"> <span class=\"icon is-small\"><i class=\"fas fa-reply\"></i></span> </a> <a class=\"level-item\"> <span class=\"icon is-small\"><i class=\"fas fa-heart\"></i></span> </a> </div> </nav> </div> </article>\n"

                $("#msgDiv").append(html+'<br>')  // 先插入样式
                this.bt_status = 0
                this.area_status = false
                // mark格式化
                const converter = new showdown.Converter();
                const htmlText = converter.makeHtml(data);
                // 插入html。隐藏
                var o = $(".dazi:last")
                o.hide()  // 隐藏标签
                o.html(htmlText);  // 插入html
                this.a()   // 调用高亮和打字机
                Prism.highlightAll();

            })
            // 社区
            socket.on('communitys', (data)=>{
                console.log("社区"+data)
                var username = "小生"
                var username2 = "对方"
                var html = "<article class=\"media\" ><figure class=\"media-left\" ><p class=\"image is-32x32 \"><img src=\"https://bulma.io/images/placeholders/128x128.png\" class=\"\"></p></figure><div class=\"media-content\"><div class=\"content\"><div><strong class=\"tag is-primary\">"+username+"</strong><br><div style=\"margin-top: 2px;background-color: #ebebeb;padding: 10px;border-radius: 5px;display: inline-block;\">"+data+"</div></div></div></div></article>\n"
                var html2 = "<article class=\"media\" ><figure class=\"media-left\" ><p class=\"image is-32x32 \"><img src=\"https://bulma.io/images/placeholders/128x128.png\" class=\"\"></p></figure><div class=\"media-content\"><div class=\"content\"><div><strong class=\"tag is-dark\">"+username2+"</strong><br><div style=\"margin-top: 2px;background-color: #ebebeb;padding: 10px;border-radius: 5px;display: inline-block;\">"+data+"</div></div></div></div></article>\n"
                $("#c_msg").append(html)
                $("#c_msg").append(html2)
            })
        },
        // 打字效果
        printText: function (text, object) {
            object.show()
            var i = 0;
            var html = '';
            function print(){
                if (i < text.length) {
                    html += text[i];
                    i++;
                    object.html(html);  // 实时渲染
                    setTimeout(print, 10)
                }
            }
            print();
        },
        a: function(){
            // 时间太快，会自动识别代码失败
            setTimeout(this.b, 100)

        },
        // 获取高亮代码
        b: function () {
            var o = $(".dazi:last")
            this.prims_ai = o.html()  // 赋值
            this.printText(o.html(), o)  // 调用打字机
        },
        // 社区
        sendMsgCommunity: function (){
            if (this.ClassFlag === 3) {
                 socket.emit('community', this.community_input)
                console.log("社区发送成功")
                this.community_input = ''
            }
        },
        // 发送
        send_message: function() {
            if (this.ClassFlag === 1) {
                socket.emit('msg', this.text)
                this.text = ''
                this.bt_status = 1
                this.area_status = true
            }
        },
        // 房间数据
        get_message: function () {
            console.log("p")
            axios.post('http://127.0.0.1:8000/api')
                .then(response => {
                    console.log(response.data)
                    this.chatMessage = response.data
                    this.ClassFlag = 1
                })
        },



    },
    created(){
        // 页面加载就触发
        this.c()
    },


})

var a = ""