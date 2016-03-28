/*
  宽屏自动调高
  功能：根据背景图大小设置高度(宽屏图时候用)
  参数1：图片src
  参数2：要设置高度的jq节点	
*/
function setWideImgHeight(src,jqDom){
        var img = new Image();
        img.onload=function(){
            var imgHeight = img.height;
            $(jqDom).css("height",imgHeight);
        };
        img.src =src;
    }
function setWideImgs(imgList){
    for(var i=0;i<imgList.length;i++) {
        var jqDom = $(imgList[i]),
            allUrl = jqDom.css("background-image");
        var srcI=allUrl.substring(5,allUrl.length-2);
        if(srcI.substring(0,1)=="t"){
            srcI=allUrl.substring(4,allUrl.length-1);
        }
        setWideImgHeight(srcI,jqDom);
    }
}
//setWideImgs($(".wide_screen_box").find("p"))
/*是否PC端
*返回 true:是PC端，false:不是PC端
 */
function isPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}
/*
 *功能：瞬间滚屏
 *输入：触发事件DOM 目的地DOM 触发事件类型
 *注：必须为JS DOM节点不能为Jquery节点，JQ节点请get(0)
 */
 function ScrollTo(btnNode,destinationNode,eventType){
        function toDestination(){
            destinationNode.scrollIntoView();
        }
        var handler=function(){
            toDestination()
        };
        btnNode.addEventListener(eventType,handler,false);
 }
/*拖拽
*参数：被拖拽的元素ID
*/
function dray(id){
	function isPC() {
	    var userAgentInfo = navigator.userAgent;
	    var Agents = ["Android", "iPhone",
	        "SymbianOS", "Windows Phone",
	        "iPad", "iPod"];
	    var flag = true;
	    for (var v = 0; v < Agents.length; v++) {
	        if (userAgentInfo.indexOf(Agents[v]) > 0) {
	            flag = false;
	            break;
	        }
	    }
	    return flag;
	}
    var ispc=isPC();
    var keyBox=document.getElementById(id);
    var disX= 0,
        disY= 0;
    /*pc端拖拽*/
    if(ispc){
        (function() {
            keyBox.onmousedown = function (ev) {
                var e = ev || window.event;
                disX = e.clientX - keyBox.offsetLeft;
                disY = e.clientY - keyBox.offsetTop;
                document.onmousemove = function (ev) {
                    var e = ev || window.event;
                    var l = e.clientX - disX,
                        t = e.clientY - disY;
                    if (l < 0) {
                        l = 0
                    }
                    else if (l > document.documentElement.clientWidth - keyBox.offsetWidth) {
                        l = document.documentElement.clientWidth - keyBox.offsetWidth
                    }
                    if (t < 0) {
                        t = 0
                    }
                    else if (t > document.documentElement.clientHeight - keyBox.offsetHeight) {
                        t = document.documentElement.clientHeight - keyBox.offsetHeight
                    }
                    keyBox.style.left = l + "px";
                    keyBox.style.top = t + "px";
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                };
                document.onmouseup = function (ev) {
                    var e = ev = window.event;
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
                return false;
            }
        })();
    }
    /*移动端拖拽*/
    if(!ispc){
        $('body').on('touchmove touchstart', function (event) {
            event.preventDefault();
        });
        var moveStart=false;
        (function(){
            function touchInBox(ev){
                var e = ev || window.event;
                disX = e.touches[0].clientX - keyBox.offsetLeft;
                disY = e.touches[0].clientY - keyBox.offsetTop;
                moveStart=true;
            }
            function touchMoveBox(ev){
                var e = ev || window.event;
                if(moveStart){
                    var l=e.touches[0].clientX - disX,
                        t=e.touches[0].clientY - disY;
                }
                if (l < 0) {
                    l = 0
                }
                else if (l > document.documentElement.clientWidth - keyBox.offsetWidth) {
                    l = document.documentElement.clientWidth - keyBox.offsetWidth
                }
                if (t < 0) {
                    t = 0
                }
                else if (t > document.documentElement.clientHeight - keyBox.offsetHeight) {
                    t = document.documentElement.clientHeight - keyBox.offsetHeight
                }
                keyBox.style.left = l + "px";
                keyBox.style.top = t + "px";
            }
            keyBox.addEventListener('touchend',function(){
                moveStart = false;
            });
            keyBox.addEventListener('touchstart',touchInBox);
            keyBox.addEventListener('touchmove',touchMoveBox);
        })();
    }
}
