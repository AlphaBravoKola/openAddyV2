# OpenAddy - Property Delivery Management System

OpenAddy is a web application that allows property managers to manage delivery instructions for their properties and enables delivery drivers to access these instructions and communicate with property managers.

## Features

- User authentication for both property managers and delivery drivers
- Property management (create, read, update, delete)
- Delivery instructions management
- Real-time messaging between property managers and delivery drivers
- Search functionality for properties
- Responsive and modern UI

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Prisma (PostgreSQL)
- NextAuth.js
- React

## Getting Started

### Prerequisites

- Node.js 18.x or later
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/openaddy.git
   cd openaddy
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/openaddy"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
openaddy/
├── app/
│   ├── api/              # API routes
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # Property manager dashboard
│   ├── driver-dashboard/ # Delivery driver dashboard
│   ├── properties/       # Property management pages
│   ├── providers/        # Context providers
│   ├── globals.css       # Global styles
│   └── layout.tsx        # Root layout
├── prisma/
│   └── schema.prisma     # Database schema
├── public/               # Static assets
└── ...config files
```

## Usage

### Property Managers

1. Register as a property manager
2. Log in to your account
3. Add properties with delivery instructions
4. Manage existing properties
5. Communicate with delivery drivers

### Delivery Drivers

1. Register as a delivery driver
2. Log in to your account
3. Search for properties
4. View delivery instructions
5. Communicate with property managers

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 