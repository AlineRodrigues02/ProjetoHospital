
// src/auth.js
export const ROLES = {
  MEDICO: "MEDICO",
  ATENDENTE: "ATENDENTE",
};

const USERS_KEY = "users";
const SESSION_KEY = "currentUser";

function loadUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); }
  catch { return []; }
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUser() {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null"); }
  catch { return null; }
}
export function setCurrentUser(u) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(u));
}
export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
}

async function sha256(str) {
  const enc = new TextEncoder();
  const data = enc.encode(str);
  const hash = await crypto.subtle.digest("SHA-256", data);
  const bytes = Array.from(new Uint8Array(hash));
  return bytes.map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function createUser({ name, username, role, password }) {
  const users = loadUsers();
  if (users.some(u => u.username.toLowerCase() == username.toLowerCase())) {
    throw new Error("Usuário já existe.");
  }
  if (![ROLES.MEDICO, ROLES.ATENDENTE].includes(role)) {
    throw new Error("Papel inválido.");
  }
  const passwordHash = await sha256(password);
  const user = { id: crypto.randomUUID(), name: name.trim(), username: username.trim(), role, passwordHash, createdAt: Date.now() };
  users.push(user);
  saveUsers(users);
  return user;
}

export async function login(username, password) {
  const users = loadUsers();
  const user = users.find(u => u.username.toLowerCase() === String(username).toLowerCase());
  if (!user) throw new Error("Usuário não encontrado.");
  const hash = await sha256(password);
  if (hash !== user.passwordHash) throw new Error("Senha incorreta.");
  setCurrentUser({ id: user.id, name: user.name, username: user.username, role: user.role });
  return getCurrentUser();
}
