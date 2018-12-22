# Champaign-Urbana Mass Transit Department - Quick Bus Lookup

[![Build Status](https://travis-ci.com/josh-byster/bus-tracker.svg?branch=master)](https://travis-ci.com/josh-byster/bus-tracker)
This is a simple web app that allows you to search for a stop and find out the bus arrival times in under 5 seconds. It also features
live updating every 60 seconds with an ability to see the last known location of any bus.

This utilizes CUMTD's API and Google Maps Static API along with Bootstrap 4 and jQuery to deliver a responsive end-user experience.

The goal of this web app is completely based on efficiency. Many of the existing apps suffer from lagging on load times, and I wanted
a way to very quickly be able to check stops. With cached assets on a local machine, the entire search takes around 200ms. Running on the website
generally takes 1.5s on Chrome.

This is hosted on [uiucbus.com](http://uiucbus.com/).

## Usage

To use this, add your Google Maps API key and CUMTD API key, which can both be obtained for free, to the spots provided in `BusTracking.html`.
