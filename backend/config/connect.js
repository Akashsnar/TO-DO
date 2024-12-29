import mongoose from "mongoose"
import dotenv from "dotenv";
dotenv.config();

mongoose.set('strictQuery', true);

export const connection = async () =>{
    await mongoose.connect(process.env.MONGOURL).then(() =>{
        console.log({msg : "Connection Successfully!"});
    }).catch((error) =>{
        console.log({msg : "Connection Failed!", error});
    })

}