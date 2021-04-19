Documentation
=============

This source for documentation is at `docs` and built using [mdbook](https://github.com/rust-lang/mdBook). You can trigger a manual build by executing the following command from the project root:

```bash
$ yarn build:docs
```

The resulting files are placed in `build/docs/`.

*Mdbook* also supports starting a local web server to render a live preview of changes made to the markdown files:

```bash
$ cd docs
$ mdbook serve
```

Plugins
-------

Currently there are two plugins used during compilation of the documentation. You'll probably have to install them manually.

**[mdbook-linkcheck](https://github.com/Michael-F-Bryan/mdbook-linkcheck)** is included to check that all links the documentation points to are valid.

**[mdbook-open-on-gh](https://github.com/badboy/mdbook-open-on-gh)** adds a link to the current page on GitHub at the bottom of each page.

You can install the plugins with [cargo](https://doc.rust-lang.org/cargo/) from you command line:

```bash
$ cargo install mdbook-linkcheck mdbook-open-on-gh
```
