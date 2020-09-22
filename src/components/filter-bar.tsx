import React, { useCallback, useMemo, useState } from 'react';

import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import './filter-bar.css';
import useBarInventory from '../hooks/useBarInventory';

export enum Inclusion {
  Default,
  Easy,
  All,
}

interface Props {
  onSearch: (selected: string[], inclusion: Inclusion) => void;
}

export default function Filterbar({ onSearch }: Props) {
  const [includeEasy, setEasy] = useState(false);

  const { selectedCategories } = useBarInventory();

  const handleSearch = useCallback(() => {
    onSearch(
      selectedCategories,
      includeEasy ? Inclusion.Easy : Inclusion.Default
    );
  }, [selectedCategories, includeEasy]);

  const handleAllSearch = useCallback(() => {
    onSearch(selectedCategories, Inclusion.All);
  }, [selectedCategories]);

  return (
    <>
      <Button
        className="filter"
        color="primary"
        size="large"
        variant="contained"
        onClick={handleAllSearch}
      >
        Show All
      </Button>

      <Button
        className="filter"
        color="primary"
        size="large"
        variant="contained"
        onClick={handleSearch}
      >
        Filter Results
      </Button>

      <FormControlLabel
        label="Include easily attainable ingredients"
        control={
          <Checkbox
            checked={includeEasy}
            onChange={() => setEasy(!includeEasy)}
          />
        }
      />
    </>
  );
}
