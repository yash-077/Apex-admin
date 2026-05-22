# Admin Panel (React + Vite)

This is the admin React app used to manage products, orders, and users.

TECH STACK:
- React.jsx (Vite)
- React Router DOM v6
- Axios for API calls
- Context API for admin auth state
- Tailwind CSS or CSS Modules
- React Hook Form for form handling

FOLDER STRUCTURE:
admin/
├── src/
│   ├── api/
│   │   └── axios.js              # Axios instance with admin JWT interceptor
│   ├── context/
│   │   └── AdminAuthContext.jsx  # Admin auth state, login, logout
│   ├── components/
│   │   ├── AdminRoute.jsx        # Protected route wrapper
│   │   ├── Sidebar.jsx           # Nav: Dashboard, Products, Logout
│   │   ├── Topbar.jsx            # Admin name, logout button
│   │   ├── ProductTable.jsx      # Table with search, filter, pagination
│   │   ├── Product.jsx      # Reusable Add/Edit modal with React Hook Form
│   │   ├── ConfirmDialog.jsx     # Delete confirmation dialog
│   │   └── StatCard.jsx          # Summary stat card component
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── UsersPage.jsx
│   │   ├── ordersPage.jsx
│   │   └── ProductsPage.jsx
│   ├── hooks/
│   │   └── useProducts.js        # Fetch, create, update, delete product hooks
│   ├── utils/
│   │   └── helpers.js            # formatPrice, formatDate
│   ├── App.jsx
│   └── main.jsx

