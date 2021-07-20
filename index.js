const express = require('express')
const mongoose = require('mongoose')
const autRouter = require('./router/authRouter')

const PORT = process.env.PORT || 5000

const app = express()



app.use(express.json())
app.use('/auth', autRouter)

const start = async () => {
    try {
        await mongoose.connect('mongodb+srv://mongo:mongo@cluster0.roihl.mongodb.net/auth-system-express', { useUnifiedTopology: true })
        app.listen(PORT, () => console.log(`server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()