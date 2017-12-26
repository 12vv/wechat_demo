$(document).ready(function() {
    var selfid = $.cookie('selfid');
    console.log(selfid);
    baseurl = "http://localhost:3000";
    $.ajaxSetup({ xhrFields: { withCredentials: true }, crossDomain: true });
    message_save = new Array();

    co = 0;
    rem = 0;
    if (navigator.userAgent.indexOf("Firefox") >= 0) {
        $(".mesbox").niceScroll({
            cursorcolor: "#000",
            autohidemode: true,
            zindex: 2000000000,
            disableoutline: true,
            cursorborder: "0",
            cursorwidth: "6px",
            iframeautoresize: true,
        })
        $(".contacts").niceScroll({
            cursorcolor: "#5a5b60",
            background: "#9c9d9f",
            autohidemode: true,
            zindex: 20000,
            disableoutline: true,
            cursorborder: "0",
            cursorwidth: "6px",
            iframeautoresize: true,
        })
    }


    function save() {
        if ($("#rm").is(":checked")) {
            localStorage.setItem('username', $("#name").val());
            localStorage.setItem('password', $("#psw").val());
        } else {
            localStorage.setItem('username', "");
            localStorage.setItem('password', "");
        }
    }


    $(".search_bar").keyup(function(e) {
        if (e.keyCode == 13) {
            search();
        }
    })
    $(".search_bar").focus(function() {
        $(".search_bar").val("");
        $(".contacts3").children().show();
    })
    $(".search_bar").blur(function() {
        $(".search_bar").val("搜索");
    })


    $(document).keydown(function(e) {
        if (e.keyCode == 13) {
            if ($(".login").css("display") != "none") {
                $("#login").click();
            }
            if ($(".edit").css("display") != "none") {
                $(".submitedit").click();
            }
            if ($(".chatbox").css("display") != "none" && $("textarea").is(":focus")) {
                $(".send").click();
            }
        }
    })

    $.ajax({
        type: "GET",
        url: baseurl + '/getUserInfo',
        data: {
            id: selfid
        },
        dataType: "html",
        success: function(data) {
            console.log(data);
            var obj = eval("(" + data + ")");
            if (obj.result == "failed") {} else {
                $("#address").val(obj.address);
                $("#mailbox").val(obj.mailbox);
                $("#introduction").val(obj.introduction);
                $("#nickname").val(obj.nickname);
                $("#age").val(obj.age);
                $(".nickname").text(obj.nickname);
            }
        },
        error: function() {

        }
    })

    save();
    setTimeout(refresh, 5000); //刷新信息
    //获取好友列表getList
    $.ajax({
        type: "GET",
        url: baseurl + '/getList',
        dataType: "html",
        success: function(data) {
            $("#list3").click();
            var objj = eval("(" + data + ")");
            // var objj = eval("(" + obj + ")");
            for (var i = 0; i < objj.length; i++) {
                var contact = $("<div></div>").addClass("contact_item");
                var img = $("<i></i>").addClass("aimg");
                var inf = $("<div class='inf'></div>");
                var txt = $("<h4></h4>").text(objj[i].nickname);
                inf.append(txt);
                contact
                    .append(img)
                    .append(inf);
                contact.attr("id", objj[i].id);

                $(".contacts3").append(contact);
            }
            $(".contacts3").children().click(function() {
                console.log($(this).attr("id"));
                $(this).css({ "background-color": "#3b4047" });
                $(this).siblings().css({ "background-color": "#2e3238" });

                $(".title").text("详细信息");
                $(".getinfo").show();
                $(".getinfo").siblings().hide();
                $(".mesbox").children().remove();

                var userid = $(this).attr("id");
                //获取用户信息getUserInfo
                $.ajax({
                    type: "GET",
                    url: baseurl + '/getUserInfo',
                    data: {
                        id: $(this).attr("id")
                    },
                    dataType: "html",
                    success: function(data) {
                        var obj = eval("(" + data + ")");
                        if (obj.result == "failed") {} else {
                            $(".add").text(obj.address);
                            $(".mai").text(obj.mailbox);
                            $(".int").text(obj.introduction);
                            $(".nic").text(obj.nickname);
                            $(".ag").text(obj.age);
                            $(".button").attr("id", userid);
                        }
                    },
                    error: function() {

                    }
                })
            })
        },
        error: function() {

        }
    })



    $(".opt").unbind('click').click(function(e) {
        $(".menu").show();
        $(document).one("click", function() {
            $(".menu").hide();
        })
        e.stopPropagation();
        $(".editinfo").parent().unbind('click').click(function(e) {
                $(".menu").hide();
                popupDiv('edit');
                $(document).one("click", function() {
                    hideDiv('edit');
                })
                e.stopPropagation();
                $(".edit").on("click", function(e) {
                    e.stopPropagation();
                }) /**/


                var check1, check2, check3;
                $(".edit input").blur(function() {
                    if ($(this).is("#nickname")) {
                        if (this.value == "") {
                            $(this).next().text("不能为空！");
                            check1 = 1;

                        } else { $(this).next().text("OK！"); }
                    }

                    if ($(this).is("#age")) {
                        var re = /^\d+$/;
                        if (this.value == "") {
                            $(this).next().text("不能为空！");
                            check2 = 1;
                        } else if (re.test(this.value) && this.value > 0 && this.value < 150) { $(this).next().text("OK！"); } else {
                            $(this).next().text("你的年龄好假！");
                            check2 = 1;
                        }
                    }

                    if ($(this).is("#mailbox")) {
                        var re = /^\w+\@[a-zA-Z0-9]+\.[a-zA-Z]{2,4}$/i;
                        if (this.value == "") {
                            $(this).next().text("不能为空！");
                            check3 = 1;
                        } else if (re.test(this.value)) { $(this).next().text("OK！"); } else {
                            $(this).next().text("你的邮箱好假！");
                            check3 = 1;
                        }
                    }
                })

                //修改信息updateUserInfor
                $(".submitedit").unbind('click').one('click', function() {
                    if (check1 != 1 && check2 != 1 && check3 != 1) {
                        $.ajax({
                            type: "POST",
                            url: baseurl + '/updateUserInfo',
                            data: {
                                nickname: $("#nickname").val(),
                                age: $("#age").val(),
                                address: $("#address").val(),
                                introduction: $("#introduction").val(),
                                mailbox: $("#mailbox").val()
                            },
                            dataType: "html",
                            success: function(data) {
                                var obj = eval("(" + data + ")");
                                if (obj.result == "success") {
                                    $(".nickname").text($("#nickname").val());
                                    hideDiv('edit');
                                }
                                if (obj.result == "failed") {
                                    $(".tip").text(obj.reason);
                                    popupDiv("alert");
                                }
                            },
                            error: function() {

                            }
                        })
                    } else {
                        $(".tip").text("请检查信息");
                        //$(".edit").hide();
                        popupDiv("alert");
                    }
                })
            })
            //下线，登出logout
        $(".logout").parent().unbind('click').click(function() {
            $.ajax({
                type: "GET",
                url: baseurl + '/logout',
                dataType: "html",
                /**/
                success: function(mes) {
                    var obj = eval("(" + mes + ")");
                    if (obj.result == "success") {
                        $(location).attr('href', '/');
                    }
                    if (obj.result == "failed") {
                        $(".tip").text(obj.reason);
                        popupDiv("alert");
                    }
                },
                error: function() {

                }

            })
        })
        $(".nos").parent().unbind('click').click(function() {
            $(".nos").next().text("开启声音");
            $(".nos").parent().attr("title", "开启声音");
            $(".nos").removeClass("nos").addClass("sound");

            au = $("#au").remove();
        })
        $(".sound").parent().unbind('click').click(function() {
            $(".sound").next().text("关闭声音");
            $(".sound").parent().attr("title", "关闭声音");
            $(".sound").removeClass("sound").addClass("nos");

            $("body").append(au);
        })
        $(".nonotice").parent().unbind('click').click(function() {
            $(".nonotice").next().text("开启桌面提醒");
            $(".nonotice").parent().attr("title", "开启桌面提醒");
            $(".nonotice").removeClass("nonotice").addClass("notice");

        })
        $(".notice").parent().unbind('click').click(function() {
            $(".notice").next().text("关闭桌面提醒");
            $(".notice").parent().attr("title", "关闭桌面提醒");
            $(".notice").removeClass("notice").addClass("nonotice");


        })
    })


    $("#list1").unbind('click').click(function() {
        var flag = 0;
        $(".reddot").css("display", "none");
        $(".title").text("发起聊天");
        $(".icon1").css({ "background-image": "url(../images/c11.png)" });
        $(".icon3").css({ "background-image": "url(../images/c3.png)" });
        $(".contacts1").show();
        $(".contacts1").siblings().hide();
        if ($(".contacts1").children().length == 0) {
            $(".init").show();
            $(".init").siblings().hide();
        } else {
            $(".contacts1").children().each(function(a, k) {
                if ($(k).css("background-color") == 'rgb(59, 64, 71)') {
                    $(k).click();
                    flag = 1;
                }
            })
        }
        if (flag == 0) {
            $(".init").show();
            $(".init").siblings().hide();
        }
        $(".no").css({ "background": "url(../images/in1.png) no-repeat center" });
    })


    $("#list3").unbind('click').click(function() {
        $(".title").text("详细信息");
        $(".icon3").css({ "background-image": "url(../images/c33.png)" }); /**/
        $(".icon1").css({ "background-image": "url(../images/mes.png)" });
        $(".contacts3").show();
        $(".contacts3").children().show();
        $(".contacts3").siblings().hide();
        $(".init").show();
        $(".init").siblings().hide();
        $(".no").css({ "background-image": "url(../images/contact.png)" });
    })

    $('.contacts1').delegate('.contact_item', 'click', function(e) {
        console.log($(this).attr("id"));
        $(this).find("p").css("color", "white");
        $(this).siblings().find("p").css("color", "#989898");
        $(this).find(".red").remove();
        console.log($(this).attr("id"));
        $(".mesbox").children().remove();

        var user_id = $(this).attr("id");
        var name = $(this).find("h4").text();
        $(this).css({ "background-color": "#3b4047" });
        $(this).siblings().css({ "background-color": "#2e3238" });
        $(".title").text(name);
        $(".chatbox").siblings().hide();
        $(".chatbox").show();
        showmes(user_id);
        $(".record").unbind('click').click(function(e) {
            getChatRecord(user_id); //获取与某好友的聊天记录getChatRecord
            co++;
        })
        $(".send").unbind('click').click(function() {
            var content = $("textarea").val();
            sendContent(user_id, selfid, content); //发送消息sendContent
        })
        $(".face1").unbind('click').click(function(e) {
            $(".mmpop").show();
            $(document).one("click", function() {
                $(".mmpop").hide();
            })
            e.stopPropagation();
            $(".qq_face").children().unbind('click').click(function() {
                console.log($(this).attr("title"));
                var emtext = "[" + $(this).attr("title") + "]";

                var reg = new RegExp('/\[.+?\]/');
                console.log(reg);
                var text = $("textarea").val();
                text += emtext;
                $("textarea").val(text);

            })
        })
    })

    $(".button").unbind('click').click(function() {
        $("#list1").click();
        $(".title").text($(".nic").text());
        $(".chatbox").siblings().hide();
        $(".chatbox").show();
        var user_id = $(this).attr("id");
        traverse(user_id);
        $(".contacts1").show();
        $(".contacts1").siblings().hide();

        $(".contacts1").children().each(function(a, k) {
            if ($(k).attr("id") == user_id) { $(k).click(); }
        })

        $(".send").unbind('click').click(function() {
            var content = $("textarea").val();
            sendContent(user_id, selfid, content); //发送消息sendContent	
        })
        $(".record").unbind('click').click(function(e) {
            getChatRecord(user_id); //获取与某好友的聊天记录getChatRecord
            //console.log("1");
            co++;

        })
        $(".contacts1").bind("contextmenu", function() {
            return false;
        })
        $(".contacts1").children().unbind('mousedown').mousedown(function(e) {
            var deleteid = $(this).attr("id");
            var deleteper = $(this);
            var x = 5;
            var y = 10;
            console.log(e.which);
            if (e.which == 3) {
                var pop = "<div class='pop'><span class='delete'>删除聊天</span></div>";
                $("body").append(pop);
                $(".pop").css({
                    "top": (e.pageY + y) + "px",
                    "left": (e.pageX + x) + "px"
                })
                console.log($(this).attr("id"));
                $(document).one("click", function() {
                    $(".pop").remove();
                })
                e.stopPropagation();
            }
            $(".pop").unbind('click').click(function() {
                console.log(message_save.length);
                for (var i = 0; i < message_save.length; i++) {
                    if (message_save[i]["sender"] == deleteid || message_save[i]["receiver"] == deleteid) {
                        message_save.splice(i, 1);
                    }
                }
                deleteper.remove();
                $("#list1").click();
            })
        })

        $(".face1").unbind('click').click(function(e) {
            $(".mmpop").show();
            $(document).one("click", function() {
                $(".mmpop").hide();
            })
            e.stopPropagation(); /**/
            $(".qq_face").children().unbind('click').click(function() {
                console.log($(this).attr("title"));
                var emtext = "[" + $(this).attr("title") + "]";

                var reg = new RegExp('/\[.+?\]/');
                console.log(reg);
                var text = $("textarea").val();
                text += emtext;
                $("textarea").val(text);

            })
        })
    })
})





//未读消息getUnreadChatRecord
function refresh() {

    $.ajax({
        type: "GET",
        url: baseurl + '/getUnreadChatRecord',
        dataType: "html",
        success: function(data) {

            //JSON.parse(data);
            console.log(data);
            var obj = eval("(" + data + ")");
            //var objj = eval("("+obj+")");
            if (obj.length == 0) {

            } else if (obj.length > 0) {
                if ($("#au")[0]) {
                    $("#au")[0].play();
                }
                var count = 1;
                for (var i = 0; i < obj.length; i++) {

                    savemes(selfid, obj[i].sender, obj[i].content);

                    traverse(obj[i].sender);
                    if ($(".contacts1").css("display") == "none") {
                        $(".reddot").css("display", "inline-block");
                    }

                    $(".contacts1").children().each(function(a, k) {
                        for (var j = 0; j < obj.length && j != i; j++) {
                            if (obj[i].sender == obj[j].sender) {
                                count++;
                            }
                        }
                        if ($(k).attr("id") == obj[i].sender) {
                            $(k).find("p.msg").html(tran(obj[i].content));
                            var ni = $(k).find("h4").text();
                            notice(ni, obj[i].content);
                            $(k).find("p.ext").text(obj[i].date.slice(11, 16));
                            if ($(k).find("i.red").text()) {
                                $(k).find("i.red").text(parseInt($(k).find("i.red").text()) + count);

                            } else {
                                console.log($(k).find("i.red").text());


                                $(k).append("<i class ='red'>" + count + "</i>"); //计数
                            }
                            if ($(k).css("background-color") == "rgb(59, 64, 71)") {
                                $(k).find("i.red").remove();
                                showmes(obj[i].sender);
                            }

                        }

                    })


                } //添加红点

            } else {

            }
        },
        error: function() {

        }
    })
    setTimeout(refresh, 5000);
}



function savemes(receiver, sender, mes) {
    this.receiver = receiver;
    this.sender = sender;
    var obj = new Object();
    obj.receiver = receiver;
    obj.sender = sender;
    obj.mes = mes;
    console.log(receiver);
    console.log(sender);
    console.log(mes);
    message_save.push(obj);
}


function showmes(id) {
    co = 0;
    console.log(id);
    $(".mesbox").children().remove();
    var record = $("<p class = 'record'></p>");
    record.text("查看历史消息");
    $(".mesbox").append(record);
    var t = 0;
    for (var i = 0; i < message_save.length; i++) {
        if (id == message_save[i]["sender"] || id == message_save[i]["receiver"]) {
            //console.log(message_save[i]["mes"]);
            t = 1;
            var content = message_save[i]["mes"];
            var parent = $(".mesbox");
            var message = $("<div class='message'></div>");

            if (message_save[i]["receiver"] == selfid) {
                var bubble = $("<div class='bubble bubble2'></div>");
                var img = $("<div class='post post2'><img src='../images/pos.jpg'></div>");
            } else {
                var bubble = $("<div class='bubble bubble1'></div>");
                var img = $("<div class='post'><img src='../images/214.png'></div>");
            }
            var inmessage = $("<p></p>");
            //inmessage.text(content);
            inmessage.html(tran(content));
            bubble.append(inmessage);
            message.append(img).append(bubble);
            $(".mesbox").append(message);
            $(".mesbox").scrollTop($(".mesbox")[0].scrollHeight);
        }
        var k = i;
    }
    if (t == 0) {
        var nomes = $("<p class='mes_emp'></p>");
        $(nomes).text("暂时没有新消息");
        $(".mesbox").append(nomes);
    }

}

function sendContent(receiver, sender, content) {
    if ($(".mes_emp")) { $(".mes_emp").remove(); }
    console.log(receiver);
    $.ajax({
        type: "POST",
        url: baseurl + '/sendContent',
        dataType: "html",
        data: {
            receiver: receiver,
            content: content,
        },
        success: function(data) {
            var date = new Date();
            hour = date.getHours();
            minute = date.getMinutes();
            var obj = eval("(" + data + ")");
            if (obj.result == "success") {
                savemes(receiver, selfid, content);
                /*alert(message_save[0]["id"]);
                showmes(user_id);*/
                $("textarea").val("");
                var parent = $(".mesbox");
                var message = $("<div class='message'></div>");
                var bubble = $("<div class='bubble bubble1'></div>");
                var img = $("<div class='post'><img src='../images/214.png'></div>");
                var inmessage = $("<p></p>");
                var loading = $("<div class='loading'><img src='../images/loading.gif'></div>");

                //inmessage.text(content);
                inmessage.html(tran(content));
                $(".contacts1").children().each(function(i, n) {

                    if ($(n).attr("id") == receiver) {

                        //$(this).find("p.msg").text(content);
                        $(this).find("p.msg").html(tran(content));
                        var before = $(this).find("p.ext").text();
                        $(this).find("p.ext").text((hour < 10 ? '0' : '') + hour + ":" + (minute < 10 ? '0' : '') + minute);
                        var now = $(this).find("p.ext").text();
                        //console.log(now.slice(3,5)-before.slice(3,5));
                        if ((now.slice(3, 5) - before.slice(3, 5)) >= 1) {
                            var time = $("<span class = 'time'></span>");
                            var tmessage = $("<div class='tmessage'></div>");
                            time.text(now);
                            tmessage.append(time);

                            $(".mesbox").append(tmessage);
                        }
                        console.log((now.slice(3, 5) - before.slice(3, 5)));
                    }
                }) /**/


                bubble.append(inmessage);
                message.append(img).append(bubble).append(loading);
                $(".mesbox").append(message);
                $(".mesbox").animate({
                    'scrollTop': $(".mesbox")[0].scrollHeight
                }, 1000);
                loading.delay(200).hide(0);
            } else {
                $(".tip").text(obj.reason);
                popupDiv("alert");
            }
        },
        error: function() {

        }
    })
}

function getChatRecord(id) {
    var i;

    $(".mesbox").children(".mes_emp").remove();
    $(".mesbox").children(".tmessage").remove();
    if (co == 0) {
        $(".mesbox").children(".message").remove();
    }

    console.log(co);
    $.ajax({
        type: "GET",
        url: baseurl + '/getChatRecord',
        dataType: "html",
        data: {
            id: id
        },
        success: function(data) {
            //JSON.parse(data);
            console.log(data);
            var obj = eval("(" + data + ")");
            if (co == 1) {
                i = obj.length - 1;
                console.log(i);
            } else {
                i = rem;
                console.log(i);
            }
            if (obj.length == 0) {
                var nomes = $("<p class='mes_emp'></p>");
                $(nomes).text("没有历史消息");
                $(".mesbox").append(nomes);
            } else if (obj.length > 0) {
                for (var t = 0; t < 20 && i >= 0; i--, t++) {
                    var parent = $(".mesbox");
                    var message = $("<div class='message'></div>");
                    if (id == obj[i].sender) {
                        var bubble = $("<div class='bubble bubble2'></div>");
                        var img = $("<div class='post post2'><img src='../images/pos.jpg'></div>");
                    } else {
                        var bubble = $("<div class='bubble bubble1'></div>");
                        var img = $("<div class='post'><img src='../images/214.png'></div>");
                    }
                    var inmessage = $("<p></p>");
                    inmessage.html(tran(obj[i].content));

                    bubble.append(inmessage);
                    message.append(img).append(bubble);
                    $(".record").after(message);
                }
                rem = i;
            } else {

            }
        },
        error: function() {

        }
    })
}

function traverse(user_id) {
    $(".contacts3").children().each(function(i, n) {
        if (user_id == $(n).attr("id")) {
            var i = 0;
            if ($(".contacts1").children().length > 0) {
                $(".contacts1").children().each(function(a, k) {
                    if (user_id == $(k).attr("id")) {
                        i = 1;
                    }
                })
            }
            if (i == 0 || $(".contacts1").children().length == 0) {
                var clone = $(n).clone(true);

                clone.find(".inf")
                    .append("<p class='ext'></p>")
                    .append("<p class='msg'></p>");
                $(".contacts1").prepend(clone);

            }
        }
    })
}

function search() {
    var target = $(".search_bar").val();
    $(".contacts3").children().each(function() {
        if ($(this).find("h4").text() == target) {
            $(this).show();
        } else if ($(this).find("h4").text() != target) {
            $(this).hide();
        }
    })
}


function popupDiv(div_class) {
    var $div_obj = $("." + div_class);
    $("<div id='bg'></div>").appendTo("body").fadeIn("fast");
    $div_obj.css({
        "position": "absloute"
    }).animate({
        opacity: "show"
    }, "fast");
    $(document).one("click", function() {
        hideDiv(div_class);
    })
    $div_obj.on("click", function(e) {
        e.stopPropagation();
    })
}


function hideDiv(div_class) {
    $("#bg").remove();
    $("." + div_class).animate({
        opacity: "hide"
    }, "fast");
}

function notice(sender, text) {
    var i = 0;
    console.log(Notification.permission);
    if ($(".menu ul").children(":first").find("i").hasClass("nonotice")) {
        var notification = new Notification(sender + " :", {
            body: text,
            icon: '../images/pos.jpg',
            tag: 1,
            renotify: true,
        });
    }
}

function tran(str) {

    if (typeof str == "string") {
        var t;
        var strnode;
        var dat;
        var strarr = str.match(/[^\[]+(?=\])/g); //方括号中内容
        var all = str.match(/\[.+?\]/); //包括方括号
        //var tag = str.match(/(?!<img.+?>)<.+?>/g);             
        var tag = str.match(/(?!<img[^>]*?(src=\'..\/images\/spacer.gif\')[^>]*?>)<.+?>/g);
        //console.log(tag);
        str = str.replace(/\s/g, "&nbsp;");
        //console.log(str);

        if (tag != null) {
            for (var j = 0; j < tag.length; j++) {
                console.log(tag[j]);
                var tagin = tag[j].match(/[^<]+(?=>)/);
                console.log(tagin[0]);
                str = str.replace(/(?!<img[^>]*?(src=\'..\/images\/spacer.gif\')[^>]*?>)<.+?>/, "&lt" + tagin[0] + "&gt"); //除img外的标签
                console.log(str); //
            }
        }

        if (strarr != null) {
            for (var j = 0; j < strarr.length; j++) {
                $(".qq_face").children().each(function(a, k) {
                    if ($(k).attr("title") == strarr[j]) {
                        str = str.replace(/\[.+?\]/, '<img class=' + '"' + $(k).attr("class") + '"' + ' src="../images/spacer.gif"' + '/>'); //
                        //console.log(str);
                        var tran = str.replace(/\[.+?\]/, '');
                    }
                })
            }
        }
        return str;
    }
}


//头像放大
$(function() {
    var x = 1;
    var y = 2;
    $(".post img").click(function(e) {
        //$(".tooltip").show();
        $(".tooltip").animate({
            height: 'hide',
            width: 'hide',
        }, 1);
        $(".tooltip").animate({
            height: 'show',
            width: 'show'
        }, 500);
        $(".tooltip").css({
            "display": "block",
            "top": (e.pageY + y) + "px",
            "left": (e.pageX + x) + "px",
        }, 1000)
        $(document).one("click", function() {
            $(".tooltip").hide();
        })
        e.stopPropagation();
        $(".tooltip").on("click", function(e) {
            e.stopPropagation();
        })
    })
})