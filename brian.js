var gulp = require('gulp')
var webpack = require('webpack')

    webpack({
        entry: './messages/index.js',
        devtool: 'inline-source-map',
        output: {
            path: __dirname.concat('/deploy/js/'),
            filename: 'messages.js'
        },
        module: {
            loaders: [
                {
                  test: /\.js$/,
                  loader: 'babel-loader'
                }
            ]
        }
    }, function(err, stats) {
    });
