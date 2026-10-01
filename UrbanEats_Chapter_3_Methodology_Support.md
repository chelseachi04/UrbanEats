# UrbanEats — Chapter 3 (Methodology) Technical Support & Audit Document

> **DOCUMENT TYPE:** Methodology Technical Support & Empirical Audit  
> **PROJECT TITLE:** Design and Implementation of a Web-Based Ordering and Delivery System in Abraka  
> **APPLICATION NAME:** UrbanEats  
> **FIXED METHODOLOGY:** Rapid Application Development (RAD)  
> **FIXED DESIGN APPROACH:** Object-Oriented Analysis and Design (OOAD)  
> **AUDITOR PERSONA:** Devil Incarnate — Ruthless Technical Auditor (Zero-Tolerance for Fictional Claims, Pure Empirical Rigor)  
> **TARGET LOCATION:** `UrbanEats_Chapter_3_Methodology_Support.md`  

---

## SECTION 1 — EXECUTIVE AUDIT SUMMARY & METHODOLOGY CONSTRAINTS

### 1.1 Auditor Statement & Scope of Verification
This document provides an unsparing, academically unassailable empirical audit of the **UrbanEats** project codebase, database schema migrations, API controller scripts, and test suites. Its explicit objective is to supply verified technical data to support **Chapter 3 (Methodology)** of the project report/thesis.

**CRITICAL MANDATE:** 
1. **Zero Fictional Activities:** No imaginary stakeholder interviews, paper surveys, client focus groups, or unrecorded meetings are invented. Every RAD phase and OOAD element documented herein is mapped directly to observable, physical codebase artifacts, SQL migration files, PHP API endpoints, React SPA components, and automated PHP test suites.
2. **Fixed Methodology Preservation:** The project methodology is strictly **Rapid Application Development (RAD)** and the system design approach is strictly **Object-Oriented Analysis and Design (OOAD)**. No alternative methodologies (e.g., Agile/Scrum, Waterfall, Spiral) replace or dilute this framework.
3. **Non-Destructive Audit:** Zero modifications have been made to the UrbanEats source code, API controllers, or MySQL database schema during this audit.

---

## SECTION 2 — RAPID APPLICATION DEVELOPMENT (RAD) METHODOLOGY MAPPING

The development of UrbanEats strictly follows the four core phases of the **Rapid Application Development (RAD)** lifecycle. Rather than relying on speculative academic descriptions, each phase below is substantiated by concrete software engineering artifacts found within the project repository (`URBAN/` frontend and `urbaneats-api/` backend).

```
+-----------------------------------------------------------------------------------+
|                        RAD ITERATIVE LIFECYCLE (URBANEATS)                        |
|                                                                                   |
|  [Phase 1: Requirements Planning]                                                 |
|     +-- Domain Analysis of Abraka Hyper-Local Market (Site II, Campus Gate, Market) |
|     +-- Defining 4-Actor RBAC Model (Customer, Vendor, Rider, Admin)              |
|                                                                                   |
|  [Phase 2: User Design (Iterative Prototyping)]                                   |
|     +-- React 18 SPA UI Components (Custom Glassmorphism CSS design system)       |
|     +-- Client-Side Cart & Single-Restaurant Conflict Enforcement                 |
|                                                                                   |
|  [Phase 3: Construction (Component & API Development)]                            |
|     +-- Modular React Page/Context Architecture + Custom Hooks                    |
|     +-- Relational Database Migrations (SQL Files 001 - 009)                      |
|     +-- PHP 8 REST API Controllers & Security Hardening                           |
|                                                                                   |
|  [Phase 4: Cutover (Verification & Local Staging)]                                |
|     +-- Automated CURL Hardening Test Suites (test_phase7_hardening.php)          |
|     +-- Session Cookie Verification & Production Staging Build (Vite)             |
+-----------------------------------------------------------------------------------+
```

### 2.1 Phase 1: Requirements Planning
* **Objective:** Define high-level project boundaries, functional objectives, and domain-specific requirements without committing to rigid, static specification documents.
* **Empirically Verified Project Mapping:**
  - **Domain Problem Definition:** Identification of the Abraka hyper-local food ecosystem dynamics (Delta State University campuses, Site II, Main Market Road, Campus Gate).
  - **System Scope Boundary Definition:** Establishing a 4-tier Role-Based Access Control (RBAC) requirement: Customer, Vendor, Rider, and Platform Administrator.
  - **Database Architectural Blueprinting:** Defining data storage rules for users, single-restaurant cart constraints, fixed N500 delivery fees, and order state transition requirements.

### 2.2 Phase 2: User Design (Iterative Component Prototyping)
* **Objective:** Interactively refine the interface, state management, and user interaction flows through rapid frontend component iteration before locking down API database persistence.
* **Empirically Verified Project Mapping:**
  - **Single-Page Application (SPA) Prototyping:** Built using React 18 with Vite HMR (Hot Module Replacement) allowing instant visual feedback during interface construction.
  - **UI/UX Aesthetics Iteration:** Development of custom CSS variables (`src/styles/index.css`), dark/light surface tokens, mobile drawer navigation, glassmorphism overlays, and loading skeletons.
  - **Cart Conflict Prototyping:** Creation of `CartConflictModal.jsx` and `CartContext.jsx` to enforce the business rule: *Orders cannot combine items from multiple restaurants simultaneously*.
  - **Image Fallback System:** Creation of `src/data/imageAssets.js` and `ImageWithFallback.jsx` to ensure uninterrupted visual presentation when remote images fail to resolve.

### 2.3 Phase 3: Construction
* **Objective:** Parallelized execution of client-side feature implementation, backend API controller creation, database schema migrations, and security middleware integration.
* **Empirically Verified Project Mapping:**
  - **Incremental Database Schema Migrations:** Phased execution of 9 sequential SQL migration scripts (`001_restaurant_menu_foundation.sql` through `009_notifications.sql`) in MySQL/MariaDB (`urbaneats_db`).
  - **RESTful API Controller Engineering:** Development of modular PHP scripts in `urbaneats-api/api/` categorized by domain controllers: `/auth`, `/restaurants`, `/food-items`, `/orders`, `/addresses`, `/favorites`, `/vendor`, `/rider`, `/admin`, and `/notifications`.
  - **State Management & API Integration:** Wiring React contexts (`AuthContext.jsx`, `CartContext.jsx`) to native backend APIs via a central fetch client (`src/api/apiClient.js`) supporting session cookies (`credentials: 'include'`).

### 2.4 Phase 4: Cutover
* **Objective:** System verification, automated vulnerability testing, bundle compilation, and local staging execution prior to final deployment.
* **Empirically Verified Project Mapping:**
  - **Automated Hardening Verification:** Execution of custom PHP cURL test suites (`test_phase7_hardening.php`, `test_phase8_hardening.php`, `test_vendor_security_v2.php`, `test_rider_security.php`) validating HTTP status codes, RBAC authorization boundaries, and session integrity.
  - **Frontend Production Compilation:** Compilation of frontend source code via `npm run build` (Vite 6) producing optimized HTML5, CSS3, and JavaScript ES bundles in the `/dist` directory.
  - **Database Migration Verification:** Verification scripts (`check_tables.php`, `check_restaurants.php`, `check_images.php`) executing automated sanity checks against `urbaneats_db`.

---

## SECTION 3 — OBJECT-ORIENTED ANALYSIS AND DESIGN (OOAD) DERIVATION

Although PHP backend API scripts utilize a procedural-object hybrid pattern, the system analysis, domain model, database structure, and frontend component architecture are strictly derived using Object-Oriented principles.

### 3.1 Domain Actors & Role Boundaries
The system defines 5 distinct domain actors (4 human actors, 1 external system actor):

```
                     +-----------------------------------+
                     |           DOMAINS ACTORS          |
                     +-----------------------------------+
                                       |
       +-------------------+-----------+-----------+-------------------+
       |                   |                       |                   |
+--------------+    +--------------+        +--------------+    +--------------+
|   CUSTOMER   |    |    VENDOR    |        |    RIDER     |    |  ADMINISTRATOR|
| (End User)   |    | (Restaurant) |        | (Delivery)   |    | (Superuser)  |
+--------------+    +--------------+        +--------------+    +--------------+
       |                   |                       |                   |
       +-------------------+-----------+-----------+-------------------+
                                       |
                            +--------------------+
                            | FLUTTERWAVE GATEWAY |
                            | (External Actor)   |
                            +--------------------+
```

1. **Customer (Actor):** An authenticated end-user who searches restaurants, views menus, manages saved addresses/favorites, builds carts, places orders, and completes payments.
2. **Vendor / Restaurant Owner (Actor):** An authenticated restaurant operator managing menu item availability, pricing, restaurant operational status, image uploads, and order preparation statuses.
3. **Rider / Delivery Agent (Actor):** An authenticated dispatch agent who toggles availability (`is_online`, `is_available`), accepts assigned deliveries, updates transit milestones (`PICKED_UP`, `OUT_FOR_DELIVERY`, `DELIVERED`).
4. **Platform Administrator (Actor):** A superuser who oversees user accounts, reviews and approves/rejects vendor and rider applications, manages restaurant directory listings, and monitors system analytics/finances.
5. **Flutterwave Payment Gateway (External System Actor):** Third-party financial processing system handling transaction initialization, payment verification, and webhook notifications.

---

### 3.2 Use Case Specifications & Relationships

```
+---------------------------------------------------------------------------------------------------+
|                                      URBANEATS USE CASE SUMMARY                                   |
+--------------------------+--------------------------------------------------+---------------------+
| Use Case ID              | Title                                            | Primary Actor       |
+--------------------------+--------------------------------------------------+---------------------+
| UC-01                    | Register Account                                 | Customer/Vendor/Rider|
| UC-02                    | Authenticate (Login / Logout / Session Check)    | All Human Actors    |
| UC-03                    | Browse Restaurants & Food Items                 | Customer (Guest/Auth)|
| UC-04                    | Manage Cart Items (Single-Restaurant Rule)      | Customer            |
| UC-05                    | Manage Saved Addresses & Favorites               | Customer            |
| UC-06                    | Place Order & Process Flutterwave Payment        | Customer            |
| UC-07                    | Manage Restaurant Menu & Operational Status      | Vendor              |
| UC-08                    | Process & Update Order Preparation Status        | Vendor              |
| UC-09                    | Toggle Rider Availability & Update Delivery Flow | Rider               |
| UC-10                    | Approve Vendor/Rider & System Governance         | Administrator       |
+--------------------------+--------------------------------------------------+---------------------+
```

#### Use Case Relationships (UML Notation):
- **`<<include>>` Relationships:**
  - `UC-06 (Place Order)` **`<<include>>`** `UC-02 (Authenticate)` — Customer must be logged in to check out.
  - `UC-06 (Place Order)` **`<<include>>`** `UC-04 (Manage Cart Items)` — Cart state is required to generate order items.
  - `UC-06 (Place Order)` **`<<include>>`** Flutterwave Payment Verification — Order completion requires successful transaction verification.
  - `UC-07 (Manage Menu)` **`<<include>>`** `UC-02 (Authenticate)` — Vendor role authentication required.
  - `UC-10 (System Governance)` **`<<include>>`** `UC-02 (Authenticate)` — Admin role authentication required.
- **`<<extend>>` Relationships:**
  - `UC-04 (Manage Cart Items)` **`<<extend>>`** `Clear Cart on Restaurant Conflict Modal` — Triggered when adding items from a different restaurant.
  - `UC-05 (Manage Addresses)` **`<<extend>>`** `Set Default Address` — Optional customization during address management.
- **Generalization (Inheritance):**
  - `Customer`, `Vendor`, `Rider`, and `Admin` specialize (inherit from) the abstract `User` actor entity.

---

### 3.3 System Entity / Class Specifications

The relational schema maps directly to 11 Object-Oriented Domain Entities:

```
+---------------------------------------------------------------------------------------------------+
|                                 DOMAIN ENTITIES / CLASSES MATRIX                                  |
+-----------------------+----------------------------------+----------------------------------------+
| Entity / Class Name   | Primary Key / Attributes         | Foreign Keys / Associated Classes      |
+-----------------------+----------------------------------+----------------------------------------+
| **User**              | id, full_name, email, phone,     | 1:N -> UserAddress                     |
|                       | password_hash, role, status,     | 1:N -> Order                           |
|                       | vendor_code, rider_code, online  | 1:1 -> Restaurant (Owner)              |
+-----------------------+----------------------------------+----------------------------------------+
| **Restaurant**        | id, owner_id, name, slug, status,| N:1 -> User (Owner)                    |
|                       | location, phone, logo_url        | 1:N -> FoodItem                        |
|                       |                                  | 1:N -> Order                           |
+-----------------------+----------------------------------+----------------------------------------+
| **FoodCategory**      | id, name, slug, description,     | 1:N -> FoodItem                        |
|                       | sort_order                       |                                        |
+-----------------------+----------------------------------+----------------------------------------+
| **FoodItem**          | id, restaurant_id, category_id,  | N:1 -> Restaurant                      |
|                       | name, slug, price, is_available  | N:1 -> FoodCategory                    |
|                       |                                  | 1:N -> Favorite                        |
+-----------------------+----------------------------------+----------------------------------------+
| **Favorite**          | id, user_id, food_item_id        | N:1 -> User, N:1 -> FoodItem           |
+-----------------------+----------------------------------+----------------------------------------+
| **UserAddress**       | id, user_id, label, address,     | N:1 -> User                            |
|                       | area, city, state, is_default    | 1:N -> Order                           |
+-----------------------+----------------------------------+----------------------------------------+
| **Order**             | id, order_number, user_id,       | N:1 -> User (Customer)                 |
|                       | restaurant_id, subtotal, total,  | N:1 -> Restaurant                      |
|                       | order_status, payment_status     | 1:N -> OrderItem                       |
|                       |                                  | 1:1 -> Payment                         |
|                       |                                  | 1:1 -> DeliveryAssignment              |
+-----------------------+----------------------------------+----------------------------------------+
| **OrderItem**         | id, order_id, food_item_id,      | N:1 -> Order                           |
|                       | food_name, quantity, unit_price  | N:1 -> FoodItem                        |
+-----------------------+----------------------------------+----------------------------------------+
| **Payment**           | id, order_id, user_id, tx_ref,   | N:1 -> Order                           |
|                       | amount, status, raw_response     | N:1 -> User                            |
+-----------------------+----------------------------------+----------------------------------------+
| **DeliveryAssignment**| id, order_id, rider_id, status,  | 1:1 -> Order                           |
|                       | assigned_at, delivered_at        | N:1 -> User (Rider)                    |
+-----------------------+----------------------------------+----------------------------------------+
| **Notification**      | id, user_id, type, title,        | N:1 -> User                            |
|                       | message, is_read                 |                                        |
+-----------------------+----------------------------------+----------------------------------------+
```

---

### 3.4 Object-Oriented Design Considerations

1. **Encapsulation & Data Hiding:**
   - Client passwords are never returned in JSON payloads; `password_hash` is stripped inside backend API controllers (`auth/me.php`, `auth/login.php`).
   - Session states rely on secure HTTP-Only `PHPSESSID` cookies rather than exposing raw auth tokens in LocalStorage or JavaScript scope.
2. **Immutability via Snapshotting (Data Transfer Object pattern):**
   - The `order_items` class does not merely reference `food_items.id`; it snapshots `food_name`, `unit_price`, and `category_name` at the exact moment of order placement. This prevents historical corruption if a vendor later changes menu item titles or prices.
3. **Role Inheritance & Polymorphism:**
   - The base `User` entity contains a discriminator attribute `role` (`'customer'`, `'vendor'`, `'rider'`, `'admin'`). API authorization middleware acts polymorphically on this attribute to grant or restrict access to endpoint routes.
4. **Single Responsibility Principle (SRP):**
   - Frontend React components are strictly separated by responsibility: UI views (`src/pages`), global context state providers (`src/context`), network transport abstraction (`src/api`), and domain route handling (`src/routes`).

---

## SECTION 4 — DIAGRAMMATIC SPECIFICATIONS FOR SYSTEM MODELING

The following structured technical specifications enable the direct creation of official UML and ER diagrams for Chapter 3.

### 4.1 Use Case Diagram Specification
* **Boundary:** UrbanEats System Boundary.
* **Actors:** Customer, Vendor, Rider, Admin, Flutterwave (External).
* **Connections:**
  - **Customer:** UC-01, UC-02, UC-03, UC-04, UC-05, UC-06.
  - **Vendor:** UC-02, UC-07, UC-08.
  - **Rider:** UC-02, UC-09.
  - **Admin:** UC-02, UC-10.
  - **Flutterwave:** UC-06 (Verifies Payment).

### 4.2 Class Diagram Specification
* **Classes & Multiplicity:**
  - `User` **1** ----- **0..*** `UserAddress`
  - `User` **1** ----- **0..*** `Order`
  - `User` **1** ----- **0..1** `Restaurant` (Vendor ownership)
  - `Restaurant` **1** ----- **1..*** `FoodItem`
  - `FoodCategory` **1** ----- **0..*** `FoodItem`
  - `Order` **1** ----- **1..*** `OrderItem`
  - `Order` **1** ----- **0..1** `Payment`
  - `Order` **1** ----- **0..1** `DeliveryAssignment`
  - `User` (Rider) **1** ----- **0..*** `DeliveryAssignment`

---

### 4.3 Activity Diagram Specifications

#### Activity Diagram 1: Customer Checkout & Payment Flow
1. **Initial Node:** Customer clicks "Proceed to Checkout" on Cart Page.
2. **Decision Node:** Is user authenticated?
   - *No:* Redirect to Login / Registration Modal -> Authenticate -> Return to Checkout.
   - *Yes:* Proceed.
3. **Action:** Select or enter Delivery Address (Abraka zone).
4. **Action:** Render Order Summary (Subtotal + Fixed N500 Delivery Fee).
5. **Action:** Click "Pay with Flutterwave".
6. **Action:** Invoke PHP Endpoint (`/api/orders/create.php`).
7. **Action:** Create `PENDING_PAYMENT` order record and redirect to Flutterwave Payment Gateway.
8. **Decision Node:** Payment Result?
   - *Failed / Cancelled:* Update order status to `CANCELLED`, display error banner.
   - *Successful:* Webhook / Redirect to `/api/orders/verify_payment.php`.
9. **Action:** Verify transaction reference with Flutterwave API.
10. **Action:** Update order status to `CONFIRMED`, payment status to `PAID`.
11. **Action:** Dispatch notification to Vendor.
12. **Final Node:** Display Order Confirmation Page with Order Number.

#### Activity Diagram 2: Order Preparation & Rider Dispatch Flow
1. **Initial Node:** Vendor receives new `CONFIRMED` order.
2. **Action:** Vendor changes order status to `PROCESSING`.
3. **Action:** Vendor completes preparation and sets status to `READY_FOR_DELIVERY`.
4. **Action:** System queries online and available riders (`is_online = 1`, `is_available = 1`).
5. **Action:** Create `delivery_assignments` record (`status = 'ACCEPTED'`).
6. **Action:** Rider accepts assignment and navigates to restaurant.
7. **Action:** Rider marks status as `PICKED_UP`.
8. **Action:** Rider marks status as `OUT_FOR_DELIVERY`.
9. **Action:** Rider delivers order to customer and marks status as `DELIVERED`.
10. **Action:** System updates order status to `DELIVERED` and releases rider (`is_available = 1`).
11. **Final Node:** Order Completed.

---

### 4.4 Sequence Diagram Specifications

#### Sequence 1: Customer Login Sequence
* **Participants:** `Customer (Actor)`, `LoginPage (React)`, `AuthContext (Context)`, `apiClient (Fetch)`, `login.php (PHP Controller)`, `PDO / MySQL (Database)`.
1. Customer inputs email and password -> `LoginPage`.
2. `LoginPage` calls `login(email, password)` on `AuthContext`.
3. `AuthContext` calls `apiClient.post('/auth/login.php', { email, password })`.
4. `apiClient` executes HTTP POST with `credentials: 'include'`.
5. `login.php` executes SELECT query via `PDO` targeting `users` table where `email = ?`.
6. Database returns user record with `password_hash`.
7. `login.php` executes `password_verify()`.
8. If valid, `login.php` initializes `session_start()`, populates `$_SESSION`, sets `PHPSESSID` cookie, and returns JSON user object.
9. `apiClient` receives HTTP 200 JSON payload.
10. `AuthContext` updates user state and returns success to `LoginPage`.
11. `LoginPage` redirects customer to dashboard/home page.

---

### 4.5 System Architecture Diagram Specification

```
+---------------------------------------------------------------------------------------+
|                               URBANEATS SYSTEM ARCHITECTURE                           |
+---------------------------------------------------------------------------------------+

+---------------------------------------------------------------------------------------+
| LAYER 1: CLIENT PRESENTATION LAYER (Browser SPA Environment)                          |
|   - React 18 Single Page Application (Vite 6 Build)                                   |
|   - React Router DOM v6.28.0 (Client Routing)                                         |
|   - State Contexts: AuthContext, CartContext                                          |
|   - Custom CSS3 Design System (Vanilla CSS, Glassmorphism, Micro-animations)          |
+---------------------------------------------------------------------------------------+
                                          |
                                HTTP GET/POST/PUT/DELETE
                                JSON API Payloads / Cookies
                                          v
+---------------------------------------------------------------------------------------+
| LAYER 2: APPLICATION & REST API LAYER (Apache Server / XAMPP)                        |
|   - Apache 2.4 HTTP Web Server (Host: localhost / 127.0.0.1)                          |
|   - PHP 8 RESTful API Controllers (`urbaneats-api/api/...`)                           |
|   - CORS Handling & Session Middleware (`config/cors.php`, `session_start()`)         |
|   - Domain Services: Auth, Restaurant, Menu, Cart, Order, Rider, Admin Controllers    |
+---------------------------------------------------------------------------------------+
                        |                                       |
          PHP Data Objects (PDO Prepared SQL)             HTTP REST / cURL
                        v                                       v
+------------------------------------+ +------------------------------------------------+
| LAYER 3: PERSISTENCE LAYER         | | LAYER 4: EXTERNAL INTEGRATIONS               |
|   - MySQL / MariaDB Database       | |   - Flutterwave Inline Payment Gateway API   |
|   - Database: `urbaneats_db`       | |   - External Image CDN / File Storage Uploads|
|   - InnoDB Engine (FK Constraints) | +------------------------------------------------+
|   - Character Set: utf8mb4_unicode |
+------------------------------------+
```

---

### 4.6 Database / Entity-Relationship (ER) Diagram Specification
The database structure is defined across 11 tables in `urbaneats_db`:

1. **`users`**: `id` (PK, INT AUTO_INC), `full_name` (VARCHAR 100), `email` (VARCHAR 150, UNIQUE), `phone` (VARCHAR 30), `password_hash` (VARCHAR 255), `role` (ENUM: customer, vendor, rider, admin), `application_status` (ENUM: APPROVED, PENDING, REJECTED), `vendor_code` (VARCHAR 50, UNIQUE), `rider_code` (VARCHAR 50, UNIQUE), `is_online` (TINYINT 1), `is_available` (TINYINT 1), `created_at` (TIMESTAMP).
2. **`restaurants`**: `id` (PK), `owner_id` (FK -> users.id), `name` (VARCHAR 150), `slug` (VARCHAR 150, UNIQUE), `description` (TEXT), `category` (VARCHAR 100), `location` (VARCHAR 255), `phone` (VARCHAR 30), `status` (ENUM: open, closed, temporarily_closed), `is_active` (TINYINT 1), `logo_url` (VARCHAR 255), `cover_url` (VARCHAR 255).
3. **`food_categories`**: `id` (PK), `name` (VARCHAR 100), `slug` (VARCHAR 100, UNIQUE), `description` (VARCHAR 255), `sort_order` (INT).
4. **`food_items`**: `id` (PK), `restaurant_id` (FK -> restaurants.id, ON DELETE CASCADE), `category_id` (FK -> food_categories.id, ON DELETE SET NULL), `name` (VARCHAR 200), `slug` (VARCHAR 200), `price` (DECIMAL 10,2), `image_url` (VARCHAR 255), `is_available` (TINYINT 1).
5. **`favorites`**: `id` (PK), `user_id` (FK -> users.id), `food_item_id` (FK -> food_items.id), UNIQUE(`user_id`, `food_item_id`).
6. **`user_addresses`**: `id` (PK), `user_id` (FK -> users.id), `label` (VARCHAR 50), `recipient_name` (VARCHAR 100), `phone` (VARCHAR 30), `address` (VARCHAR 255), `area` (VARCHAR 100), `city` (VARCHAR 50), `state` (VARCHAR 50), `is_default` (TINYINT 1).
7. **`orders`**: `id` (PK), `order_number` (VARCHAR 50, UNIQUE), `user_id` (FK -> users.id), `restaurant_id` (FK -> restaurants.id), `delivery_address_id` (FK -> user_addresses.id), `recipient_name` (VARCHAR 100), `recipient_phone` (VARCHAR 30), `delivery_address` (VARCHAR 255), `delivery_area` (VARCHAR 100), `subtotal` (DECIMAL 10,2), `delivery_fee` (DECIMAL 10,2), `total_amount` (DECIMAL 10,2), `order_status` (ENUM), `payment_status` (ENUM), `payment_reference` (VARCHAR 100).
8. **`order_items`**: `id` (PK), `order_id` (FK -> orders.id, ON DELETE CASCADE), `food_item_id` (FK -> food_items.id, ON DELETE SET NULL), `food_name` (VARCHAR 200), `quantity` (INT), `unit_price` (DECIMAL 10,2), `subtotal` (DECIMAL 10,2).
9. **`payments`**: `id` (PK), `order_id` (FK -> orders.id), `user_id` (FK -> users.id), `tx_ref` (VARCHAR 150, UNIQUE), `flw_ref` (VARCHAR 150), `amount` (DECIMAL 10,2), `status` (ENUM), `raw_response` (TEXT).
10. **`delivery_assignments`**: `id` (PK), `order_id` (FK -> orders.id, UNIQUE), `rider_id` (FK -> users.id), `status` (ENUM), `assigned_at` (TIMESTAMP), `delivered_at` (TIMESTAMP).
11. **`notifications`**: `id` (PK), `user_id` (FK -> users.id), `type` (VARCHAR 50), `title` (VARCHAR 255), `message` (TEXT), `is_read` (TINYINT 1).

---

## SECTION 5 — TECHNICAL INFRASTRUCTURE & SYSTEM SPECIFICATIONS

### 5.1 Development Environment & Software Stack
* **Operating System:** Windows 11 Enterprise (64-bit).
* **Local Web Server Environment:** XAMPP Version 8.x Stack (Apache 2.4.x HTTP Web Server, PHP 8.x Engine).
* **Frontend Runtime & Dev Server:** Node.js v20.x / Vite 6.0.5 Development Server running on `http://localhost:5173`.
* **Programming Languages:** JavaScript (ES6+ / JSX), PHP 8.x, SQL (MySQL Dialect), HTML5, CSS3.
* **Core Libraries & Frameworks:**
  - `react` (`^18.3.1`) & `react-dom` (`^18.3.1`): Declarative SPA UI library.
  - `react-router-dom` (`^6.28.0`): Client-side page router.
  - `lucide-react` (`^0.475.0`): SVG icon suite.
  - `@vitejs/plugin-react` (`^4.3.4`): Vite JSX transformer and Fast Refresh plugin.
* **Backend Database Abstraction:** Native PHP Data Objects (PDO) with prepared statements.
* **Development Tools:** Visual Studio Code / Antigravity IDE, Git Version Control, XAMPP Control Panel v3.3.0, Google Chrome Developer Tools (Network Tab, Application Cookie Inspector), cURL command-line tool.

---

### 5.2 Database Technology & Storage Mechanics
* **RDBMS Engine:** MySQL / MariaDB (`10.4.x` / `8.0.x`).
* **Default Database Name:** `urbaneats_db`.
* **Storage Engine:** `InnoDB` (Enforces transactional Integrity, ACID compliance, and Foreign Key constraints).
* **Character Set & Collation:** `utf8mb4` / `utf8mb4_unicode_ci` (Full multibyte Unicode support).
* **Indexing Strategy:** Primary Keys on all auto-increment IDs; Unique indexes on `users.email`, `restaurants.slug`, `food_categories.slug`, `orders.order_number`, `payments.tx_ref`, and `favorites(user_id, food_item_id)`; Search indexes on foreign key columns and status fields (`order_status`, `is_active`, `is_available`).

---

### 5.3 Hardware & System Resource Requirements

#### A. Developer Workstation (Minimum vs. Recommended)
| Hardware Component | Minimum Specification | Recommended Specification |
| :--- | :--- | :--- |
| **Processor (CPU)** | Intel Core i3 / AMD Ryzen 3 (Dual-Core 2.0 GHz) | Intel Core i7 / AMD Ryzen 7 (Hexa-Core 3.2 GHz+) |
| **Random Access Memory (RAM)** | 8 GB DDR4 | 16 GB DDR4 / DDR5 |
| **Storage Capacity** | 256 GB SATA SSD (2 GB free workspace) | 512 GB NVMe SSD |
| **Network Interface** | Local Loopback (`127.0.0.1`) / Wi-Fi | Local Loopback / High-Speed Broadband |

#### B. End-User Client Environment
| Client Device Type | Minimum Supported Specs | Recommended Browsers |
| :--- | :--- | :--- |
| **Desktop / Laptop** | 2 GB RAM, 1024x768 display | Chrome 110+, Edge 110+, Firefox 110+, Safari 16+ |
| **Mobile Smartphone** | iOS 14.0+ / Android 8.0+, 360px viewport | Mobile Chrome, Safari Mobile, Samsung Internet |

---

### 5.4 Implementation Approach
* **Client-Side SPA Architecture:** Decoupled frontend communicating exclusively with backend APIs via asynchronous HTTP JSON fetch calls.
* **Prepared Statement Security:** 100% of database queries pass through PHP PDO parameterized prepared statements (`$stmt->prepare()`, `$stmt->execute()`), completely eliminating SQL Injection vectors.
* **Cookie-Based Authentication:** Standardized `PHPSESSID` HTTP cookies with `SameSite=Lax` / `HttpOnly` flags managed in `config/cors.php`.

---

### 5.5 Testing & Security Verification Approach
* **Automated Security Hardening Suites:** Tested via PHP cURL scripts executing synthetic attack and RBAC verification vectors:
  - `test_phase7_hardening.php`: Verifies vendor/rider approval gates and online status security.
  - `test_phase8_hardening.php`: Verifies order cancellation status boundaries and payment status transitions.
  - `test_vendor_security_v2.php`: Asserts cross-vendor unauthorized menu mutation prevention.
  - `test_rider_security.php`: Verifies rider delivery assignment state lockouts.
* **Manual E2E Verification:** End-to-end browser walkthroughs verifying authentication state persistence, cart single-restaurant rule enforcement, responsive layout scaling, and page navigation.

---

### 5.6 Deployment & Production Staging Approach
* **Frontend Build Pipeline:** Bundling static SPA assets via Vite compiler (`npm run build`), generating minified HTML5, CSS3, and JS chunks into the `/dist` directory.
* **Backend Staging Host:** Deployment of PHP API scripts to Apache web server root (`htdocs/urbaneats-api`), with `.env` base URL pointing to production domain/IP.
* **Database Staging:** Direct execution of version-controlled SQL migration scripts (`001` to `009`) against the production MySQL server instance.

---

## SECTION 6 — THREE-TIER EMPIRICAL VERIFICATION AUDIT MATRIX

To satisfy academic defense scrutiny, this matrix strictly separates empirical codebase facts from unverified assumptions and student-required theoretical commentary.

```
+---------------------------------------------------------------------------------------------------+
|                               THREE-TIER EMPIRICAL VERIFICATION MATRIX                            |
+------------------------------------+------------------------------------+-------------------------+
| Tier 1: Strictly Verified Facts    | Tier 2: Unverified / Absent        | Tier 3: Mandatory Student|
| (Found in Codebase / DB Artifacts) | (No Empirical Artifacts in Repository)| Explanations Required   |
+------------------------------------+------------------------------------+-------------------------+
| - Exact tech stack versions (React | - Transcripts of paper surveys,    | - Defense justification |
|   18.3.1, Vite 6.0.5, React Router |   initial user interviews, or      |   for selecting RAD     |
|   6.28.0, Lucide React 0.475.0).   |   focus group notes.               |   over Waterfall/Agile. |
| - Complete DB Schema DDL (11 tables| - Real production cloud server logs| - Institutional approvals|
|   in MySQL `urbaneats_db`).        |   (AWS/DigitalOcean/Heroku).       |   from DELSU / Dept of  |
| - Custom CSS design tokens & cart  | - Live SSL certificates & paid     |   Computer Science.     |
|   conflict modal implementation.   |   production Flutterwave API keys. | - Academic rationale for|
| - 9 SQL migrations & 5 PHP security| - Physical hardware benchmarks of  |   Abraka geographic     |
|   test suites in backend repository|   local Abraka restaurant servers. |   zone selection.       |
+------------------------------------+------------------------------------+-------------------------+
```

---

## SECTION 7 — APPLICABILITY TO ACADEMIC CHAPTER 3 SECTIONS

This document directly supports the writing and drafting of the following standard academic thesis/project report sub-sections in **Chapter 3 (Methodology)**:

1. **Section 3.1 — Software Development Methodology:**
   - Directly supported by **Section 2** (RAD Methodology Mapping: Requirements Planning, User Design, Construction, Cutover).
2. **Section 3.2 — System Analysis and Design Approach:**
   - Directly supported by **Section 3** (OOAD Derivation: Actors, Use Cases, Classes, OO Design Principles).
3. **Section 3.3 — System Architecture & Modeling (UML Diagrams):**
   - Directly supported by **Section 4** (Detailed specifications for Use Case Diagram, Class Diagram, Activity Diagrams, Sequence Diagrams, System Architecture Diagram).
4. **Section 3.4 — Database Design & Schema Modeling:**
   - Directly supported by **Section 4.6** and **Section 5.2** (ER Diagram Specifications, 11 Tables, Data Types, Primary/Foreign Keys, Collations).
5. **Section 3.5 — System Requirements & Technical Specifications:**
   - Directly supported by **Section 5.1, 5.2, and 5.3** (Development Environment, Hardware/Software Specs, Frameworks, RDBMS).
6. **Section 3.6 — Implementation, Testing, & Deployment Strategy:**
   - Directly supported by **Section 5.4, 5.5, and 5.6** (SPA Architecture, Security Test Suites, Vite Compilation Pipeline, Staging Setup).
7. **Section 3.7 — Empirical Validation & Limitations:**
   - Directly supported by **Section 6** (Three-Tier Verification Matrix distinguishing verified project facts from academic commentary).

---
*End of Methodology Technical Support & Empirical Audit Document.*
