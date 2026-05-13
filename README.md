# **StockNest - Personal Inventory & Category Management App**

StockNest is an inventory management application built with **React**, **TypeScript**, **Vite**, **SCSS**, and **Redux Toolkit Query**.  
This is now a **PWA**, allowing users to get a native feel on mobile devices, thereby improving user experience.
It allows users to create groups, manage categories, track items, and view real‑time dashboard statistics.

This project is deployed using **GitHub Pages** with automated workflows.
The Backend code can be found [here](https://github.com/akshkin/StockNestMVC)


## Why I built this?
I wanted an app where I could keep track of items that I have at home. The ability to add members to a group with role assignments gives me the flexibility to share a group with others so that they, too, can know and make changes (based on role).

## What I learned from this project?
- How to build an authentication system using secure http cookies
- How role assignments work
- GitHub workflows
- PWA significantly improves UX
- How notifications work


## **Features**

### Groups & Categories
- Create, edit, and delete groups
- Add other people to the group and select which role they can have in the group - Co-Owner/Member/Viewer
- Create categories inside groups
- Choose a theme (light/dark/system)

### Item Management
- Add items to categories  
- Track quantities 
- Automatic timestamping (created/updated)  

### Dashboard & Stats
- Real-time aggregated statistics
- Recent notifications related to changes in the group if other members have changed something  

## **Tech Stack**

| Layer | Technology |
|-------|------------|
| Frontend | React + TypeScript |
| State/Data | Redux Toolkit Query |
| Backend | ASP.NET Core |
| Database | Neon |
| Image storage | Supabase Storage |
| Build Tool | Vite |
| Deployment | GitHub Pages |
| Styling | SCSS modules |


## **Key Concepts Learned in This Project**
- RTK Query caching & tag invalidation
- Cookie-based authentication
- Linting the files with prettier and ESLint on committing files to the repository
- Automated deployment on merging pull requests to the main branch using GitHub actions

