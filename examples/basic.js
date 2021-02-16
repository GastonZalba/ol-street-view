(function () {

    var map = new ol.Map({
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM(),
            })
        ],
        target: 'map',
        view: new ol.View({
            center: [-57.11345, -36.28140],
            zoom: 13,
            projection: 'EPSG:4326'
        })
    });

    var wfst = new StreetView(map,
        {
            apiKey: '_testing_'

        }
    );

})();