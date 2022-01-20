# Bitrise-Helper
### Various Bitrise helpers

1) Run ```npm install```.


2) The helper will need the following as environmental variables: 

```ACCESS_TOKEN```: the Bitrise Access Token.

```APP_SLUG```: the app's partial URL.

Current scripts:
- ```npm run check```:
  Check if there is capacity for your build.
- ```npm run watch```:
  Watch all the builds of a given branch.
- ```npm run trigger```:
  Trigger a build.
- ```npm run abort```:
  Abort a build.
- ```npm run help```:
  List of available commands
