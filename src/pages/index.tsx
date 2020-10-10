import React, { useCallback, useMemo, useState } from 'react';

import Layout from '../components/layout';
import SEO from '../components/seo';

import './index.css';
import {
  filterSpecs,
  getAllSpecsAnnotated,
  getAvailableSpecsAnnotated,
} from '../orm';
import Filterbar, { Inclusion, SortOrder } from '../components/filter-bar';
import SpecList from '../components/spec-list';
import useBarInventory from '../hooks/useBarInventory';

export default function IndexPage() {
  const { selectedCategories } = useBarInventory();
  const [keywords, setKeywords] = useState<string[]>([]);
  const [sort, setSortOrder] = useState<SortOrder>(SortOrder.Alphabetical);

  const [{ available, filtered }, setSpecs] = useState(() => {
    const specs = getAvailableSpecsAnnotated(
      selectedCategories,
      Inclusion.Default
    );
    return {
      available: specs,
      filtered: specs,
    };
  });

  const handleFilterChange = useCallback(
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
      setSpecs({
        available,
        filtered: filterSpecs(available, newKeywords),
      });
      setKeywords(newKeywords);
    },
    [available]
  );

  const sortedSpecs = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sort === SortOrder.PageNumber) {
        return Number(a.pageNum) - Number(b.pageNum);
      }
      if (sort == SortOrder.MissingCount) {
        return (
          a.ingredients.filter(i => i.missing).length -
          b.ingredients.filter(i => i.missing).length
        );
      }
      return a.name
        .toLocaleLowerCase()
        .localeCompare(b.name.toLocaleLowerCase());
    });
  }, [filtered, sort]);

  return (
    <Layout>
      <SEO title="Cocktails" />

      <div id="homepage">
        <Filterbar
          onSearch={handleFilterChange}
          onKeywordSearch={handleKeywordSearch}
          onSort={setSortOrder}
          keywords={keywords}
          selectedCategories={selectedCategories}
          sort={sort}
        />

        <SpecList specs={sortedSpecs} />
      </div>
    </Layout>
  );
}
