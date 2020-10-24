import React, { useCallback, useState } from 'react';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';

import './filter-bar.css';
import KeywordSearch from './keyword-search';

export enum Inclusion {
  Default,
  Easy,
  All,
}

export enum SortOrder {
  Alphabetical,
  MissingCount,
  PageNumber,
  TotalIngredients,
}

interface Props {
  onSearch: (selected: string[], inclusion: Inclusion) => void;
  onKeywordSearch: (keywords: string[], inclusion: Inclusion) => void;
  onSort: (order: SortOrder) => void;
  keywords: string[];
  selectedCategories: string[];
  sort: SortOrder | undefined;
  totalResults: number | undefined;
}

function inclusionFromToggle(
  includeEasy: boolean,
  includeBarOnly: boolean
): Inclusion {
  if (!includeBarOnly) {
    return Inclusion.All;
  }

  return includeEasy ? Inclusion.Easy : Inclusion.Default;
}

export default function Filterbar({
  keywords,
  onSearch,
  onKeywordSearch,
  onSort,
  totalResults,
  selectedCategories,
  sort = SortOrder.Alphabetical,
}: Props) {
  const [includeEasy, setEasy] = useState(false);
  const [includeBarOnly, setBarOnly] = useState(false);

  const handleToggle = useCallback(
    ({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) => {
      setBarOnly(checked);

      onSearch(selectedCategories, inclusionFromToggle(includeEasy, checked));
    },
    [selectedCategories, includeEasy, onSearch]
  );

  const handleEasyToggle = useCallback(
    ({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) => {
      setEasy(checked);

      onSearch(
        selectedCategories,
        inclusionFromToggle(checked, includeBarOnly)
      );
    },
    [selectedCategories, includeBarOnly, onSearch]
  );

  const handleKeywordSearch = useCallback(
    (newKeywords: string[]) => {
      debugger;
      onKeywordSearch(
        newKeywords,
        inclusionFromToggle(includeEasy, includeBarOnly)
      );
    },
    [includeBarOnly, includeEasy, onKeywordSearch]
  );

  const handleSort = useCallback(
    (e: React.ChangeEvent<{ value: any }>) => {
      onSort(e.target.value);
    },
    [onSort]
  );

  return (
    <div id="filter-bar">
      <div className="results-header">
        <KeywordSearch keywords={keywords} onSearch={handleKeywordSearch} />

        <FormControl variant="outlined" className="sort-menu">
          <InputLabel htmlFor="sort-menu-select">Sort Order</InputLabel>
          <Select id="sort-menu-select" value={sort} onChange={handleSort}>
            <MenuItem value={SortOrder.Alphabetical}>Alphabetical</MenuItem>
            <MenuItem value={SortOrder.MissingCount}>
              # Missing Ingredients
            </MenuItem>
            <MenuItem value={SortOrder.PageNumber}>Page number</MenuItem>
            <MenuItem value={SortOrder.TotalIngredients}>
              Total Ingredients
            </MenuItem>
          </Select>
        </FormControl>
      </div>

      {Number.isInteger(totalResults) && <h3>{totalResults} matching specs</h3>}
      {/* <FormControlLabel
        control={<Switch defaultChecked onChange={handleToggle} />}
        label="Limit to back bar ingredients"
      />

      <FormControlLabel
        label="Include easily attainable ingredients"
        control={
          <Switch
            checked={includeEasy}
            disabled={!includeBarOnly}
            onChange={handleEasyToggle}
          />
        }
      /> */}
    </div>
  );
}
