import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import Layout from '../components/layout';
import SEO from '../components/seo';
import data from '../../data/json/denormalized-combined.json';

import './index.css';

type X = Record<string, string>;

export default function IndexPage() {
  return (
    <Layout>
      <SEO title="Cocktails" />
      <div id="recipes">
        {Object.values(data)
          .flat()
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(spec => (
            <Card>
              <CardContent className="spec">
                <p className="secondary origin">{spec.origin}</p>
                <h3>{spec.name}</h3>
                <h4>Ingredients</h4>
                <ul>
                  {(spec.ingredients || []).map(i => (
                    <li className="secondary">{i.ingredient}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
      </div>
    </Layout>
  );
}
