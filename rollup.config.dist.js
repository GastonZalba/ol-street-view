import resolve from '@rollup/plugin-node-resolve';
import image from '@rollup/plugin-image';
import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import terser from '@rollup/plugin-terser';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import postcss from 'rollup-plugin-postcss';
import path from 'path';
import banner2 from 'rollup-plugin-banner2'
import { readFileSync } from 'fs';
const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

const globals = (id) => {

    const globals = {
        'interactjs': 'interact',
        'google-maps': 'google-maps'
    }

    if (/ol(\\|\/)/.test(id)) {
        return id.replace(/\//g, '.').replace('.js', '');
    } else if (id in globals) {
        return globals[id];
    }

    return id;
}

const banner =`
/*!
 * ${pkg.name} - v${pkg.version}
 * ${pkg.homepage}
 * Built: ${new Date()}
*/
`;

export default function (commandOptions) {

    const outputs = [{
        input: 'src/index-umd.ts',
        output: [
            {
                file: 'dist/ol-street-view.js',
                format: 'umd',
                name: 'StreetView',
                globals: globals,
                sourcemap: true
            },
            !commandOptions.dev && {
                file: 'dist/ol-street-view.min.js',
                format: 'umd',
                plugins: [terser()],
                name: 'StreetView',
                globals: globals,
                sourcemap: true
            }
        ],
        plugins: [
            banner2(() => banner),
            del({ targets: 'dist/*' }),
            typescript(
                {
                    outDir: './dist',
                    declarationDir: './dist',
                    outputToFilesystem: true
                }
            ),
            resolve(),
            image(),
            postcss({
                extensions: ['.css', '.sass', '.scss'],
                inject: commandOptions.dev ? true : false,
                extract: commandOptions.dev ? false : path.resolve('dist/css/ol-street-view.css'),
                sourceMap: commandOptions.dev ? true : false,
                minimize: false,
                config: {
                    path: './postcss.config.cjs',
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
                port: 3005,
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
        external: (id) => {
            return /(ol(\\|\/)|interactjs)/.test(
                id
            );
        }
    }]

    // Minified css
    if (!commandOptions.dev)
        outputs.push({
            input: path.resolve('dist/css/ol-street-view.css'),
            plugins: [
                postcss({
                    extract: true,
                    minimize: true,
                    config: {
                        path: './postcss.config.cjs',
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
        })

    return outputs;
}