self.addEventListener("install", event=>{
    event.waitUntil(
        caches.open("static").then(cache=>{
            return cache.addAll(["./", "/css/main.css", "./image/logo192.png"]);
        })
    );
});

self.addEventListener("fetch", (event)=>{
    event.respondWith(
        caches.match(event.request).then(response =>{
            return response || fetch(event.request);
        })
    );
})