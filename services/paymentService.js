import { Fees } from "../models/Fees.js";
import { Payment } from "../models/Payment.js";

export async function listPayments() {
  return Payment.find({}, { _id: 0 }).sort({ date: -1 }).lean();
}

export async function getFeesByStudent(studentId) {
  return Fees.findOne({ student_id: studentId }, { _id: 0 }).lean();
}

export async function createPayment({ student_id, amount, method, date, transaction_id }) {
  const payment = await Payment.create({
    student_id,
    amount,
    method,
    date: new Date(date),
    ...(transaction_id ? { transaction_id } : {}),
  });

  const fees = await Fees.findOne({ student_id });
  if (fees) {
    const newPaid = fees.paid + amount;
    fees.paid = newPaid;
    fees.balance = Math.max(0, fees.total_fee - newPaid);
    await fees.save();
  }

  return payment.toObject();
}
