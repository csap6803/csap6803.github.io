window.onload = function() {
//Kartenlayer definieren
        var layers = {
            geolandbasemap: L.tileLayer("https://{s}.wien.gv.at/basemap/geolandbasemap/normal/google3857/{z}/{y}/{x}.png", {
                subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
                attribution: 'Datenquelle: <a href="http://www.basemap.at/">basemap.at</a>'
            }),
            bmaporthofoto30cm: L.tileLayer("https://{s}.wien.gv.at/basemap/bmaporthofoto30cm/normal/google3857/{z}/{y}/{x}.jpeg", {
                subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
                attribution: 'Datenquelle: <a href="http://www.basemap.at/">basemap.at</a>'
            }),
            osm: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                subdomains: ['a', 'b', 'c'],
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            })
        };

        // Karte definieren
        var map = L.map('map', {
            layers: [layers.geolandbasemap],
            center : [47.252873, 11.397459],
            zoom : 9,
        });
        
        // Maßstab hinzufügen
        L.control.scale({
            maxWidth: 200,
            metric: true,
            imperial: false
        }).addTo(map);

        //Bike Track einfügen
        var gpxbike = omnivore.gpx('data/gpxbike/bike.gpx').addTo(map);      
        //Wanderweg als eine Etappe einfügen  
        var gpxtrack = omnivore.gpx('data/gps-daten-kat-walk-alpin.gpx').addTo(map);
        
        //Popup mit Link zur Seite
        
        gpxbike.bindPopup(
        '<h4>Bike-Track Tirol</h4><a target="_blank" href=../trail/index.html>Seite</a>');
        gpxtrack.bindPopup(
        '<h4>Wanderweg KAT</h4><a target="_blank" href=../kat/index.html>Seite</a>');
       
        
        var layerControl = L.control.layers({
                "basemap.at - STANDARD": layers.geolandbasemap,
                "basemap.at - ORTHOFOTO": layers.bmaporthofoto30cm,
                "OpenStreetMap": layers.osm,
                 },
                {
                'Rad-Etappe':gpxbike,
                'Wander-Etappe':gpxtrack,
                }
            ).addTo(map);

      // leaflet-hash aktivieren
        var hash = new L.Hash(map);
        
        var hike = L.icon({
			iconUrl: 'images/hiking.png',
			iconAnchor: [16, 37]
		});
		L.marker([47.35663, 12.27387], { title: "Wander-Etappe", icon: hike}).bindPopup(
        '<h4>Wanderweg KAT</h4><a target="_blank" href=../kat/index.html>Seite</a>').addTo(map);
        
        
        var bike = L.icon({
			iconUrl: 'images/bike_rising.png',
			iconAnchor: [16, 37],
		});
		L.marker([47.364963, 11.159393], { title: "Rad-Etappe", icon: bike}).bindPopup(
        '<h4>Bike-Track Tirol</h4><a target="_blank" href=../trail/index.html>Seite</a>').addTo(map);       
        
        
        var txt;
        var r = confirm("Willst du unsere Webseite auschecken?");
            if (r == true) {
                txt = "Yeah! Viel Spaß!";
                alert(txt);
            } else {
                txt = "Nagut, dann viel Spaß in der Offline-Welt :(";
                alert(txt);
            };
			
			var back = $('body');

			var backgrounds = new Array(
				'url(images/background.jpg)'
			  , 'url(images/background2.jpg)'
			  , 'url(images/background3.jpg)'
			);

			var current = 0;

			function nextBackground() {
				current++;
				current = current % backgrounds.length;
				back.css('background-image', backgrounds[current]);
			}
			setInterval(nextBackground, 12000);

			back.css('background-image', backgrounds[0]);
				 

}