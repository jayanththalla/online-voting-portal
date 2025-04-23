# Online Voting Portal

A secure and modern online voting system built with Next.js, MongoDB, and Tailwind CSS.

## Features

- Voter Registration with Photo Capture
- Secure Voting with Identity Verification
- Real-time Vote Counting
- Admin Dashboard for Results
- Modern UI with Tailwind CSS
- Type-safe with TypeScript
- Form Validation with Zod
- JWT Authentication

## Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Webcam access for photo capture

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd online-voting-portal
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
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

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Voting pages
│   └── (admin)/           # Admin pages
├── components/            # React components
├── hooks/                 # Custom hooks
├── lib/                   # Utility functions
├── models/               # MongoDB models
├── types/                # TypeScript types
└── utils/                # Helper functions
```

## Usage

1. **Voter Registration**
   - Navigate to the registration page
   - Fill in your details
   - Capture a photo using your webcam
   - Receive your unique voter ID

2. **Voting**
   - Use your voter ID to access the voting page
   - Select a candidate
   - Verify your identity with a photo
   - Submit your vote

3. **Admin Panel**
   - Access the admin panel
   - Login with admin credentials
   - View real-time results
   - Monitor voter registration

## Security Features

- JWT-based authentication
- Photo verification for voting
- One vote per voter
- Secure admin access
- Input validation with Zod
- Protected API routes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
