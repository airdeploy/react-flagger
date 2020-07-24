## Get started

If you want to develop flagger sdk or make changes in examples:

- Сlone this repo and install dependencies by running:
  `yarn` in `flagger/examples/react-example` and `flagger` folders

- start flagger backend. You need to have a service that resolves with a flagger configuration. Alternatively use airship as a backend, copy `apiKey` from your dashboard and send them in `.init()` function during initialization of flagger SDK

- run `npm link` in `flagger` folder
- run `npm link flagger` in `flagger/examples/react-example/`. That way you create a symlink between folders so that you can check your changes without publishing to npm
- run `yarn dev` in `flagger` folder. It will start rollup in a watch mode, so that all changes in SDK will update react bundle
- run `yarn start` in `flagger/examples/react-example/`. Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
