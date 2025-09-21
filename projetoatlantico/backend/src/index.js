import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

function triageColor(text='') {
  const t = String(text).toLowerCase();
  if (/parada|inconsciente|sangramento|dor\s*forte|urgente|falta de ar|desmaio/.test(t)) return 'VERMELHO';
  if (/febre|fratura|queda|tontura|moderado|vômito|diarreia/.test(t)) return 'AMARELO';
  return 'VERDE';
}

// AUTH
app.post('/auth/login', async (req, res) => {
  const schema = z.object({ username: z.string().min(1), password: z.string().min(1) });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Dados inválidos' });
  const { username, password } = parse.data;

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return res.status(401).json({ error: 'Usuário não encontrado' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Senha inválida' });
  res.json({ id: user.id, name: user.name, username: user.username, role: user.role });
});

// Criar paciente + visita (triagem)
app.post('/patients', async (req, res) => {
  const schema = z.object({ name: z.string().min(1), reason: z.string().optional() });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Dados inválidos' });
  const { name, reason = '' } = parse.data;

  const patient = await prisma.patient.create({ data: { name } });
  const visit = await prisma.visit.create({
    data: {
      patientId: patient.id,
      reason,
      color: triageColor(reason),
      status: 'TRIAGEM',
    },
    include: { patient: true, doctor: true },
  });
  res.status(201).json(visit);
});

// Listar visitas (fila/histórico)
app.get('/patients', async (req, res) => {
  const { status } = req.query;
  const where = {};
  if (status) where.status = status;
  const visits = await prisma.visit.findMany({
    where,
    orderBy: [{ createdAt: 'asc' }],
    include: { patient: true, doctor: true },
  });
  res.json(visits);
});

// Iniciar atendimento
app.post('/attend/:id/start', async (req, res) => {
  const { id } = req.params;
  const schema = z.object({ doctorId: z.string().min(1) });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Dados inválidos' });
  const { doctorId } = parse.data;

  const visit = await prisma.visit.update({
    where: { id },
    data: { status: 'ATENDIMENTO', startedAt: new Date(), doctorId },
    include: { patient: true, doctor: true },
  });
  res.json(visit);
});

// Concluir atendimento
app.post('/attend/:id/finish', async (req, res) => {
  const { id } = req.params;
  const visit = await prisma.visit.update({
    where: { id },
    data: { status: 'CONCLUIDO', endedAt: new Date() },
    include: { patient: true, doctor: true },
  });
  res.json(visit);
});

// Histórico (com filtros simples)
app.get('/history', async (req, res) => {
  const { name, from, to, status } = req.query;
  const where = {};
  if (status) where.status = status;
  if (name) where.patient = { name: { contains: String(name), mode: 'insensitive' } };
  if (from || to) {
    where.startedAt = {};
    if (from) where.startedAt.gte = new Date(from + 'T00:00:00');
    if (to) where.startedAt.lte = new Date(to + 'T23:59:59');
  }
  const visits = await prisma.visit.findMany({
    where,
    orderBy: [{ startedAt: 'asc' }],
    include: { patient: true, doctor: true },
  });
  res.json(visits);
});

// Relatório
app.get('/reports', async (_req, res) => {
  const visits = await prisma.visit.findMany({ include: { patient: true, doctor: true } });
  const byDoctor = {};
  const byPriority = { VERMELHO: 0, AMARELO: 0, VERDE: 0 };
  let waits = [];
  for (const v of visits) {
    const docKey = v.doctor ? v.doctor.name : '—';
    if (v.status === 'CONCLUIDO') byDoctor[docKey] = (byDoctor[docKey] || 0) + 1;
    byPriority[v.color] = (byPriority[v.color] || 0) + 1;
    if (v.startedAt && v.createdAt) waits.push(new Date(v.startedAt).getTime() - new Date(v.createdAt).getTime());
  }
  const avgWaitMinutes = waits.length ? Number((waits.reduce((a,b)=>a+b,0)/waits.length/60000).toFixed(1)) : 0;
  res.json({ byDoctor, byPriority, avgWaitMinutes, total: visits.length });
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`API http://localhost:${PORT}`));
