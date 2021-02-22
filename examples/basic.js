(function () {

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
            center: [-6451375.8,-4153315.9],
            zoom: 17,
            projection: 'EPSG:900913',
            constrainResolution: true // Prevents blurry XYZ background
        })
    });

    var streetView = new StreetView(map,
        {
            apiKey: null,
            language: 'en',
            size: 'md'
        }
    );

})();