import babel from '@rollup/plugin-babel';
import image from '@rollup/plugin-image';
import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import path from 'path';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy';

process.env.NODE_ENV = 'production';

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