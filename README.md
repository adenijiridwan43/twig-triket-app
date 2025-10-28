# Triket - Twig/PHP Implementation

A complete ticket management system built with **Twig templating engine**, **PHP 8+**, and **Vanilla JavaScript** - replicating the exact functionality and design of the React implementation.

## 🎯 Features

✅ Responsive landing page with wavy hero section  
✅ Secure authentication (Login/Signup) with localStorage  
✅ Protected dashboard with real-time statistics  
✅ Full CRUD ticket management  
✅ Real-time validation & error handling  
✅ Toast notifications  
✅ Consistent design (max-width 1440px)  
✅ Status color coding (Open/In Progress/Closed)  
✅ Mobile-responsive navigation  

---

## 🧰 Technologies Used

- **PHP 8+** - Server-side logic and routing
- **Twig 3.0** - Templating engine
- **Vanilla JavaScript (ES6+)** - Client-side interactivity
- **Tailwind CSS** - Utility-first CSS framework (via CDN)
- **localStorage** - Mock authentication & data persistence

---

## 📂 Project Structure

```
twig-app/
│
├── public/                      # Public directory (document root)
│   ├── index.php                # Front controller
│   │
│   ├── css/
│   │   └── styles.css           # Custom CSS styles
│   │
│   └── js/
│       ├── store.js             # Vanilla JS state management
│       └── auth.js              # Global auth check
│
├── src/                         # PHP source code
│   ├── Router.php               # Simple PHP router
│   │
│   └── Controller/
│       ├── HomeController.php
│       ├── AuthController.php
│       ├── DashboardController.php
│       └── TicketsController.php
│
├── templates/                   # Twig templates
│   ├── layout/
│   │   ├── base.html.twig       # Base layout
│   │   ├── header.html.twig     # Header component
│   │   └── footer.html.twig     # Footer component
│   │
│   └── pages/
│       ├── landing.html.twig    # Landing page
│       ├── login.html.twig      # Login page
│       ├── signup.html.twig     # Signup page
│       ├── dashboard.html.twig  # Dashboard page
│       ├── tickets.html.twig    # Tickets management
│       └── 404.html.twig        # 404 page
│
├── vendor/                      # Composer dependencies (after install)
├── composer.json                # PHP dependencies
└── README.md                    # This file
```

---

## 🚀 Installation & Setup

### Prerequisites

- PHP 8.0 or higher
- Composer (PHP dependency manager)
- A web browser

### Step 1: Install Dependencies

```bash
cd twig-app
composer install
```

### Step 2: Start the PHP Development Server

```bash
php -S localhost:8000 -t public
```

### Step 3: Open in Browser

Navigate to: **http://localhost:8000**

---

## 🎨 Design System

### Colors

The app uses a consistent color palette matching the React version:

```css
/* Status Colors */
--status-open: #10B981 (Green)
--status-in-progress: #F59E0B (Amber)
--status-closed: #6B7280 (Gray)

/* Brand Colors */
--primary: #4F46E5 (Indigo)
--secondary: #06B6D4 (Cyan)

/* Background */
--bg-1: #fffaf0 (Cream)
--bg-2: #fff9f2 (Light Cream)
```

### Layout

- **Max-width Container**: 1440px (centered)
- **Responsive Breakpoints**: Mobile (< 640px), Tablet (640px-1024px), Desktop (>1024px)
- **Card Style**: White background with subtle shadows and rounded corners
- **Typography**: System fonts with consistent sizing

---

## 🔐 Authentication

The app uses **mock authentication** stored in `localStorage`:

### Test Credentials

Use **any email and password** combination to log in or sign up. Examples:

```
Email: test@triket.com
Password: password123
```

```
Email: demo@example.com
Password: demo123
```

### How It Works

1. Login/Signup validates input format
2. Creates a mock user object and token
3. Stores session in `localStorage` as `ticketapp_session`
4. Protected routes check for this session on page load
5. Logout clears the session

---

## 📋 Pages Overview

### 1. **Landing Page** (/)

- Hero section with wavy SVG background
- Decorative circle elements
- Features section (3 feature cards)
- Testimonials section (3 customer quotes)
- Pricing section (3 pricing tiers)
- Call-to-action section
- **No authentication required**

### 2. **Login Page** (/auth/login)

- Email and password inputs
- Real-time form validation
- Error messages (inline + toast)
- Link to signup page
- Demo credentials info box
- **Redirects to /dashboard if already authenticated**

### 3. **Signup Page** (/auth/signup)

- Name, email, password, and confirm password fields
- Password strength validation (min 6 characters)
- Password match check
- Error handling
- Link to login page
- **Redirects to /dashboard if already authenticated**

### 4. **Dashboard** (/dashboard)

- Welcome message with user's name
- 4 stat cards (Total, Open, In Progress, Closed tickets)
- Quick action buttons:
  - Create Ticket
  - View All Tickets
  - Add Demo Ticket
  - Export Demo (CSV)
- Recent activity section
- **Protected route - requires authentication**

### 5. **Tickets Page** (/tickets)

- List of all tickets in card view
- Create new ticket button
- Each ticket card shows:
  - Title and description
  - Status badge (color-coded)
  - Priority badge
  - Created date
  - Edit and Delete buttons
- Modal for creating/editing tickets
- Form validation
- Confirmation before delete
- **Protected route - requires authentication**

### 6. **404 Page** (/*)

- Friendly error message
- "Go Home" and "Go Back" buttons
- Large 404 illustration
- **No authentication required**

---

## 🔄 State Management

The app uses a custom **Vanilla JavaScript Store** (`store.js`) that replicates Zustand functionality:

### Store Structure

```javascript
{
  user: { id, email, name },
  isAuthenticated: boolean,
  tickets: [...],
  currentTicket: object | null,
  loading: boolean,
  formErrors: {},
  toast: { type, message } | null
}
```

### Store Methods

**Authentication:**
- `login(email, password)` - Authenticate user
- `signup(email, password, name)` - Create new user
- `logout()` - Clear session
- `restoreSession()` - Restore from localStorage

**Tickets CRUD:**
- `createTicket(ticketData)` - Create new ticket
- `updateTicket(ticketId, ticketData)` - Update existing ticket
- `deleteTicket(ticketId)` - Delete ticket
- `setCurrentTicket(ticket)` - Set ticket for editing

**Utilities:**
- `getStats()` - Get ticket statistics
- `clearToast()` - Clear toast notification
- `clearFormErrors()` - Clear form errors

### Persistence

The store automatically persists to `localStorage` under the key `ticket-store`:

```javascript
{
  tickets: [...],
  user: {...},
  isAuthenticated: true
}
```

---

## 🎯 Routing

### Routes Configuration

**Public Routes:**
- `GET /` - Landing page
- `GET /auth/login` - Login page
- `GET /auth/signup` - Signup page

**Protected Routes:**
- `GET /dashboard` - Dashboard page
- `GET /tickets` - Tickets management page

**Auth Actions:**
- `POST /auth/login` - Process login (handled client-side)
- `POST /auth/signup` - Process signup (handled client-side)
- `GET /auth/logout` - Logout

**Fallback:**
- `* (any)` - 404 page

### How Routing Works

1. All requests go to `public/index.php`
2. Router matches request method and path
3. Calls appropriate controller method
4. Controller renders Twig template
5. Client-side JavaScript checks authentication and handles interactivity

---

## ✅ Validation Rules

### Ticket Validation

**Title:**
- ✅ Required
- ✅ Max 100 characters

**Status:**
- ✅ Required
- ✅ Must be one of: `open`, `in_progress`, `closed`

**Description:**
- Optional
- Max 500 characters

**Priority:**
- Optional
- Must be one of: `low`, `medium`, `high`

### Auth Validation

**Email:**
- ✅ Required
- ✅ Valid email format

**Password:**
- ✅ Required
- ✅ Min 6 characters (for signup)

**Name:**
- Optional (defaults to email username)

---

## 🎨 UI Components

### Toast Notifications

Appear in top-right corner with 3 types:

- ✅ **Success** (Green) - Operation completed
- ❌ **Error** (Red) - Operation failed or validation error
- ℹ️ **Info** (Blue) - General information

Auto-dismiss after 3 seconds.

### Modal

Used for creating/editing tickets:

- Smooth fade-in animation
- Click outside to close
- Escape key support
- Form validation
- Loading states

### Status Badges

Color-coded badges for ticket status:

- 🟢 **Open** - Emerald green
- 🟡 **In Progress** - Amber yellow
- ⚫ **Closed** - Gray

---

## 🔧 Customization

### Change Colors

Edit `public/css/styles.css` or the `<style>` block in `templates/layout/base.html.twig`:

```css
:root {
  --bg-1: #your-color;
  --accent-1: #your-color;
  --card-bg: #your-color;
}
```

### Change Max Width

In `templates/layout/base.html.twig`:

```css
.container {
  max-width: 1440px; /* Change this */
}
```

### Add New Page

1. Create controller in `src/Controller/YourController.php`
2. Add route in `public/index.php`
3. Create template in `templates/pages/your-page.html.twig`

---

## 🐛 Troubleshooting

### Issue: Blank Page

**Solution:** Check PHP error logs. Ensure Composer dependencies are installed.

```bash
composer install
```

### Issue: Routes Not Working

**Solution:** Make sure you're running the server from the correct directory:

```bash
php -S localhost:8000 -t public
```

### Issue: Styles Not Loading

**Solution:** Verify Tailwind CDN is loading. Check browser console for errors. Clear browser cache.

### Issue: Authentication Not Persisting

**Solution:** Check browser localStorage:

1. Open DevTools → Application → Local Storage
2. Look for `ticketapp_session` and `ticket-store` keys
3. If missing, try logging in again

### Issue: Tickets Not Saving

**Solution:** Check browser console for JavaScript errors. Ensure `store.js` is loaded correctly.

---

## 📱 Responsive Design

### Mobile (< 640px)

- Stacked layouts
- Hamburger menu
- Full-width cards
- Touch-friendly buttons

### Tablet (640px - 1024px)

- 2-column grid for tickets
- Expanded navigation
- Optimized spacing

### Desktop (> 1024px)

- 3-column grid for tickets
- 4-column stats grid
- Full navigation menu
- Max-width 1440px container

---

## ♿ Accessibility

- ✅ Semantic HTML elements
- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation support
- ✅ Focus visible states
- ✅ Sufficient color contrast
- ✅ Alt text for images/icons
- ✅ Screen reader friendly

---

## 🚦 Browser Support

- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅

---

## 📦 Deployment

### Option 1: Traditional Hosting (cPanel, Shared Hosting)

1. Upload files to web root
2. Run `composer install` on server
3. Point domain to `public/` directory
4. Done!

### Option 2: VPS (DigitalOcean, Linode)

```bash
# Install dependencies
sudo apt-get install php8.1 php8.1-cli composer

# Clone/upload your code
cd /var/www/html/triket

# Install Composer dependencies
composer install

# Configure Apache/Nginx to point to public/ directory
```

### Option 3: Docker

Create `Dockerfile`:

```dockerfile
FROM php:8.1-apache
RUN apt-get update && apt-get install -y zip unzip
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
WORKDIR /var/www/html
COPY . .
RUN composer install
RUN a2enmod rewrite
EXPOSE 80
```

---

## 🔒 Security Notes

⚠️ **This is a demo application with mock authentication!**

For production use, you MUST:

1. ✅ Use server-side sessions (not localStorage)
2. ✅ Hash passwords (bcrypt, argon2)
3. ✅ Add CSRF protection
4. ✅ Validate all input server-side
5. ✅ Use prepared statements for database queries
6. ✅ Add rate limiting
7. ✅ Implement proper error handling
8. ✅ Use HTTPS

---

## 🆚 Differences from React Version

### Similarities (100% Feature Parity)

✅ Exact same UI/UX design  
✅ Identical color scheme  
✅ Same validation rules  
✅ Same authentication flow  
✅ Same CRUD operations  
✅ Same toast notifications  
✅ Same responsive behavior  

### Technical Differences

| Feature| Twig/PHP |
|---------|-------|----------|
| **Routing** | PHP Router |
| **State** |  Vanilla JS Store |
| **Templating** |  Twig |
| **Components** |  Twig Includes |
| **Events** |  Vanilla JS Events |
| **Icons** |  SVG (inline) |

---

## 📚 Additional Resources

- [Twig Documentation](https://twig.symfony.com/doc/3.x/)
- [PHP Manual](https://www.php.net/manual/en/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [MDN Web Docs](https://developer.mozilla.org/)

---

## 👨‍💻 Development Tips

### Hot Reload

PHP built-in server doesn't support hot reload. Use a tool like:

```bash
# Install browser-sync globally
npm install -g browser-sync

# Run with auto-reload
browser-sync start --proxy "localhost:8000" --files "templates/**/*.twig, public/**/*.js, public/**/*.css"
```

### Debugging

Add this to any controller:

```php
var_dump($variable);
die();
```

Or use Xdebug for advanced debugging.

### Code Organization

- Keep controllers thin - logic in models/services
- Use Twig filters for formatting
- Extract repeated JavaScript into separate files
- Use CSS classes for reusable styles

---

## 📝 License

MIT License - Feel free to use this project for learning and personal projects.

---

## 🙏 Acknowledgments

- **Tailwind CSS** for the utility-first CSS framework
- **Twig** for the flexible templating engine

---

## 📞 Support

If you encounter any issues:

1. Check the Troubleshooting section
2. Review browser console for errors
3. Check PHP error logs
4. Verify all dependencies are installed
