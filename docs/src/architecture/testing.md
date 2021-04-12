Testing
=======

Most of the code base is tested via unit tests, written in Karma / Jasmine and located at `test/unit/`. Generally each test file here directly corresponds to a source file in `src`.

The world generation code is tested using a golden master approach. Test cases are seeded with World Size, Planet and a 16bit PRNG seed and validated against output of the original game.

In order to ensure that the gameplay stays true to the original implementation and scripts are executed properly there are a number of in-game tests that use recorded or synthesized input and inspect the game state after running the specified inputs. In order to simplify development and improve maintainability of in-game tests, a custom format similar to `phpt` (see [PHP Quality Assuarance](https://qa.php.net/write-test.php#basic-format)) is used. The format is described in [Gameplay Test Format](gameplay-test-format). Tests can also be created by using the [Test Creator](../debugging/test-creator) GUI.

In order to guide developers while improving and extending the test suite, code coverage reports are generated for JavaScript/TypeScript files, as well as the internal scripting language and scripts defined in that language. See [Editor/CoverageView](editor/coverage-view) on how to access in-game code coverage.
