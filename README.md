TheBat- WebApp
========================


WebApp for a mapping application based on Angular X and Leaflet.


How to start?
--------------

This project requires [npm](https://www.npmjs.com/) (or [yarn](https://yarnpkg.com/)).

1.	Run `npm install` or `yarn install` to install dependencies.

2.	Run `npm run build` to build the project.

3.  Open the app at `public/index.html`.

Quirks:
--------------
- Angular Material does not support loading themes unless you directly refer node_modules folder (for non cli projects)
- Issues with loading spin.js and intro.js css inside Angular.
- These files are provided in prod-dependencies folder for now. (Permanent fix in a future version)