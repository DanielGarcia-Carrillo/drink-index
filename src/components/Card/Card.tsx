import { ReactNode } from 'react';
import { cardStyles } from './Card.css';

interface CardProps {
  title?: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
}

function Card({ title, description, children, footer }: CardProps) {
  return (
    <div className={cardStyles.base}>
      {(title || description) && (
        <div className={cardStyles.header}>
          {title && <h3 className={cardStyles.title}>{title}</h3>}
          {description && <p className={cardStyles.description}>{description}</p>}
        </div>
      )}
      
      {children && (
        <div className={cardStyles.content}>
          {children}
        </div>
      )}
      
      {footer && (
        <div className={cardStyles.footer}>
          {footer}
        </div>
      )}
    </div>
  );
}

export { Card };
export type { CardProps }; 