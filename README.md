# Setup Guide

## Prerequisites

- **Node.js**: v16.13.1 or higher
- **npm** or **yarn**: For package management
- **MongoDB Atlas**: For database (or local MongoDB for development)

## Environment Configuration

### Backend Setup

1. Navigate to the `back_end` directory:
```bash
cd back_end
```

2. Copy the environment template:
```bash
cp .env.default .env
```

3. Edit `.env` and fill in your actual values:
```env
ATLAS_URI="mongodb+srv://username:password@cluster.mongodb.net/retail_dashboard"
JWT_SECRET="your-very-secure-random-string-change-this"
PORT=5001
CURRENCY_API_KEY="your-currency-api-key"
```

**Important**: 
- Never commit `.env` to version control (it's in `.gitignore`)
- Use a strong, random string for `JWT_SECRET` in production
- Get `CURRENCY_API_KEY` from https://currencyapi.com or similar service
- Use MongoDB Atlas connection string for `ATLAS_URI`

### Frontend Setup

1. Navigate to the `front_end` directory:
```bash
cd front_end
```

2. Copy the environment template:
```bash
cp .env.default .env
```

3. Configure the API URL (usually doesn't need changes for local development):
```env
REACT_APP_API_URL=http://localhost:5001
```

For production, update this to your production backend URL.

## Installation

### Install Dependencies

From the root directory:
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd back_end && npm install

# Install frontend dependencies
cd ../front_end && npm install
```

Or with yarn:
```bash
yarn install:all
```

## Running the Application

### Development Mode (Recommended)

From the root directory, run both backend and frontend simultaneously:
```bash
yarn start:dev
```

This starts:
- **Backend**: http://localhost:5001
- **Frontend**: http://localhost:3006

### Production Mode

```bash
NODE_ENV=production yarn start
```

## Default Demo Accounts

The application includes demo accounts for testing:

- **Demo User**: 
  - Username: `demo`
  - Password: `demo123`

- **Admin User** (if created):
  - Username: `admin`
  - Password: `admin123`

## Security Checklist Before Deployment

- [ ] Changed `JWT_SECRET` to a strong random string
- [ ] Updated `ATLAS_URI` with production MongoDB credentials
- [ ] Updated `REACT_APP_API_URL` to production backend URL
- [ ] Verified `.env` files are in `.gitignore`
- [ ] Removed any sensitive data from committed files
- [ ] Set appropriate CORS origins in backend for production domains
- [ ] Enabled HTTPS in production
- [ ] Set secure cookie flags for production

## Troubleshooting

### Port Already in Use

If port 5001 is already in use:
```bash
# Kill the process using the port
lsof -i :5001 -t | xargs kill -9

# Or specify a different port in .env
PORT=5002
```

### MongoDB Connection Issues

- Verify `ATLAS_URI` is correct
- Check IP whitelist in MongoDB Atlas (add your IP)
- Ensure credentials are correct
- Test connection string in MongoDB Compass

### CORS Errors

The backend CORS is configured for local development (`localhost:3006` and `localhost:3000`). For production, update the CORS settings in `back_end/server.js`.

## Environment Variables Reference

### Backend (.env)

| Variable | Purpose | Example |
|----------|---------|---------|
| `ATLAS_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `JWT_SECRET` | Secret key for JWT signing | Use `openssl rand -hex 32` to generate |
| `PORT` | Server port | `5001` |
| `CURRENCY_API_KEY` | Currency conversion API key | Get from currencyapi.com |

### Frontend (.env)

| Variable | Purpose | Example |
|----------|---------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:5001` or production URL |

## Security Notes

⚠️ **Never commit `.env` files to version control!**

Both `.env` patterns are in `.gitignore`:
- `back_end/.gitignore`
- `front_end/.gitignore`

If `.env` was accidentally committed:
1. Remove from git history: `git rm --cached .env`
2. Force commit: `git commit -m "Remove .env file"`
3. Rotate all secrets immediately
4. Review git history for leaks

## Getting Help

- Check application logs for error messages
- Verify all environment variables are set correctly
- Ensure MongoDB Atlas is accessible from your IP
- Check that both frontend and backend ports are available
