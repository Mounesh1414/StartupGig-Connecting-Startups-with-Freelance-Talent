import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    startup: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" }
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
