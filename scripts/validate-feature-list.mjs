#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const featurePath = resolve(root, 'feature_list.json');
const decisionsPath = resolve(root, 'decisions.json');

const errors = [];
const warns = [];

function load(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (e) {
    errors.push(`No se pudo parsear ${path}: ${e.message}`);
    return null;
  }
}

const feat = load(featurePath);
const dec = load(decisionsPath);

if (feat) {
  const validStatus = new Set(['pending', 'in_progress', 'done', 'blocked']);
  const validPriority = new Set(['high', 'medium', 'low']);
  const ids = new Set();
  let inProgress = 0;

  for (const f of feat.features ?? []) {
    if (!f.id || !/^F-\d{2,3}$/.test(f.id)) {
      errors.push(`Feature con id inválido: ${JSON.stringify(f.id)}`);
    }
    if (ids.has(f.id)) errors.push(`Feature id duplicado: ${f.id}`);
    ids.add(f.id);

    if (!validStatus.has(f.status)) errors.push(`${f.id}: status inválido ${f.status}`);
    if (!validPriority.has(f.priority)) errors.push(`${f.id}: priority inválido ${f.priority}`);
    if (!f.title || f.title.length < 3) errors.push(`${f.id}: title vacío o muy corto`);
    if (!f.summary) errors.push(`${f.id}: falta summary`);
    if (!f.source) errors.push(`${f.id}: falta source`);

    if (f.status === 'in_progress') inProgress++;
    if (f.status === 'blocked' && !f.blocker) {
      errors.push(`${f.id}: blocked sin campo 'blocker' que explique`);
    }
    if (f.status === 'done' && f.pr == null) {
      warns.push(`${f.id}: done sin PR linkeado`);
    }

    for (const dep of f.depends_on ?? []) {
      if (!ids.has(dep) && !(feat.features ?? []).some(x => x.id === dep)) {
        errors.push(`${f.id}: depende de ${dep} que no existe`);
      }
    }
  }

  if (inProgress > 1) {
    errors.push(`Hay ${inProgress} features en in_progress (máximo 1). Una feature a la vez.`);
  }

  console.log(`feature_list.json: ${feat.features?.length ?? 0} features, ${inProgress} in_progress`);
}

if (dec) {
  const validStatus = new Set(['pending', 'resolved', 'deferred']);
  const ids = new Set();
  for (const d of dec.decisions ?? []) {
    if (!d.id || !/^D-\d{2,3}$/.test(d.id)) {
      errors.push(`Decision con id inválido: ${JSON.stringify(d.id)}`);
    }
    if (ids.has(d.id)) errors.push(`Decision id duplicado: ${d.id}`);
    ids.add(d.id);

    if (!validStatus.has(d.status)) errors.push(`${d.id}: status inválido ${d.status}`);
    if (d.status === 'resolved' && !d.resolution) {
      errors.push(`${d.id}: resolved sin campo 'resolution'`);
    }
  }
  console.log(`decisions.json: ${dec.decisions?.length ?? 0} decisions`);
}

if (warns.length) {
  console.warn('\nWarnings:');
  for (const w of warns) console.warn(`  [WARN] ${w}`);
}

if (errors.length) {
  console.error('\nErrors:');
  for (const e of errors) console.error(`  [FAIL] ${e}`);
  process.exit(1);
}

console.log('\n[OK] feature_list.json y decisions.json válidos');
