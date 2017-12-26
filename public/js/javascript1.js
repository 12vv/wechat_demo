var selfid;
$(document).ready(function() {
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


    $("#name").val(localStorage.getItem('username'));
    $("#psw").val(localStorage.getItem('password'));

    if (localStorage.getItem('username') == "") {
        $("#name").val("username");
        $("#psw").val("password");
        $("#psw").attr("type", "text");
        $("#rm").attr("checked", false);
    } else {
        $("#rm").attr("checked", true);
    }

    $("#name").focus(function() {
        var val = $(this).val();
        if (val == "username") {
            $(this).val("");
            $(this).css("color", "black");
        }
    })
    $("#name").blur(function() {
        var val = $(this).val();
        if (val == "") {
            $(this).val("username");
            $(this).css("color", "whitesmoke");
        }
    })
    $("#psw").focus(function() {
        var val = $(this).val();
        $(this).attr("type", "password");
        if (val == "password") {
            $(this).val("");
            $(this).css("color", "black");
        }
    })
    $("#psw").blur(function() {
        var val = $(this).val();
        if (val == "") {
            $(this).attr("type", "text");
            $(this).val("password");
            $(this).css("color", "whitesmoke");
        }
    })

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
        //登录login
    $("#login").click(function() {
        $.ajax({
            type: "GET",
            url: baseurl + '/login',
            data: {
                account: $("#name").val(),
                password: $("#psw").val()
            },
            dataType: "html",
            success: function(data) {
                console.log(data);
                var obj = eval("(" + data + ")");
                if (obj.result == "success") {
                    //存储自己的id
                    $.cookie('selfid', obj.userid);
                    selfid = obj.userid;
                    console.log(selfid);
                    $(location).attr('href', '/mainpage'); //跳转界面
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
})

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