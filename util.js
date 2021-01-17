module.exports.util = {}

module.exports.util.clamp = function (num, min, max) {
    return num <= min ? min : num >= max ? max : num;
}