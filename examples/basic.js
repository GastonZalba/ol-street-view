(function () {

    var map = new ol.Map({
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM({
                    url: 'https://mt1.google.com/vt/?lyrs=y&x={x}&y={y}&z={z}' // Hybrid Google
                })
            })
        ],
        target: 'map',
        view: new ol.View({
            center: [-57.95409,-34.92209],
            zoom: 15,
            projection: 'EPSG:4326'
        })
    });

    var streetView = new StreetView(map,
        {
            apiKey: null

        }
    );

})();