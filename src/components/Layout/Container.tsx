import { ReactNode } from 'react';
import { atoms } from '../../styles/sprinkles.css';
import { container } from './Container.css';

interface ContainerProps {
  children: ReactNode;
}

function Container({ children }: ContainerProps) {
  return (
    <div className={container}>
      <div className={atoms({
        paddingX: 4,
        paddingY: 8,
      })}>
        {children}
      </div>
    </div>
  );
}

export { Container }; 