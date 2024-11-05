var coordsView = [-6451484.76, -4153214.08];

var map = new ol.Map({
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM({
                attributions: `&copy; ${new Date().getFullYear()} Google Maps <a href="https://www.google.com/help/terms_maps/" target="_blank">Terms of Service</a>`,
                maxZoom: 19,
                url: 'https://mt{0-3}.google.com/vt/?lyrs=r&x={x}&y={y}&z={z}'
                // url: 'https://mt{0-3}.google.com/vt/?lyrs=y&x={x}&y={y}&z={z}' // Sat Hybrid
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
        autoLoadGoogleMaps: false
    }
);

map.addControl(streetView);

function initiPano() {
    var pano = streetView.showStreetView(coordsView);
    pano.setPov({
        heading: 52,
        pitch: -12,
        zoom: 1
    });
}

// Add test buttons
function createBtn(name, onClick) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = name;
    btn.onclick = onClick;
    return btn;
}

var buttonsSect = document.getElementById('testButtons');
buttonsSect.append(
    createBtn('Load library', function () {

        if (window.initialize) return;

        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://maps.googleapis.com/maps/api/js?callback=initialize&v=weeklyt";
        document.body.append(script);

        // Library callback
        window.initialize = () => {
            streetView.init();
            initiPano();
            this.disabled = true;
            this.innerHTML = 'Library loaded';
        };

    })
);