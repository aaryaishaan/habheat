import app from "./app.js";
import { connectdb } from "./config/db.js";

const PORT = 5000;

const startServer = async(): Promise<void> =>{
  await connectdb();


    app.listen(PORT, ()=>{
    console.log(`Server is running on port no. ${PORT}`)
})
}
startServer();
