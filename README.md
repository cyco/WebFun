# WebFun
An unfinished web based reimplementation of the desktop adventures game engine.


## Usage
### Prerequisites
  * Browser (tested on Safari 11, up to date Chrome should also work)
  * Node.js
  * [yarn](https://yarnpkg.com)
  * game file placed in `assets/game-data` (rename `YODESK.DTA` to `yoda.data`)
  * palette file placed at `assets/game-data/yoda.pal` `assets/game-data/indy.pal` (extract from original game)

### How to build
The project uses yarn to manage dependencies, webpack as a build system and karma/jasmine to run tests.
To compile the project and start a local webserver run the following command:

```bash
# check out projcet
git clone https://github.com/cyco/WebFun.git
cd WebFun

# install dependencies
yarn

# start local web server, then navigate to http://localhost:8080
yarn start

# run tests
yarn test:full
```
Check the `scripts` section of `package.json` for other commands.
