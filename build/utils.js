var path = require('path')
var config = require('../config')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

exports.assetsPath = function(_path) {
    var assetsSubDirectory = process.env.NODE_ENV === 'production' ? config.build.assetsSubDirectory : config.dev.assetsSubDirectory
    return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function(options) {
    options = options || {}
        // generate loader string to be used with extract text plugin
    function generateLoaders(loaders) {
        var sourceLoader = loaders.map(function(loader) {
            var extraParamChar
            if (/\?/.test(loader)) {
                loader = loader.replace(/\?/, '-loader?')
                extraParamChar = '&'
            } else {
                loader = loader + '-loader'
                extraParamChar = '?'
            }
            return loader + (options.sourceMap ? extraParamChar + 'sourceMap' : '')
        }).join('!')

        // Extract CSS when that option is specified
        // (which is the case during production build)
        if (options.extract) {
            return ExtractTextPlugin.extract('vue-style-loader', sourceLoader)
        } else {
            return ['vue-style-loader', sourceLoader].join('!')
        }
    }

    // http://vuejs.github.io/vue-loader/en/configurations/extract-css.html

    return {
        css: generateLoaders(['css','postcss']),
        postcss: generateLoaders(['css?modules&localIdentName=[name]-[local]-[hash:base64:5]']),
        less: generateLoaders(['css?modules&localIdentName=[name]-[local]-[hash:base64:5]','postcss', 'less']),
        sass: generateLoaders(['css?modules&localIdentName=[name]-[local]-[hash:base64:5]','postcss', 'sass?indentedSyntax']),
        scss: generateLoaders(['css?modules&localIdentName=[name]-[local]-[hash:base64:5]','postcss', 'sass']),
        stylus: generateLoaders(['css?modules&localIdentName=[name]-[local]-[hash:base64:5]','postcss', 'stylus']),
        styl: generateLoaders(['css?modules&localIdentName=[name]-[local]-[hash:base64:5]','postcss', 'stylus'])
    }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function(options) {
    var output = []
    var loaders = exports.cssLoaders(options)
    for (var extension in loaders) {
        var loader = loaders[extension]
        output.push({
            test: new RegExp('\\.' + extension + '$'),
            loader: loader
        })
    }
    return output
}