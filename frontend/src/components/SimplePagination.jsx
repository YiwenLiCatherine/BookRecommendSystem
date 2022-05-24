import { Button, Pagination } from '@mui/material';
import React from 'react';

const SimplePagination = ({ postsPerPage, totalPosts, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav style={{marginLeft: "auto", marginRight: "auto", width: "100%"}}>
      <span style={{display: "inline"}}>
        {pageNumbers.map(number => (
            <Button onClick={() => paginate(number)} className='page-link'>
                {number}
            </Button>
        ))}
      </span>
    </nav>
  );
};

export default SimplePagination;