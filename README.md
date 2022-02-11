# Bitrise-Helper
### Various Bitrise helpers

More information can be found here https://api-docs.bitrise.io/#/builds/build-log
1) Run ```npm install```.


2) The helper will need the following as environmental variables: 

```ACCESS_TOKEN```: the Bitrise Access Token.

```APP_SLUG```: the app's partial URL.

```PROJECT_PATH```: the path of the main project

Current scripts:
- ```npm run check```:
  Check if there is capacity for your build.
- ```npm run watch```:
  Watch all the builds of a given branch.
- ```npm run trigger```:
  Trigger a build.
- ```npm run abort```:
  Abort a build.
- ```npm run runTest```:
    Run a test in SauceLabs
- ```npm run help```:
  List of available commands
