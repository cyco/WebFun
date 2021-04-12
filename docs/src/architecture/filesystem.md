Filesystem Overview
===================

The filesystem layout follows that of a typical web project. All text files are encoded in UTF-8 using `LF` (*U+000A*) as the sole line separator.

```bash
~/Source/webfun $ tree -L 1 .
.
├── Dockerfile
├── Dockerfile.CI
├── Jenkinsfile
├── README.md
├── TODO.md
├── assets
├── build
├── config
├── docs
├── node_modules
├── package.json
├── sonar-project.properties
├── src
├── test
├── tsconfig.json
├── webpack.config.js
├── yarn-error.log
└── yarn.lock

7 directories, 11 files
```

In `src` you'll find the source code files. The `assets` directory contains static (most likely binary) files like images that are used at runtime. Files created at build-time are placed in `build`. Scripts and configuration files are can be found in `config`. Files used in documentation are placed under `docs`. The `node_modules` directory is automatically generated and maintained by `Yarn`. Finally, all tests and files used only for testing are placed in `test`. The test directory has subdirectories for `unit` and `acceptance` tests. Unit tests are expected to correspond directly to a single file, module or class. They should only run the code under test and replace dependencies with mocks and stubs when practical. Every test that is not a unit test by the above definition can go into `test/acceptance`. Code that is only used in tests can be placed in `test/helpers`, all other files that are only used during test execution should be placed in `test/fixtures`.
