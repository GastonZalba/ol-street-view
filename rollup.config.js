import image from '@rollup/plugin-image';
import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import path from 'path';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy';

export default {
    input: 'src/index-es.js',
    output: [
        {
            file: 'lib/ol-street-view.js',
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
        postcss({
            extensions: ['.css', '.sass', '.scss'],
            extract: path.resolve('lib/style/css/ol-street-view.css'),
            inject: false,
            config: {
                path: './postcss.config.js',
                ctx: {
                    isDev: false
                }
            }
        }),
        copy({
            targets: [
                { src: 'src/assets/scss', dest: 'lib/style' }
            ]
        })
    ],
    external: id => !(path.isAbsolute(id) || id.startsWith("."))
};