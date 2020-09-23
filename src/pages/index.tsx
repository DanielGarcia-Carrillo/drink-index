import React, { useCallback, useState } from 'react';

import Layout from '../components/layout';
import SEO from '../components/seo';

import './index.css';
import { FormattedSpec } from '../types';
import {
  filterSpecs,
  getAllSpecsAnnotated,
  getAvailableSpecsAnnotated,
} from '../orm';
import Filterbar, { Inclusion } from '../components/filter-bar';
import SpecList from '../components/spec-list';
import useBarInventory from '../hooks/useBarInventory';

export default function IndexPage() {
  const { selectedCategories } = useBarInventory();
  const [keywords, setKeywords] = useState<string[]>([]);
  const [{ available, filtered }, setSpecs] = useState({
    available: getAvailableSpecsAnnotated(
      selectedCategories,
      Inclusion.Default
    ),
    filtered: getAvailableSpecsAnnotated(selectedCategories, Inclusion.Default),
  });

  const handleSearch = useCallback(
    (selected: string[], inclusion: Inclusion) => {
      const specs =
        inclusion === Inclusion.All
          ? getAllSpecsAnnotated(selected)
          : getAvailableSpecsAnnotated(selected, inclusion);
      setSpecs({
        available: specs,
        filtered: keywords.length ? filterSpecs(specs, keywords) : specs,
      });
    },
    [keywords]
  );

  const handleKeywordSearch = useCallback(
    (newKeywords: string[]) => {
      setKeywords(newKeywords);
      setSpecs({
        available,
        filtered: filterSpecs(available, newKeywords),
      });
    },
    [available]
  );

  return (
    <Layout>
      <SEO title="Cocktails" />

      <div id="homepage">
        <Filterbar
          onSearch={handleSearch}
          onKeywordSearch={handleKeywordSearch}
          keywords={keywords}
          selectedCategories={selectedCategories}
        />

        <SpecList specs={filtered} />
      </div>
    </Layout>
  );
}
