import React, { useCallback, useState } from 'react';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import './filter-bar.css';
import KeywordSearch from './keyword-search';

export enum Inclusion {
  Default,
  Easy,
  All,
}

interface Props {
  onSearch: (selected: string[], inclusion: Inclusion) => void;
  onKeywordSearch: (keywords: string[], inclusion: Inclusion) => void;
  keywords: string[];
  selectedCategories: string[];
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
  onSearch,
  onKeywordSearch,
  selectedCategories,
}: Props) {
  const [includeEasy, setEasy] = useState(false);
  const [includeBarOnly, setBarOnly] = useState(true);

  const handleToggle = useCallback(
    ({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) => {
      setBarOnly(checked);

      onSearch(selectedCategories, inclusionFromToggle(includeEasy, checked));
    },
    [selectedCategories, includeEasy]
  );

  const handleEasyToggle = useCallback(
    ({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) => {
      setEasy(checked);

      onSearch(
        selectedCategories,
        inclusionFromToggle(checked, includeBarOnly)
      );
    },
    [selectedCategories, includeBarOnly]
  );

  const handleKeywordSearch = useCallback(
    (keywords: string[]) => {
      onKeywordSearch(
        keywords,
        inclusionFromToggle(includeEasy, includeBarOnly)
      );
    },
    [includeBarOnly, includeEasy]
  );

  return (
    <div id="filter-bar">
      <FormControlLabel
        control={<Switch defaultChecked onChange={handleToggle} />}
        label="Include only specs with bar ingredients"
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
      />

      <KeywordSearch onSearch={handleKeywordSearch} />
    </div>
  );
}
