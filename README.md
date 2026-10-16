# Nexus Store

A responsive e-commerce web application with a customer storefront and an admin dashboard, built as the Frontend Development capstone project.

*Live site: https://e-commerce-app-iota-seven.vercel.app/
*Repository: [https://github.com/S1m9a9r8t/e-commerce-app.git]
*Author: [Mihret Melese]


# used Technologies

- [Next.js](https://nextjs.org/) (App Router) for routing and server and client components
- TypeScript
- Tailwind CSS for styling
- [shadcn/ui](https://ui.shadcn.com/) (Radix UI) for components
- next-themes for light, dark, and system themes
- [EscuelaJS (Platzi Fake Store) API](https://api.escuelajs.co/docs) for products, categories, users, and authentication

# Features

# 1 Storefront

- Home page with a hero, popular categories, and featured products from the API
- Product listing with search by name, category filter, price range filter, and sorting (price, name, date)
- Product details with an image gallery, quantity selector, and related products
- Category list and category pages
- Shopping cart saved in `localStorage` (duplicate products increase the quantity, totals are calculated, the cart survives a refresh)
- Registration, login, and a profile page
- Simulated checkout with form validation and an order confirmation page
- Light, dark, and system themes with an accessible toggle
- Loading, error, empty, and "not found" states, plus fallbacks for missing or broken images

# 2 Admin dashboard

- Overview with total products, categories, and users, and recently added products. All numbers are counted from API responses. If one cannot be loaded, it shows "Unavailable".
- Product management: table with search, details page, create form, edit form
- Category management: list, create form, edit form
- User management: searchable list and details page, with no passwords or tokens shown
- Sidebar on desktop and a drawer on mobile

# How I  started

1. Clone the repository and open the folder:

```bash
   git clone [your repository link]
   cd e-commerce-app
```

2. Install the dependencies:

```bash
   npm install
```

3. Create a file named `.env.local` in the project root (see `.env.example`):

```
   NEXT_PUBLIC_API_URL=https://api.escuelajs.co/api/v1
   NEXT_PUBLIC_ADMIN_DEMO_MODE=true
```

4. Start the development server:

```bash
   npm run dev
```

5. Open http://localhost:3000.

Other commands: `npm run lint` checks the code and `npm run build` creates a production build.

# Environment variables

| Name & Purpose |
| `NEXT_PUBLIC_API_URL` | Base URL of the EscuelaJS API |
| `NEXT_PUBLIC_ADMIN_DEMO_MODE` | `true` lets any logged-in user open the admin dashboard, for demonstration only. `false` allows only accounts whose API role is `admin`. |

No secrets are committed. `.env.local` is ignored by Git.

# Project structure


src/
  app/
    (store)/        storefront pages and layout (header and footer)
    admin/          admin pages and layout (sidebar)
  components/
    admin/ auth/ cart/ categories/ layout/ products/ shared/
    ui/             shadcn/ui components
  context/          cart and auth state
  lib/
    api/            API service layer (client, auth, products, categories, users)
    admin-created.ts, order-storage.ts, utils.ts
  types/            TypeScript types


All requests go through one function, `apiFetch`, in `src/lib/api/client.ts`. It handles headers, network errors, and error messages. Components never call `fetch` directly.

# API integration

Base URL: `https://api.escuelajs.co/api/v1`

| Area & Endpoints used |
| Products - `GET /products`, `GET /products/{id}`, `GET /products/{id}/related`, `POST /products`, `PUT /products/{id}` |
| Categories - `GET /categories`, `GET /categories/{id}`, `GET /categories/slug/{slug}`, `GET /categories/{id}/products`, `POST /categories`, `PUT /categories/{id}` |
| Users - `POST /users`, `GET /users`, `GET /users/{id}` |
| Authentication - `POST /auth/login`, `GET /auth/profile`, `POST /auth/refresh-token` |

Public GET responses are cached for 60 seconds. Admin pages and anything with a login token are never cached.

# Authentication and route protection

- Login returns an access token and a refresh token. They are stored in `localStorage`. On every visit the app loads the profile with the access token, and uses the refresh token if the access token has expired.
- `/profile`, `/checkout`, and `/checkout/success` are wrapped in a `RequireAuth` component that sends guests to `/login`. The login page shows "Please log in or create an account to continue to checkout." when the user came from checkout.
- Passwords and tokens are never shown or logged.

## Admin authorization

The API gives users a `role` field, and the course provides a demo admin account whose role is `admin`. The dashboard checks that role in the browser:

- Accounts with the role `admin` can open `/admin`.
- Other accounts see "Access denied". 
- Demo admin account : `admin@mail.com` / `admin123`

These checks run in the browser, so they can be bypassed. In my testing, the API also accepted product and category creation from an account with the `customer` role, so it does not appear to enforce roles on the server. A real application must check permissions on the server.

# Safety rules for the shared API

The API is shared with other people, so:

- There is no delete function anywhere in the app.
- New records are test records (titles start with `TEST`).
- Only products and categories created in the current browser can be edited. The app remembers their IDs in `localStorage`, and other records show a "shared" message instead of a form.

# final Testing checklist

- Storefront: home data, product list, details, search, category filter, price filter, sorting, related products, missing products
- Cart: add, duplicate quantity, plus and minus, remove, clear, refresh persistence, totals
- Authentication: registration validation, login errors, profile data, logout, protected profile
- Checkout: form validation, order summary, simulated order clears the cart, guests are redirected
- Admin: pages load, data from the API, create and edit test records, users shown without passwords, guests are redirected
- Responsive layout on phone, tablet, and desktop, and all three themes