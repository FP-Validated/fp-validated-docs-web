import React, {useEffect, useMemo, useState} from 'react';
import './styles.css';

type IntelligenceIndex = {
  generatedAt: string;
  chains: {id: string}[];
  notes: {id: string}[];
  admin: {sourceCount: number; reviewQueue: string[]};
};

type SupportedNetwork = {
  name: string;
  icon: string;
  support: string[];
};

const supportedNetworks: SupportedNetwork[] = [
  {name: 'Ethereum', icon: '/img/networks/logo-ethereum.png', support: ['Validator', 'RPC']},
  {name: 'Solana', icon: '/img/networks/logo-solana.png', support: ['Validator', 'RPC']},
  {name: 'Sui', icon: '/img/networks/logo-sui.png', support: ['Validator']},
  {name: 'Walrus', icon: '/img/networks/logo-walrus.png', support: ['Validator']},
  {name: 'Initia', icon: '/img/networks/logo-initia.png', support: ['Validator']},
  {name: 'Stable', icon: '/img/networks/logo-stable.png', support: ['Validator']},
  {name: 'Sei', icon: '/img/networks/logo-sei.png', support: ['Validator']},
  {name: 'Canton', icon: '/img/networks/logo-canton.png', support: ['Validator']},
  {name: 'Aptos', icon: '/img/networks/logo-aptos.png', support: ['Validator']},
  {name: 'Injective', icon: '/img/networks/logo-injective.png', support: ['Validator']},
  {name: 'Monad', icon: '/img/networks/logo-monad.png', support: ['Validator']},
  {name: 'Stacks', icon: '/img/networks/logo-stacks.png', support: ['Signer']},
  {name: 'Zero', icon: '/img/networks/logo-layerzero.jpg', support: ['Validator']},
  {name: 'LayerZero', icon: '/img/networks/logo-layerzero.jpg', support: ['DVN']},
  {name: 'BSC', icon: '/img/networks/logo-bsc.png', support: ['RPC']},
  {name: 'Hyperliquid', icon: '/img/networks/logo-hyperliquid.jpg', support: ['RPC']},
  {name: 'Avalanche', icon: '/img/networks/logo-avalanche.png', support: ['RPC']},
  {name: 'Polygon', icon: '/img/networks/logo-polygon.png', support: ['RPC']},
  {name: 'Arbitrum', icon: '/img/networks/logo-arbitrum.jpg', support: ['RPC']},
  {name: 'Optimism', icon: '/img/networks/logo-optimism.png', support: ['RPC']},
  {name: 'Base', icon: '/img/networks/logo-base.png', support: ['RPC']},
  {name: 'Tempo', icon: '/img/networks/logo-tempo.png', support: ['RPC']},
];

const quickLinks = [
  {label: 'Infrastructure', href: '/fp-validated-infra/overview'},
  {label: 'Staking', href: '/staking'},
  {label: 'Chains', href: '/chains'},
  {label: 'Node Operations', href: '/operations/common-runbooks'},
  {label: 'Developer', href: '/developer/api-design-principles'},
];

export default function IntelligenceHome(): React.ReactElement {
  const [index, setIndex] = useState<IntelligenceIndex | null>(null);

  useEffect(() => {
    document.body.dataset.fpHome = 'true';
    fetch('/intelligence-index.json')
      .then((response) => response.json())
      .then(setIndex)
      .catch(() => setIndex(null));
    return () => {
      delete document.body.dataset.fpHome;
    };
  }, []);

  const summaryItems = useMemo(() => [
    {
      label: 'Networks operated',
      value: String(supportedNetworks.length),
      detail: 'Networks where we run validators, signers, DVNs or RPC nodes.',
    },
    {
      label: 'Cloud providers',
      value: '5',
      detail: 'Cloud providers our nodes run on.',
    },
    {
      label: 'Reviewed notes',
      value: index ? String(index.notes.length) : '—',
      detail: index
        ? `Public notes, last generated ${index.generatedAt.slice(0, 10)}.`
        : 'Public notes, refreshed with each site build.',
    },
  ], [index]);

  return (
    <section className="intelligence-home">
      <div className="intelligence-home__frame">
        <div className="intelligence-home__hero">
          <div className="intelligence-home__hero-copy">
            <p className="intelligence-home__eyebrow">FP Validated Docs</p>
            <h1 className="intelligence-home__headline">How FP Validated runs validators and RPC nodes.</h1>
            <p className="intelligence-home__lead">
              Architecture, chain guides, staking guides, node operations and developer
              interfaces for our validator and RPC infrastructure.
            </p>
            <div className="intelligence-home__actions" aria-label="Primary documentation links">
              {quickLinks.map((item) => (
                <a className="intelligence-home__action" href={item.href} key={item.label}>
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="intelligence-home__summary-grid">
          {summaryItems.map((item) => (
            <article className="intelligence-home__summary-card" key={item.label}>
              <span className="intelligence-home__label">{item.label}</span>
              <strong>{item.value}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>

        <section className="intelligence-home__networks" aria-label="Supported chains">
          <div className="intelligence-home__network-grid">
            {supportedNetworks.map((network) => (
              <article className="intelligence-home__network-card" key={network.name}>
                <div className="intelligence-home__network-logo-wrap">
                  <img
                    alt={`${network.name} logo`}
                    className="intelligence-home__network-logo"
                    loading="lazy"
                    src={network.icon}
                  />
                </div>
                <div className="intelligence-home__network-body">
                  <h3>{network.name}</h3>
                  <div className="intelligence-home__network-tags" aria-label={`${network.name} support type`}>
                    {network.support.map((tag) => (
                      <span className="intelligence-home__network-tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
