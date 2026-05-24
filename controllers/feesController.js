import { AppError } from "../utils/appError.js";
import { created, ok } from "../utils/apiResponse.js";
import { positiveNumber, requireFields } from "../utils/validators.js";
import { createPayment as createPaymentService, getFeesByStudent as getFeesByStudentService, listPayments } from "../services/paymentService.js";

export async function getFeesByStudent(req, res) {
  const record = await getFeesByStudentService(req.params.studentId);
  if (!record) {
    throw new AppError("Fees record not found.", 404);
  }
  return ok(res, record);
}

export async function getPayments(req, res) {
  const payments = await listPayments();
  return ok(res, payments);
}

export async function createPayment(req, res) {
  const { student_id, amount, method, date, transaction_id } = req.body;
  requireFields(req.body, ["student_id", "amount", "method", "date"], "payment");

  if (String(method).toUpperCase() === "UPI" && !transaction_id) {
    throw new AppError("transaction_id is required for UPI payments.", 400);
  }

  const payment = await createPaymentService({
    student_id,
    amount: positiveNumber(amount, "amount"),
    method,
    date,
    transaction_id,
  });

  return created(res, { ...payment, _id: undefined });
}
