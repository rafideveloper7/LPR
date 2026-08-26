# LPR Agency Frontend

Next.js frontend for LPR Agency website with dual data mode support (API + Dummy data).

## Setup

```bash
npm install
npm run dev  # Development: http://localhost:3001
npm run build  # Production build
```

## API Integration

The frontend supports both API data and local dummy data. Add environment variable in `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

If `NEXT_PUBLIC_API_URL` is not set or API fails, components fallback to dummy data from `src/lib/data.js` or inline arrays.

## Project Structure

```
src/
├── app/
│   ├── page.js             # Home page
│   ├── about/page.js       # About page
│   ├── contact/page.js     # Contact page
│   ├── blog/page.js        # Blog page
│   └── case-studies/page.js # Projects page
├── components/
│   ├── layout/
│   │   ├── Navbar.js       # Navigation with active route detection
│   │   └── Footer.js       # Footer with site links
│   └── sections/
│       ├── Hero.js         # Hero section
│       ├── Services.js     # Services cards
│       ├── Projects.js     # Project cards
│       ├── Blog.js         # Blog posts
│       ├── About.js        # About section
│       ├── Skills.js       # Skills grid
│       ├── Testimonials.js # Testimonials slider
│       ├── Stats.js        # Stats counters
│       ├── Contact.js      # Contact form
│       └── CTA.js          # Call to action
└── lib/
    └── data.js             # Dummy data & API utilities
```

## API Endpoints (Expected from Backend)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/services` | GET | List all services |
| `/services/:id` | GET | Single service |
| `/services` | POST | Create service (admin) |
| `/services/:id` | PUT | Update service (admin) |
| `/services/:id` | DELETE | Delete service (admin) |
| `/blogs` | GET | List all blog posts |
| `/blogs/:id` | GET | Single blog post |
| `/blogs` | POST | Create blog (admin) |
| `/blogs/:id` | PUT | Update blog (admin) |
| `/blogs/:id` | DELETE | Delete blog (admin) |
| `/projects` | GET | List all projects |
| `/projects/:id` | GET | Single project |
| `/projects` | POST | Create project (admin) |
| `/projects/:id` | PUT | Update project (admin) |
| `/projects/:id` | DELETE | Delete project (admin) |
| `/clients` | GET | List all clients |
| `/skills` | GET | List all skills |
| `/stats` | GET | Get stats data |
| `/testimonials` | GET | List all testimonials |
| `/contact` | POST | Submit contact form |
| `/hero` | GET | Hero titles & descriptions |

## Tech Stack

- Next.js 14
- React 18
- Tailwind CSS
- Framer Motion (animations)
- React CountUp
- Swiper (carousel)

## Environment Variables

```env
# Required for API mode
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api

# Optional: For preview mode
NEXT_PUBLIC_PREVIEW_MODE=false
```

## Routes

| Route | Component |
|-------|-----------|
| `/` | Home (Hero, Services, Projects, Blog, Testimonials, CTA) |
| `/about` | About page |
| `/contact` | Contact page |
| `/blog` | Blog listing |
| `/blog/[id]` | Blog post detail |
| `/case-studies` | Projects listing |