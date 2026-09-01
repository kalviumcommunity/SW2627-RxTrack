import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { ENV } from "../config/env";
import { userRepository } from "../repositories/user.repository";
import { ConflictError, UnauthorizedError } from "../utils/errors";
import type { JwtPayload } from "../types/auth";
import type { RegisterInput, LoginInput } from "../validators/auth.validator";

const SALT_ROUNDS = 10;

// ── JWT token generation ──────────────────────────────
function generateToken(payload: JwtPayload): string {
  const options: SignOptions = {
    // cast avoids the @types/jsonwebtoken@9 gotcha (see note below)
    expiresIn: ENV.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, ENV.JWT_SECRET, options);
}

function toPayload(user: { id: string; email: string; role: JwtPayload["role"] }): JwtPayload {
  return { sub: user.id, email: user.email, role: user.role };
}

function publicUser(user: {
  id: string; name: string; email: string; role: JwtPayload["role"]; createdAt: Date;
}) {
  // never leak passwordHash back to the client
  return { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt };
}

export const authService = {
  async register(input: RegisterInput) {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) {
      throw new ConflictError("An account with this email already exists");
    }

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

    const user = await userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
    });

    return { token: generateToken(toPayload(user)), user: publicUser(user) };
  },

  async login(input: LoginInput) {
    const user = await userRepository.findByEmail(input.email);
    // same message whether the email is unknown or the password is wrong —
    // this prevents attackers from discovering which emails are registered
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedError("Invalid email or password");
    }

    return { token: generateToken(toPayload(user)), user: publicUser(user) };
  },
};