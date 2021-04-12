Project Architecture
====================

### Goal

The original goal of *WebFun* was to find out how Yoda Stories' world generation works.

After that had been accomplished the goal shifted to preserving and revitalizing the *Desktop Adventures*-series, making the games easy to play and explore on modern devices.

Some components like the asset editor, script debugger and save game editor have originally been created to aid in the reverse engineering efforts, but could be refined to help users to extend the original games.

Along the way the project served as a playground to evaluate web technologies before putting them into production at *$dayjob*.

### Code

WebFun is written in [TypeScript](https://www.typescriptlang.org) and targets modern web browsers. In its current form is not based on a web framework. The UI is build on a thin abstraction over Web Components and Custom Elements. Some parts use JSX syntax to reduce the cognitive overhead of building DOM nodes.
