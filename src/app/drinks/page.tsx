import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { container, header, grid } from '../../styles/layout.css';
import { row } from '../../styles/flex.css';

function DrinksPage() {
  return (
    <main className={container}>
      <div className={header}>
        <h1>Drinks</h1>
        <Button variant="secondary">Add Drink</Button>
      </div>
      
      <div className={grid({ columns: 3 })}>
        <Card
          title="Coming Soon"
          description="Drink listings will appear here"
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

export default DrinksPage; 