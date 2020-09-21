import React, { useCallback, useState } from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import Layout from '../components/layout';
import SEO from '../components/seo';

import './index.css';
import Searchbar, { Inclusion } from '../components/searchbar';
import { FormattedSpec } from '../types';
import {
  getAllIngredientCategories,
  getAllSpecsAnnotated,
  getAvailableSpecsAnnotated,
} from '../orm';

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

  const handleSelection = useCallback(() => {
    if (availableSpecs.length) {
      setSpecs([]);
    }
  }, [availableSpecs.length]);

  return (
    <Layout>
      <SEO title="Cocktails" />
      <Searchbar
        categories={getAllIngredientCategories()}
        onSearch={handleSearch}
        onSelectionChange={handleSelection}
      />
      <div id="recipes">
        {availableSpecs.map(spec => (
          <Card>
            <CardContent className="spec">
              <h3>{spec.name}</h3>
              <p className="secondary origin">
                {spec.origin} - {spec.pageNum}
              </p>
              <ul>
                {spec.ingredients.map(i => (
                  <li
                    className={`secondary list-item ${
                      i.missing ? 'missing' : ''
                    }`}
                  >
                    {i.name}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </Layout>
  );
}
