# TECHNICAL PROJECT DOCUMENTATION: URBANEATS

> **PROJECT TITLE:** DESIGN AND IMPLEMENTATION OF A WEB-BASED ORDERING AND DELIVERY SYSTEM IN ABRAKA  
> **APPLICATION NAME:** UrbanEats  
> **SOFTWARE DEVELOPMENT METHODOLOGY:** Rapid Application Development (RAD)  
> **SYSTEM ANALYSIS AND DESIGN APPROACH:** Object-Oriented Analysis and Design (OOAD)  
> **DOCUMENT TYPE:** Complete Technical Reference for Chapter 4 (System Implementation)  
> **FILE LOCATION:** `UrbanEats_Technical_Project_Documentation.md`  

---

## SECTION 1 — PROJECT OVERVIEW

### 1.1 Project Title
**DESIGN AND IMPLEMENTATION OF A WEB-BASED ORDERING AND DELIVERY SYSTEM IN ABRAKA**

### 1.2 Application Name
**UrbanEats**

### 1.3 Purpose of UrbanEats
UrbanEats is a specialized, web-based food ordering and hyper-local delivery platform engineered explicitly for the university town of Abraka, Delta State, Nigeria. The platform serves as a digital bridge connecting local food vendors, restaurants, buka establishments, and fast-food eateries directly with university students, academic/non-academic staff, and local residents. It provides a centralized digital marketplace where users can discover local food providers, browse menus, check item prices, customize orders, and manage customer accounts.

### 1.4 Problem Statement
Prior to the implementation of UrbanEats, food ordering in Abraka relied primarily on manual, informal, and fragmented methods. Key problems addressed by the system include:
- **Lack of Centralized Discovery:** Students and residents had no single platform to explore all available dining options, operating hours, and location details across Abraka (such as Site II, Campus Gate, and Main Market Road).
- **Manual Telephone & In-Person Ordering Delays:** Ordering food required physical visitation or direct phone calls to restaurant managers, leading to long queue wait times, busy phone lines, and miscommunication of orders.
- **Menu and Pricing Opacity:** Menu offerings, availability of native dishes, and prices fluctuated without a public digital reference.
- **Absence of Dedicated Local Delivery Infrastructure:** Existing national food delivery services do not service the specific hyper-local geography of Abraka and Delta State University (DELSU) campuses.

### 1.5 Target Users
1. **Customers:** Students of Delta State University (DELSU), university personnel, visitors, and residents of Abraka seeking convenient online food discovery and ordering.
2. **Vendors (Restaurant Owners):** Local restaurant managers and buka operators in Abraka who require a digital platform to showcase their culinary offerings, update food availability, and manage incoming orders.
3. **Delivery Riders:** Dispatch riders operating within the Abraka campus and town territory who accept delivery jobs and update delivery status milestones.
4. **Administrators:** Platform supervisors overseeing system activities, verifying and approving vendor/rider registration applications, and maintaining system governance.

### 1.6 System Scope
The implemented UrbanEats codebase comprises a complete, 4-tier Role-Based Access Control (RBAC) web architecture:
- **Frontend SPA:** Responsive React 18 Single Page Application compiled with Vite 6.
- **Backend REST API:** Modular PHP 8 API operating on Apache (XAMPP).
- **Database Layer:** Relational MySQL / MariaDB database (`urbaneats_db`) using the InnoDB engine.
- **Authentication & Security:** HTTP-Only cookie session management (`PHPSESSID`), prepared statement query execution, and role-based route guards.

### 1.7 Main Objectives
1. To design and deploy a responsive, web-based SPA for seamless restaurant browsing and food selection.
2. To build a secure PHP REST-style API backend coupled with a MySQL database to manage users, restaurants, food categories, food items, orders, deliveries, saved addresses, favorites, and notifications dynamically.
3. To implement server-side PHP session authentication with secure HTTP-only cookie management (`PHPSESSID`) across all user roles.
4. To establish a client-side cart management system enforcing single-restaurant ordering rules.
5. To provide a complete end-to-end order processing and rider delivery dispatch workflow tailored to Abraka's geography.

### 1.8 Key Implemented Features
- **Multi-Role Portal Access:** Separate dedicated dashboards and navigation flows for Customers, Vendors, Riders, and Administrators.
- **Dynamic Restaurant & Menu Browsing:** Real-time data retrieval from MySQL database via PHP REST APIs.
- **Customer Authentication & Account Management:** Full registration, login, session persistence (`/api/auth/me.php`), profile update, saved delivery addresses, and favorites list.
- **Vendor Portal & Menu Management:** Vendor dashboard, food item creation/update, availability toggling, image uploads, and order preparation workflow.
- **Rider Portal & Dispatch Workflow:** Rider availability toggling (`is_online`, `is_available`), active delivery management, milestone status transitions (`ACCEPTED`, `PICKED_UP`, `OUT_FOR_DELIVERY`, `DELIVERED`), and history log.
- **Admin Portal & Application Governance:** Admin stats overview, vendor and rider account verification (Approve/Reject applications), user account activation/deactivation, and order oversight.
- **Centralized Notifications System:** Database-persisted notifications for order placement, status transitions, and delivery assignments with unread counters and read-marking.

---

## SECTION 2 — TECHNOLOGY STACK

### 2.1 Technology Stack Summary Table

| Category | Technology | Exact Version | Actual Role in System |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React | `18.3.1` | Renders UI components, manages client state, drives SPA component lifecycle. |
| **Build Tool & Dev Server** | Vite | `6.0.5` | Module bundler, hot module replacement (HMR) server running on port 5173. |
| **React Compiler Plugin** | `@vitejs/plugin-react` | `4.3.4` | Fast Refresh and JSX transformation compiler plugin for Vite. |
| **Frontend Router** | React Router DOM | `6.28.0` | Client-side routing (`/`, `/restaurants`, `/vendor/*`, `/rider/*`, `/admin/*`). |
| **UI Vector Icons** | Lucide React | `0.475.0` | Icon set for buttons, dashboards, status indicators, and feedback overlays. |
| **Styling Approach** | Vanilla CSS3 | Custom CSS3 | Located in `src/styles/index.css`. Uses CSS variables, glassmorphism, responsive grid. |
| **Backend Language & Server**| PHP | `8.x` (Apache/XAMPP) | Handles REST HTTP requests, validation, sessions, authorization, JSON responses. |
| **Database Engine** | MySQL / MariaDB | `8.x` / `10.4.x` | Relational storage engine using InnoDB with `utf8mb4_unicode_ci` collation. |
| **Database Access Layer** | PHP PDO | Native PHP PDO | Executes parameterized SQL statements with prepared query protection. |
| **Server Host Environment** | XAMPP | Stack v3.3.0 | Local server stack hosting Apache 2.4 and MySQL at `http://localhost/urbaneats-api/api`. |
| **API Client Transport** | Custom Fetch Wrapper | Native ES6 Fetch | Located in `src/api/apiClient.js`. Sends requests with `credentials: 'include'`. |
| **Environment Config** | Dotenv (`.env`) | Vite `.env` | Stores `VITE_API_BASE_URL=http://localhost/urbaneats-api/api`. |

*Note: Bootstrap and Axios are NOT used or installed in this project.*

---

## SECTION 3 — SYSTEM ARCHITECTURE

### 3.1 Architectural Flow Diagram

```
+-----------------------------------------------------------------------------------+
|                                  USER BROWSER                                     |
|                       React 18 SPA (Vite Dev Server:5173)                         |
|                                                                                   |
|  [Customer Marketplace]   [Vendor Portal]    [Rider Portal]     [Admin Portal]    |
|       |                         |                  |                  |           |
|       +-------------------------+------------------+------------------+           |
|                                         |                                         |
|                     React Contexts (AuthContext / CartContext)                    |
+-----------------------------------------|-----------------------------------------+
                                          |
                                 apiClient.js (Fetch API)
                             (credentials: 'include')
                                          | HTTP JSON / PHPSESSID Cookie
                                          v
+-----------------------------------------------------------------------------------+
|                               APACHE HTTP SERVER                                  |
|                            (XAMPP - localhost:80)                                 |
|                                                                                   |
|                                 PHP REST API                                      |
|               Endpoint URL: http://localhost/urbaneats-api/api                    |
|                                                                                   |
|  [cors.php] ---> Configures Access-Control-Allow-Origin & Session Cookie params   |
|                                                                                   |
|  [auth/*]  [restaurants/*]  [food-items/*]  [orders/*]  [vendor/*]  [rider/*] ...|
|                                         |                                         |
|                                PHP PDO (db.php)                                   |
|                           Prepared Statements (SQL)                               |
+-----------------------------------------|-----------------------------------------+
                                          |
                               TCP/IP (127.0.0.1:3306)
                                          v
+-----------------------------------------------------------------------------------+
|                              MYSQL DATABASE ENGINE                                |
|                                 `urbaneats_db`                                    |
|                                                                                   |
|   users  |  restaurants  |  food_categories  |  food_items  |  favorites         |
|   user_addresses  |  orders  |  order_items  |  payments  |  delivery_assignments |
|   notifications                                                                   |
+-----------------------------------------------------------------------------------+
```

### 3.2 System Layer Responsibilities
1. **Frontend Presentation Layer (React 18 SPA):** Handles user interactions, client routing, cart state, modal forms, and UI rendering. Communicates with backend endpoints via `apiClient.js`.
2. **API & Business Logic Layer (PHP 8 REST API):** Validates incoming payload parameters, enforces RBAC, checks session cookies via `PHPSESSID`, executes business logic, and outputs standard JSON responses.
3. **Database Access Layer (PHP PDO):** Uses native PHP Data Objects (PDO) with strict prepared statement binding to isolate SQL logic and prevent injection attacks.
4. **Data Persistence Layer (MySQL / MariaDB):** Relational database `urbaneats_db` enforcing foreign keys, unique constraints, and transaction safety using the InnoDB engine.

---

## SECTION 4 — USER ROLES AND PERMISSIONS

```
+---------------------------------------------------------------------------------------------------+
|                                   USER ROLES & PERMISSION MATRIX                                  |
+-------------------+--------------------+------------------------+---------------------------------+
| User Role         | Auth Requirement   | Dashboard / Route      | Implemented Key Features        |
+-------------------+--------------------+------------------------+---------------------------------+
| **Customer**      | Public / Session   | `/profile`, `/cart`    | Search restaurants, view menus, |
|                   |                    |                        | add to cart, checkout, view     |
|                   |                    |                        | order history, track order,     |
|                   |                    |                        | manage addresses & favorites.   |
+-------------------+--------------------+------------------------+---------------------------------+
| **Vendor**        | Logged in vendor + | `/vendor/dashboard`    | Manage restaurant details,      |
|                   | `APPROVED` status  | `/vendor/menu`         | create/edit menu items, toggle  |
|                   | (`VendorGuard`)    | `/vendor/orders`       | availability, upload images,    |
|                   |                    |                        | update order preparation status.|
+-------------------+--------------------+------------------------+---------------------------------+
| **Rider**         | Logged in rider +  | `/rider/dashboard`     | Toggle online/available status, |
|                   | `APPROVED` status  | `/rider/deliveries`    | view active delivery, update    |
|                   | (`RiderGuard`)     | `/rider/history`       | delivery milestones (Picked Up, |
|                   |                    |                        | Out for Delivery, Delivered).   |
+-------------------+--------------------+------------------------+---------------------------------+
| **Admin**         | Logged in admin    | `/admin/dashboard`     | Platform analytics & stats,     |
|                   | (`AdminGuard`)     | `/admin/vendors`       | approve/reject vendors & riders,|
|                   |                    | `/admin/riders`        | user management, order oversight.|
+-------------------+--------------------+------------------------+---------------------------------+
```

---

## SECTION 5 — AUTHENTICATION AND AUTHORIZATION

### 5.1 Registration Workflow (`/api/auth/register.php`)
- Receives `full_name`, `email`, `phone`, `password`, and optional `role` (`customer`, `vendor`, `rider`).
- Validates input format and checks `users.email` uniqueness.
- Hashes password using native PHP `password_hash($password, PASSWORD_DEFAULT)`.
- Customers are created with `application_status = 'APPROVED'`.
- Vendor and Rider registrants are assigned a unique tracking code (`vendor_code` e.g., `UE-VND-000001` or `rider_code` e.g., `UE-RDR-000001`) and created with `application_status = 'PENDING'`.

### 5.2 Login Workflow (`/api/auth/login.php`)
- Receives `email` and `password`.
- Retrieves user record from database via PDO prepared statement.
- Verifies password using `password_verify($password, $user['password_hash'])`.
- Initializes session using `session_start()`, populating `$_SESSION['user_id']`, `$_SESSION['user_role']`, and `$_SESSION['user_email']`.
- Emits standard HTTP `Set-Cookie` header containing `PHPSESSID`.
- Returns sanitized JSON user profile (excluding `password_hash`).

### 5.3 Session Verification (`/api/auth/me.php`)
- Called automatically on frontend application startup by `AuthContext.jsx`.
- Checks for valid `PHPSESSID` cookie and active `$_SESSION['user_id']`.
- Fetches fresh profile data from DB (including current `application_status` and vendor/rider codes).

### 5.4 Logout Workflow (`/api/auth/logout.php`)
- Unsets `$_SESSION` variables, destroys session using `session_destroy()`, and expires the `PHPSESSID` cookie.

### 5.5 Route Protection & Role Isolation
- **Frontend Protection:** React Higher-Order Component guards (`VendorGuard.jsx`, `RiderGuard.jsx`, `AdminGuard.jsx`) wrap protected routes.
- **Backend Protection:** Every protected PHP endpoint calls session check helpers; unauthorized calls return HTTP `401 Unauthorized` or `403 Forbidden`.

---

## SECTION 6 — DATABASE DOCUMENTATION

### 6.1 Database General Specifications
* **Database Name:** `urbaneats_db`
* **Database Engine:** MySQL / MariaDB (`InnoDB`)
* **Default Collation:** `utf8mb4_unicode_ci`
* **Total Tables:** 11 Tables

### 6.2 Table Schemas

#### 1. Table `users`
Stores user accounts for all 4 roles.
- `id` INT AUTO_INCREMENT PRIMARY KEY
- `full_name` VARCHAR(100) NOT NULL
- `email` VARCHAR(150) NOT NULL UNIQUE
- `phone` VARCHAR(30) NOT NULL
- `password_hash` VARCHAR(255) NOT NULL
- `role` ENUM('customer', 'vendor', 'rider', 'admin') DEFAULT 'customer' NOT NULL
- `application_status` ENUM('APPROVED', 'PENDING', 'REJECTED') DEFAULT 'APPROVED' NOT NULL
- `vendor_code` VARCHAR(50) NULL UNIQUE
- `rider_code` VARCHAR(50) NULL UNIQUE
- `is_online` TINYINT(1) DEFAULT 0 NOT NULL
- `is_available` TINYINT(1) DEFAULT 1 NOT NULL
- `approved_at` TIMESTAMP NULL
- `approved_by` INT NULL
- `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

#### 2. Table `restaurants`
Stores restaurant vendor profiles.
- `id` INT AUTO_INCREMENT PRIMARY KEY
- `owner_id` INT NULL (FK -> `users.id`)
- `name` VARCHAR(150) NOT NULL
- `slug` VARCHAR(150) NOT NULL UNIQUE
- `description` TEXT NULL
- `category` VARCHAR(100) NULL
- `location` VARCHAR(255) NULL
- `phone` VARCHAR(30) NULL
- `logo_image` VARCHAR(500) NULL
- `cover_image` VARCHAR(500) NULL
- `logo_url` VARCHAR(255) NULL
- `cover_url` VARCHAR(255) NULL
- `opening_hours` VARCHAR(100) NULL
- `status` ENUM('open', 'closed', 'temporarily_closed') DEFAULT 'open' NOT NULL
- `is_active` TINYINT(1) DEFAULT 1 NOT NULL
- `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

#### 3. Table `food_categories`
Taxonomy categories for menu items.
- `id` INT AUTO_INCREMENT PRIMARY KEY
- `name` VARCHAR(100) NOT NULL UNIQUE
- `slug` VARCHAR(100) NOT NULL UNIQUE
- `description` VARCHAR(255) NULL
- `sort_order` INT DEFAULT 0 NOT NULL
- `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

#### 4. Table `food_items`
Individual menu items offered by restaurants.
- `id` INT AUTO_INCREMENT PRIMARY KEY
- `restaurant_id` INT NOT NULL (FK -> `restaurants.id` ON DELETE CASCADE)
- `category_id` INT NULL (FK -> `food_categories.id` ON DELETE SET NULL)
- `name` VARCHAR(200) NOT NULL
- `slug` VARCHAR(200) NOT NULL
- `description` TEXT NULL
- `price` DECIMAL(10,2) NOT NULL
- `image` VARCHAR(500) NULL
- `image_url` VARCHAR(255) NULL
- `is_available` TINYINT(1) DEFAULT 1 NOT NULL
- `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
- UNIQUE KEY `uq_food_slug_restaurant` (`slug`, `restaurant_id`)

#### 5. Table `favorites`
Customer saved food items list.
- `id` INT AUTO_INCREMENT PRIMARY KEY
- `user_id` INT NOT NULL (FK -> `users.id` ON DELETE CASCADE)
- `food_item_id` INT NOT NULL (FK -> `food_items.id` ON DELETE CASCADE)
- `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- UNIQUE KEY `uq_user_food_favorite` (`user_id`, `food_item_id`)

#### 6. Table `user_addresses`
Saved delivery addresses per customer.
- `id` INT AUTO_INCREMENT PRIMARY KEY
- `user_id` INT NOT NULL (FK -> `users.id` ON DELETE CASCADE)
- `label` VARCHAR(50) DEFAULT 'Home' NOT NULL
- `recipient_name` VARCHAR(100) NOT NULL
- `phone` VARCHAR(30) NOT NULL
- `address` VARCHAR(255) NOT NULL
- `area` VARCHAR(100) DEFAULT 'Abraka' NOT NULL
- `city` VARCHAR(50) DEFAULT 'Abraka' NOT NULL
- `state` VARCHAR(50) DEFAULT 'Delta State' NOT NULL
- `is_default` TINYINT(1) DEFAULT 0 NOT NULL
- `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

#### 7. Table `orders`
Master order records.
- `id` INT AUTO_INCREMENT PRIMARY KEY
- `order_number` VARCHAR(50) NOT NULL UNIQUE
- `user_id` INT NOT NULL (FK -> `users.id` ON DELETE CASCADE)
- `restaurant_id` INT NOT NULL (FK -> `restaurants.id` ON DELETE CASCADE)
- `restaurant_name` VARCHAR(150) NOT NULL
- `delivery_address_id` INT NULL (FK -> `user_addresses.id` ON DELETE SET NULL)
- `recipient_name` VARCHAR(100) NOT NULL
- `recipient_phone` VARCHAR(30) NOT NULL
- `delivery_address` VARCHAR(255) NOT NULL
- `delivery_area` VARCHAR(100) NOT NULL
- `delivery_city` VARCHAR(50) DEFAULT 'Abraka' NOT NULL
- `delivery_state` VARCHAR(50) DEFAULT 'Delta State' NOT NULL
- `subtotal` DECIMAL(10,2) NOT NULL
- `delivery_fee` DECIMAL(10,2) DEFAULT 500.00 NOT NULL
- `total_amount` DECIMAL(10,2) NOT NULL
- `order_status` ENUM('PENDING_PAYMENT', 'CONFIRMED', 'PROCESSING', 'READY_FOR_DELIVERY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED') DEFAULT 'PENDING_PAYMENT' NOT NULL
- `payment_status` ENUM('PENDING', 'PAID', 'FAILED', 'CANCELLED') DEFAULT 'PENDING' NOT NULL
- `payment_method` VARCHAR(50) DEFAULT 'FLUTTERWAVE' NOT NULL
- `payment_reference` VARCHAR(100) NULL
- `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

#### 8. Table `order_items`
Immutable snapshots of food items within an order.
- `id` INT AUTO_INCREMENT PRIMARY KEY
- `order_id` INT NOT NULL (FK -> `orders.id` ON DELETE CASCADE)
- `food_item_id` INT NULL (FK -> `food_items.id` ON DELETE SET NULL)
- `food_name` VARCHAR(200) NOT NULL
- `food_slug` VARCHAR(200) NULL
- `category_name` VARCHAR(100) NULL
- `quantity` INT DEFAULT 1 NOT NULL
- `unit_price` DECIMAL(10,2) NOT NULL
- `subtotal` DECIMAL(10,2) NOT NULL
- `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP

#### 9. Table `payments`
Payment transaction audit log.
- `id` INT AUTO_INCREMENT PRIMARY KEY
- `order_id` INT NOT NULL (FK -> `orders.id` ON DELETE CASCADE)
- `user_id` INT NOT NULL (FK -> `users.id` ON DELETE CASCADE)
- `tx_ref` VARCHAR(150) NOT NULL UNIQUE
- `flw_ref` VARCHAR(150) NULL
- `amount` DECIMAL(10,2) NOT NULL
- `currency` VARCHAR(10) DEFAULT 'NGN' NOT NULL
- `status` ENUM('PENDING', 'SUCCESSFUL', 'FAILED', 'CANCELLED') DEFAULT 'PENDING' NOT NULL
- `raw_response` TEXT NULL
- `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

#### 10. Table `delivery_assignments`
Rider dispatch assignments.
- `id` INT AUTO_INCREMENT PRIMARY KEY
- `order_id` INT NOT NULL UNIQUE (FK -> `orders.id` ON DELETE CASCADE)
- `rider_id` INT NOT NULL (FK -> `users.id` ON DELETE CASCADE)
- `status` ENUM('ASSIGNED', 'ACCEPTED', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED') DEFAULT 'ACCEPTED' NOT NULL
- `assigned_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
- `accepted_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
- `picked_up_at` TIMESTAMP NULL
- `out_for_delivery_at` TIMESTAMP NULL
- `delivered_at` TIMESTAMP NULL
- `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

#### 11. Table `notifications`
Centralized notification store.
- `id` INT AUTO_INCREMENT PRIMARY KEY
- `user_id` INT NOT NULL
- `type` VARCHAR(50) NOT NULL
- `title` VARCHAR(255) NOT NULL
- `message` TEXT NOT NULL
- `related_order_id` INT NULL
- `related_restaurant_id` INT NULL
- `related_delivery_id` INT NULL
- `is_read` TINYINT(1) DEFAULT 0 NOT NULL
- `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL

---

## SECTION 7 — API ENDPOINT DOCUMENTATION

The backend implements 48 verified REST API endpoints grouped across 10 functional modules:

### 7.1 Authentication Module (`/api/auth/`)
- `POST /auth/register.php`: Registers customer, vendor, or rider account.
- `POST /auth/login.php`: Authenticates user, initializes session cookie.
- `GET /auth/me.php`: Returns current session user profile.
- `POST /auth/logout.php`: Destroys session.
- `POST /auth/update_profile.php`: Updates user profile information.

### 7.2 Restaurants Module (`/api/restaurants/`)
- `GET /restaurants/index.php`: Lists active restaurants with optional search/category filter.
- `GET /restaurants/show.php?id={id}`: Retrieves detailed restaurant profile and menu items.

### 7.3 Food Items Module (`/api/food-items/`)
- `GET /food-items/index.php`: Retrieves food items filtered by `restaurant_id` or `category_id`.

### 7.4 Addresses Module (`/api/addresses/`)
- `GET /addresses/index.php`: Lists saved delivery addresses for logged-in user.
- `POST /addresses/create.php`: Creates a new delivery address.
- `POST /addresses/set_default.php`: Sets an address as primary default.
- `POST /addresses/delete.php`: Deletes a saved address.

### 7.5 Favorites Module (`/api/favorites/`)
- `GET /favorites/index.php`: Lists favorited food items for authenticated customer.
- `POST /favorites/add.php`: Adds item to user favorites.
- `POST /favorites/remove.php`: Removes item from user favorites.

### 7.6 Orders Module (`/api/orders/`)
- `POST /orders/create.php`: Places a new order from cart items.
- `POST /orders/verify_payment.php`: Verifies payment transaction and confirms order.
- `GET /orders/index.php`: Retrieves order history for current customer.
- `GET /orders/detail.php?id={id}`: Retrieves full order details and item snapshots.
- `POST /orders/archive.php`: Archives order from active view.
- `POST /orders/restore.php`: Restores archived order.

### 7.7 Vendor Module (`/api/vendor/`)
- `GET /vendor/dashboard.php`: Vendor overview analytics and active metrics.
- `GET /vendor/restaurant.php`: Retrieves vendor's linked restaurant details.
- `GET /vendor/menu.php`: Lists menu items owned by vendor's restaurant.
- `POST /vendor/create_food_item.php`: Adds new food item to vendor menu.
- `POST /vendor/update_food_item.php`: Edits item details, price, or availability.
- `POST /vendor/upload_restaurant_image.php`: Handles logo and cover image uploads.
- `POST /vendor/upload_food_image.php`: Handles food item image uploads.
- `GET /vendor/orders.php`: Lists orders placed at vendor's restaurant.
- `GET /vendor/order_detail.php?id={id}`: Detailed order breakdown for vendor.
- `POST /vendor/update_order_status.php`: Updates status (`PROCESSING`, `READY_FOR_DELIVERY`).

### 7.8 Rider Module (`/api/rider/`)
- `GET /rider/dashboard.php`: Rider stats overview.
- `POST /rider/toggle_online.php`: Toggles rider `is_online` and `is_available` states.
- `GET /rider/deliveries.php`: Lists available/assigned delivery jobs.
- `GET /rider/active.php`: Retrieves rider's current active delivery.
- `POST /rider/accept.php`: Accepts an available delivery assignment.
- `POST /rider/update_status.php`: Transitions delivery status (`PICKED_UP`, `OUT_FOR_DELIVERY`, `DELIVERED`).
- `GET /rider/history.php`: Retrieves completed delivery history logs.
- `GET /rider/profile.php`: Retrieves rider profile details.

### 7.9 Admin Module (`/api/admin/`)
- `GET /admin/stats.php` & `GET /admin/analytics.php`: System overview metrics.
- `GET /admin/users.php` & `POST /admin/user_action.php`: User management.
- `GET /admin/restaurants.php` & `POST /admin/restaurant_action.php`: Restaurant oversight.
- `GET /admin/approve_vendor.php` & `POST /admin/approve_vendor.php`: Vendor account approvals.
- `GET /admin/approve_rider.php` & `POST /admin/approve_rider.php`: Rider account approvals.
- `GET /admin/orders.php` & `GET /admin/order_details.php`: Global order monitoring.
- `GET /admin/deliveries.php`: Global delivery assignment oversight.
- `GET /admin/finance.php`: Financial metrics breakdown.

### 7.10 Notifications Module (`/api/notifications/`)
- `GET /notifications/index.php`: Lists notifications for current user.
- `GET /notifications/unread_count.php`: Returns count of unread notifications.
- `POST /notifications/mark_read.php`: Marks single notification as read.
- `POST /notifications/mark_all_read.php`: Marks all notifications as read.

---

## SECTION 8 — SYSTEM MODULES

1. **Authentication & User Profile Module:** Handles multi-role registration, session cookie validation, profile updating, delivery address management, and favorites lists.
2. **Restaurant Discovery & Menu Module:** Public search, category filtering, restaurant profile viewing, and dynamic food item listing.
3. **Cart Management Module:** Client-side cart state with local storage persistence and single-restaurant conflict modal enforcement.
4. **Checkout & Order Creation Module:** Delivery address selection, order calculation (subtotal + N500 delivery fee), order placement (`/api/orders/create.php`), and simulated payment verification (`/api/orders/verify_payment.php`).
5. **Vendor Management Module:** Dedicated vendor portal for menu CRUD operations, item availability toggling, image uploads, and order preparation status progression.
6. **Rider Dispatch & Delivery Module:** Rider portal for online toggle, accepting assigned orders, updating delivery milestones, and viewing completed delivery history.
7. **Admin Platform Governance Module:** Platform analytics, approving pending vendor/rider applications, managing user accounts, and monitoring global orders.
8. **Notification Module:** Centralized notification hub notifying users of order confirmations, status transitions, and delivery dispatches.

---

## SECTION 9 — COMPLETE ORDER AND DELIVERY WORKFLOW

```
+-----------------------------------------------------------------------------------+
|                        COMPLETE ORDER & DELIVERY WORKFLOW                         |
+-----------------------------------------------------------------------------------+

[CUSTOMER] Browse & Add Items to Cart (Single-Restaurant Enforced)
    │
    ▼
[CUSTOMER] Checkout Page -> Select Saved Address -> Click "Place Order & Pay"
    │
    ▼
[SYSTEM API] Creates Order (`PENDING_PAYMENT`) & Payments record (`tx_ref`)
    │
    ▼
[CUSTOMER] Simulated Payment Modal -> Click "Complete Payment"
    │
    ▼
[SYSTEM API] `/orders/verify_payment.php` -> Updates Order to `CONFIRMED`, Payment to `PAID`
    │
    ├─► [NOTIFICATION] Triggered to Vendor: "New Order Confirmed!"
    ▼
[VENDOR] Views Order in Vendor Portal -> Updates Status to `PROCESSING`
    │
    ▼
[VENDOR] Prepares Food -> Updates Status to `READY_FOR_DELIVERY`
    │
    ├─► [SYSTEM] Auto-assigns available Rider & creates `delivery_assignments`
    ├─► [NOTIFICATION] Triggered to Rider: "New Delivery Assigned!"
    ▼
[RIDER] Accepts Assignment in Rider Portal (`ACCEPTED`)
    │
    ▼
[RIDER] Arrives at Restaurant & Picks Up Food -> Updates Status to `PICKED_UP`
    │
    ├─► [NOTIFICATION] Triggered to Customer: "Food Picked Up!"
    ▼
[RIDER] In Transit to Customer -> Updates Status to `OUT_FOR_DELIVERY`
    │
    ├─► [NOTIFICATION] Triggered to Customer: "Order Out for Delivery!"
    ▼
[RIDER] Delivers Food to Customer Address -> Updates Status to `DELIVERED`
    │
    ├─► [SYSTEM] Marks Order as `DELIVERED` & frees Rider (`is_available = 1`)
    └─► [NOTIFICATION] Triggered to Customer & Vendor: "Order Delivered Successfully!"
```

---

## SECTION 10 — IMAGE UPLOAD AND STORAGE SYSTEM

### 10.1 Storage Architecture
* **Upload Directories:**
  - Restaurant Images: `c:\xampp\htdocs\urbaneats-api\uploads\restaurants\`
  - Food Item Images: `c:\xampp\htdocs\urbaneats-api\uploads\food-items\`
* **Public URL Access:** Served directly by Apache at `http://localhost/urbaneats-api/uploads/...`.

### 10.2 Upload Endpoints & Validation
- **Endpoints:** `/api/vendor/upload_restaurant_image.php` and `/api/vendor/upload_food_image.php`.
- **Validation Rules:**
  1. Maximum file size: 5 MB (`5 * 1024 * 1024` bytes).
  2. Allowed extensions: `.jpg`, `.jpeg`, `.png`, `.webp`.
  3. MIME type validation: Checked via `finfo_file()` to ensure MIME matches `image/jpeg`, `image/png`, `image/webp`.
- **Naming Strategy:** Unique timestamped filename generation (e.g., `rest_1_logo_1722765000.webp`).

### 10.3 Frontend Image Resolution & Fallback
- Dynamic images check `logo_url`, `cover_url`, or `image_url` returned from API.
- Rendered via `ImageWithFallback.jsx` component; if an image fails to load, it automatically falls back to bundled static assets from `src/data/imageAssets.js`.

---

## SECTION 11 — NOTIFICATION SYSTEM

- **Database Table:** `notifications` storing `user_id`, `type`, `title`, `message`, `related_order_id`, `is_read`, `created_at`.
- **API Endpoints:** `/api/notifications/index.php`, `/unread_count.php`, `/mark_read.php`, `/mark_all_read.php`.
- **UI Integration:** Rendered in navigation header via `NotificationBell` dropdown component with unread counter badge.
- **Polling Mechanism:** Frontend polls unread count periodically to update header badges automatically.

---

## SECTION 12 — CART SYSTEM

- **Client-Side State:** Driven by React `CartContext.jsx` and persisted in `localStorage` under key `urban_eats_cart`.
- **Single-Restaurant Isolation:** Enforces business rule: *Items from multiple restaurants cannot be mixed in one cart*. Attempting to add an item from a different restaurant displays `CartConflictModal.jsx`, prompting user to either clear cart or cancel.
- **Cart Operations:** Add item, increment/decrement quantity, remove item, clear cart.
- **Persistence:** Retained across page reloads and browser restarts until explicitly cleared or checked out.

---

## SECTION 13 — PAYMENT SYSTEM

- **Implementation Classification:** **SIMULATED / DEMO PAYMENT WORKFLOW**.
- **Details:** The checkout process generates realistic transaction references (`tx_ref` e.g., `UE-TX-1722765000-1234`) and stores payment status in the `payments` database table. The payment modal presents a simulated completion interface that calls `/api/orders/verify_payment.php` to verify and transition order statuses without charging real debit cards.
- **Status:** Real live Flutterwave API gateway integration is not connected to live bank processing; it operates safely in demo/acceptance mode.

---

## SECTION 14 — RAD METHODOLOGY MAPPING

1. **Requirements Planning Phase:** Scope boundary definition, 4-actor role model, Abraka landmark mapping (Site II, Campus Gate, Market Road).
2. **User Design Phase (Iterative Prototyping):** React SPA UI component iteration, dark/light surface aesthetics, custom CSS variable tokens, single-restaurant cart conflict modal.
3. **Construction Phase:** Incremental database schema migrations (`001` to `009`), PHP REST API controller development, prepared query security integration, context state wiring.
4. **Cutover Phase:** Automated cURL security test suites execution (`test_phase7_hardening.php`, etc.), Vite production compilation (`npm run build`), local Apache/MySQL staging.

---

## SECTION 15 — OOAD DOCUMENTATION

- **Domain Actors:** Customer, Vendor, Rider, Administrator, Flutterwave (External).
- **Use Cases:** UC-01 (Register), UC-02 (Authenticate), UC-03 (Browse), UC-04 (Cart Management), UC-05 (Address & Favorites), UC-06 (Checkout & Payment), UC-07 (Vendor Menu CRUD), UC-08 (Vendor Order Processing), UC-09 (Rider Delivery Flow), UC-10 (Admin Approval Governance).
- **Domain Classes:** `User`, `Restaurant`, `FoodCategory`, `FoodItem`, `Favorite`, `UserAddress`, `Order`, `OrderItem`, `Payment`, `DeliveryAssignment`, `Notification`.
- **Design Considerations:** Immutability of order item snapshots, encapsulation of password hashes, role-based polymorphic authorization, single responsibility component architecture.

---

## SECTION 16 — TESTING DOCUMENTATION

```
+---------------------------------------------------------------------------------------------------+
|                                     VERIFIED SYSTEM TEST MATRIX                                   |
+-------------------+----------------------------------+-------------------+---------------+--------+
| Feature Tested    | Test Scenario                    | Expected Result   | Actual Result | Status |
+-------------------+----------------------------------+-------------------+---------------+--------+
| Customer Auth     | Login with invalid credentials   | Reject HTTP 401   | HTTP 401      | PASS   |
| Vendor Guard      | Unapproved vendor accesses dashboard| Show Pending View | Pending View  | PASS   |
| Rider Dispatch    | Rider updates status to PICKED_UP| Transition Status | Status Updated| PASS   |
| Cart Isolation    | Add item from 2nd restaurant     | Show Modal        | Conflict Modal| PASS   |
| Image Upload      | Upload 10MB file (exceeds limit) | Reject file size  | File Rejected | PASS   |
| Security Hardening| Unauthenticated order update call| HTTP 401 / 403    | HTTP 401      | PASS   |
| Vite Build        | Run `npm run build` compilation  | Build `/dist`     | Build Success | PASS   |
+-------------------+----------------------------------+-------------------+---------------+--------+
```

---

## SECTION 17 — SECURITY IMPLEMENTATION

1. **Prepared Statement Query Binding:** 100% of SQL queries pass through PHP PDO prepared statements with bound parameters (`$stmt->execute()`), effectively preventing SQL injection attacks.
2. **Session Cookie Integrity:** `PHPSESSID` cookies configured with `HttpOnly` and `SameSite=Lax` parameters in `config/cors.php`.
3. **Password Security:** Hashed using native PHP `password_hash()` with BCRYPT; `password_hash` strings are omitted from JSON API payloads.
4. **Role-Based Access Control (RBAC):** Authenticated session roles enforced on both frontend guards and backend controller endpoints.
5. **File Upload Security:** MIME-type validation via `finfo_file()`, extension verification, and 5MB size limits.

---

## SECTION 18 — RESPONSIVE DESIGN

The responsive design system was audited and verified across 7 standard viewports:

| Viewport Size | Device Category | Tested Layout Elements | Result |
| :--- | :--- | :--- | :--- |
| **320px** | Small Mobile | Single column layout, mobile drawer navigation | PASS |
| **375px** | Mobile Standard | Responsive search bar, food item cards stack | PASS |
| **414px** | Large Mobile | Form inputs, modal dialogue positioning | PASS |
| **768px** | Tablet Portrait | 2-column restaurant grid, cart drawer overlay | PASS |
| **1024px** | Tablet Landscape | 3-column restaurant grid, dashboard sidebar | PASS |
| **1280px** | Desktop Standard | Full navbar navigation, multi-column tables | PASS |
| **1440px** | Large Desktop | Centered container max-width constraints | PASS |

---

## SECTION 19 — CURRENT SYSTEM STATUS AND LIMITATIONS

### 19.1 Fully Implemented
- Complete 4-Role Authentication & Session Persistence (`PHPSESSID`).
- Responsive Customer Marketplace (Search, Filter, Restaurant Details, Menu Browsing).
- Client-Side Cart System with Single-Restaurant Isolation Modal.
- Customer Delivery Address & Favorites Management.
- Order Creation & Delivery Detail Snapshotting.
- Complete Vendor Portal (Dashboard, Menu CRUD, Image Uploads, Order Preparation).
- Complete Rider Portal (Online Toggle, Delivery Job Acceptance, Milestone Transitions).
- Complete Admin Portal (Platform Stats, Vendor/Rider Application Approvals, User Management).
- Database-Persisted Notification System with Header Unread Badge.

### 19.2 Partially Implemented
- **Payment Gateway Integration:** Operates in simulated/demo payment mode; generates real references (`tx_ref`) and verifies transactions without charging live credit cards.
- **Notification Polling:** Uses HTTP polling rather than WebSockets.

### 19.3 Not Implemented
- Live GPS Map Tracking for Rider movement.
- Multi-Restaurant Combined Cart Checkout.

---

## SECTION 20 — RECOMMENDED CHAPTER 4 STRUCTURE

Based on the completed implementation of UrbanEats, the following structure is recommended for **Chapter 4 (System Implementation & Results)** of your academic report:

```markdown
4.1 Overview of System Implementation
4.2 Development & Deployment Environment
    4.2.1 Hardware Specifications
    4.2.2 Software & Technology Stack Specifications
4.3 System Architecture & Design Realization
    4.3.1 Client Presentation Layer (React 18 SPA)
    4.3.2 REST API & Application Layer (PHP 8 Engine)
    4.3.3 Persistence Layer (MySQL `urbaneats_db`)
4.4 Database Implementation & Schema Details
    4.4.1 Table Schemas & Relational Integrity
    4.4.2 Migration Execution & Seeding
4.5 User Roles & Authentication Implementation
    4.5.1 Registration & Password Security
    4.5.2 Session Cookie Management (`PHPSESSID`)
    4.5.3 Role-Based Access Control & Guards
4.6 Detailed System Modules Implementation
    4.6.1 Customer Discovery & Ordering Module
    4.6.2 Cart & Checkout Subsystem
    4.6.3 Vendor Management Portal & Menu CRUD
    4.6.4 Rider Dispatch & Delivery Milestone Subsystem
    4.6.5 Admin Governance & Verification Approval Module
    4.6.6 Centralized Notification Subsystem
4.7 Complete Order & Delivery Workflow Execution
4.8 System Security & Hardening Implementation
    4.8.1 SQL Injection Prevention (PDO Prepared Statements)
    4.8.2 Image Upload Validation & MIME Verification
4.9 System Testing & Results Matrix
    4.9.1 Automated cURL Hardening Test Results
    4.9.2 End-to-End Functional Test Results
    4.9.3 Responsive Design Viewport Verification
4.10 Summary of System Status & Known Limitations
```

---
*End of UrbanEats Technical Project Documentation.*
