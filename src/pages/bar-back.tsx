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
import { getAllIngredientCategories } from '../orm';

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

export default function BackBarPage() {
  const { selectedCategories, setCategory, deleteCategory } = useBarInventory();

  const selectedSet = new Set(selectedCategories);

  const lists = useMemo(() => Object.entries(getCategorizedCategories()), []);

  return (
    <Layout>
      <SEO title="Bar Back" />
      <div id="bar-back">
        {lists.map(([categoryName, categories]) => (
          <Accordion key={categoryName}>
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
                    label={c}
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
