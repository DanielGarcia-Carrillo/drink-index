import { Link } from 'gatsby';
import React from 'react';

import LocalBarIcon from '@material-ui/icons/LocalBar';
import Button from '@material-ui/core/Button';

interface Props {
  siteTitle: string;
  maxWidth: number;
}

const Header = ({ siteTitle, maxWidth }: Props) => (
  <header>
    <div id="header-contents">
      <h1 className="title" style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            color: `white`,
            textDecoration: `none`,
          }}
        >
          <span className="text-title">{siteTitle}</span>
          <span className="icon-title">
            <LocalBarIcon />
          </span>
        </Link>
      </h1>
      <nav style={{ display: 'flex' }}>
        {[
          ['/', 'Search'],
          ['/bar-back', 'Bar Back'],
        ].map(([href, text]) => (
          <Button key={href} className="nav-link" color="inherit" href={href}>
            {text}
          </Button>
        ))}
      </nav>
    </div>
  </header>
);

export default Header;
