# UIUCBus.com — Quick and Painless Bus Tracking Web App

[![Build Status](https://travis-ci.com/josh-byster/bus-tracker.svg?branch=master)](https://travis-ci.com/josh-byster/bus-tracker)

Designed for frequent bus riders, this web app has speed and simplicity as its top priority. The app allows for quick checking of any route, keeps track of recently viewed stops, and allows riders to see the live location of a bus.

This utilizes CUMTD's API and Mapbox along with ReactJS and Twitter Bootstrap to deliver a responsive and intuitive end-user experience. The old version of the site (2016-2017) employed jQuery instead of React.

The initial goal of this project was to have an app designed specifically for power users that want to have a way to very quickly and reliably see the bus arrival times. Many of the existing apps suffer from lagging on load times, and I wanted
a way to very quickly be able to check stops. On average, with cached assets on a local machine, the entire search takes around 200ms from the time of clicking to the time the results are displayed.

The site is hosted through GitHub Pages and is aliased at [uiucbus.com](http://uiucbus.com/). It is also featured on MTD's [app page](https://mtd.org/maps-and-schedules/apps/). All bus information is provided by MTD.

## Usage

To use this, add your Google Maps API key and CUMTD API key, which can both be obtained for free, to the spots provided in `src/util/api.js`.
