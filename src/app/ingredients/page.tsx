import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { container, header, grid } from '../../styles/layout.css';
import { row } from '../../styles/flex.css';

function IngredientsPage() {
  return (
    <main className={container}>
      <div className={header}>
        <h1>Ingredients</h1>
        <Button variant="secondary">Add Ingredient</Button>
      </div>

      <div className={grid({ columns: 4, gap: 'small' })}>
        <Card
          title="Coming Soon"
          description="Ingredient listings will appear here"
          footer={
            <div className={row({ justify: 'end' })}>
              <Button variant="ghost" size="sm">View Details</Button>
            </div>
          }
        />
      </div>
    </main>
  );
}

export default IngredientsPage; 