import React, { useEffect } from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import './spec-list.css';
import { FormattedSpec } from '../types';
import usePartialRender from '../hooks/usePartialRender';
import { getSpecId } from '../orm';

interface Props {
  specs: FormattedSpec[];
}

const Spec = React.memo(({ spec }: { spec: FormattedSpec }) => {
  return (
    <Card className="spec">
      <CardContent>
        <h3>{spec.name}</h3>
        <p className="secondary origin">
          {spec.origin} - {spec.pageNum}
        </p>
        <ul>
          {spec.ingredients.map(i => (
            <li
              key={i.id}
              className={`secondary list-item ${i.missing ? 'missing' : ''}`}
            >
              {i.name} <span className="category">({i.category})</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
});

export default function SpecList({ specs }: Props) {
  const { maxToRender, triggerRef } = usePartialRender(specs.length);

  return (
    <>
      <div id="specs">
        {specs.slice(0, maxToRender).map(spec => (
          <Spec key={getSpecId(spec)} spec={spec} />
        ))}
        <div ref={triggerRef} />
      </div>
    </>
  );
}
