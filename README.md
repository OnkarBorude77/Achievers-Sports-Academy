# Karate Dojo Website (React + Vite)

Pages: Home, About us, Belt path, Achievements, Gallery, Contact us.

## Run it

```bash
npm install
npm run dev        # opens a local preview (usually http://localhost:5173)
npm run build      # creates the final site in the dist/ folder
```

Upload the contents of `dist/` to any hosting (Netlify, Vercel, GitHub Pages, shared hosting).
Node.js 18 or newer is required.

## Change the text, contact details, belts, results

Open **`src/data/siteData.js`**. Dojo name, phone, email, address, class list, timings, belt
details, achievements and gallery entries all live there. Anything written in [square brackets]
is a placeholder to replace.

Also change the page title in `index.html`.

## Add your photos

Put your images in **`public/images/`** with these names (or edit the names in `siteData.js`).
Until a file exists, the site shows a dashed placeholder naming the photo it needs.

| File name | Used on | Suggested shape |
|---|---|---|
| `herophoto.jpg` | Home hero (shown inside a circle) | Square, student mid-technique |
| `senseiphoto.jpg` | Home and About | Portrait, 4:5 |
| `dojophoto.jpg` | About story section | Portrait, 4:5 |
| `about-01.jpg`, `about-02.jpg`, `about-03.jpg` | About photo strip | Landscape, 4:3 |
| `gallery-01.jpg` … `gallery-12.jpg` | Gallery and Home preview | Any shape (see `ratio` in data) |
| `achievement-01.jpg` … `achievement-07.jpg` | Achievements page | Landscape, 4:3 |

Tip: resize photos to about 1600px on the long side and save as JPG to keep the site fast.

## Make the contact form send email

By default the form opens the visitor's email app. To send messages directly, create a free form
endpoint (for example at formspree.io) and paste its URL into `formEndpoint` in `siteData.js`.
Paste your Google Maps embed link into `mapEmbedUrl` to show the map.

## Change the look

Colours and fonts are at the top of `src/styles.css` (the `:root` block).
