!function($){function e(){}function t(e){r=[e]}function n(e,t,n){return e&&e.apply(t.context||t,n)}function o(e){return/\?/.test(e)?"&":"?"}function c(c){function D(e){V++||(W(),K&&(w[M]={"s":[e]}),A&&(e=A.apply(c,[e])),n(R,c,[e,x,c]),n(z,c,[c,x]))}function F(e){V++||(W(),K&&e!=b&&(w[M]=e),n(U,c,[c,e]),n(z,c,[c,e]))}c=$.extend({},I,c);var S,_,q,P,Q,R=c.success,U=c.error,z=c.complete,A=c.dataFilter,G=c.callbackParameter,H=c.callback,J=c.cache,K=c.pageCache,L=c.charset,M=c.url,N=c.data,O=c.timeout,V=0,W=e;return k&&k(function(e){e.done(R).fail(U),R=e.resolve,U=e.reject}).promise(c),c.abort=function(){!V++&&W()},!1===n(c.beforeSend,c,[c])||V?c:(M=M||u,N=N?"string"==typeof N?N:$.param(N,c.traditional):u,M+=N?o(M)+N:u,G&&(M+=o(M)+encodeURIComponent(G)+"=?"),!J&&!K&&(M+=o(M)+"_"+(new Date).getTime()+"="),M=M.replace(/=\?(&|$)/,"="+H+"$1"),K&&(S=w[M])?S.s?D(S.s[0]):F(S):(j[H]=t,q=$(g)[0],q.id=d+E++,L&&(q[a]=L),T&&T.version()<11.6?(P=$(g)[0]).text="document.getElementById('"+q.id+"')."+m+"()":q[i]=i,B&&(q.htmlFor=q.id,q.event=f),q[p]=q[m]=q[h]=function(e){if(!q[y]||!/i/.test(q[y])){try{q[f]&&q[f]()}catch(e){}e=r,r=0,e?D(e[0]):F(l)}},q.src=M,W=function(e){Q&&clearTimeout(Q),q[h]=q[p]=q[m]=null,C[v](q),P&&C[v](P)},C[s](q,_=C.firstChild),P&&C[s](P,_),Q=O>0&&setTimeout(function(){F(b)},O)),c)}var r,i="async",a="charset",u="",l="error",s="insertBefore",d="_jqjsp",f="onclick",m="on"+l,p="onload",h="onreadystatechange",y="readyState",v="removeChild",g="<script>",x="success",b="timeout",j=window,k=$.Deferred,C=$("head")[0]||document.documentElement,w={},E=0,I={"callback":d,"url":location.href},T=j.opera,B=!!$("<div>").html("\x3c!--[if IE]><i><![endif]--\x3e").find("i").length;c.setup=function(e){$.extend(I,e)},$.jsonp=c}(jQuery);