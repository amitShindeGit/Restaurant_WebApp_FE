import React from "react";

const divStyle = {
  width: "500px",
  height: "80px",
  display: 'flex',
  position: "absolute",
  top: "0",
  bottom: "0",
  left: "0",
  right: "0",
  margin: "auto",
};

const Forbidden = ({errorMsg, code}) => {
  return (
    <div style={divStyle}>
      {code && <h1 style={{ borderRight: "1px solid", paddingRight: '1rem' }}>401 </h1>}
      <h1 style={{ paddingLeft: '1rem' }}>{errorMsg}</h1>
    </div>
  );
};

export default Forbidden;
