const CACHE='muxu-resume-d8dcd3027966';
const ASSETS=["./","./app.js","./content.js","./font.css","./icon.svg","./icons/apple-touch-icon.png","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png","./images/brand-51.jpg","./images/brand-52.jpg","./images/brand-53.jpg","./images/brand-54.jpg","./images/brand-55.jpg","./images/craft-41.jpg","./images/craft-42.jpg","./images/craft-43.jpg","./images/health-59.jpg","./images/health-60.jpg","./images/health-61.jpg","./images/model-44.jpg","./images/model-45.jpg","./images/model-46.jpg","./images/model-47.jpg","./images/papercut.jpg","./images/portrait.jpg","./images/poster-56.jpg","./images/poster-57.jpg","./images/poster-58.jpg","./images/skill-ae.png","./images/skill-ai.png","./images/skill-procreate.png","./images/skill-ps.png","./images/travel-49.jpg","./images/travel-50.jpg","./images/web-35.jpg","./images/web-36.jpg","./images/web-37.jpg","./images/web-38.jpg","./images/web-39.jpg","./images/web-40.jpg","./images.js","./index.html","./manifest.webmanifest","./OFL-NotoSansSC.txt","./pwa.css","./pwa.js","./studio-sans.woff2","./style.css"];

self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(names=>Promise.all(names.filter(name=>name.startsWith('muxu-resume-')&&name!==CACHE).map(name=>caches.delete(name)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.pathname.startsWith(new URL(self.registration.scope).pathname))return;
 event.respondWith(caches.open(CACHE).then(async cache=>{
  if(event.request.mode==='navigate')return await cache.match(new URL('./index.html',self.registration.scope).href)||fetch(event.request);
  return await cache.match(event.request)||fetch(event.request);
 }));
});
