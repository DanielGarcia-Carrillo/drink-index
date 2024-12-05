import React, { useMemo } from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Chip from '@material-ui/core/Chip';

import Layout from '../components/layout';
import SEO from '../components/seo';
import getCategorizedCategories from '../orm/getCategorizedCategories';
import useBarInventory from '../hooks/useBarInventory';

import './bar-back.css';
import Searchbar from '../components/searchbar';
import {
  getAllIngredientCategories,
  getCategoryCounts,
  getIncrementalCategoryCounts,
} from '../orm';

function SelectedCount({
  categories,
  selected,
}: {
  categories: string[];
  selected: Set<string>;
}) {
  const count = categories.filter(c => selected.has(c)).length;
  return count ? (
    <div className="selected-count secondary"> ({count})</div>
  ) : null;
}

function mostUsed(
  categoryCounts: Record<string, number>,
  selectedSet: Set<string>,
  total = 10
) {
  return Object.entries(categoryCounts)
    .filter(([category]) => !selectedSet.has(category))
    .sort(([, a], [, b]) => b - a)
    .slice(0, total);
}

export default function BackBarPage() {
  const { selectedCategories, setCategory, deleteCategory } = useBarInventory();

  const selectedSet = new Set(selectedCategories);

  const lists = useMemo(() => Object.entries(getCategorizedCategories()), []);
  const mostUsedMissingCategories = useMemo(
    () => mostUsed(getCategoryCounts(), selectedSet),
    [selectedCategories]
  );
  const incrementalCounts = useMemo(
    () => getIncrementalCategoryCounts(selectedCategories),
    [selectedCategories]
  );
  const mostIncrementalCategories = useMemo(
    () => mostUsed(incrementalCounts, selectedSet),
    [incrementalCounts, selectedCategories]
  );

  return (
    <Layout>
      <SEO title="Bar Back" />
      <div id="bar-back">
        <h2>Missing categories</h2>
        {mostUsedMissingCategories.map(([category, total]) => (
          <div>
            {category} - {total}
          </div>
        ))}
        <h2>Most effective purchases</h2>
        {mostIncrementalCategories.map(([category, total]) => (
          <div>
            {category} - {total}
          </div>
        ))}
        {lists.map(([categoryName, categories]) => (
          <Accordion
            key={categoryName}
            TransitionProps={{ unmountOnExit: true }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <div>{categoryName} </div>
              <SelectedCount selected={selectedSet} categories={categories} />
            </AccordionSummary>

            <AccordionDetails>
              <div className="chip-list">
                {categories.map(c => (
                  <Chip
                    key={c}
                    className="chip"
                    variant={selectedSet.has(c) ? 'default' : 'outlined'}
                    color="primary"
                    label={
                      <>
                        {c} ({getCategoryCounts()[c]}){' '}
                        {!!incrementalCounts[c] && (
                          <span
                            className={`incremental-count ${
                              selectedSet.has(c) ? 'to-remove' : 'to-add'
                            }`}
                          >
                            ({incrementalCounts[c]})
                          </span>
                        )}
                      </>
                    }
                    onClick={() => setCategory(c)}
                    onDelete={
                      selectedSet.has(c) ? () => deleteCategory(c) : undefined
                    }
                  />
                ))}
              </div>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </Layout>
  );
}
