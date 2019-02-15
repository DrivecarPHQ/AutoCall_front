let autoprefixer = require('autoprefixer');
let cssnano = require('cssnano')
module.exports = {
    plugins: [
        autoprefixer({
            browsers: [
                // 加这个后可以出现额外的兼容性前缀
                '> 0.01%','last 10 versions', 'ie > 8', 'iOS >= 8', 'Firefox >= 20', 'Android > 4.4'
            ]
        }),
        cssnano()
    ]
}
