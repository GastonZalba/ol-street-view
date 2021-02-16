import pkg from './package.json';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import image from '@rollup/plugin-image';
import { terser } from "rollup-plugin-terser";
import css from 'rollup-plugin-css-only';
import { mkdirSync, writeFileSync } from 'fs';
import CleanCss from 'clean-css';

let globals = {
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
    'ol/style/IconAnchorUnits': 'ol.style.IconAnchorUnits',
    'ol/interaction/Translate': 'ol.interaction.Translate',
    'interactjs': 'interact',
    'google-maps': 'google-maps'
};

module.exports = {
    input: 'tmp-dist/ol-street-view.js',
    output: [
        {
            file: pkg.main,
            format: 'umd',
            name: 'StreetView',
            globals: globals
        },
        {
            file: pkg.browser,
            format: 'umd',
            plugins: [terser()],
            name: 'StreetView',
            globals: globals
        }
    ],
    plugins: [
        resolve(),
        commonjs(),
        babel({
            babelrc: false,
            plugins: ["@babel/plugin-transform-runtime"],
            babelHelpers: 'runtime',
            exclude: 'node_modules/**',
            presets: [
                [
                    '@babel/preset-env',
                    {                        
                        targets: {
                            browsers: [
                                "Chrome >= 52",
                                "FireFox >= 44",
                                "Safari >= 7",
                                "Explorer 11",
                                "last 4 Edge versions"
                            ]
                        }
                    }
                ]
            ]
        }),
        image(),
        css({
            output: function (styles, styleNodes) {
                mkdirSync('dist/css', { recursive: true });
                writeFileSync('dist/css/ol-street-view.css', styles)
                const compressed = new CleanCss().minify(styles).styles;
                writeFileSync('dist/css/ol-street-view.min.css', compressed)
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
        'ol/style',
        'ol/control',
        'ol/proj',
        'ol/Observable',
        'ol/format',
        'ol/events',
        'ol/interaction',
        'ol/coordinate',
        'ol/interaction/Translate',
        'interactjs'
    ]
};