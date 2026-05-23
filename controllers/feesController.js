import { Fees } from "../models/Fees.js";
import { Payment } from "../models/Payment.js";

export async function getFeesByStudent(req, res) {
  const record = await Fees.findOne({ student_id: req.params.studentId }, { _id: 0 }).lean();
  if (!record) {
    return res.status(404).json({ error: "Fees record not found." });
  }
  return res.status(200).json({ data: record });
}

export async function createPayment(req, res) {
  const { student_id, amount, method, date } = req.body;
  if (!student_id || amount == null || !method || !date) {
    return res.status(400).json({ error: "student_id, amount, method, and date are required." });
  }

  const paidAmount = Number(amount);
  if (Number.isNaN(paidAmount) || paidAmount <= 0) {
    return res.status(400).json({ error: "amount must be a positive number." });
  }

  const payment = await Payment.create({
    student_id,
    amount: paidAmount,
    method,
    date: new Date(date),
  });

  const fees = await Fees.findOne({ student_id });
  if (fees) {
    const newPaid = fees.paid + paidAmount;
    fees.paid = newPaid;
    fees.balance = Math.max(0, fees.total_fee - newPaid);
    await fees.save();
  }

  return res.status(201).json({ data: { ...payment.toObject(), _id: undefined } });
}
