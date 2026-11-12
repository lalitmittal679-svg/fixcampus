# FixMyCampus

See a problem. Report it. Get it fixed. Campus issue reporting for students, with an admin portal.

## Run
```
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build
```
Deploy to Vercel as a standard Vite project (`vercel.json` handles SPA routing).

## Notes
- Frontend only. All data lives in LocalStorage (`fmc.*` keys) via `src/services/issueStore.ts`.
- 24 seeded issues are labelled demo data. Admin → Settings → "Reset to demo data" restores them.
- Map markers use illustrative coordinates on a placeholder campus layout, not real incidents. Edit `src/data/constants.ts` (`CAMPUS_CENTER`, `CAMPUS_LOCATIONS`) for your campus.
- The landing hero is an original illustration. Replace `CampusIllustration` with a photo when you have one.
- Demo sign-in: choose Student or Administrator at /signin, or switch from the avatar menu.
