const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

const registerRoutes = require('./Routes/registerRoutes');
const loginRoutes = require('./Routes/loginRoutes');
const userRoutes = require('./Routes/userRoutes');
const performerRoutes = require('./Routes/PerformerRoutes');
const OrganizerRoutes = require('./Routes/OrganizerRoutes');
const OrganizerScheduleRouter = require('./Routes/OrganizerSchelduleRoutes'); 
const EmailSenderRoutes = require('./Routes/EmailSenderRoutes'); 

app.use(cors());
app.use(express.json());

const PORT = 3001;
const HOST = "localhost";

const connectToDatabase = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/StageSync");
        console.log("Database connected");
    } catch (error) {
        console.error("Error connecting to the database:", error.message);
    }
};

// Call the function to connect to the database
connectToDatabase();

// Use routers
app.use(registerRoutes);
app.use(loginRoutes);
app.use(userRoutes);
app.use(performerRoutes)
app.use(OrganizerRoutes)
app.use(EmailSenderRoutes)


app.use(OrganizerScheduleRouter)


// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    

const startServer = async () => {
    try {
        await app.listen(PORT, HOST);
        console.log(`Server is running on port http://${HOST}:${PORT}`);
    } catch (error) {
        console.error("Error starting the server:", error.message);
    }
};

// Call the function to start the server
startServer();
