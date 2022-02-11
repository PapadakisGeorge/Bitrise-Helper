const { forEach } = require("p-iteration");
const getFiles = require("node-recursive-directory");

const getAllFeatureNames = async (testSuite) => {
  let featureNames = [];
  const mainDirectory = "../ie-native-app/test/features";

  const subDirectoriesPerSuite = {
    android: ["common", "androidOnly"],
    ios: ["common", "iosOnly"],
    androidEdge: ["androidEdge", "androidErrorHandle"],
    iosEdge: ["iosEdge", "iosErrorHandle"],
  };

  await forEach(subDirectoriesPerSuite[testSuite], async (subDirectory) => {
    const features = await getFiles(`${mainDirectory}/${subDirectory}`);
    featureNames = featureNames.concat(features);
  });

  return featureNames.map((feature) => feature.split("/").pop());
};

module.exports = {
  getAllFeatureNames,
};
