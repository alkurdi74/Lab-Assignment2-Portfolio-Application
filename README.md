# COMP229 Assignment 2 — Portfolio backend

Author: Mohamad Alkurdi

The existing Assignment 1 React frontend is connected to a Node.js/Express backend with Mongoose and a MongoDB database named Portfolio. Contact form submissions are stored in MongoDB. The root API response matches the assignment screenshot.

## Run

Requires Node.js 22.12 or newer and a running MongoDB service.

1. In MyPortfolio run `npm install` and `npm --prefix client install`.
2. Copy .env.example to .env. Set JWT_SECRET to a random string of at least 32 characters. Generate one using `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.
3. Default MONGODB_URI is `mongodb://127.0.0.1:27017/Portfolio`. Replace it with an Atlas URI if needed. Never commit .env.
4. Run `npm run dev` from MyPortfolio, or `npm run dev` from client. Both start Vite at http://localhost:5173 and the API at http://localhost:3000. Stop with Ctrl+C.
5. For backend only, run `node server.js`. If PORT changes, update the Vite proxy target too.

## Required APIs

All four resources support GET collection, GET /:id, POST collection, PUT /:id, DELETE /:id, and DELETE collection.

| Resource | Base URL | Fields |
|---|---|---|
| Contacts | /api/contacts | firstname, lastname, email; optional phone, message |
| Projects | /api/projects | title, firstname, lastname, email, completion, description |
| Education | /api/qualifications | title, firstname, lastname, email, completion, description |
| Users | /api/users | name, email, password; server-managed created, updated |

/api/educations is an alias for /api/qualifications. Completion values are ISO date strings in JSON and Dates in MongoDB. PUT accepts a partial set of allowed fields. Invalid input returns 400, missing records 404, duplicate user emails 409, and missing/invalid/revoked authentication 401.

## Authentication

POST /api/users registers a user. POST /auth/signin with email and password returns a one-hour JWT. Send it as Authorization: Bearer <token>. POST /auth/signout revokes all issued tokens for that user; GET /auth/signout is also provided for the course convention. /api/auth is an alias.

Public routes: root welcome, user registration, contact creation, project and qualification reads. All other routes require a valid JWT. Password changes revoke prior tokens. Passwords are salted and hashed using scrypt and never returned by the API.

This course implementation treats registered users as trusted portfolio editors; it has no administrator role or record ownership policy. Do not deploy with open registration for an unrestricted public audience without adding authorization roles.

## Verification and evidence

Run `npm test` for 79 HTTP checks against real MongoDB. The test creates and drops only a unique Portfolio_test_<timestamp> database and writes evidence/api-results.json. It never drops Portfolio. Run `npm run build` and `npm --prefix client run lint` for frontend checks.

Import postman/Portfolio.postman_collection.json into Postman. Run registration and sign-in first. Create requests save IDs automatically. The final cleanup folder is destructive and should be run manually against test data only; delete users last. The screenshot report uses actual API test output, with credentials and tokens redacted.

## Submission

Submit the companion ZIP, screenshot Word document, and your GitHub repository link. Create a repository under your GitHub account, push this project, and paste its URL into your submission. No GitHub link is fabricated or included because a repository/account was not supplied. Exclude node_modules, client/dist and .env. Both package-lock.json files are included for repeatable npm installs.

## Structure and references

server/models defines Mongoose schemas; server/controllers handles CRUD and authentication; server/routes maps endpoints; config/config.js loads environment settings; server.js connects MongoDB before listening. Shared CRUD code is reused by four named resource controllers and routers.

Implementation references: https://mongoosejs.com/docs/validation.html and https://github.com/auth0/node-jsonwebtoken .

For the console screenshot, run node server.js and capture the two startup lines confirming Portfolio and the server URL. In MongoDB Compass connect to mongodb://127.0.0.1:27017, open Portfolio, and capture contacts, projects, qualifications, and users. Create example records with Postman to display each collection’s fields.
