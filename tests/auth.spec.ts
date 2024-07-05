import request from "supertest"
import app from "../app"
import { UserModel } from "../app/models/user.model"

let token: string

const user = {
  name: "John Doe",
  email: "johndoe@gmail.com",
  password: "password",
}

// Sign Up
describe("POST /api/v1/auth/sign-up", () => {
  // Success
  it("should return response with status code 201", async () => {
    await request(app)
      .post("/api/v1/auth/sign-up")
      .send(user)
      .set("Accept", "application/json")
      .expect(201)
      .expect("Content-Type", "application/json; charset=utf-8")
      .then((response) => {
        expect(response.body.status).toBe("OK")
        expect(response.body.message).toBe("Successfully sign up")
        expect(response.body.data).toEqual(
          expect.objectContaining({
            name: user.name,
            email: user.email,
          })
        )
      })
  })

  // Validation Error
  it("should return response with status code 400", async () => {
    await request(app)
      .post("/api/v1/auth/sign-up")
      .send({
        ...user,
        email: null,
      })
      .set("Accept", "application/json")
      .expect(400)
      .expect("Content-Type", "application/json; charset=utf-8")
      .then((response) => {
        expect(response.body.status).toBe("FAIL")
        expect(response.body.message).toBe("Validation error")
        expect(response.body.errors).toBeInstanceOf(Array)
      })
  })
})

// Sign In
describe("POST /api/v1/auth/sign-in", () => {
  // Success
  it("should return response with status code 200", async () => {
    await request(app)
      .post("/api/v1/auth/sign-in")
      .send({
        email: user.email,
        password: user.password,
      })
      .set("Accept", "application/json")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8")
      .then((response) => {
        expect(response.body.status).toBe("OK")
        expect(response.body.message).toBe("Successfully sign in")
        expect(response.body.data.user).toEqual(
          expect.objectContaining({
            name: user.name,
            email: user.email,
          })
        )
        token = response.body.data.token
      })
  })

  // Invalid Password
  it("should return response with status code 400", async () => {
    await request(app)
      .post("/api/v1/auth/sign-in")
      .send({
        email: user.email,
        password: "invalid",
      })
      .set("Accept", "application/json")
      .expect(400)
      .expect("Content-Type", "application/json; charset=utf-8")
      .then((response) => {
        expect(response.body.status).toBe("FAIL")
        expect(response.body.message).toBe("Invalid password")
      })
  })

  // Validation Error
  it("should return response with status code 400", async () => {
    await request(app)
      .post("/api/v1/auth/sign-in")
      .send({
        email: null,
        password: null,
      })
      .set("Accept", "application/json")
      .expect(400)
      .expect("Content-Type", "application/json; charset=utf-8")
      .then((response) => {
        expect(response.body.status).toBe("FAIL")
        expect(response.body.message).toBe("Validation error")
        expect(response.body.errors).toBeInstanceOf(Array)
      })
  })
})

// Current User
describe("GET /api/v1/user/current", () => {
  it("should return response with status code 200", async () => {
    await request(app)
      .get("/api/v1/user/current")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8")
      .then((response) => {
        expect(response.body.status).toBe("OK")
        expect(response.body.message).toBe("Successfully get current user")
        expect(response.body.data).toEqual(
          expect.objectContaining({
            name: user.name,
            email: user.email,
          })
        )
      })
  })
})

afterAll(async () => {
  await UserModel.query().where("email", user.email).delete()
})
