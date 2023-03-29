# PCC Website

Demo site: [coventrypca.netlify.app](https://coventrypca.netlify.app/)

This is the repo for the Presbyterian Church of Coventry's 2019 website redesign and Git host for Netlify builds.

This project uses [Gridsome](https://gridsome.org) and [NetlifyCMS](https://netlifycms.com).

# Develop

Clone and open this repository

```sh
git clone https://github.com/Presbyterian-Church-of-Coventry/pcc-website.git
cd pcc-website
```

Install all the necessary packages 

```sh
npm install
```

Then write some code!

<br/>
<br/>

To test your changes, you can spin up a local dev server at `http://localhost:8080` by running

```sh
npm run dev
```

Before comitting, test to make sure everything builds fine with:

```sh
npm run generate
```

Happy coding! 🎉

# Structure

As most Vue/Gridsome projects, all the individal webpages live in `src/pages/`, with supporting components and data in the `src/` directory.

However, all the changable data the site displays lives in `content/` as markdown files that are manipulated by Netlify's CMS page. Changing any displayed data should be done here, while any aesthetic/webpage changes should be made in `src/`.
