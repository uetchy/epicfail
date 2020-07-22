import fetch from 'node-fetch';

export async function findIssues(q: string, repo: string) {
  const query = `repo:${repo} ${q}`;
  try {
    const res = await fetch(
      `https://api.github.com/search/issues?q=${encodeURIComponent(
        query,
      )}&per_page=3`,
    ).then((res) => res.json());
    return res?.items;
  } catch (err) {
    return [];
  }
}

export function guessRepo(str: string): string | undefined {
  return /(?:(?<=github\.com\/)|^)([\w\-_]+\/[\w.\-_]+)/.exec(str)?.[1];
}

export function linkToNewIssue(repo: string, body: string | undefined) {
  return `https://github.com/${repo}/issues/new${
    body ? `?body=${encodeURIComponent(body)}` : ''
  }`;
}
