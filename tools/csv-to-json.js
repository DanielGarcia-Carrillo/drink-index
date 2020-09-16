function csvToJSON() {
  const converter = require('csvtojson');
  let sc;
  converter()
    .fromFile('./csv/SC.csv')
    .then(json => (sc = json));
}

// structure:
// Record<string, Spec[]>
// interface Spec {
//   name: string
//   origin: string
//   pageNum: number
//   ingredients: Ingredient[]
//   instructions: string
// }

// Field9 is useless
function extractIngredient({ field9, isInfusion, ...ingredient }) {
  return {
    ...ingredient,
    isInfusion: !!isInfusion,
  };
}

function canonicalSort(json) {
  return json.sort((a, b) => a.index - b.index);
}

function denormalize(json, origin, prevResult = {}) {
  const deepcopy = require('deepcopy');

  const result = deepcopy(prevResult);
  canonicalSort(json)
    .filter(({ name, ingredient }) => name && ingredient)
    .forEach(({ name, pageNum, instruction, misc, ...ingredient }) => {
      result[name] = result[name] || [];
      const spec = result[name].find(s => s.origin === origin);

      if (spec) {
        spec.ingredients.push(extractIngredient(ingredient));
        if (instruction) {
          // first line may have been blank
          spec.instructions = (spec.instructions || '') + ' ' + instruction;
        }
        if (misc) {
          spec.originNotes = (spec.originNotes || '') + ' ' + misc;
        }
      } else {
        result[name].push({
          name,
          origin,
          pageNum,
          ingredients: [extractIngredient(ingredient)],
          instructions: instruction,
          originNotes: misc,
        });
      }
    });

  return result;
}

function readAndCombine(options) {
  const fs = require('fs');

  const data = [
    [require('../data/json/SC.json'), "Smuggler's Cove"],
    [require('../data/json/D&Co.json'), 'Death & Co'],
  ].reduce((acc, [json, origin]) => denormalize(json, origin, acc), {});

  fs.writeFileSync(
    `../data/json/denormalized-combined-${options.version}.json`,
    JSON.stringify(data, null, 2)
  );
}

readAndCombine({ version: 1 });
