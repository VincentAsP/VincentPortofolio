# UI/UX Portfolio (Next.js + Tailwind CSS v4)

    npm install
    npm run dev      # http://localhost:3000

- Edit your name, bio, projects, video id in `app/data.js`
- Add images to `public/images/`
- Real intro video: see the comment in `components/Transition.js`
- Theme (accent color, animations, font): `app/globals.css` under `@theme`
- Dark mode follows the visitor's system setting
- Deploy: push to GitHub and import into Vercel

## Menu
Full-screen menu with a layered photo effect: `components/Menu.js`.
Put your portrait at `public/images/menu.jpg` (set in `app/data.js`). Links, socials and addresses are also in `data.js`.
