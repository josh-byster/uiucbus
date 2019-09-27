<h1 align="center">
  <br>
  <a href="https://uiucbus.com/"><img src="https://i.imgur.com/EneZPWV.jpg" alt="Markdownify" width="200"></a>
  <br>
  UIUC Bus Tracker
  <br>
</h1>

<h4 align="center">A fast, lightweight, responsive web app for the Champaign—Urbana bus system.</h4>

<p align="center">

  <a href="https://travis-ci.com/josh-byster/bus-tracker">
    <img src="https://travis-ci.com/josh-byster/bus-tracker.svg?branch=master"
         alt="Travis CI">
  </a>
  <a href="https://cypress.io">
    <img src="https://img.shields.io/badge/cypress.io-tests-green.svg?style=flat-square"
         alt="Cypress">
  </a>
  <a href="https://lbesson.mit-license.org/">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg"
         alt="License">
  </a>
  <a href="https://codecov.io/gh/josh-byster/bus-tracker">
    <img src="https://codecov.io/gh/josh-byster/bus-tracker/branch/master/graph/badge.svg"
         alt="Codecov">
  </a>
</p>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#credits">Credits</a> •
  <a href="#license">License</a>
</p>

## Key Features

* See most recently viewed stops
  - Instantly navigate between most popular stops and most recently viewed
* Responsive, mobile-friendly
* Get stops closest to current location
* Smart fuzzy searching of stops
* Optimized for speed
  - Hosted through a CDN for fast load times
  - Uses a [redis](https://redis.io) cache on the backend so popular stops can be retrieved quickly
* View current bus location on a map
  - See the previous and next stops for any bus
* Color-coding based on route for quick viewing
  - Designed so that the 12W Teal, for example, has a teal background

## About

Designed for frequent bus riders, this web app has speed and simplicity as its top priority. The app allows for quick checking of any route, keeps track of recently viewed stops, and allows riders to see the live location of a bus.

This utilizes CUMTD's API and Mapbox along with ReactJS and Twitter Bootstrap to deliver a responsive and intuitive end-user experience. The old version of the site (2016-2017) employed jQuery instead of React.

The initial goal of this project was to have an app designed specifically for power users that want to have a way to very quickly and reliably see the bus arrival times. Many of the existing apps suffer from lagging on load times, and I wanted
a way to very quickly be able to check stops. On average, with cached assets on a local machine, the entire search takes around 200ms from the time of clicking to the time the results are displayed.

The site is hosted through GitHub Pages and is aliased at [uiucbus.com](http://uiucbus.com/). The site is powered by [Cloudflare](https://www.cloudflare.com/cdn/) CDN for quick loading and caching of static assets. The API is deployed to [Heroku](https://www.heroku.com/) on every push to `master`.

The app is also featured on MTD's [app page](https://mtd.org/maps-and-schedules/apps/). All bus information is provided by MTD.

## How To Use

To run this project, first make sure you have Docker and Docker Compose installed on your machine. Then you must set the `$CUMTD_API_KEY` environment variable. After this, you may run `docker-compose up` to start both the frontend and backend! At this point, you can navigate to `localhost:3000` to view the tracker. The API is located at `localhost:5000`.


## Credits

This software uses the following open source packages:

- [Node.js](https://nodejs.org/)
- [React.js](https://reactjs.org)
- [Express.js](http://expressjs.com/)
- [Cypress.io](http://cypress.io/)
- Icons are taken from [FontAwesome](https://github.com/FortAwesome/react-fontawesome)

## License

MIT

---

> [joshbyster.com](https://joshbyster.com) &nbsp;&middot;&nbsp;
> GitHub [@josh-byster](https://github.com/josh-byster) &nbsp;&middot;&nbsp;
> LinkedIn [in/joshbyster](https://www.linkedin.com/in/joshbyster/)
