import mongoose from "mongoose";

const ConnectionDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MDB_URL);
        console.log(`\n DB Connected Successfully. DB Host: ${connect.connection.host}`)
    } catch (error) {
        console.log("DB connection Error", error);
        process.exit(1);
    }
}

export default ConnectionDB;