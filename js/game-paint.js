/**
 * Created by erdi on 21.12.2016.
 */
var webBase = './';
$("body").append('<div id="cursor"></div>');

$(".select-image img").mousedown(function () {
    var image = $(this).data("image");
    $("#start-page").fadeOut(250);
    $("#play-page").delay(400).fadeIn(250);
    $.get(webBase + "/images/" + image + ".svg", function (data) {
        $("#paint-area").html(data).promise().done(function(){
            resizeFake(0);
        });
        // $("#paint-area [id]").hide();
        $("#paint-area path").each(function (i) {
            // $(this).delay(i * 7).show(3000 / i);
            $(this).attr('data-id', 'er-'+i).removeAttr('id');
        });
        $("#paint-area-fake").html($("#paint-area").html())
    }, 'text');
});
$("#go-start a").click(function () {
    $("#play-page").fadeOut(250);
    $("#start-page").delay(400).fadeIn(250);
});
var pen = [
    "acikmavi",
    "beyaz",
    "kahve",
    "kirmizi",
    "koyuyesil",
    "mavi",
    "mor",
    "mor1",
    "mor2",
    "sari",
    "sari2",
    "turuncu",
    "yesil",
];
var color = [
    "#4666a3",
    "#fff",
    "#915002",
    "#c4383b",
    "#235446",
    "#385293",
    "#9a0055",
    "#c447c7",
    "#85368c",
    "#e2e345",
    "#dba115",
    "#da540d",
    "#669142",
];
var paintColor;
$.each(pen, function (i, v) {
    var _class;
    var cur = $("#cursor");
    if (i == 0) {
        _class = 'active';
        paintColor = color[i];
        cur.css("background-image", "url('" + webBase + "/images/kalem_" + v + ".png')");
    }
    $("#colorArea").append("<img src='" + webBase + "/images/kalem_" + v + ".png' data-color='" + color[i] + "' class='"+_class+"'>");
});
$("#colorArea").append("<img src='" + webBase + "/images/silgi.png' data-color='#fff' class='eraser'>");
$(document).delegate("#play-page svg path", "mousedown", function () {
    var id = $(this).data("id");
    $("#play-page svg path[data-id='"+id+"']").css("fill", paintColor)
});
var cur = $("#cursor");

$("#colorArea img").mousedown(function () {
    $("#colorArea img").removeClass("active");
    $(this).addClass("active");
    paintColor = $(this).data("color");
    cur.css("background-image", "url("+$(this).attr("src")+")");
    if ($(this).hasClass('eraser')) {
        cur.css("width", "36px");
    }else{
        cur.css("width", "16px");
    }

});

$("#paint-download a").click(function () {
    var data = "data:image/svg+xml;base64,"+window.btoa($("svg").wrap("<div id='xyz'/>").parent().html());
    $(this).attr("href", data);

});
$("#page-next a:not(.disabled)").click(function () {
    page += pageLimit;
    getPage();
});
$("#page-prev a:not(.disabled)").click(function () {
    page -= pageLimit;
    getPage();
});
var page = 0;
var pageLimit = 2;
function getPage() {
    $("#page-prev a, #page-next a").removeClass('disabled');
    $("#page-next a").show();

    $(".select-image:visible").fadeOut(250);
    for (var i = page; i < page + pageLimit; i++) {
        if ($(".select-image:eq("+i+")").length > 0) {
            $(".select-image:eq("+i+")").delay(300).fadeIn();
        }else{
            $("#page-next a").hide();
        }
    }
    if (page == 0) {
        $("#page-prev a").addClass('disabled');
    }
    if ($(".select-image").length < page + pageLimit) {
        $("#page-next a").addClass('disabled');
    }
}
getPage();
$(window).mousemove(function (e) {
    $("#cursor").css("top", e.pageY - 9).css("left", e.pageX+19);
});

function resizeFake(t) {
    t++;
    var a = $("#paint-area");
    var h = -a.height();
    $("#paint-area-fake").css("margin-top", h);
    if (t <= 15) {
        setTimeout(function () {
            resizeFake(t);
        },150);
    }
}

$(document).delegate("#paint-area-fake", "mouseenter mouseleave", function (e) {
    var c = $("#cursor");
    if (e.type === 'mouseenter') {
        c.show();
    }else{
        c.hide()
    }
});

$(window).resize(function () {
    resizeFake();
});