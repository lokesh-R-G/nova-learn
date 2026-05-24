import { AppError } from "./appError.js";

export function requireFields(obj, fields, context = "request") {
  const missing = fields.filter((field) => obj[field] == null || String(obj[field]).trim() === "");
  if (missing.length) {
    throw new AppError(`Missing required ${context} field(s): ${missing.join(", ")}.`, 400, { missing });
  }
}

export function positiveNumber(value, fieldName) {
  const numberValue = Number(value);
  if (Number.isNaN(numberValue) || numberValue <= 0) {
    throw new AppError(`${fieldName} must be a positive number.`, 400);
  }
  return numberValue;
}

export function parsePagination(query, defaults = { page: 1, limit: 20, maxLimit: 200 }) {
  const page = Number.parseInt(String(query.page ?? defaults.page), 10);
  const limit = Number.parseInt(String(query.limit ?? defaults.limit), 10);

  if (Number.isNaN(page) || page < 1) {
    throw new AppError("page must be a positive integer.", 400);
  }
  if (Number.isNaN(limit) || limit < 1) {
    throw new AppError("limit must be a positive integer.", 400);
  }

  const normalizedLimit = Math.min(limit, defaults.maxLimit ?? 200);
  const skip = (page - 1) * normalizedLimit;

  return { page, limit: normalizedLimit, skip };
}
