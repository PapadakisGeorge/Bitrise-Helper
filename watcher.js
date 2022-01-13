const { watcherStart } = require('./src/bitriseAPI/watcherStart');

(async () => {
    await watcherStart();
})();
