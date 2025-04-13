import { Router } from "express";
import feedRoutes from "./feedRoutes";

const routes = Router();

routes.use("/feeds", feedRoutes);

export default routes;