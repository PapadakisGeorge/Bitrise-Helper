const { abortBuild } = require("./src/bitriseAPI/abortBuild");

(async () => {
  await abortBuild();
})();
