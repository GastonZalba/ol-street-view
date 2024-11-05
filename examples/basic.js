var coordsIcon = [-6451474.93, -4153206.94];
var coordsView = [-6451484.76, -4153214.08];
var iconUrl = './icon.png';

var map = new ol.Map({
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM({
                attributions: `&copy; ${new Date().getFullYear()} Google Maps <a href="https://www.google.com/help/terms_maps/" target="_blank">Terms of Service</a>`,
                maxZoom: 19,
                url: 'https://mt{0-3}.google.com/vt/?lyrs=r&x={x}&y={y}&z={z}'
                // url: 'https://mt{0-3}.google.com/vt/?lyrs=y&x={x}&y={y}&z={z}' // Sat Hybrid
            })
        }),
        // Add icon layer to OpenLayers map
        new ol.layer.Vector({
            zIndex: 15,
            style: new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 1],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'fraction',
                    src: iconUrl
                })
            }),
            source: new ol.source.Vector({
                features: [
                    new ol.Feature({
                        name: 'Star',
                        geometry: new ol.geom.Point(coordsIcon)
                    })
                ]
            })
        })
    ],
    target: 'map',
    view: new ol.View({
        center: coordsView,
        zoom: 19,
        projection: 'EPSG:900913',
        constrainResolution: true // Prevents blurry XYZ background
    })
});

var streetView = new StreetView(
    {
        apiKey: null,
        language: StreetView.Language.EN,
        transparentButton: false,
        radius: 50,
        updatePegmanToClosestPanorama: true,
        size: StreetView.BtnControlSize.Large,
        resizable: true,
        sizeToggler: true,
        zoomOnInit: 18,
        minZoom: 13,
        defaultMapSize: StreetView.MapSize.Expanded,
        autoLoadGoogleMaps: true,
        i18n: {
            dragToInit: 'Drag and drop me'
        }
    }
);

map.addControl(streetView);
// streetView.setMap(map);

function initiPano() {
    var pano = streetView.showStreetView(coordsView);
    pano.setPov({
        heading: 52,
        pitch: -12,
        zoom: 1
    });
}

// Init panorama programatically after the lib is loaded
streetView.once('loadLib', initiPano);

// Wait until the Google Maps Panorama is initializated to add the icon (and run once)
streetView.on('streetViewInit', function () {

    streetView.googleMapsLoader.importLibrary('marker')
        .then(() => {
            // Get the panorama instance
            var panorama = streetView.getStreetViewPanorama();

            var coords4326 = ol.proj.transform(coordsIcon, 'EPSG:3857', 'EPSG:4326');

            // Use global google maps functions to add the icon
            var markerPos = new google.maps.LatLng(coords4326[1], coords4326[0]);

            new google.maps.Marker({
                position: markerPos,
                map: panorama,
                icon: iconUrl,
                title: 'Star'
            });

        })
        .catch((err) => {
            console.error(err);
        });
});

var buttonsSect = document.getElementById('testButtons');

// Add test buttons
function createBtn(name, onClick) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = name;
    btn.onclick = onClick;
    return btn;
}

buttonsSect.append(
    createBtn('Unset map', function () {
        streetView.setMap(null)
    }),
    createBtn('Set map', function () {
        streetView.setMap(map)
    })
);