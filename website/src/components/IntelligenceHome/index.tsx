import React, {useEffect} from 'react';
import Link from '@docusaurus/Link';
import './styles.css';

type Section = {
  title: string;
  href: string;
  description: string;
  links: {label: string; href: string}[];
};

const sections: Section[] = [
  {
    title: 'Staking',
    href: '/staking',
    description: 'Delegate to FP Validated from your own wallet or custody platform.',
    links: [
      {label: 'Choose a network', href: '/staking'},
      {label: 'Stake SUI', href: '/staking/sui'},
      {label: 'Stake APT', href: '/staking/aptos'},
    ],
  },
  {
    title: 'Infrastructure',
    href: '/fp-validated-infra/overview',
    description: 'How our validator infrastructure is deployed, monitored and secured.',
    links: [
      {label: 'Overview', href: '/fp-validated-infra/overview'},
      {label: 'Monitoring', href: '/fp-validated-infra/monitoring-architecture'},
      {label: 'Responsiveness and slashing', href: '/fp-validated-infra/responsiveness-and-slashing-policy'},
    ],
  },
  {
    title: 'Chains',
    href: '/chains',
    description: 'Notes for each network we run: node types, endpoints and upgrades.',
    links: [
      {label: 'All chains', href: '/chains'},
      {label: 'Ethereum', href: '/chains/ethereum/overview'},
      {label: 'Sui', href: '/chains/sui/overview'},
    ],
  },
  {
    title: 'Node Operations',
    href: '/operations/common-runbooks',
    description: 'Runbooks and standards for running and recovering nodes.',
    links: [
      {label: 'Common runbooks', href: '/operations/common-runbooks'},
      {label: 'Incident response', href: '/operations/incident-response'},
      {label: 'Backup standards', href: '/operations/backup-standards'},
    ],
  },
  {
    title: 'Developer',
    href: '/developer/api-design-principles',
    description: 'Patterns for building on our RPC and API endpoints.',
    links: [
      {label: 'API design principles', href: '/developer/api-design-principles'},
      {label: 'Transaction submission', href: '/developer/transaction-submission-pattern'},
      {label: 'Reorgs and finality', href: '/developer/reorg-finality-handling'},
    ],
  },
  {
    title: 'Reference',
    href: '/reference/chain-matrix',
    description: 'Lookup tables for chains, RPC methods, ports and terms.',
    links: [
      {label: 'Chain matrix', href: '/reference/chain-matrix'},
      {label: 'RPC / API matrix', href: '/reference/rpc-api-matrix'},
      {label: 'Glossary', href: '/reference/glossary'},
    ],
  },
];

export default function IntelligenceHome(): React.ReactElement {
  useEffect(() => {
    document.body.dataset.fpHome = 'true';
    return () => {
      delete document.body.dataset.fpHome;
    };
  }, []);

  return (
    <section className="docs-home">
      <header className="docs-home__hero">
        <h1 className="docs-home__title">FP Validated Docs</h1>
        <p className="docs-home__lead">
          Guides for staking with FP Validated, and documentation for the infrastructure behind our
          validators and RPC nodes. Use the search box at the top to find a page.
        </p>
      </header>

      <div className="docs-home__grid">
        {sections.map((section) => (
          <article className="docs-home__card" key={section.title}>
            <h2 className="docs-home__card-title">
              <Link to={section.href}>{section.title}</Link>
            </h2>
            <p className="docs-home__card-desc">{section.description}</p>
            <ul className="docs-home__links">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link to={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
