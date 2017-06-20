window.onload = function() {
        // WMTS-Layer basemap.at - Quelle: http://www.basemap.at/wmts/1.0.0/WMTSCapabilities.xml
        var layers = {
            geolandbasemap: L.tileLayer("https://{s}.wien.gv.at/basemap/geolandbasemap/normal/google3857/{z}/{y}/{x}.png", {
                subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
                attribution: 'Datenquelle: <a href="http://www.basemap.at/">basemap.at</a>'
            }),
            bmapgrau: L.tileLayer("https://{s}.wien.gv.at/basemap/bmapgrau/normal/google3857/{z}/{y}/{x}.png", {
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

        // Map definieren
        var map = L.map('map', {
            layers: [layers.geolandbasemap],
            center: [47.4575, 12.2137], 
            zoom: 14
			
			});

        // Maßstab hinzufügen
        L.control.scale({
            maxWidth: 200,
            metric: true,
            imperial: false
        }).addTo(map);

        // WMTS-Layer Auswahl hinzufügen
        var layerControl = L.control.layers({
            "basemap.at - STANDARD": layers.geolandbasemap,
            "basemap.at - GRAU": layers.bmapgrau,
            "basemap.at - ORTHOFOTO": layers.bmaporthofoto30cm,
            "OpenStreetMap": layers.osm,
        }).addTo(map);

        // leaflet-hash aktivieren
        var hash = new L.Hash(map);

        omnivore.gpx('data/kat_etappe_1.gpx').addTo(map).addTo(map);

        var el = L.control.elevation();
		
		
		
        //el.addTo(map);

        //L.geoJSON(window.etappe12, {
        //onEachFeature: el.addData.bind(el)
        //}).addTo(map);





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
	   
	  document.getElementById("etappentitel").innerHTML = window.KAT_ETAPPEN[track].etappentitel;
	  document.getElementById("kurzinfo").innerHTML = window.KAT_ETAPPEN[track].kurzinfo;
	  document.getElementById("bergauf").innerHTML = window.KAT_ETAPPEN[track].bergauf;
	  document.getElementById("bergab").innerHTML = window.KAT_ETAPPEN[track].bergab;
	  document.getElementById("dauer").innerHTML = window.KAT_ETAPPEN[track].dauer;
	  document.getElementById("laenge").innerHTML = window.KAT_ETAPPEN[track].laenge;
	  document.getElementById("einkehr").innerHTML = window.KAT_ETAPPEN[track].einkehr;
	  
	  
	   
	   
        // nach erfolgreichem Laden Popup hinzufügen, Ausschnitt setzen und Höhenprofil erzeugen
        gpxTrack.on('ready', function() {


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
                        case (deg >= 20):
                            farbe = "#bd0026";
                            break;
                        case (deg >= 15):
                            farbe = "#f03b20";
                            break;
                        case (deg >= 10):
                            farbe = "#fd8d3c";
                            break;
                        case (deg >= 5):
                            farbe = "#feb24c";
                            break;
                        case (deg >= 1):
                            farbe = "#fed976";
                            break;
                        case (deg >= -1):
                            farbe = "yellow";
                            break;
                        case (deg >= -5):
                            farbe = "#d9f0a3";
                            break;
                        case (deg >= -10):
                            farbe = "#addd8e";
                            break;
                        case (deg >= -15):
                            farbe = "#78c679";
                            break;
                        case (deg >= -20):
                            farbe = "#31a354";
                            break;
                        case (deg < -20):
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
		L.marker([47.463472, 12.220483],{title: "Filzalm", icon : L.icon({ iconUrl:'icons/restaurant.png'})}),
		L.marker([47.424355, 12.269906],{title: "Brixenbachalm", icon : L.icon({ iconUrl:'icons/restaurant.png'})}),
		L.marker([47.409129, 12.280981],{title: "Wiegalm", icon : L.icon({ iconUrl:'icons/restaurant.png'})}),
		L.marker([47.429729, 12.332853],{title: "Maierl Alm", icon : L.icon({ iconUrl:'icons/restaurant.png'})}),
		L.marker([47.419199, 12.342590],{title: "Alpengasthof Ochsalm", icon : L.icon({ iconUrl:'icons/restaurant.png'})}),
		L.marker([47.490634, 12.417919],{title: "Stangl Alm", icon : L.icon({ iconUrl:'icons/restaurant.png'})}),
		L.marker([47.495379, 12.416677],{title: "Müllner Alm", icon : L.icon({ iconUrl:'icons/restaurant.png'})}),
		L.marker([47.530684, 12.533675],{title: "Wintersteller Alm", icon : L.icon({ iconUrl:'icons/restaurant.png'})}),
		];
		var einkehrLayer = L.featureGroup();
		for (var i=0; i<einkehr.length; i++) {
		einkehrLayer.addLayer(einkehr[i]);
		};
		einkehrLayer.addTo(map);


        map.on("zoomend", function() {
            if (map.getZoom() >= 13) {
                map.addLayer(einkehrLayer);
            } else {
                map.removeLayer(einkehrLayer);
            }

        });
		



     

		
		var etappenSelektor = document.getElementById("etappen");
		console.log("Selektor: ", etappenSelektor);
		etappenSelektor.onchange = function(evt) {
		console.log("GPX track laden" , etappenSelektor[etappenSelektor.selectedIndex].value);
		loadTrack(etappenSelektor[etappenSelektor.selectedIndex].value);
		}
		loadTrack("kat_etappe_1.gpx")
}