import babel from '@rollup/plugin-babel';
import image from '@rollup/plugin-image';
import css from 'rollup-plugin-css-only'
import { mkdirSync, writeFileSync } from 'fs';

module.exports = {
    input: 'tmp-lib/ol-street-view.js',
    output: [
        {
            file: 'lib/ol-street-view.js',
            format: 'es',
            name: 'StreetView',
            globals: {
                'ol': 'ol',
                'ol/Map': 'ol.Map',
                'ol/source': 'ol.source',
                'ol/layer': 'ol.layer',
                'ol/layer/VectorTile': 'ol.layer.VectorTile',
                'ol/geom': 'ol.geom',
                'ol/geom/Polygon': 'ol.geom.Polygon',
                'ol/Feature': 'ol.Feature',
                'ol/Overlay': 'ol.Overlay',
                'ol/style': 'ol.style',
                'ol/control': 'ol.control',
                'ol/proj': 'ol.proj',
                'ol/extent': 'ol.extent',
                'ol/Observable': 'ol.Observable',
                'ol/format': 'ol.format',
                'ol/events': 'ol.events',
                'ol/interaction': 'ol.interaction',
                'ol/TileState': 'ol.TileState',
                'ol/coordinate': 'ol.coordinate',
                'ol/style/IconAnchorUnits':'ol.style.IconAnchorUnits',
                'ol/interaction/Translate':'ol.interaction.Translate',
                'interactjs': 'interact',
                'google-maps': 'google-maps'
            }
        }
    ],
    plugins: [
        babel({
            presets: [
                [
                    "@babel/preset-env",
                    {
                        targets: {
                            esmodules: true
                        }
                    }
                ]
            ],
            babelHelpers: 'bundled',
            exclude: 'node_modules/**'
        }),
        image(),
        css({
            output: function (styles, styleNodes) {
                mkdirSync('lib/css', { recursive: true });
                writeFileSync('lib/css/ol-street-view.css', styles)
            }
        })
    ],
    external: [
        'ol',
        'ol/Map',
        'ol/source',
        'ol/layer',
        'ol/geom',
        'ol/Feature',
        'ol/Overlay',
        'ol/control',
        'ol/proj',
        'ol/Observable',
        'ol/format',
        'ol/events',
        'ol/interaction',
        'ol/coordinate',
        'ol/style/IconAnchorUnits',
        'ol/interaction/Translate',
        'interactjs',
        'google-maps'
    ]
};