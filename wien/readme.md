# Geodaten mit QGIS und Leaflet
## Beispiel Stadtspaziergang Wien

### Google Suche "WFS Opendata Wien"

* Web Feature Service (WFS) - Wien - Datensätze - data.gv.at
* https://www.data.gv.at/katalog/dataset/45a55c97-2122-42a6-823d-f374f1a8bd48
* WFS GetCapabilities klicken
* URL: http://data.wien.gv.at/daten/geo?service=WFS&request=GetCapabilities&version=1.1.0
* URL kopieren und QGIS Desktop starten

### QGIS 2.8 Desktop (Wien)

* Layer / Add Layer / WFS Layer / New
    * Name: data.wien.gv.at
    * URL: http://data.wien.gv.at/daten/geo?service=WFS&request=GetCapabilities&version=1.1.0
    * OK / Connect
    * Stadtspaziergang - Punkte / Add

* Datenexploration
    * Identify Features (i)
    * Open Attribute Table
        * https://www.wien.gv.at/spaziergang/
    * Properties

* Datenquelle aus QGIS
    * Properties / Layer Source
    * http://data.wien.gv.at/daten/geo?version=1.1.0&SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&TYPENAME=ogdwien:SPAZIERPUNKTOGD&SRSNAME=EPSG:31256
    * EPSG auf 4326 ändern
    * JSON-Format hinzufügen: &outputFormat=application/json
    * Resultat: http://data.wien.gv.at/daten/geo?version=1.1.0&SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&TYPENAME=ogdwien:SPAZIERPUNKTOGD&SRSNAME=EPSG:4326&outputFormat=application/json
    * Speichern unter: stadtspaziergang_punkte.json

### Leaflet Karte

* stadtspaziergang_punkte.json für Leaflet vorbereiten
    * Öffnen in Notepad++
    * Variablenname hinzufügen: window.spaziergangPunkte = {"type":"FeatureCollection" ... }
    * Speichern unter stadtspaziergang_punkte.json.js

* Vorlage Innsbruck anpassen
    * https://github.com/webmapping/17s/blob/master/ibk/ibk_03.html
    * Id des Karten-DIVs auf `wienMap` ändern und CSS, JS entsprechend anpassen
    * Titel ändern auf "Stadtspaziergang Wien"
    * Kartenhintergrund Basemap grau voreinstellen
    * Kartenpositionierung Innsbruck entfernen
    * Code für Marker löschen
    * stadtspaziergang_punkte.json.js als `<script>` einbauen
    * Testen ob Daten verfügbar sind: `console.log(window.spaziergangPunkte)`

* GeoJSON Punkte einbauen
    * http://leafletjs.com/reference-1.0.3.html#geojson
    * Usage example anpassen
        * `L.geoJSON(...)` als Variable `points` speichern
        * `window.spaziergangPunkte` statt `data` als GeoJSON Datenobjekt
        * `style: ` durch `pointToLayer:` ersetzen (siehe Options bei geoJSON docs)
        * `layer.feature.properties.NAME` statt `layer.feature.properties.description`
        * Ausschnitt auf die Punkte setzen

### Ausbaustufen

1. Popupfenster ergänzen um BEMERKUNG, OBJECTID, KATEGORIE, ADRESSE, WEITERE_INF (als Link)

        .bindPopup(function (layer) {
            var popup = [];
            popup.push('<h3>' + layer.feature.properties.NAME + '</h3>');
            // ...
            return popup.join('\n');
        }

2. Unterschiedliche Marker je nach KATEGORIE
    * http://leafletjs.com/reference-1.0.3.html#geojson-pointtolayer
    * https://github.com/pointhi/leaflet-color-markers

            var iconByCategory = {
                1 : "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
                2 : "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
                3 : "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
                4 : "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
                5 : "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png",
                6 : "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png"
            };

            L.geoJSON(window.spaziergangPunkte, {
                pointToLayer: function(feature, latlng) {
                    return L.marker(latlng, {
                        icon : L.icon({
                            iconSize : [25,41],
                            iconAnchor: [12,41],
                            popupAnchor : [1, -34],
                            shadowSize: [41, 41],
                            shadowUrl: 'https://unpkg.com/leaflet@1.0.3/dist/images/marker-shadow.png',
                            iconUrl: iconByCategory[feature.properties.KATEGORIE]
                        })
                    });
                }
            })

3. Routenverlauf aus WFS-Layer einbauen
    * analog zu den Punkten
    * Farben über:

            var colorByCategory = {
                1 : "blue",
                2 : "red",
                3 : "green",
                4 : "orange",
                5 : "yellow",
                6 : "violet"
            };

            L.geoJSON(window.spaziergangLinien, {
                style: function (feature) {
                    return {
                        color: colorByCategory[feature.properties.KATEGORIE]
                    };
                }
            })

4. Wiener Märkte (Flächen) als WFS-Layer einbauen
    * analog zu den Linien, ohne Farbunterscheidung

5. Overlay ein/aus für Routen, Standorte und Märkte
    * http://leafletjs.com/reference-1.0.3.html#control-layers

