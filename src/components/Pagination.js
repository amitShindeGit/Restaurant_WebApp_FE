import React from "react";
// totalPage:number BE ... 
const Pagination = ({ postsPerPage, totalPosts, paginate }) => {
  const pageNumber = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumber.push(i);
  }

  return (
    <div >
      <ul className="pagination" style={{ margin: '0 auto', justifyContent:'center'}}>
        {pageNumber.map((number) => {
         return( <li key={number}  className="page-item">
            <button onClick={() => paginate(number)} className="page-link">
              {number} 
            </button>
          </li>
         )
        })}
      </ul>
    </div>
  );
};

export default Pagination;
