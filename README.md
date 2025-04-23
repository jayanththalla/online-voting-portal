# Online Voting Portal

A secure, modern, and user-friendly online voting system built with Next.js 14, MongoDB, and Tailwind CSS. This platform enables secure electronic voting with features like photo verification, real-time results, and comprehensive admin controls.

![Online Voting Portal](public/images/online-vote.png)

## 🌟 Key Features

- **Secure Authentication**
  - JWT-based authentication system
  - Photo verification for voting
  - One vote per voter policy
  - Protected API routes

- **Voter Management**
  - Easy voter registration
  - Webcam photo capture
  - Unique voter ID generation
  - Voter verification system

- **Voting System**
  - Real-time vote counting
  - Secure ballot submission
  - Photo verification during voting
  - Vote confirmation system

- **Admin Dashboard**
  - Real-time results monitoring
  - Voter registration management
  - Candidate management
  - System statistics

- **Modern Tech Stack**
  - Next.js 14 with App Router
  - TypeScript for type safety
  - MongoDB for data storage
  - Tailwind CSS for styling
  - Zod for validation
  - Shadcn UI components

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Webcam access for photo capture

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jayanththalla/online-voting-portal.git
cd online-voting-portal
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/voting-portal
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── admin/        # Admin API endpoints
│   │   ├── auth/         # Authentication endpoints
│   │   └── vote/         # Voting endpoints
│   ├── (auth)/           # Authentication pages
│   ├── (dashboard)/      # Voting pages
│   └── (admin)/          # Admin pages
├── components/            # React components
│   └── ui/               # UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── models/              # MongoDB models
├── types/               # TypeScript types
└── utils/               # Helper functions
```

## 🔐 Security Features

- **Authentication & Authorization**
  - JWT-based secure authentication
  - Role-based access control
  - Protected API routes
  - Session management

- **Voting Security**
  - Photo verification system
  - One vote per voter enforcement
  - Secure ballot submission
  - Vote encryption

- **Data Protection**
  - Input validation with Zod
  - XSS protection
  - CSRF protection
  - Rate limiting

## 👥 User Guide

### For Voters
1. **Registration**
   - Visit the registration page
   - Fill in personal details
   - Capture a photo using webcam
   - Receive unique voter ID

2. **Voting Process**
   - Login with voter ID
   - Verify identity with photo
   - Select candidate
   - Confirm and submit vote

### For Administrators
1. **Dashboard Access**
   - Login to admin panel
   - View system statistics
   - Monitor voter registration
   - Track voting progress

2. **Management**
   - Add/remove candidates
   - View real-time results
   - Generate reports
   - Manage voter database

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Zod](https://zod.dev/)

## 📧 Contact

Jayanth Thalla - [@jayanththalla](https://github.com/jayanththalla)

Project Link: [https://github.com/jayanththalla/online-voting-portal](https://github.com/jayanththalla/online-voting-portal)
