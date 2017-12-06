function scroll() {  // 开始封装自己的scrollTop
    /*if (window.pageYOffset != null) {  // ie9+ 高版本浏览器
        // 因为 window.pageYOffset 默认的是  0  所以这里需要判断
        return {
            left: window.pageXOffset,
            top: window.pageYOffset
        }
    }
    else if (document.compatMode === "CSS1Compat") {    // 标准浏览器   来判断有没有声明DTD
        return {
            left: document.documentElement.scrollLeft,
            top: document.documentElement.scrollTop
        }
    }
    return {   // 未声明 DTD
        left: document.body.scrollLeft,
        top: document.body.scrollTop
      }*/

    // 实际上使用这种
    return {
      left: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
      top: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
    }
  }

//获取页面文档的总高度
function documentHeight(){
  //现代浏览器（IE9+和其他浏览器）和IE8的document.body.scrollHeight和document.documentElement.scrollHeight都可以
  return Math.max(document.body.scrollHeight,document.documentElement.scrollHeight);
}
//获取页面浏览器视口的高度
function windowHeight(){
  //document.compatMode有两个取值。BackCompat：标准兼容模式关闭。CSS1Compat：标准兼容模式开启。
  return (document.compatMode == "CSS1Compat")?
  document.documentElement.clientHeight:
  document.body.clientHeight;
}


function getUrlStr (name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  /*
   * 例子：   file:\/\/\/C:/Users\/Administrator\/Desktop\/E运河码云项目\/eYunHe\/wy_E-资讯2.html?id=26&time=2017-07-27%2011:38:26
   */
   var r = window.location.search.substr(1).match(reg);
   if (r != null) return decodeURI(r[2]);
   return null;
};