import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';

import './keyword-search.css';

interface Props {
  keywords: string[];
  onSearch: (newKeywords: string[]) => void;
}

export default function KeywordSearch({ keywords, onSearch }: Props) {
  return (
    <>
      <TextField
        className="keyword-search"
        label="What would you like?"
        placeholder="Whiskey, Daiquiri..."
        onKeyPress={e => {
          if (e.key === 'Enter') {
            onSearch([...keywords, e.target.value].sort());
          }
        }}
        variant="outlined"
        type="search"
      />

      <div className="chip-list">
        {keywords.map(word => (
          <Chip
            key={word}
            className="chip"
            variant="outlined"
            label={word}
            onDelete={() => {
              onSearch(keywords.filter(k => k !== word));
            }}
          />
        ))}
      </div>
    </>
  );
}
