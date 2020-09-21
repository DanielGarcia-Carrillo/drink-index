import React, { useCallback, useMemo, useState } from 'react';

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import './searchbar.css';
import { getInvalidCategories } from '../orm';
import useBarInventory from '../hooks/useBarInventory';

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

export default function Searchbar({
  categories,
  onSearch,
  onSelectionChange,
}: Props) {
  const [inputValue, setInputValue] = useState('');
  const [includeEasy, setEasy] = useState(false);

  const { selectedCategories, setCategory, deleteCategory } = useBarInventory();

  const invalidCategories = getInvalidCategories(selectedCategories);

  const options = useMemo(() => {
    const selectedSet = new Set(selectedCategories);
    return categories.filter(i => !selectedSet.has(i));
  }, [categories, selectedCategories]);

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
            !selectedCategories.includes(value)
          ) {
            setCategory(value);
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
        {selectedCategories.map(i => (
          <Chip
            key={i}
            className="chip"
            variant="outlined"
            label={i}
            onDelete={() => {
              deleteCategory(i);
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
                  deleteCategory(i);
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
