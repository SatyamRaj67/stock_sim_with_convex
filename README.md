# T3 + Next.js + NextAuth + Convex + tRPC Template

A modern, type-safe full-stack application template that integrates:

- **Next.js 14** with App Router
- **NextAuth.js v5** for authentication
- **Convex** as the backend database and real-time sync
- **tRPC** for end-to-end type safety
- **TypeScript** throughout the entire stack

## 🚀 Features

- ✅ **Authentication** with NextAuth.js (Google, GitHub, Credentials)
- ✅ **Real-time Database** with Convex
- ✅ **Type-safe API** with tRPC
- ✅ **Two-Factor Authentication** support
- ✅ **Email Verification** system
- ✅ **Password Reset** functionality
- ✅ **Role-based Access Control** (Admin/User)
- ✅ **Responsive Design** with modern UI components

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
├── convex/                 # Convex backend functions
│   ├── schema.ts          # Database schema
│   ├── user.ts            # User operations
│   ├── authAdapter.ts     # NextAuth Convex adapter
│   └── ...                # Other database operations
├── server/                # Server-side logic
│   └── auth/              # NextAuth configuration
├── lib/                   # Utility functions
├── types/                 # TypeScript type definitions
└── actions/              # Server actions
```

## 🛠️ Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env.local` file:

```env
# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_ID="your-github-id"
GITHUB_SECRET="your-github-secret"

# Convex
NEXT_PUBLIC_CONVEX_URL="your-convex-deployment-url"
CONVEX_DEPLOY_KEY="your-convex-deploy-key"
CONVEX_AUTH_ADAPTER_SECRET="your-adapter-secret"

# Email (optional - for verification/reset emails)
RESEND_API_KEY="your-resend-api-key"
```

### 3. Generate Keys
Generate the required authentication keys:

```bash
node generateKeys.mjs
```

Copy the output to your environment variables.

### 4. Setup Convex
```bash
npx convex dev
```

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Authentication

This template includes a complete authentication system with:

- **Multiple Providers**: Google, GitHub, and email/password
- **Email Verification**: Users must verify their email before accessing the app
- **Two-Factor Authentication**: Optional 2FA with time-based codes
- **Password Reset**: Secure password reset via email
- **Role Management**: Admin and User roles with different permissions

### NextAuth + Convex Integration

Special thanks to **[Michal Srb](https://github.com/michalsrb)** for creating the [NextAuth Convex adapter](https://stack.convex.dev/nextauth-adapter) that makes this integration possible. This adapter allows NextAuth.js to work seamlessly with Convex as the backend database.

## 🗄️ Database Schema

The Convex schema includes all necessary tables for authentication:

- **Users**: Store user profile information
- **Accounts**: OAuth account linking
- **Sessions**: User session management
- **Verification Tokens**: Email verification
- **Two Factor Tokens**: 2FA code storage
- **Password Reset Tokens**: Secure password reset
- **Two Factor Confirmations**: 2FA confirmation tracking

## 🔧 Key Technologies

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety throughout
- **Tailwind CSS**: Utility-first styling
- **React Hook Form**: Form handling with validation

### Backend
- **Convex**: Real-time database with type safety
- **NextAuth.js**: Authentication library
- **tRPC**: End-to-end type safety
- **Zod**: Schema validation

### Authentication Flow
1. User signs in via OAuth or credentials
2. NextAuth validates credentials
3. Convex adapter stores/retrieves user data
4. JWT tokens include Convex authentication
5. Real-time sync across all user sessions

## 🚀 Deployment

### Deploy to Convex
```bash
npx convex deploy
```

### Deploy to Vercel
```bash
npm run build
npx vercel deploy
```

Make sure to add all environment variables to your deployment platform.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **[Michal Srb](https://github.com/michalsrb)** for the [NextAuth Convex adapter](https://stack.convex.dev/nextauth-adapter)
- **[Convex Team](https://convex.dev)** for the amazing real-time database
- **[NextAuth.js Team](https://next-auth.js.org)** for the authentication library
- **[Vercel](https://vercel.com)** for Next.js and deployment platform

---

**Ready to build something amazing?** 🚀

This template gives you a production-ready foundation with authentication, real-time data, and type safety built-in. Focus on building your unique features instead of boilerplate code.