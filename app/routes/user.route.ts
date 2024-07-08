import { Router } from "express"
import controllers from "../controllers"
import upload from "../middlewares/multer.middleware"
import { checkSchema } from "express-validator"
import {
  createUserValidationSchema,
  updateUserValidationSchema,
} from "../schemas/user.schema"
import {
  isAdmin,
  isSuperAdmin,
  jwtValidation,
} from "../middlewares/auth.middleware"

const userRouter: Router = Router()

userRouter
  .route("/users")
  .get(
    jwtValidation as any,
    isAdmin as any,
    controllers.api.v1.userController.index
  )
  .post(
    jwtValidation as any,
    isSuperAdmin as any,
    upload.single("avatar"),
    checkSchema(createUserValidationSchema),
    controllers.api.v1.userController.store
  )

userRouter
  .route("/users/:id")
  .get(
    jwtValidation as any,
    isAdmin as any,
    controllers.api.v1.userController.show
  )
  .put(
    jwtValidation as any,
    isSuperAdmin as any,
    upload.single("avatar"),
    checkSchema(updateUserValidationSchema),
    controllers.api.v1.userController.update
  )
  .delete(
    jwtValidation as any,
    isSuperAdmin as any,
    controllers.api.v1.userController.destroy
  )

userRouter
  .route("/user/current")
  .get(jwtValidation as any, controllers.api.v1.userController.current as any)

export default userRouter
