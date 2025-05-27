# Tạo file .env
# Server
PORT=9000
# Database
MONGO_URI= ?
# JWT openssl rand -hex 64
JWT_SECRET=
# Google OAuth
GOOGLE_CLIENT_ID=?
GOOGLE_CLIENT_SECRET=?
GOOGLE_CALLBACK_URL=http://localhost:9000/auth/google/callback
# Session openssl rand -base64 64
SESSION_SECRET=?

# FRONTEND_URL=http://localhost:3000
# NODE_ENV=development