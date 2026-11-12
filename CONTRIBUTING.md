# Contributing to wkt-parser

Thanks for your interest in contributing. wkt-parser is maintained by a small group of volunteers, and review time is the scarcest resource we have. These guidelines help us spend it on changes that matter to people who use wkt-parser and [proj4js](https://github.com/proj4js/proj4js).

To set up a development environment, run `npm install`. `npm test` builds the library and runs the tests.

## Real-world use case

Bug reports and bug fixes need a real-world use case. That means one of:

- A published CRS definition (e.g. an EPSG, ESRI or IAU code) whose WKT or PROJJSON, as published on [spatialreference.org](https://spatialreference.org) or produced by `projinfo`, is parsed incorrectly.
- A WKT or PROJJSON definition written by software you or your users actually depend on (e.g. a `.prj` file from GIS software, or a response from a map server).

Describe the use case in the issue or pull request, and include the definition. Definitions that are made up or edited by hand to trigger a difference are not considered bugs.

New features (e.g. support for a new WKT element or projection method) need a use case too: tell us who needs it and for which CRS.

## One pull request per change

Keep each pull request to a single fix or feature, and leave unrelated code alone. Don't reformat, rename or restructure code you're not otherwise changing.

Before opening a pull request, check the open pull requests. If one already addresses the same problem, review or comment on it instead of opening another.

For anything bigger than a small fix, open an issue first and wait for feedback from a maintainer before investing time in a pull request.

## Keep descriptions short

Keep issue and pull request descriptions short and focused on what a reviewer needs to know: the use case, what was wrong, and what the change does. As a rule of thumb, a reviewer should be able to read and understand a pull request description in less than a minute. Don't include test run statistics or lists of every check you ran; our CI runs those.

Keep commit messages short as well. Don't repeat the pull request description, and don't reference issues or pull requests in commit messages; GitHub links those for us.

## Tests

Bug fixes need a test that fails without the fix, and new features need tests that cover them.

- Write as few tests as needed. Add a fixture to `test/test-fixtures.json` only if no existing fixture already covers the same code path.
- Use the definition from the use case as the fixture's `code`, instead of a made-up one.
- Generate the fixture with `npm run fixture -- <code>` (or a WKT/PROJJSON string or file instead of the code). It checks that proj4js, with the definition parsed by wkt-parser, transforms coordinates like [PROJ](https://proj.org) does, and prints the fixture only if it does. It needs PROJ's `projinfo` and `cs2cs`, and proj4js (`npm install --no-save proj4`). Include the coordinate comparison it prints in the pull request description.
- Leave existing fixtures alone unless the expected behavior has changed. If an existing fixture has to change, explain why in the pull request description.

## Code comments

Keep code comments concise. They should help readers understand code that isn't self-explanatory, not describe the reasoning or history behind a change; that belongs in the pull request. Don't add decorative comment banners.

## Before submitting

Make sure `npm test` passes.
