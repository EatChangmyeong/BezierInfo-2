# BezierInfo-2: a dev repository

This is the development repository for ["A Primer on Bézier Curves"](https://pomax.github.io.bezierinfo), itself hosted as https://pomax.github.io/BezierInfo-2/

The primer is currently being rewritten from a React application to a pure HTML/CSS/Vanilla-JS tech stack.

React is nice, Webpack is convenient, but there's just very little need to serve the Primer as "a React app". Simply convert the various parts to HTML directly, and then assemble it as "a page" that _just works_, rather than as "an application" that won't even show content without JS enabled.

See https://github.com/Pomax/BezierInfo-2/issues/257 for the current rewrite status

## Building everything

Use the latest Node v14, with all dependencies installed via `npm install`. Note that [node-canvas](https://github.com/Automattic/node-canva) has [special instructions](https://github.com/Automattic/node-canvas/wiki/Installation:-Windows) because it's going to have to compile itself (however, JPEG support is not needed for this project).

- The general single-build-pass command is simply `npm start`
- Continuous development is `npm test`

#### Specialised commands:

- `polish` runs `prettier` on the final .html files, as well as `link-checker` to make sure there are no dead links in the content.

#### Even more specialized commands:

Please see the package.json `"scripts"` section for the full list of commands. Most of these are just build chain steps, and running them on their own basically makes no sense.

## Weird personal dependencies?

There are a number of dependencies that are pulled from my own forks of projects, because they included patches (either by myself or others) that fix problems or shortcomings that have not been merged into upstream yet, or have been merged in but not released as a version that can be pulled down from npm yet.
