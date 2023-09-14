const mongoose = require('mongoose');
mongoose.set('strictQuery', false)

const connectDb = async () => {
    const con = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log("MongoDB Connected on ", con.connection.host)
}

module.exports = connectDb;