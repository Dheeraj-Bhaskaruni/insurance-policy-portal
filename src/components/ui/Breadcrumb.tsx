import React from 'react';
import { Link } from 'react-router-dom';

import './Breadcrumb.css';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={item.label} className="breadcrumb-item">
              {!isLast && item.to ? (
                <>
                  <Link to={item.to} className="breadcrumb-link">
                    {item.label}
                  </Link>
                  <span className="breadcrumb-separator" aria-hidden="true">
                    /
                  </span>
                </>
              ) : (
                <span className="breadcrumb-current" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
