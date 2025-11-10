Server README

Added endpoints:
- POST /api/mpesa/stk-push (protected) - initiate STK push (simulated)
- POST /api/mpesa/callback (public) - receive mpesa callback and mark donation completed
- GET/POST /api/chat - simple chat messages (POST protected)
Role middleware:
- protect middleware checks JWT and attaches user and roles from user_roles collection.
- requireRole('admin') can be used to protect admin-only routes (used on POST /api/distributions and POST /api/user_roles).
