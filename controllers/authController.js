import { signToken } from "../services/tokenService.js";
import { findUserByRole, isAdminRole } from "../services/authService.js";

export async function login(req, res) {
  const { role, identifier, access_code } = req.body;
  if (!role || !identifier) {
    return res.status(400).json({ error: "role and identifier are required." });
  }

  const normalizedRole = String(role).toLowerCase();

  if (isAdminRole(normalizedRole)) {
    const expected = process.env.ADMIN_ACCESS_CODE;
    if (!expected) {
      return res.status(500).json({ error: "ADMIN_ACCESS_CODE not configured." });
    }
    if (access_code !== expected) {
      return res.status(401).json({ error: "Invalid access code." });
    }

    const token = signToken({ sub: identifier, role: normalizedRole }, process.env.JWT_SECRET);
    return res.status(200).json({ token, role: normalizedRole });
  }

  const user = await findUserByRole(normalizedRole, identifier);
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  const token = signToken({ sub: identifier, role: normalizedRole, name: user.name }, process.env.JWT_SECRET);
  return res.status(200).json({ token, role: normalizedRole, name: user.name });
}

export async function me(req, res) {
  res.status(200).json({ user: req.user });
}
