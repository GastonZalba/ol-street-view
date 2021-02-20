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
            center: [-6451375.8,-4153315.9],
            zoom: 15,
            projection: 'EPSG:900913',
            constrainResolution: true // Prevents blurry XYZ background
        })
    });

    var streetView = new StreetView(map,
        {
            apiKey: null

        }
    );

})();