const express = require("express");
const path = require("path");
const cors = require("cors");

 
const adminRoutes = require('./routes/adminroutes');
const userRoutes=require('./routes/userdataroutes');
const carouselRoutes=require('./routes/carouselroutes');

 
 
const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 
app.use(express.json());
app.use(cors()); 
 
app.use('/admin', adminRoutes);
app.use('/user',userRoutes);
app.use('/carousel',carouselRoutes);



app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
