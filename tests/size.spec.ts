import request from "supertest"
import app from "../app"

describe("GET /api/v1/sizes", () => {
  // Get All Sizes
  it("should return response with status code 200", async () => {
    await request(app)
      .get("/api/v1/sizes")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8")
      .then((response) => {
        expect(response.body.status).toBe("OK")
        expect(response.body.message).toBe("Successfully get all sizes")
        expect(response.body.count).toBeGreaterThanOrEqual(0)
        expect(response.body.data).toBeInstanceOf(Array)
      })
  })

  // Get A Size
  it("should return response with status code 200", async () => {
    await request(app)
      .get("/api/v1/sizes/1")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8")
      .then((response) => {
        expect(response.body.status).toBe("OK")
        expect(response.body.message).toBe("Successfully get a size")
        expect(response.body.data).toBeInstanceOf(Object)
      })
  })
})
