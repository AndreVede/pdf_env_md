const path = require('path');
const webpackNodeExternals = require('webpack-node-externals');
const autoprefixer = require('autoprefixer');
const Dotenv = require('dotenv-webpack');

const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '.env.defaults') });
dotenv.config({ path: path.resolve(__dirname, '.env'), override: true });

module.exports = (env, argv) => {
    const mode = argv.mode;
    const conf = {
        entry: [path.resolve('src', 'index.ts')],
        devtool: isProd(mode) ? undefined : 'inline-source-map',
        plugins: [
            new Dotenv({
                path: path.resolve(__dirname, '.env'),
                defaults: true,
            }),
        ],
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: [
                        {
                            loader: 'ts-loader',
                            options: {
                                configFile: path.resolve('tsconfig.json'),
                            },
                        },
                    ],
                    exclude: /node_modules/,
                },
                {
                    test: /\.md$/,
                    use: ['raw-loader'],
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        //'style-loader',
                        {
                            // Translates CSS into CommonJS
                            loader: 'css-loader',
                            options: {
                                sourceMap: !isProd(mode),
                                import: false,
                            },
                        },
                        {
                            // Compiles Sass to CSS
                            loader: 'sass-loader',
                            options: {
                                sourceMap: !isProd(mode),
                                sassOptions: {
                                    outputStyle: isProd(mode)
                                        ? 'compressed'
                                        : 'expanded',
                                },
                            },
                        },
                        {
                            // Loader for webpack to process CSS with PostCSS
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    plugins: [[autoprefixer, {}]],
                                },
                            },
                        },
                    ],
                },
                {
                    test: /\.(svg|png|jpg|gif|webp)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                outputPath: 'imgs',
                                esModule: false,
                            },
                        },
                    ],
                },
                {
                    test: /\.(aac|mp3)$/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'audio',
                            esModule: false,
                        },
                    },
                },
                {
                    test: /\.(webm|mp4)$/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'video',
                            esModule: false,
                        },
                    },
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
            alias: { '@src': path.resolve('src') },
        },
        output: {
            filename: 'bundle.js',
            path: path.resolve('build'),
            clean: true,
            libraryTarget: 'umd', // ssr
            globalObject: 'this', // ssr
        },
        target: 'node', // ssr
        externals: [webpackNodeExternals()],
        watchOptions: {
            ignored: /node_modules/,
        },
    };
    return conf;
};

const isProd = (mode) => {
    return mode === 'production';
};
