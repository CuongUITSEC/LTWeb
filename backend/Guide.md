# Tạo file .env
Server
PORT=9000
 Database
MONGO_URI= ?
 JWT openssl rand -hex 64
JWT_SECRET=
 Google OAuth
GOOGLE_CLIENT_ID=?
GOOGLE_CLIENT_SECRET=?
GOOGLE_CALLBACK_URL=http://localhost:9000/auth/google/callback
 Session openssl rand -base64 64
SESSION_SECRET=?

 FRONTEND_URL=http://localhost:3000
 NODE_ENV=development

# Command for run
0/ npm install - not to need
1/ 
npm dev run
2/
npm run seed
3/
node test-all-apis

# Set up for forntend
npm install react-redux @reductjs/toolkit axios
folder src adding folder redux
