import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';

export const repoRoot = path.resolve(import.meta.dirname, '..');

export async function listFilesRecursive(root: string): Promise<string[]> {
  const dirents = await readdir(root, {withFileTypes: true});
  const files = await Promise.all(
    dirents.map(async (dirent) => {
      const fullPath = path.join(root, dirent.name);
      if (dirent.isDirectory()) {
        return listFilesRecursive(fullPath);
      }
      return [fullPath];
    }),
  );

  return files.flat();
}

type ChainMetadataRecord = {
  path: string;
  metadata: Record<string, any>;
};

export async function readChainMetadata(): Promise<ChainMetadataRecord[]> {
  const chainsRoot = path.join(repoRoot, 'chains');
  const files = (await listFilesRecursive(chainsRoot))
    .filter((file) => file.endsWith('metadata.yaml'))
    .sort();

  const records: ChainMetadataRecord[] = [];
  for (const file of files) {
    const raw = await readFile(file, 'utf8');
    records.push({
      path: file,
      metadata: YAML.parse(raw),
    });
  }

  return records;
}
