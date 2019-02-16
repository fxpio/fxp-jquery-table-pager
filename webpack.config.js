/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const Encore = require('@symfony/webpack-encore');

const config = Encore
    .setOutputPath('build/')
    .setPublicPath('/build')
    .disableSingleRuntimeChunk()
    .autoProvidejQuery()
    .enableSourceMaps(!Encore.isProduction())
    .cleanupOutputBeforeBuild()
    .enableLessLoader()
    .addLoader(
        {
            test: /\.js$/,
            loader: 'babel-loader',
            query: {
                presets: ['@babel/preset-env'],
            },
        }
    )
    .addEntry('main', './examples/main.js')
    .copyFiles({
        from: './examples',
        to: '[name].[ext]',
        pattern: /.html$/
    })
    .getWebpackConfig()
;

// Config of ajax data
if (config.devServer) {
    config.devServer.inline = true;
    config.devServer.before = function (app) {
        let url = require('url'),
            querystring = require('querystring');

        /**
         * Generate the list.
         *
         * @param {Number} pn  The page number
         * @param {Number} ps  The page size
         * @param {Number} max The max size of the list
         *
         * @returns {Array}
         */
        function getRows(pn, ps, max) {
            let rows = [],
                start = (pn - 1) * ps,
                end = 0 === ps ? max : Math.min(start + ps, max),
                i;

            for (i = start + 1; i <= end; i++) {
                rows.push({
                    '_row_number': i,
                    '_row_id': i,
                    'id': i.toString(),
                    'firstname': 'First name ' + i,
                    'lastname': 'Last name ' + i,
                    'username': 'Username ' + i,
                    '_selectable': '<input type="checkbox">'
                });
            }

            return rows;
        }

        app.get("/ajax.json", function(req, res){
            let params = querystring.parse(url.parse(req.url).query),
                max = 70,
                pn = 'pn' in params ? parseInt(params['pn']) : 1,
                ps = 'ps' in params ? parseInt(params['ps']) : 10,
                rows = getRows(pn, ps, max);

            res.json({
                size: max,
                pageNumber: pn,
                pageSize: ps,
                rows: rows,
                sortColumns: {}
            });
        });
    };
}

module.exports = config;
