const express = require("express")
const server = express()
require("dotenv").config()
const PORT = process.env.PORT || 8080
const Pool = require("pg").Pool
server.use(express.json())


const pool = new Pool({
    user: "postgres",
    password: "1234",
    database: "jalol",
    host: "localhost",
    port: 5432
})


// Get all User
server.get('/user', async (req, res) => {
    try {
        const Users = await pool.query(`SELECT * FROM xasanboy`)
        res.status(200).json(Users.rows)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Create a new User 
server.post("/user", async (req, res) => {
    try {
        const NewUser = req.body
        if (NewUser.name !== undefined && NewUser.surname !== undefined && NewUser.birthday !== undefined && NewUser.email !== undefined && NewUser.country !== undefined) {
            const all = await pool.query(`SELECT * FROM xasanboy`).rows
            let arr = []
            for (let r in all) {
                if (all.name == NewUser.name && all.surname == NewUser.surname && all.email == NewUser.email) {
                    arr.push(NewUser)
                }
            }
            if (arr.length == 0) {
                await pool.query(`INSERT INTO xasanboy (name,surname,birthday,email,country) VALUES ($1,$2,$3,$4,$5)`, [NewUser.name, NewUser.surname, NewUser.birthday, NewUser.email, NewUser.country])
                return res.status(201).json("Your Data has Created")
            }
        }
        res.status(400).json({ message: "In your DATA has a problem!" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
// Delete All user
server.delete("/user", async (req, res) => {
    try {
        await pool.query(`DELETE FROM xasanboy`)
        const ALL = await pool.query(`SELECT * FROM xasanboy`)
        res.status(200).json(ALL.rows)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
server.listen(PORT, () => {
    console.log(`Server: http://localhost:${PORT}`)
})