import express from "express";
import cors from "cors";
import healthRoutes from "./routes/healthRoutes.js";
import assetRoutes from "./routes/assetRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import inspectionRoutes from "./routes/inspectionRoutes.js";
import defectRoutes from "./routes/defectRoutes.js";
import maintenanceRoutes from "./routes/maintenanceRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import { success, errorHandler } from "./middleware/response.js";
import { notFound } from "./middleware/notFound.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", healthRoutes);
app.use("/api", userRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/assets/:id/inspections", inspectionRoutes);
app.use("/api", defectRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api", dashboardRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;