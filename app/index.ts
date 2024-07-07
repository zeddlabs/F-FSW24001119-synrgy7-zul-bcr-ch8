import dotenv from "dotenv"
import express, { Express } from "express"
import apiRouter from "../config/routes.conf"
import { Model } from "objection"
import db from "../config/database.conf"
import path from "path"
import cors from "cors"

dotenv.config()

const app: Express = express()

Model.knex(db)

app.use(cors({ origin: "*" }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if (process.env.NODE_ENV === "production") {
  app.use("/public", express.static(path.resolve(__dirname, "../../public")))
} else {
  app.use("/public", express.static(path.resolve(__dirname, "../public")))
}

app.use(apiRouter)

export default app
