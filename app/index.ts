import "dotenv/config"
import express, { Express } from "express"
import apiRouter from "../config/routes.conf"
import { Model } from "objection"
import db from "../config/database.conf"
import path from "path"
import cors from "cors"

const app: Express = express()

Model.knex(db)

app.use(cors({ origin: "*" }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/public", express.static(path.resolve(__dirname, "../public")))

app.use(apiRouter)

export default app
