<h1 align="center">
  <br>
  <a href="https://uiucbus.com/"><img src="https://i.imgur.com/EneZPWV.jpg" alt="UIUC Bus Tracker" width="200"></a>
  <br>
  UIUC Bus Tracker
  <br>
</h1>

<h4 align="center">A fast, lightweight, responsive web app for the Champaign—Urbana bus system.</h4>

<p align="center">
  <a href="https://lbesson.mit-license.org/">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg"
         alt="License">
  </a>
</p>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#credits">Credits</a> •
  <a href="#license">License</a>
</p>

## Key Features

* See most recently viewed stops
  - Instantly navigate between most popular stops and most recently viewed
* Responsive, mobile-friendly with dark mode support
* Get stops closest to current location
* Smart fuzzy searching of stops and routes
* Optimized for speed
  - Built on Next.js with Turbopack for fast development and optimized production builds
  - API routes colocated in the same app for minimal latency
* View current bus location
  - See the previous and next stops for any bus
* Color-coding based on route for quick viewing
  - Designed so that the 12W Teal, for example, has a teal background

## About

Designed for frequent bus riders, this web app has speed and simplicity as its top priority. The app allows for quick checking of any route, keeps track of recently viewed stops, and allows riders to see the live location of a bus.

This is a full-stack Next.js application that uses CUMTD's API to deliver a responsive and intuitive end-user experience. The frontend is built with React 19, Tailwind CSS v4, and shadcn/ui components.

The initial goal of this project was to have an app designed specifically for power users that want to have a way to very quickly and reliably see the bus arrival times. Many of the existing apps suffer from lagging on load times, and I wanted a way to very quickly be able to check stops.

The site is available at [uiucbus.com](http://uiucbus.com/). The app is also featured on MTD's [app page](https://mtd.org/maps-and-schedules/apps/). All bus information is provided by MTD.

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI:** [React 19](https://react.dev/), [shadcn/ui](https://ui.shadcn.com/), [cmdk](https://cmdk.paco.me/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Theming:** [next-themes](https://github.com/pacocoursey/next-themes)

## How To Use

To run this project locally, you need [Node.js](https://nodejs.org/) installed.

```bash
# Clone the repository
git clone https://github.com/josh-byster/uiucbus.git
cd uiucbus

# Install dependencies
npm install

# Set up environment variables
# Create a .env file with your CUMTD API key:
#   CUMTD_API_KEY=your_key_here

# Start the dev server (uses Turbopack)
npm run dev
```

Then navigate to `localhost:3000` to view the tracker.

## Credits

This software uses the following open source packages:

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)

## License

MIT

---

> [joshbyster.com](https://joshbyster.com) &nbsp;&middot;&nbsp;
> GitHub [@josh-byster](https://github.com/josh-byster) &nbsp;&middot;&nbsp;
> LinkedIn [in/joshbyster](https://www.linkedin.com/in/joshbyster/)
