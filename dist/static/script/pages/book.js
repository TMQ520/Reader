function setCookie(t,e){document.cookie=t+"="+escape(e)}function clearCookie(){var t=document.cookie.match(/[^ =;]+(?=\=)/g);if(t)for(var e=t.length;e--;)document.cookie=t[e]+"=0;expires="+new Date(0).toUTCString()}function t(){for(var t="0123456789QWERTYUIOPASDFGHJKLZXCVBNM",e="",i=0;12>i;i++)e+=t.charAt(Math.ceil(1e8*Math.random())%t.length);return"D950"+e}function isEqual(t,e){for(var i=0;i<t.length;i++)if(t[i]==e)return!0;return!1}var params={"id":getUrlStr("id"),"from":getUrlStr("from")},obj={"app_id":"mi_wap","build":8888,"device_hash":"5528999bb9b7cae495ff68a2792b9c81","device_id":t(),"user_type":2};$(function(){$.get("/ajax/books?id="+params.id,function(t){Vue.use(VueLazyload,{"preLoad":1.2,"error":"../../img/default_book.png","loading":"../../img/default_book.png"}),new Vue({"el":"#app","data":t,"created":function(){$("#init_loading").hide(),$("#goBack").click(function(){if("main"==params.from)location.href="/";else if("categoryDetails"==params.from){var t=getUrlStr("cate_id"),e=getUrlStr("nav");location.href="/category/details?cate_id="+t+"&nav="+e+"&from=category"}else params.from?location.href="/"+params.from:location.href="/"})},"filters":{"worldCount":function(t){var e=Math.ceil(t/1e4);return 1==e?e=t:e+="万",e}},"methods":{"readBook":function(){var t,e=Storage.getItem(this.item.fiction_id+"_last_chapter")||0;t=params.from?params.from:"book";var i=JSON.parse(Storage.getItem("fiction_array"))||[];if(i.length>0){isEqual(i,this.item.fiction_id)||i.unshift(this.item.fiction_id)}else i.push(this.item.fiction_id);if(Storage.setItem("fiction_array",JSON.stringify(i)),"categoryDetails"==params.from){var a=getUrlStr("cate_id"),r=getUrlStr("nav");location.href="/reader?fiction_id="+this.item.fiction_id+"&chapter_id="+e+"&cate_id="+a+"&nav="+r+"&from=categoryDetails"}else location.href="/reader?fiction_id="+this.item.fiction_id+"&chapter_id="+e+"&from="+t}}})},"json")});