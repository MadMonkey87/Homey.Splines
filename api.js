const Homey = require('homey')

module.exports = [
    {
        method: 'POST',
        path: '/liveTest',
        public: false,
        fn: function (args, callback) {
            Homey.app.liveTest(args.body, (err, result) => {
                if (err) {
                    callback(err, null)
                } else {
                    callback(null, result)
                }
            })
        }
    }
]