const express = require('express');
const app = express();
const dotenv = require('dotenv'); // menyimpan value kedalam environtment variable
dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());

// DB Check Connection
const { dbConf } = require('./config/database')

dbConf.getConnection((error, connection)=>{
    if(error){
        console.log("Error MySQL Connection", error.message, error.sqlMessage);
    }

    console.log(`Connected to MySQL Server ✅ : ${connection.threadId}`)
})

app.get('/', (req, res) => {
    res.status(200).send("<h1>JCAHLS Ecommerce API</h1>");
});

const { userRouter } = require('./routers');
app.use('/users', userRouter);

app.listen(PORT, () => console.log(`Running API at PORT ${PORT}`));