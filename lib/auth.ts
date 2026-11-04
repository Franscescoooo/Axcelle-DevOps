// Helper autentikasi sisi server. Jangan di-import dari komponen client.
//
// CATATAN: penyimpanan pengguna di sini berupa file JSON (data/users.json)
// supaya mudah dipelajari dan tanpa dependensi tambahan. Cocok untuk
// development lokal. Untuk production / hosting serverless (mis. Vercel),
// ganti fungsi readUsers/writeUsers dengan database sungguhan.

import {
  createHmac,
  randomBytes,
  randomUUID,
  scrypt as scryptCb,
  timingSafeEqual,
} from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const scrypt = promisify(scryptCb) as (
  password: string,
  salt: Buffer,
  keylen: number
) => Promise<Buffer>;

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  createdAt: string;
};

export const SESSION_COOKIE = "eclipse_session";
export const SESSION_LONG = 60 * 60 * 24 * 30; // 30 hari (jika "Ingat saya")
export const SESSION_SHORT = 60 * 60 * 12; // 12 jam

const DB_PATH = path.join(process.cwd(), "data", "users.json");

/* ---------- Penyimpanan pengguna ---------- */

async function readUsers(): Promise<User[]> {
  try {
    return JSON.parse(await readFile(DB_PATH, "utf8")) as User[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

async function writeUsers(users: User[]) {
  await mkdir(path.dirname(DB_PATH), { recursive: true });
  await writeFile(DB_PATH, JSON.stringify(users, null, 2), "utf8");
}

export async function findUserByEmail(email: string) {
  const users = await readUsers();
  return users.find((u) => u.email === email.trim().toLowerCase()) ?? null;
}

export async function findUserById(id: string) {
  const users = await readUsers();
  return users.find((u) => u.id === id) ?? null;
}

/** Mengembalikan null jika email sudah terdaftar. */
export async function createUser(input: {
  name: string;
  email: string;
  phone: string;
  password: string;
}): Promise<User | null> {
  const users = await readUsers();
  if (users.some((u) => u.email === input.email)) return null;

  const user: User = {
    id: randomUUID(),
    name: input.name,
    email: input.email,
    phone: input.phone,
    passwordHash: await hashPassword(input.password),
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  await writeUsers(users);
  return user;
}

/* ---------- Kata sandi (scrypt + salt acak) ---------- */

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const key = await scrypt(password, salt, 64);
  return `${salt.toString("hex")}:${key.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [saltHex, keyHex] = stored.split(":");
  if (!saltHex || !keyHex) return false;
  const expected = Buffer.from(keyHex, "hex");
  const key = await scrypt(password, Buffer.from(saltHex, "hex"), 64);
  return key.length === expected.length && timingSafeEqual(key, expected);
}

/* ---------- Sesi (cookie bertanda tangan HMAC) ---------- */

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET belum diatur di environment.");
  }
  return "dev-only-secret-ganti-lewat-env-local";
}

function sign(payload: string) {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function createSessionToken(userId: string, maxAgeSec: number) {
  const payload = Buffer.from(
    JSON.stringify({ sub: userId, exp: Math.floor(Date.now() / 1000) + maxAgeSec })
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

/** Mengembalikan id pengguna jika token valid dan belum kedaluwarsa. */
export function verifySessionToken(token: string): string | null {
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;

  const a = Buffer.from(sig);
  const b = Buffer.from(sign(payload));
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const { sub, exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (typeof sub !== "string" || typeof exp !== "number") return null;
    if (exp < Math.floor(Date.now() / 1000)) return null;
    return sub;
  } catch {
    return null;
  }
}
