import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import eslint from 'rollup-plugin-eslint';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import cfg from './package.json';

export default {
    entry: 'src/index.js',
    dest: 'dist/tempos.js',
    format: 'umd',
    moduleName: 'tempos',
    banner: '/*!\n' +
        ' * tempos v' + cfg.version + '\n' +
        ' * (c) ' + new Date().getFullYear() + ' Focci\n' +
        ' * Under the MIT License\n' +
        ' */',
    sourceMap: true,
    plugins: [
        json(),
        resolve({
            jsnext: true,
            main: true
        }),
        eslint({
            exclude: ['node_modules/**']
        }),
        commonjs({
            ignoreGlobal: true
        }),
        babel({
            exclude: ['node_modules/**'],
            presets: ['es2015-rollup']
        }),
        replace({
            exclude: 'node_modules/**',
            ENV: JSON.stringify(process.env.NODE_ENV || 'development')
        }),
        (process.env.NODE_ENV === 'production' && uglify())
    ]
};