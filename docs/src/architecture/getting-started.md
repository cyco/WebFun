Getting Started
===============

To set up a local development environment you'll need:

-	[Git](https://git-scm.com) to download the source code
-	[Node.js](https://nodejs.org), version 15 or newer
-	[Yarn](https://yarnpkg.com) to install dependencies and run dev tasks

### Get the Source Code

Open your terminal and execute the following script to download the repository:

```bash
git clone https://github.com/cyco/webfun
```

### Install dependencies

To download and install all dependencies change into the new directory created by `git clone` and run yarn:

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
