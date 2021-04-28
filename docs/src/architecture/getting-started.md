Getting Started
===============

To set up a local development environment you'll need:

-	[Git](https://git-scm.com) to download the source code
-	[Node.js](https://nodejs.org), version 14 or newer
-	[Yarn](https://yarnpkg.com) to install dependencies and run dev tasks

### Get the Source Code

Open your terminal and execute the following script to download the repository:

```bash
git clone https://github.com/cyco/webfun
```

### Install dependencies

To download and install all dependencies change into the new directory created by `git clone` and run `yarn`:

```bash
cd webfun
yarn install
```

### Start the server

Using `yarn` again from the project directory you can now start a local web server. Run the following command in your terminal and the local page will be opened in your default browser.

```bash
yarn start
```

Now you're all set up. The development page will reload whenever a code change is detected. See [Build System](build-system.md) for a list of tasks `yarn` can execute for you.

When you're done hit `CTRL` and `c` on your keyboard to stop the server.

Data Sources
------------

By default *WebFun* is set up to load game assets from [archive.org](htts://archive.org/). For local development it's often helpful to load the files from disk and speed things up a bit. *WebFun* uses an environment variable called `WEBFUN_GAMES` to determine where to find games.

To override the default configuration (stored in the file `.env.defaults`), you can either set it in your shell before starting the web server or create a new file `.env` and put the value there. The value of the variable should be a `JSON` encoded array of [GameSource](https://github.com/cyco/WebFun/blob/master/src/app/webfun/game-controller.tsx#L62) objects.

> **Note:** Environment variables are only read when a program is started. Make sure to restart your development server after making changes to `.env`

The following configuration adds a local Yoda Stories installation to the default *archive.org* game source.

```env
WEBFUN_GAMES=[{"title":"Yoda Stories (local)","variant":"yoda","data":"game-data/YODESK.DTA","exe":"game-data/YODESK.EXE","help":"game-data/YODESK.HLP","sfx":"game-data/SFX/"},{"title":"Yoda Stories from archive.org","variant":"yoda","exe":"https://cors.archive.org/download/Star_Wars_-_Yoda_Stories_1997_LucasArts/Star%20Wars%20-%20Yoda%20Stories%20%281997%29%28LucasArts%29.iso/Yoda%2FYodesk.exe","sfx":"https://cors.archive.org/download/Star_Wars_-_Yoda_Stories_1997_LucasArts/Star%20Wars%20-%20Yoda%20Stories%20%281997%29%28LucasArts%29.iso/Yoda%2Fsfx%2F","data":"https://cors.archive.org/download/Star_Wars_-_Yoda_Stories_1997_LucasArts/Star%20Wars%20-%20Yoda%20Stories%20%281997%29%28LucasArts%29.iso/Yoda%2Fyodesk.dta","help":"https://cors.archive.org/download/Star_Wars_-_Yoda_Stories_1997_LucasArts/Star%20Wars%20-%20Yoda%20Stories%20%281997%29%28LucasArts%29.iso/Yoda%2FYodesk.hlp"}]
```
