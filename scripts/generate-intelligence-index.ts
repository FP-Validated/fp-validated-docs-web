// Usage: npx tsx scripts/generate-intelligence-index.ts
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';
import { listFilesRecursive, readChainMetadata, repoRoot } from './lib.ts';

type KnowledgeSource = {
  type: string;
  label: string;
  url?: string;
};

type KnowledgeNote = {
  id: string;
  path: string;
  title: string;
  chain: string;
  topics: string[];
  kind: string;
  review_status: string;
  last_reviewed: string;
  confidence: string;
  summary: string;
  sources: KnowledgeSource[];
  body: string;
  excerpt: string;
};

const knowledgeRoot = path.join(repoRoot, 'knowledge');
const outputPath = path.join(repoRoot, 'website/static/intelligence-index.json');

function parseMarkdown(raw: string, filePath: string): { frontmatter: any; body: string } {
  if (!raw.startsWith('---\n')) {
    throw new Error(`${path.relative(repoRoot, filePath)} is missing YAML frontmatter`);
  }

  const close = raw.indexOf('\n---\n', 4);
  if (close === -1) {
    throw new Error(`${path.relative(repoRoot, filePath)} has unterminated YAML frontmatter`);
  }

  const frontmatter = YAML.parse(raw.slice(4, close));
  const body = raw.slice(close + 5).trim();
  return { frontmatter, body };
}

function noteId(filePath: string): string {
  return path.relative(knowledgeRoot, filePath).replace(/\.md$/, '').replaceAll(path.sep, '/');
}

function excerpt(body: string): string {
  return body
    .replace(/^# .+$/m, '')
    .replace(/[#>*`_-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 280);
}

async function readKnowledgeNotes(): Promise<KnowledgeNote[]> {
  const files = (await listFilesRecursive(knowledgeRoot))
    .filter((file) => file.endsWith('.md'))
    .sort();

  const notes: KnowledgeNote[] = [];
  for (const file of files) {
    const raw = await readFile(file, 'utf8');
    const { frontmatter, body } = parseMarkdown(raw, file);
    notes.push({
      id: noteId(file),
      path: path.relative(repoRoot, file),
      title: frontmatter.title,
      chain: frontmatter.chain,
      topics: frontmatter.topics ?? [],
      kind: frontmatter.kind,
      review_status: frontmatter.review_status,
      last_reviewed: frontmatter.last_reviewed,
      confidence: frontmatter.confidence,
      summary: frontmatter.summary,
      sources: frontmatter.sources ?? [],
      body,
      excerpt: excerpt(body),
    });
  }

  return notes;
}

function normalizeRuntimeList(runtimes: any): string[] {
  if (Array.isArray(runtimes)) return runtimes;
  return Object.entries(runtimes ?? {})
    .filter(([, value]) => typeof value === 'boolean' ? value : value && typeof value === 'object' && Object.values(value).some(Boolean))
    .map(([key]) => key);
}

async function main(): Promise<void> {
  const [records, notes] = await Promise.all([readChainMetadata(), readKnowledgeNotes()]);
  const generatedAt = new Date().toISOString();

  const chains = records.map((record) => {
    const relatedNotes = notes.filter((note) => note.chain === record.metadata.chain);
    return {
      id: record.metadata.chain,
      displayName: record.metadata.displayName ?? record.metadata.chain,
      category: record.metadata.category ?? 'unknown',
      status: record.metadata.status,
      lastVerified: record.metadata.lastVerified ?? null,
      runtimes: normalizeRuntimeList(record.metadata.runtimes),
      developerInterfaces: record.metadata.developerInterfaces,
      ports: record.metadata.ports,
      sampleLanguages: record.metadata.sampleLanguages ?? [],
      knowledgeCount: relatedNotes.length,
      topics: Array.from(new Set(relatedNotes.flatMap((note) => note.topics))).sort(),
    };
  });

  const topicIndex = Array.from(new Set(notes.flatMap((note) => note.topics))).sort().map((topic) => ({
    id: topic,
    count: notes.filter((note) => note.topics.includes(topic)).length,
    chains: Array.from(new Set(notes.filter((note) => note.topics.includes(topic)).map((note) => note.chain))).sort(),
  }));

  const index = {
    version: 1,
    generatedAt,
    product: {
      name: 'FP Validated Intelligence',
      description: 'Reviewed operator intelligence compiled from internal knowledge, chain metadata, and curated source snapshots.',
    },
    chains,
    notes,
    topics: topicIndex,
    admin: {
      reviewQueue: notes.filter((note) => note.review_status !== 'approved').map((note) => note.id),
      sourceCount: notes.reduce((total, note) => total + note.sources.length, 0),
    },
  };

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');
  console.error(`Wrote ${path.relative(repoRoot, outputPath)} with ${notes.length} knowledge note(s).`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
