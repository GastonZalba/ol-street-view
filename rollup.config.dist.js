import pkg from './package.json';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import image from '@rollup/plugin-image';
import { terser } from "rollup-plugin-terser";
import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import postcss from 'rollup-plugin-postcss';
import path from 'path';

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

export default function (commandOptions) {

    return [
        {
            input: 'src/ol-street-view.ts',
            output: [
                {
                    dir: 'dist',
                    format: 'umd',
                    name: 'StreetView',
                    globals: globals,
                    sourcemap: true
                },
                !commandOptions.dev && {
                    file: pkg.browser,
                    format: 'umd',
                    plugins: [terser()],
                    name: 'StreetView',
                    globals: globals,
                    sourcemap: true
                }
            ],
            plugins: [
                del({ targets: 'dist/*' }),
                typescript(
                    {
                        outDir: './dist',
                        declarationDir: './dist',
                        outputToFilesystem: true
                    }
                ),
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
                postcss({
                    extensions: ['.css', '.sass', '.scss'],
                    inject: commandOptions.dev ? true : false,
                    extract: commandOptions.dev ? false : path.resolve('dist/css/ol-street-view.css'),
                    sourceMap: commandOptions.dev  ? true : false,
                    minimize: false,
                    config: {
                        path: './postcss.config.js',
                        ctx: {
                            isDev: commandOptions.dev ? true : false
                        }
                    }
                }),
                commandOptions.dev && serve({
                    open: false,
                    verbose: true,
                    contentBase: ['', 'examples'],
                    historyApiFallback: '/basic.html',
                    host: 'localhost',
                    port: 3000,
                    // execute function after server has begun listening
                    onListening: function (server) {
                        const address = server.address()
                        // by using a bound function, we can access options as `this`
                        const protocol = this.https ? 'https' : 'http'
                        console.log(`Server listening at ${protocol}://localhost:${address.port}/`)
                    }
                }),
                commandOptions.dev && livereload({
                    watch: ['src'],
                    delay: 500
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
                'ol/Control',
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
        },
        // Minified css
        {
            input: path.resolve('dist/css/ol-street-view.css'),
            plugins: [
                postcss({
                    extract: true,
                    minimize: true,
                    config: {
                        path: './postcss.config.js',
                        ctx: {
                            isDev: commandOptions.dev ? true : false
                        }
                    }
                }),
            ],
            output: {
                file: path.resolve('dist/css/ol-street-view.min.css'),
            },
            onwarn(warning, warn) {
                if (warning.code === 'FILE_NAME_CONFLICT') return
                warn(warning)
            }
        }]
}