import React, { useCallback, useMemo, useState } from 'react';

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import useLocalStorage from '../hooks/useLocalStorage';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import './searchbar.css';

export enum Inclusion {
  Default,
  Easy,
  All,
}

interface Props {
  ingredients: string[];
  onSearch: (selected: string[], inclusion: Inclusion) => void;
}

const BAR_INGREDIENTS_KEY = 'bar-ingredients';

export default function Searchbar({ ingredients, onSearch }: Props) {
  const [inputValue, setInputValue] = useState('');
  const [includeEasy, setEasy] = useState(false);

  // TODO: validate that the localstorage ingredients are still valid
  const [ingredientsSelected, setSelected] = useLocalStorage<string[]>(
    BAR_INGREDIENTS_KEY,
    []
  );

  const options = useMemo(() => {
    const selectedSet = new Set(ingredientsSelected);
    return ingredients.filter(i => !selectedSet.has(i));
  }, [ingredients, ingredientsSelected]);

  const handleSearch = useCallback(() => {
    onSearch(
      ingredientsSelected,
      includeEasy ? Inclusion.Easy : Inclusion.Default
    );
  }, [ingredientsSelected, includeEasy]);

  const handleAllSearch = useCallback(() => {
    onSearch(ingredientsSelected, Inclusion.All);
  }, [ingredientsSelected]);

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
            !ingredientsSelected.includes(value)
          ) {
            setSelected([...ingredientsSelected, value].sort());
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
      <div id="chip-list">
        {ingredientsSelected.map(i => (
          <Chip
            className="chip"
            variant="outlined"
            label={i}
            onDelete={() => {
              setSelected(ingredientsSelected.filter(s => s !== i));
            }}
          />
        ))}
      </div>
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
