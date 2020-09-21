import React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Chip from '@material-ui/core/Chip';

import Layout from '../components/layout';
import SEO from '../components/seo';
import getCategorizedCategories from '../orm/getCategorizedCategories';
import useBarInventory from '../hooks/useBarInventory';

export default function BackBarPage() {
  const { selectedCategories, setCategory, deleteCategory } = useBarInventory();

  const selectedSet = new Set(selectedCategories);

  return (
    <Layout>
      <SEO title="Back bar" />
      {Object.entries(getCategorizedCategories()).map(
        ([categoryName, categories]) => (
          <Accordion key={categoryName}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              {categoryName}
            </AccordionSummary>
            <AccordionDetails>
              <div className="chip-list">
                {categories.map(c => (
                  <Chip
                    key={c}
                    className="chip"
                    variant="outlined"
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
        )
      )}
    </Layout>
  );
}
