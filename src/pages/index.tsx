import React, { useCallback, useState } from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import Layout from '../components/layout';
import SEO from '../components/seo';
import data from '../../data/json/denormalized-combined-2.json';

import './index.css';
import Searchbar, { Inclusion } from '../components/searchbar';

const specs = Object.values(data)
  .flat()
  .sort((a, b) => a.name.localeCompare(b.name));

type SpecList = typeof specs;

const ingredients = Array.from(
  new Set(
    specs
      .map(s => s.ingredients)
      .flat()
      .map(ingredient => ingredient.ingredientCategory)
  )
).sort();

const EASY_TO_GET = ['Syrup', 'Sugar', 'Juice', 'Fruit', 'Beer'];

function getSpecsWithIngredients(
  list: SpecList,
  selected: string[],
  inclusion: Inclusion
): SpecList {
  const selectedSet = new Set(selected);

  return list.filter(s =>
    s.ingredients.every(ingredient => {
      const { ingredientCategory } = ingredient;
      const hasCategory = selectedSet.has(ingredientCategory);

      ingredient.missing = !hasCategory;

      return (
        hasCategory ||
        (inclusion === Inclusion.Easy &&
          EASY_TO_GET.some(i => ingredientCategory.includes(i)))
      );
    })
  );
}

function allSpecsAnnotated(list: SpecList, selected: string[]): SpecList {
  const selectedSet = new Set(selected);

  return list.map(spec => {
    spec.ingredients.forEach(ingredient => {
      const { ingredientCategory } = ingredient;

      ingredient.missing = !selectedSet.has(ingredientCategory);
    });

    return spec;
  });
}

export default function IndexPage() {
  const [availableSpecs, setSpecs] = useState<SpecList>([]);

  const handleSearch = useCallback(
    (selected: string[], inclusion: Inclusion) => {
      setSpecs(
        inclusion === Inclusion.All
          ? allSpecsAnnotated(specs, selected)
          : getSpecsWithIngredients(specs, selected, inclusion)
      );
    },
    []
  );

  return (
    <Layout>
      <SEO title="Cocktails" />
      <Searchbar ingredients={ingredients} onSearch={handleSearch} />
      <div id="recipes">
        {availableSpecs.map(spec => (
          <Card>
            <CardContent className="spec">
              <p className="secondary origin">
                {spec.origin} - {spec.pageNum}
              </p>
              <h3>{spec.name}</h3>
              <ul>
                {spec.ingredients.map(i => (
                  <li className={`secondary ${i.missing ? 'missing' : ''}`}>
                    {i.ingredient}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </Layout>
  );
}
