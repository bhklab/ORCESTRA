"use strict";var precacheConfig=[["/index.html","fe13b34c9535bbd5192cc6a58e989bdb"],["/static/css/main.c0e1840f.css","ad76cbcf734cde91fefb54a552af7fe1"],["/static/js/main.cd329946.js","05a3ad2ff68d56110c0420ed26cd10ce"],["/static/media/bg3.96c961c6.png","96c961c6e85f289b90afa216a5e46c4c"],["/static/media/color.c7a33805.png","c7a33805ffda0d32bd2a9904c8b02750"],["/static/media/line.567f5738.gif","567f57385ea3dde2c9aec797d07850d2"],["/static/media/open-sans-v15-latin-300.177cc92d.ttf","177cc92d2e8027712a8c1724abd272cd"],["/static/media/open-sans-v15-latin-300.27ef0b06.svg","27ef0b062b2e221df16f3bbd97c2dca8"],["/static/media/open-sans-v15-latin-300.521d17bc.woff","521d17bc9f3526c690e8ada6eee55bec"],["/static/media/open-sans-v15-latin-300.60c86674.woff2","60c866748ff15f5b347fdba64596b1b1"],["/static/media/open-sans-v15-latin-300.76b56857.eot","76b56857ebbae3a5a689f213feb11af0"],["/static/media/open-sans-v15-latin-700.148a6749.eot","148a6749baa5f658a45183ddb5ee159f"],["/static/media/open-sans-v15-latin-700.2e00b263.svg","2e00b2635b51ba336b4b67a5d0bc03c7"],["/static/media/open-sans-v15-latin-700.623e3205.woff","623e3205570002af47fc2b88f9335d19"],["/static/media/open-sans-v15-latin-700.7e08cc65.ttf","7e08cc656863d52bcb5cd34805ac605b"],["/static/media/open-sans-v15-latin-700.d08c09f2.woff2","d08c09f2f169f4a6edbcf8b8d1636cb4"],["/static/media/open-sans-v15-latin-regular.7aab4c13.svg","7aab4c13671282c90669eb6a10357e41"],["/static/media/open-sans-v15-latin-regular.9dce7f01.eot","9dce7f01715340861bdb57318e2f3fdc"],["/static/media/open-sans-v15-latin-regular.bf2d0783.woff","bf2d0783515b7d75c35bde69e01b3135"],["/static/media/open-sans-v15-latin-regular.c045b73d.ttf","c045b73d86803686f4cd1cc3f9ceba59"],["/static/media/open-sans-v15-latin-regular.cffb686d.woff2","cffb686d7d2f4682df8342bd4d276e09"],["/static/media/primeicons.2d2afb27.eot","2d2afb2719a1ee903e576e7c457daf81"],["/static/media/primeicons.66ee0deb.woff","66ee0deb739ca71f0ecdc39d7c1b22cb"],["/static/media/primeicons.df0140f8.ttf","df0140f8e79ecfeffaf85220aaecd7c4"],["/static/media/primeicons.e5e0e944.svg","e5e0e94474d5fd92e7e800a8865d297c"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,t){var a=new URL(e);return"/"===a.pathname.slice(-1)&&(a.pathname+=t),a.toString()},cleanResponse=function(t){return t.redirected?("body"in t?Promise.resolve(t.body):t.blob()).then(function(e){return new Response(e,{headers:t.headers,status:t.status,statusText:t.statusText})}):Promise.resolve(t)},createCacheKey=function(e,t,a,n){var c=new URL(e);return n&&c.pathname.match(n)||(c.search+=(c.search?"&":"")+encodeURIComponent(t)+"="+encodeURIComponent(a)),c.toString()},isPathWhitelisted=function(e,t){if(0===e.length)return!0;var a=new URL(t).pathname;return e.some(function(e){return a.match(e)})},stripIgnoredUrlParameters=function(e,a){var t=new URL(e);return t.hash="",t.search=t.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(t){return a.every(function(e){return!e.test(t[0])})}).map(function(e){return e.join("=")}).join("&"),t.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var t=e[0],a=e[1],n=new URL(t,self.location),c=createCacheKey(n,hashParamName,a,/\.\w{8}\./);return[n.toString(),c]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(n){return setOfCachedUrls(n).then(function(a){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(t){if(!a.has(t)){var e=new Request(t,{credentials:"same-origin"});return fetch(e).then(function(e){if(!e.ok)throw new Error("Request for "+t+" returned a response with status "+e.status);return cleanResponse(e).then(function(e){return n.put(t,e)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var a=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(t){return t.keys().then(function(e){return Promise.all(e.map(function(e){if(!a.has(e.url))return t.delete(e)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(t){if("GET"===t.request.method){var e,a=stripIgnoredUrlParameters(t.request.url,ignoreUrlParametersMatching),n="index.html";(e=urlsToCacheKeys.has(a))||(a=addDirectoryIndex(a,n),e=urlsToCacheKeys.has(a));var c="/index.html";!e&&"navigate"===t.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],t.request.url)&&(a=new URL(c,self.location).toString(),e=urlsToCacheKeys.has(a)),e&&t.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(a)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(e){return console.warn('Couldn\'t serve response for "%s" from cache: %O',t.request.url,e),fetch(t.request)}))}});