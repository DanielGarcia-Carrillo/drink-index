import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';

interface Props {
  onSearch: (keywords: string[]) => void;
}

export default function KeywordSearch({ onSearch }: Props) {
  const [keywords, setKeywords] = useState<string[]>([]);
  return (
    <div>
      <TextField
        className="keyword-search"
        label="What would you like to use?"
        onKeyPress={e => {
          if (e.key === 'Enter') {
            const newKeywords = [...keywords, e.target.value].sort();
            setKeywords(newKeywords);
            onSearch(newKeywords);
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
              const newKeywords = keywords.filter(k => k !== word);
              setKeywords(newKeywords);
              onSearch(newKeywords);
            }}
          />
        ))}
      </div>
    </div>
  );
}
