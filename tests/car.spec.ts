import request from "supertest"
import app from "../app"
import { CarModel } from "../app/models/car.model"

let token: string

const car = {
  name: "Car Test",
  rent_per_day: 100000,
  size_id: 1,
}

const testImage = `${__dirname}/images/test-image.jpg`

const admin = {
  email: "admin@bcr.com",
  password: "admin",
}

// Sign In as Admin
describe("POST /api/v1/auth/sign-in", () => {
  it("should return response with status code 200", async () => {
    await request(app)
      .post("/api/v1/auth/sign-in")
      .send(admin)
      .set("Accept", "application/json")
      .then((response) => {
        token = response.body.data.token
      })
  })
})

// Cars
describe("GET /api/v1/cars", () => {
  // Get All Cars
  it("should return response with status code 200", async () => {
    await request(app)
      .get("/api/v1/cars")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8")
      .then((response) => {
        expect(response.body.status).toBe("OK")
        expect(response.body.message).toBe("Successfully get all cars")
        expect(response.body.count).toBeGreaterThanOrEqual(0)
        expect(response.body.data).toBeInstanceOf(Array)
      })
  })

  // Get A Car
  it("should return response with status code 200", async () => {
    await request(app)
      .get("/api/v1/cars/1")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8")
      .then((response) => {
        expect(response.body.status).toBe("OK")
        expect(response.body.message).toBe("Successfully get a car")
        expect(response.body.data).toBeInstanceOf(Object)
      })
  })

  // Get A Car Not Found
  it("should return response with status code 404", async () => {
    await request(app)
      .get("/api/v1/cars/999")
      .expect(404)
      .expect("Content-Type", "application/json; charset=utf-8")
      .then((response) => {
        expect(response.body.status).toBe("FAIL")
        expect(response.body.message).toBe("Car not found")
      })
  })

  // Store A Car
  it("should return response with status code 201", async () => {
    await request(app)
      .post("/api/v1/cars")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "multipart/form-data")
      .field("name", car.name)
      .field("rent_per_day", car.rent_per_day)
      .field("size_id", car.size_id)
      .attach("image", testImage)
      .expect(201)
      .expect("Content-Type", "application/json; charset=utf-8")
      .then((response) => {
        expect(response.body.status).toBe("OK")
        expect(response.body.message).toBe("Successfully create a new car")
        expect(response.body.data).toBeInstanceOf(Object)
      })
  })
})

afterAll(async () => {
  await CarModel.query().where("name", car.name).delete()
})
