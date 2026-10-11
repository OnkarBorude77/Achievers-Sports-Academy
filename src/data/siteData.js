// ─────────────────────────────────────────────────────────────
//  EDIT THIS FILE to change the text, contact details,
//  achievements and gallery. You rarely need to touch the pages.
//
//  IMAGES: put your photos in  public/images/  using the same
//  file names written below (or change the names here).
//  Until a photo exists, the site shows a labelled placeholder
//  with the file name you need to add.
// ─────────────────────────────────────────────────────────────

export const site = {
  // These are the starting values. After Owner login, the "Edit site" button lets you change
  // most of them from the website itself (saved in your browser).
  name: "Your Dojo Name",
  tagline: "Traditional karate for kids, teens and adults",
  style: "[Karate style]",
  foundedYear: "[Year]",

  heroTitle: "Karate that builds character, one belt at a time.",
  heroText:
    "We teach traditional karate to children, teens and adults. Train with respect, earn each belt, and leave every class a little stronger than you arrived.",

  phone: "+00 00000 00000",
  whatsapp: "000000000000", // country code + number
  email: "info@yourdojo.com",
  address: ["[Street address]", "[City, PIN code]"],

  // Google Maps: open your location → Share → Embed a map → copy the src="..." link here
  mapEmbedUrl: "",

  // Optional: paste a Formspree (or similar) endpoint so the contact form sends email.
  // Example: "https://formspree.io/f/xxxxxxx". Leave empty to open the visitor's email app instead.
  formEndpoint: "",

  // Passcode that unlocks "Owner mode". Change it! This only hides the edit tools from
  // casual visitors. It is not real security.
  ownerPasscode: "Code_By_Onkar",

  // Social links (leave empty to hide)
  instagram: "",
  facebook: "",
  youtube: "",

  // About page
  story:
    "[Write two or three short paragraphs here. Say when and why the dojo started, how it has grown, and what you want families to feel when they walk in.]",
  senseiName: "[Sensei name]",
  senseiRank: "[rank] black belt",
  senseiBio:
    "[Add a short, personal story here: how your sensei started karate and what they hope every student takes away.]",
  senseiCredentials: [
    "[Rank and association, e.g. 4th Dan, national karate federation]",
    "[Certified instructor or referee qualifications]",
    "[Notable results as an athlete or coach]",
  ],
};

// Photos that can be replaced from the "Edit site" button. "file" is the name in public/images/.
export const sitePhotos = [
  { file: "herophoto.jpg", label: "Home page main photo", hint: "Wide landscape, person on the right half" },
  { file: "senseiphoto.jpg", label: "Sensei portrait", hint: "Portrait, about 4:5" },
  { file: "dojophoto.jpg", label: "Dojo photo (About page)", hint: "Portrait, about 4:5" },
  { file: "about-01.jpg", label: "About page strip, photo 1", hint: "Landscape, about 4:3" },
  { file: "about-02.jpg", label: "About page strip, photo 2", hint: "Landscape, about 4:3" },
  { file: "about-03.jpg", label: "About page strip, photo 3", hint: "Landscape, about 4:3" },
];

export const classes = [
  {
    name: "Little Dragons",
    ages: "Ages 4–7",
    text: "Games, balance and first techniques. Children learn to listen, take turns and keep trying.",
  },
  {
    name: "Juniors",
    ages: "Ages 8–13",
    text: "Basics, kata and light, controlled sparring. Confidence that carries into school and friendships.",
  },
  {
    name: "Teens and adults",
    ages: "Ages 14+",
    text: "Full-body conditioning, technique and partner work. Complete beginners are always welcome.",
  },
  {
    name: "Self-defence and fitness",
    ages: "All adults",
    text: "Practical skills built on karate: awareness, boundaries and a calm response under pressure.",
  },
];

// Achievements and gallery photos are added with the Add buttons (Owner mode), so these start empty.
// To list one permanently for every visitor, add it here, for example:
// { id: "a1", year: 2025, level: "State", title: "Event name", result: "Gold medal", who: "Student name", photo: "achievement-01.jpg" }
export const achievements = [];

export const achievementLevels = ["All", "District", "State", "National"];

export const galleryCategories = ["All", "Training", "Tournaments", "Gradings", "Events"];

// To list a photo permanently for every visitor, put the file in public/images/ and add it here, for example:
// { file: "gallery-01.jpg", alt: "Students training", category: "Training", ratio: "4/3" }
export const gallery = [];

// Branches are added with the Add branch button (Owner mode) on the Contact page, so this starts empty.
// To list one permanently for every visitor, add it here, for example:
// { id: "b1", name: "City Centre Dojo", sensei: "Sensei name", address: "Street, City", phone: "+00 00000 00000", email: "" }
export const branches = [];

export const dojoKun = [
  "Seek perfection of character.",
  "Be faithful.",
  "Endeavour.",
  "Respect others.",
  "Refrain from violent behaviour.",
];