module.exports = {
    async liveTest({ homey, params, query, body }) {
        return await homey.app.liveTest(body);
    },
};