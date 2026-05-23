import jwt from "jsonwebtoken";

export function signToken(payload, secret, options = {}) {
  return jwt.sign(payload, secret, { expiresIn: "7d", ...options });
}

export function verifyToken(token, secret) {
  return jwt.verify(token, secret);
}
