// Edit your content here. Put image files in /public/images and reference them like "/images/project-1.jpg".
// If a file is missing, a placeholder is shown instead.
export const profile = {
  name: "Vincentius Axel Sebastian Pradono",
  email: "vincentiusaxelpradono@gmail.com",
  phone: "+62 812-2670-4575",
  headline: "Designing interfaces people enjoy using.",
  bio: "I turn complex problems into simple, clear experiences, from first sketch to shipped product. Replace this with your own short bio.",
  photo: "/images/profile.jpg",
  menuPhoto: "@/images/menu.jpg", // portrait for the menu (plain/dark background works best)
  socials: [
    { label: "Instagram", href: "#" },
    { label: "YouTube", href: "https://youtu.be/uw6C8Z1XieY" },
  ],
  locations: [
    { city: "Jakarta", lines: ["Your studio", "Street name 12", "Jakarta, ID"] },
    { city: "Remote", lines: ["Available worldwide"] },
  ],
  videoId: "uw6C8Z1XieY", // YouTube video id
  skills: ["Figma", "Prototyping", "User research", "Design systems", "Wireframing", "Usability testing"],
};

export const projects = [
  { title: "Mobile banking app", text: "Research, flows and high-fidelity UI.", image: "/images/project-1.jpg", c1: "#ff3b1f", c2: "#ffb703" },
  { title: "SaaS dashboard", text: "Information architecture and design system.", image: "/images/project-2.jpg", c1: "#3a86ff", c2: "#8338ec" },
  { title: "Music platform redesign", text: "Home, discovery and player experience.", image: "/images/project-3.jpg", c1: "#2ec4b6", c2: "#3a86ff" },
];
