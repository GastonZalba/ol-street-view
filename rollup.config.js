import babel from '@rollup/plugin-babel';
import image from '@rollup/plugin-image';
import css from 'rollup-plugin-css-only'
import { mkdirSync, writeFileSync } from 'fs';
import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';

module.exports = {
    input: 'src/ol-street-view.ts',
    output: [
        {
            dir: 'lib',
            format: 'es',
            sourcemap: true
        }
    ],
    plugins: [
        del({ targets: 'lib/*' }),
        typescript({
            outDir: './lib',
            declarationDir: './lib',
            outputToFilesystem: true
        }),
        image(),
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
            exclude: ["node_modules/**", "src/assets/**"]
        }),
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
        'ol/style',
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