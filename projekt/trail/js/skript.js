window.onload = function() {
        // WMTS-Layer basemap.at - Quelle: http://www.basemap.at/wmts/1.0.0/WMTSCapabilities.xml
        var layers = {
		   osm: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                subdomains: ['a', 'b', 'c'],
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }),
            geolandbasemap: L.tileLayer("https://{s}.wien.gv.at/basemap/geolandbasemap/normal/google3857/{z}/{y}/{x}.png", {
                subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
                attribution: 'Datenquelle: <a href="http://www.basemap.at/">basemap.at</a>'
            }),
            bmapgrau: L.tileLayer("https://{s}.wien.gv.at/basemap/bmapgrau/normal/google3857/{z}/{y}/{x}.png", {
                subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
                attribution: 'Datenquelle: <a href="http://www.basemap.at/">basemap.at</a>'
            }),
            bmapoverlay: L.tileLayer("https://{s}.wien.gv.at/basemap/bmapoverlay/normal/google3857/{z}/{y}/{x}.png", {
                subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
                attribution: 'Datenquelle: <a href="http://www.basemap.at/">basemap.at</a>'
            }),
            bmaphidpi: L.tileLayer("https://{s}.wien.gv.at/basemap/bmaphidpi/normal/google3857/{z}/{y}/{x}.jpeg", {
                subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
                attribution: 'Datenquelle: <a href="http://www.basemap.at/">basemap.at</a>'
            }),
            bmaporthofoto30cm: L.tileLayer("https://{s}.wien.gv.at/basemap/bmaporthofoto30cm/normal/google3857/{z}/{y}/{x}.jpeg", {
                subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
                attribution: 'Datenquelle: <a href="http://www.basemap.at/">basemap.at</a>'
            }),
         
        };

        // Map definieren
        var map = L.map('map', {
            layers: [layers.bmapgrau],
            center: [47.4580, 12.2146], 
            zoom: 13,
			});

        // Maßstab hinzufügen
        L.control.scale({
            maxWidth: 200,
            metric: true,
            imperial: false
        }).addTo(map);

        // WMTS-Layer Auswahl hinzufügen
        var layerControl = L.control.layers({
			"OpenStreetMap": layers.osm,
            "basemap.at - STANDARD": layers.geolandbasemap,
            "basemap.at - GRAU": layers.bmapgrau,
            "basemap.at - OVERLAY": layers.bmapoverlay,
            "basemap.at - HIGH-DPI": layers.bmaphidpi,
            "basemap.at - ORTHOFOTO": layers.bmaporthofoto30cm,
            
        }).addTo(map);

        // leaflet-hash aktivieren
        var hash = new L.Hash(map);

        omnivore.gpx('data/trail_etappe_1.gpx').addTo(map).addTo(map);

        var el = L.control.elevation();
      

        var einkehr = [



        ];

        var einkehrLayer = L.featureGroup();
        for (var i = 0; i < einkehr.length; i++) {
            einkehrLayer.addLayer(einkehr[i]);
        }

        var el = L.control.elevation({
            position: "topright",
            theme: "steelblue-theme", //default: lime-theme
            width: 600,
            height: 125,
            margins: {
                top: 10,
                right: 20,
                bottom: 30,
                left: 50
            },
            useHeightIndicator: true, //if false a marker is drawn at map position
            interpolation: "linear", //see https://github.com/mbostock/d3/wiki/SVG-Shapes#wiki-area_interpolate
            hoverNumber: {
                decimalsX: 3, //decimals on distance (always in km)
                decimalsY: 0, //deciamls on hehttps://www.npmjs.com/package/leaflet.coordinatesight (always in m)
                formatter: undefined //custom formatter function may be injected
            },
            xTicks: undefined, //number of ticks in x axis, calculated by default according to width
            yTicks: undefined, //number of ticks on y axis, calculated by default according to height
            collapsed: false, //collapsed mode, show chart on click or mouseover
            imperial: false //display imperial units instead of metric
        });

        //Höhenprofil

        var profileControl = L.control.elevation({
            position: 'bottomright',
            theme: 'steelblue-theme'
        });
        profileControl.addTo(map);

function loadTrack(track) {       
	   gpxTrack = omnivore.gpx('data/'+track).addTo(map);
	   
	  document.getElementById("etappentitel").innerHTML = window.ETAPPEN[track].etappentitel;
	  document.getElementById("kurzinfo").innerHTML = window.ETAPPEN[track].kurzinfo;
	  document.getElementById("bergauf").innerHTML = window.ETAPPEN[track].bergauf;
	  document.getElementById("bergab").innerHTML = window.ETAPPEN[track].bergab;
	  document.getElementById("dauer").innerHTML = window.ETAPPEN[track].dauer;
	  document.getElementById("laenge").innerHTML = window.ETAPPEN[track].laenge;
	  document.getElementById("level").innerHTML = window.ETAPPEN[track].level;
	  
        // nach erfolgreichem Laden Popup hinzufügen, Ausschnitt setzen und Höhenprofil erzeugen
        gpxTrack.on('ready', function() {
            // Popup hinzufügen
           

            // Ausschnitt setzen
            map.fitBounds(gpxTrack.getBounds());

            // Höhenprofil erzeugen
			profileControl.clear();
            gpxTrack.eachLayer(function(layer) {
                profileControl.addData(layer.feature);
                //var pts =
                //console.log(layer.feature.geometry.coordinates)

                var pts = layer.feature.geometry.coordinates;

                for (var i = 1; i < pts.length; i += 1) {
                    //console.log(pts[i]);   //aktuellerPunkt
                    //console.log(pts[i-1]); //vorhergehenderPunkt

                    //entfernung
                    var dist = map.distance(
                        [pts[i][1], pts[i][0]], [pts[i - 1][1], pts[i - 1][0]]
                    );
                    //console.log(dist);

                    var delta = pts[i][2] - pts[i - 1][2];
                    //console.log(delta, "HM auf", dist, "Strecke");

                    var rad = Math.atan(delta / dist);
                    var deg = (rad * (180 / Math.PI)).toFixed(1);
                    //console.log(deg);

                    //color 
                    var farbe;

                    switch (true) { // checks if condition is true, not for certain values of a variable
                        case (deg >= 10):
                            farbe = "#bd0026";
                            break;
                        case (deg >= 7.5):
                            farbe = "#f03b20";
                            break;
                        case (deg >= 5):
                            farbe = "#fd8d3c";
                            break;
                        case (deg >= 2.5):
                            farbe = "#feb24c";
                            break;
                        case (deg >= 1):
                            farbe = "#fed976";
                            break;
                        case (deg >= -1):
                            farbe = "yellow";
                            break;
                        case (deg >= -2.5):
                            farbe = "#d9f0a3";
                            break;
                        case (deg >= -5):
                            farbe = "#addd8e";
                            break;
                        case (deg >= -7.5):
                            farbe = "#78c679";
                            break;
                        case (deg >= -10):
                            farbe = "#31a354";
                            break;
                        case (deg < -10):
                            farbe = "#006837";
                            break;
                    };
			
                    var pointA = new L.LatLng(pts[i][1], pts[i][0]);
                    var pointB = new L.LatLng(pts[i - 1][1], pts[i - 1][0]);
                    var pointList = [pointA, pointB];

                    var firstpolyline = new L.Polyline(pointList, {
                        color: farbe,
                        weight: 6,
                        opacity: 3,
                        smoothFactor: 1

                    });
                    firstpolyline.addTo(map);
					
                }
            });
        });
		}
      
// RESTAURANT MARKER
		var einkehr = [
		L.marker([47.317494, 10.514781],{title: "Gasthof Helena", icon : L.icon({ iconUrl:'icons/restaurant.png'})}),
		L.marker([47.497157, 10.584602],{title: "Gasthof Adlerhorst", icon : L.icon({ iconUrl:'icons/restaurant.png'})}),
		L.marker([47.549673, 10.630074],{title: "Gasthaus Schwarzer Adler", icon : L.icon({ iconUrl:'icons/restaurant.png'})}),
		L.marker([47.420216, 10.787713],{title: "Pizzeria San Marco", icon : L.icon({ iconUrl:'icons/restaurant.png'})}),
		L.marker([47.368670, 11.157166],{title: "Restaurant Forellenhof", icon : L.icon({ iconUrl:'icons/restaurant.png'})}),
		L.marker([47.432713, 11.735076],{title: "Restaurant Maximilian", icon : L.icon({ iconUrl:'icons/restaurant.png'})}),
		
		];
		var einkehrLayer = L.featureGroup();
		for (var i=0; i<einkehr.length; i++) {
		einkehrLayer.addLayer(einkehr[i]);
		};
		einkehrLayer.addTo(map);


        map.on("zoomend", function() {
            if (map.getZoom() >= 11) {
                map.addLayer(einkehrLayer);
            } else {
                map.removeLayer(einkehrLayer);
            }

        });
		





        einkehrLayer.addTo(map);
		
		var etappenSelektor = document.getElementById("etappen");
		console.log("Selektor: ", etappenSelektor);
		etappenSelektor.onchange = function(evt) {
		console.log("GPX track laden" , etappenSelektor[etappenSelektor.selectedIndex].value);
		loadTrack(etappenSelektor[etappenSelektor.selectedIndex].value);
		}
		loadTrack("trail_etappe_1.gpx")
		
}