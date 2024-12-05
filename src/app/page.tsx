import { Button } from '../components/Button';
import { container, header } from '../styles/layout.css';
import { row } from '../styles/flex.css';

function HomePage() {
  return (
    <main className={container}>
      <div className={header}>
        <h1>Welcome to Drink Index</h1>
        <Button>Get Started</Button>
      </div>
      
      <div className={row({ justify: 'center' })}>
        <p>A modern cocktail search application</p>
      </div>
    </main>
  );
}

export default HomePage; 