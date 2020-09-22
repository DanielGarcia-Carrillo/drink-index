import React, { useCallback, useState } from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import Layout from '../components/layout';
import SEO from '../components/seo';

import './index.css';
import { FormattedSpec } from '../types';
import { getAllSpecsAnnotated, getAvailableSpecsAnnotated } from '../orm';
import Filterbar, { Inclusion } from '../components/filter-bar';

export default function IndexPage() {
  const [availableSpecs, setSpecs] = useState<FormattedSpec[]>([]);

  const handleSearch = useCallback(
    (selected: string[], inclusion: Inclusion) => {
      setSpecs(
        inclusion === Inclusion.All
          ? getAllSpecsAnnotated(selected)
          : getAvailableSpecsAnnotated(selected, inclusion)
      );
    },
    []
  );

  return (
    <Layout>
      <SEO title="Cocktails" />

      <div id="homepage">
        <Filterbar onSearch={handleSearch} />

        <h3>{availableSpecs.length} specs available</h3>
        <div id="specs">
          {availableSpecs.map(spec => (
            <Card key={`${spec.name}-${spec.origin}`}>
              <CardContent className="spec">
                <h3>{spec.name}</h3>
                <p className="secondary origin">
                  {spec.origin} - {spec.pageNum}
                </p>
                <ul>
                  {spec.ingredients.map(i => (
                    <li
                      key={i.id}
                      className={`secondary list-item ${
                        i.missing ? 'missing' : ''
                      }`}
                    >
                      {i.name} <span className="category">({i.category})</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
