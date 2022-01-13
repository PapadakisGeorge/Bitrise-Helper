const { triggerStart } = require('./src/bitriseAPI/triggerStart');

(async () => {
    await triggerStart();
})();
