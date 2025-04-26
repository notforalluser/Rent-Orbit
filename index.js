const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const cloudinary = require('cloudinary').v2;
const tenantRouter = require("./routes/tenantRoutes");
const landlordRouter = require("./routes/landlordRoutes");
const roomRouter = require("./routes/roomRoutes");
const requestRoutes = require('./routes/requestRoutes');
const notificationRouter = require("./routes/notificationRoute");
const complainRouter = require("./routes/complaintRoutes");

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/tenants", tenantRouter);
app.use("/api/landlord", landlordRouter);
app.use("/api/room", roomRouter);
app.use('/api/requests', requestRoutes);
app.use('/api/complaints', complainRouter);
app.use('/api/notifications', notificationRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));