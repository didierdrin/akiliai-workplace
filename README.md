# Akiliai News Platform

A comprehensive news platform featuring a modern client-side website and a sophisticated admin dashboard, built with Next.js and Firebase.

## 🚀 Project Overview

Akiliai is a premium news platform that mirrors The Washington Post's sophisticated design while incorporating modern emerald color schemes and angular gradients. The platform consists of two main applications:

### 📰 Client-Side Website (`akiliai-client`)
A pixel-perfect recreation of washingtonpost.com's layout with custom branding and enhanced visual elements.

**Key Features:**
- Sophisticated masthead with elegant serif typography
- Comprehensive navigation with category dropdowns
- Three-column layout with hero sections
- Real-time article fetching from Firebase
- Responsive design for all devices
- SEO optimized with structured data
- Newsletter signup and social sharing
- Advanced search functionality

**Categories:**
- Finance (Banking & Insurance, ETFs & Mutual Funds, Fintech, Crypto)
- Tech (Energy Tech, Entrepreneurs)
- Medicine, Politics, World News, Business
- Opinion, Sports, Arts & Entertainment, Lifestyle, Weather, Local News

### 🔧 Admin Dashboard (`akiliai-dashboard`)
A comprehensive content management system with modern interface and emerald green accents.

**Key Features:**
- Role-based access control (Super Admin, Editor, Author)
- Rich text editor with full formatting options
- Category and subcategory management
- Media library with file management
- Real-time analytics dashboard
- Content scheduling and SEO tools
- User management and permissions
- Drag-and-drop interfaces

## 🛠 Technology Stack

- **Frontend**: Next.js 15.x, React 19, TypeScript
- **Styling**: Tailwind CSS with custom emerald theme
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **Charts**: Chart.js with React Chart.js 2
- **Rich Text**: React Quill
- **UI Components**: Headless UI, Lucide React
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast

## 🎨 Design System

- **Primary Colors**: Emerald green (#047857, #065f46, #064e3b)
- **Typography**: Inter (UI), Playfair Display (headlines), Lora (body text)
- **Design Elements**: Angular gradients, sophisticated shadows, clean layouts
- **Responsive**: Mobile-first approach with fluid scaling

## 📁 Project Structure

```
akiliai-workplace/
├── akiliai-client/          # Client-side Next.js app
│   ├── src/
│   │   ├── app/            # Next.js app router
│   │   ├── components/     # Reusable components
│   │   ├── hooks/          # Custom React hooks
│   │   └── utils/          # Utility functions
│   ├── lib/                # Firebase configuration
│   └── public/             # Static assets
│
├── akiliai-dashboard/       # Admin dashboard Next.js app
│   ├── src/
│   │   ├── app/            # Dashboard routes
│   │   ├── components/     # Dashboard components
│   │   ├── contexts/       # React contexts
│   │   └── hooks/          # Admin-specific hooks
│   └── lib/                # Firebase configuration
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/didierdrin/akiliai-workplace.git
   cd akiliai-workplace
   ```

2. **Install dependencies for both projects**
   ```bash
   # Install client dependencies
   cd akiliai-client
   npm install

   # Install dashboard dependencies
   cd ../akiliai-dashboard
   npm install --legacy-peer-deps
   ```

3. **Firebase Configuration**
   - Both projects use the same Firebase configuration
   - Configuration is located in `lib/firebase.js` in each project
   - Firestore collections: `articles`, `categories`, `admin_users`, `page_analytics`

4. **Run the applications**
   ```bash
   # Run client (http://localhost:3000)
   cd akiliai-client
   npm run dev

   # Run dashboard (http://localhost:3001)
   cd akiliai-dashboard
   npm run dev -- -p 3001
   ```

## 🔥 Firebase Setup

### Collections Structure

**Articles Collection (`articles`)**
- title, content, excerpt, author, authorId
- publishDate, category, subcategory, imageUrl
- tags, viewCount, readTime, featured, status
- SEO fields, timestamps

**Categories Collection (`categories`)**
- name, description, color, order
- subcategories, slug, isActive, timestamps

**Admin Users Collection (`admin_users`)**
- role, permissions, department
- lastLogin, isActive, createdBy

**Analytics Collection (`page_analytics`)**
- url, visits, timestamp, userAgent, referrer

### Security Rules
- Admin-only write access to articles and categories
- Public read access to published content
- Role-based permissions for dashboard access

## 📊 Features

### Content Management
- ✅ Create, edit, delete articles
- ✅ Rich text editor with media embedding
- ✅ Content scheduling and publishing
- ✅ SEO optimization tools
- ✅ Category and tag management
- ✅ Bulk operations

### Analytics
- ✅ Real-time visitor tracking
- ✅ Article performance metrics
- ✅ Traffic source analysis
- ✅ Geographic user distribution
- ✅ Device and browser analytics

### User Management
- ✅ Role-based access control
- ✅ Admin user creation and management
- ✅ Activity logging and audit trails
- ✅ Session management

## 🎯 Deployment

### Client Website
- Optimized for Vercel, Netlify, or any static hosting
- Environment variables for Firebase config
- Automatic builds on push

### Admin Dashboard
- Requires server-side rendering support
- Vercel recommended for seamless deployment
- Protected routes with authentication

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Didierdrin** - [GitHub](https://github.com/didierdrin)

---

Built with ❤️ using Next.js and Firebase
