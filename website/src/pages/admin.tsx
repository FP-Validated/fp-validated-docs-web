import React, {useEffect, useMemo, useState} from 'react';
import Layout from '@theme/Layout';
import './admin.css';

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
  sources: {type: string; label: string; url?: string}[];
};

type IntelligenceIndex = {
  generatedAt: string;
  chains: {id: string; displayName: string; status: string; knowledgeCount: number; topics: string[]}[];
  notes: KnowledgeNote[];
  topics: {id: string; count: number; chains: string[]}[];
  admin: {reviewQueue: string[]; sourceCount: number};
};

export default function AdminPage(): React.ReactElement {
  const [index, setIndex] = useState<IntelligenceIndex | null>(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/intelligence-index.json')
      .then((response) => response.json())
      .then(setIndex)
      .catch(() => setIndex(null));
  }, []);

  const notes = useMemo(() => {
    if (!index) return [];
    if (filter === 'all') return index.notes;
    return index.notes.filter((note) => note.review_status === filter || note.chain === filter);
  }, [filter, index]);

  return (
    <Layout title="Intelligence Admin" description="Review generated operator intelligence">
      <main className="admin-intel">
        <section className="admin-intel__hero">
          <p>Backoffice Intelligence Compiler</p>
          <h1>Admin review console</h1>
          <span>
            Review curated operator notes, source coverage, and generated chain intelligence before publishing the static user experience.
          </span>
        </section>

        {!index && <div className="admin-intel__empty">Generate intelligence-index.json to load admin data.</div>}

        {index && (
          <>
            <section className="admin-intel__stats">
              <article>
                <strong>{index.notes.length}</strong>
                <span>knowledge notes</span>
              </article>
              <article>
                <strong>{index.chains.length}</strong>
                <span>chains</span>
              </article>
              <article>
                <strong>{index.admin.sourceCount}</strong>
                <span>sources</span>
              </article>
              <article>
                <strong>{index.admin.reviewQueue.length}</strong>
                <span>needs review</span>
              </article>
            </section>

            <section className="admin-intel__toolbar">
              <button type="button" onClick={() => setFilter('all')}>All</button>
              <button type="button" onClick={() => setFilter('approved')}>Approved</button>
              <button type="button" onClick={() => setFilter('needs-review')}>Needs review</button>
              {index.chains.map((chain) => (
                <button type="button" key={chain.id} onClick={() => setFilter(chain.id)}>
                  {chain.displayName}
                </button>
              ))}
            </section>

            <section className="admin-intel__grid">
              <div className="admin-intel__panel">
                <h2>Knowledge notes</h2>
                {notes.map((note) => (
                  <article className="admin-intel__note" key={note.id}>
                    <div>
                      <strong>{note.title}</strong>
                      <span>{note.path}</span>
                    </div>
                    <p>{note.summary}</p>
                    <footer>
                      <span>{note.chain}</span>
                      <span>{note.kind}</span>
                      <span>{note.review_status}</span>
                      <span>{note.confidence}</span>
                      <span>{note.last_reviewed}</span>
                    </footer>
                  </article>
                ))}
              </div>

              <aside className="admin-intel__panel">
                <h2>Publish checklist</h2>
                <ul>
                  <li>Admin LLM/RAG jobs update source snapshots offline.</li>
                  <li>Human review approves generated notes before publish.</li>
                  <li>User site consumes only this static reviewed index.</li>
                  <li>Homepage overview and docs are rebuilt from the reviewed publish set.</li>
                </ul>
                <h2>Topics</h2>
                <div className="admin-intel__topics">
                  {index.topics.map((topic) => (
                    <span key={topic.id}>{topic.id} · {topic.count}</span>
                  ))}
                </div>
                <p className="admin-intel__generated">Generated {new Date(index.generatedAt).toLocaleString()}</p>
              </aside>
            </section>
          </>
        )}
      </main>
    </Layout>
  );
}
