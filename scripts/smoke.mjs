#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

const PORT = process.env.SMOKE_PORT || '3010';
const BASE = `http://127.0.0.1:${PORT}`;
const ROUTES = ['/', '/posts', '/projects', '/skills', '/achievements', '/contact', '/api/health'];

function waitForReady(child, timeoutMs = 45000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Timed out waiting for next start')), timeoutMs);
    const onData = (buf) => {
      const text = buf.toString();
      if (text.includes('Ready') || text.includes('started server')) {
        clearTimeout(timer);
        child.stdout?.off('data', onData);
        child.stderr?.off('data', onData);
        resolve(undefined);
      }
    };
    child.stdout?.on('data', onData);
    child.stderr?.on('data', onData);
  });
}

async function main() {
  const child = spawn('npx', ['next', 'start', '-p', PORT], {
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, NODE_OPTIONS: '--dns-result-order=ipv4first' },
  });

  let output = '';
  child.stdout.on('data', (buf) => {
    output += buf.toString();
  });
  child.stderr.on('data', (buf) => {
    output += buf.toString();
  });

  try {
    await waitForReady(child);
    await sleep(500);

    const failures = [];
    for (const route of ROUTES) {
      const res = await fetch(`${BASE}${route}`, { redirect: 'manual' });
      if (res.status < 200 || res.status >= 400) {
        failures.push(`${route} returned ${res.status}`);
        continue;
      }
      if (route === '/posts') {
        const html = await res.text();
        if (html.includes('TypeError: fetch failed')) {
          failures.push('/posts rendered a fetch error');
        }
      }
    }

    if (failures.length) {
      console.error(failures.join('\n'));
      throw new Error(`Smoke tests failed:\n${failures.join('\n')}`);
    }

    console.log(`Smoke tests passed for ${ROUTES.join(', ')}`);
  } finally {
    child.kill('SIGTERM');
    await sleep(300);
    if (!child.killed) child.kill('SIGKILL');
    if (output.includes('Error fetching posts:')) {
      console.warn('Server logs still contain posts fetch errors');
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
