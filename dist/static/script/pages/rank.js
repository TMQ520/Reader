Vue.use(VueLazyload,{"preLoad":1.2,"error":"img/default_book.png","loading":"img/default_book.png"}),$.get("/ajax/ranks",function(e){var o=$(document.body).width();o<320&&(o=320);for(var t=0;t<e.items.length;t++)e.items[t].description=e.items[t].description.split("\n");new Vue({"el":"#app","data":{"screen_width":o,"double_screen_width":2*o,"item":e},"created":function(){$("#goBack").click(function(){location.href="/"})}})},"json");