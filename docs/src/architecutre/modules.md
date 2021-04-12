Modules
=======

Here's an overview of WebFun's most important modules. Every module is a directory in the source tree that exports its public API via an index.ts file.

Generally imports should not reach too deep into other modules and instead prefer a *public* exports. By convention relative imports should only be used for sub-module of the current module (e.g. `import {Something} from "./my-submodule"`). If something from a parent or unrelated module is needed, absolute imports starting from `src` should be preferred.

### `std`

Exports for objects and classes that are pre-defined in the global namespace. Importing these things from `std` instead of just using the global variables makes dependencies on browser APIs (esp. the DOM) more visible.

### `extension`

Additions to standard classes, that generally make life easier.

### `ui`

This module is the basis for all user interface elements in WebFun. The files `ComponentRegistry.ts` and `Components.ts` provide a thin abstraction over the Custom Elements API.

The submodule `components` exports generic controls like buttons, windows and labels.

### `util`

A bunch of helpers and utilities, preferably with a functional interface.

### `app`

The app module contains entry points for the web application. Each module here should be considered a standalone app.

### `engine`

This is the core module. It contains code for reading game assets, generate worlds and running a game.

To keep this easy to port to platforms other than the browser (i.e. node or deno), this module must not rely on browser-only APIs. To provided access platform specific functionality without coupling the engine to specific APIs a custom interface can be implemented.

The engine should also be as generic as possible, quirks that are specific to *Yoda Stories* or *Indiana Jones and His Desktop Adventures* can be implemented as a game variant in the `variant` module.

### `variant`

Code that is only relevant for a specific Desktop Adventure goes here.
