const { readFile } = require('node:fs/promises') as typeof import('node:fs/promises');
const path = require('node:path') as typeof import('node:path');

type CoverageScenario = {
  storyId: string;
  acceptanceScenarioRef: string;
  coverageStatus: 'covered' | 'deferred';
  regressionScenarioId?: string;
  deferReason?: string;
  notes?: string;
};

type CoverageManifest = {
  specs: Array<{
    featureId: string;
    featureTitle: string;
    surface: string;
    scenarios: CoverageScenario[];
  }>;
};

function parseAcceptanceScenarioRefs(specText: string) {
  const refs: string[] = [];
  const lines = specText.split('\n');
  let currentStoryId: string | null = null;
  let acceptanceIndex = 0;
  let inAcceptanceBlock = false;

  for (const line of lines) {
    const storyMatch = line.match(/^### User Story (\d+) - /);
    if (storyMatch) {
      currentStoryId = `US${storyMatch[1]}`;
      acceptanceIndex = 0;
      inAcceptanceBlock = false;
      continue;
    }

    if (line.startsWith('**Acceptance Scenarios**')) {
      inAcceptanceBlock = true;
      continue;
    }

    if (inAcceptanceBlock && /^---$/.test(line.trim())) {
      inAcceptanceBlock = false;
      continue;
    }

    if (inAcceptanceBlock && currentStoryId && /^\d+\.\s+\*\*Given\*\*/.test(line.trim())) {
      acceptanceIndex += 1;
      refs.push(`${currentStoryId}-AS${acceptanceIndex}`);
    }
  }

  return refs;
}

async function main() {
  const repoRoot = process.cwd();
  const manifestPath = path.join(repoRoot, 'playwright/coverage.manifest.json');
  const specPath = path.join(repoRoot, 'specs/001-points-tracking/spec.md');

  const manifest = JSON.parse(await readFile(manifestPath, 'utf8')) as CoverageManifest;
  const specText = await readFile(specPath, 'utf8');
  const expectedRefs = parseAcceptanceScenarioRefs(specText);
  const productSpec = manifest.specs.find((item) => item.featureId === '001-points-tracking');

  if (!productSpec) {
    throw new Error('Missing coverage record for specs/001-points-tracking/spec.md.');
  }

  if (productSpec.surface !== 'web') {
    throw new Error(`Expected surface "web", received "${productSpec.surface}".`);
  }

  const manifestRefs = productSpec.scenarios.map((scenario) => scenario.acceptanceScenarioRef);
  const missingRefs = expectedRefs.filter((ref) => !manifestRefs.includes(ref));
  const duplicateRefs = manifestRefs.filter((ref, index) => manifestRefs.indexOf(ref) !== index);
  const invalidEntries = productSpec.scenarios.filter((scenario) => {
    if (scenario.coverageStatus === 'covered') {
      return !scenario.regressionScenarioId;
    }

    return !scenario.deferReason;
  });

  if (missingRefs.length > 0) {
    throw new Error(`Missing manifest entries for: ${missingRefs.join(', ')}`);
  }

  if (duplicateRefs.length > 0) {
    throw new Error(`Duplicate manifest entries for: ${[...new Set(duplicateRefs)].join(', ')}`);
  }

  if (invalidEntries.length > 0) {
    throw new Error(
      `Invalid coverage entries: ${invalidEntries.map((entry) => entry.acceptanceScenarioRef).join(', ')}`,
    );
  }

  console.log(
    `Coverage manifest valid for ${productSpec.featureId}: ${productSpec.scenarios.length} acceptance scenarios mapped.`,
  );
}

void main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown coverage validation failure';
  console.error(message);
  process.exit(1);
});
