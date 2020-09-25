import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';

import './keyword-search.css';

interface Props {
  keywords: string[];
  onSearch: (newKeywords: string[]) => void;
}

export default function KeywordSearch({ keywords, onSearch }: Props) {
  const [currentText, setText] = useState('');

  return (
    <div className="keyword-search">
      <TextField
        className="keyword-search-input"
        label="What would you like?"
        placeholder="Whiskey, Daiquiri..."
        value={currentText}
        onKeyPress={e => {
          const inputValue = e.target.value;
          if (e.key === 'Enter') {
            onSearch([...keywords, inputValue].sort());
            setText('');
          }
        }}
        onChange={({ target: { value } }) => {
          if (value !== currentText) {
            setText(value);
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
    </div>
  );
}
