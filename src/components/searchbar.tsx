import React, { useCallback, useMemo, useState } from 'react';

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import useLocalStorage from '../hooks/useLocalStorage';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import './searchbar.css';
import { getInvalidCategories } from '../orm';

export enum Inclusion {
  Default,
  Easy,
  All,
}

interface Props {
  categories: string[];
  onSearch: (selected: string[], inclusion: Inclusion) => void;
  onSelectionChange: () => void;
}

const BAR_INGREDIENTS_KEY = 'bar-ingredients';

export default function Searchbar({
  categories,
  onSearch,
  onSelectionChange,
}: Props) {
  const [inputValue, setInputValue] = useState('');
  const [includeEasy, setEasy] = useState(false);

  const [categoriesSelected, setSelected] = useLocalStorage<string[]>(
    BAR_INGREDIENTS_KEY,
    []
  );

  const invalidCategories = getInvalidCategories(categoriesSelected);

  const options = useMemo(() => {
    const selectedSet = new Set(categoriesSelected);
    return categories.filter(i => !selectedSet.has(i));
  }, [categories, categoriesSelected]);

  const handleSearch = useCallback(() => {
    onSearch(
      categoriesSelected,
      includeEasy ? Inclusion.Easy : Inclusion.Default
    );
  }, [categoriesSelected, includeEasy]);

  const handleAllSearch = useCallback(() => {
    onSearch(categoriesSelected, Inclusion.All);
  }, [categoriesSelected]);

  return (
    <>
      <Autocomplete
        className="ingredient-search"
        options={options}
        inputValue={inputValue}
        disableClearable
        onInputChange={(_, value, reason) => {
          setInputValue(reason === 'reset' ? '' : value);
        }}
        onChange={(_, value, reason) => {
          if (
            reason === 'select-option' &&
            value &&
            !categoriesSelected.includes(value)
          ) {
            setSelected([...categoriesSelected, value].sort());
            onSelectionChange();
          }
        }}
        renderInput={params => (
          <TextField
            {...params}
            label="What's in your bar?"
            variant="outlined"
          />
        )}
      />

      <div className="chip-list">
        {categoriesSelected.map(i => (
          <Chip
            key={i}
            className="chip"
            variant="outlined"
            label={i}
            onDelete={() => {
              setSelected(categoriesSelected.filter(s => s !== i));
              onSelectionChange();
            }}
          />
        ))}
      </div>

      {!!invalidCategories.length && (
        <>
          <h3>Invalid Categories</h3>
          <div className="chip-list">
            {invalidCategories.map(i => (
              <Chip
                key={i}
                className="chip"
                variant="outlined"
                color="secondary"
                label={i}
                onDelete={() => {
                  setSelected(categoriesSelected.filter(s => s !== i));
                  onSelectionChange();
                }}
              />
            ))}
          </div>
        </>
      )}

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
