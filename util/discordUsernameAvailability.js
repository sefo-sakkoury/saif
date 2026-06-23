const fs = require('fs');
const path = require('path');

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
const TOTAL_COMBINATIONS = ALPHABET.length ** 4;

function parseArg(name) {
  const entry = process.argv.find((arg) => arg.startsWith(`${name}=`));
  return entry ? entry.slice(name.length + 1) : null;
}

function parsePositiveInt(name) {
  const value = parseArg(name);
  if (value === null) return null;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error(`${name} must be a positive integer.`);
  }
  return parsed;
}

function parseBoolean(name) {
  const value = parseArg(name);
  if (value === null) return null;
  if (value === 'true') return true;
  if (value === 'false') return false;
  throw new Error(`${name} must be either true or false.`);
}

function deterministicAvailability(username) {
  const score = username.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return score % 2 === 0 ? 'available' : 'unavailable';
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

function normalizeAvailability(payload) {
  if (typeof payload?.available === 'boolean') {
    return payload.available ? 'available' : 'unavailable';
  }
  if (payload?.availability === 'available' || payload?.availability === 'unavailable') {
    return payload.availability;
  }
  return null;
}

function previewPayload(payload) {
  try {
    return JSON.stringify(payload).slice(0, 300);
  } catch (error) {
    return '[unserializable payload]';
  }
}

function* generateUsernames() {
  for (const a of ALPHABET) {
    for (const b of ALPHABET) {
      for (const c of ALPHABET) {
        for (const d of ALPHABET) {
          yield `${a}${b}${c}${d}`;
        }
      }
    }
  }
}

async function main() {
  const endpoint = parseArg('--endpoint') || process.env.DISCORD_CHECK_URL || '';
  const timeoutMs = parsePositiveInt('--timeout-ms') || 8000;
  const outputPath = parseArg('--output');
  const forceSimulate = parseBoolean('--simulate');
  const delayMsArg = parsePositiveInt('--delay-ms');
  const requestedLimit = parsePositiveInt('--limit');

  const useSimulation = forceSimulate !== null ? forceSimulate : endpoint.length === 0;
  const defaultRealtimeLimit = 1000;
  const effectiveLimit = requestedLimit || (useSimulation ? TOTAL_COMBINATIONS : defaultRealtimeLimit);
  const delayMs = delayMsArg ?? (useSimulation ? 0 : 50);
  const limit = Math.min(effectiveLimit, TOTAL_COMBINATIONS);
  const cache = new Map();
  const results = [];

  if (useSimulation) {
    console.error('Simulation mode enabled: availability is deterministic and not real-time Discord data.');
  } else if (!requestedLimit && limit < TOTAL_COMBINATIONS) {
    console.error(`Real-time mode defaulted to ${limit} checks to avoid rate limiting. Use --limit to change this.`);
  }

  for (const username of generateUsernames()) {
    if (results.length >= limit) break;

    let availability = cache.get(username);

    if (!availability) {
      if (useSimulation) {
        availability = deterministicAvailability(username);
      } else {
        try {
          const query = new URL(endpoint);
          query.searchParams.set('username', username);
          const response = await fetchWithTimeout(query.toString(), timeoutMs);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          const payload = await response.json();
          const normalized = normalizeAvailability(payload);
          if (!normalized) {
            console.error(
              `Unexpected response shape for "${username}": ${previewPayload(payload)}. Marking as unavailable.`
            );
          }
          availability = normalized || 'unavailable';
        } catch (error) {
          console.error(`Failed availability check for "${username}": ${error.message}`);
          availability = 'unavailable';
        }
      }
      cache.set(username, availability);
    }

    results.push({ username, availability });
    if (delayMs > 0) {
      await sleep(delayMs);
    }
  }

  const jsonOutput = JSON.stringify(results, null, 2);
  if (outputPath) {
    const absolutePath = path.isAbsolute(outputPath) ? outputPath : path.join(process.cwd(), outputPath);
    fs.writeFileSync(absolutePath, jsonOutput);
    console.error(`Wrote ${results.length} records to ${absolutePath}`);
  } else {
    process.stdout.write(`${jsonOutput}\n`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
