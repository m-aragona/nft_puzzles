import React from "react";
import styled from "styled-components";

export const Grid = styled.div`
  width: 500px;
  height: 500px;
  display: flex;
  justify-content: start;
  flex-wrap: wrap;
`;

export const GridImage = styled.div`
  flex-grow: 1;
  border: 1px solid white;

  display: flex;
  justify-content: center;
  align-items: center;

  background-image: ${props => `url("${props.src}")`};
  background-size: ${props => `${props.b_size}`};

`;
//  background-size: ${props => `${props.b_size}`};

// export const GridImage = styled.div`
//   flex-grow: 1;
//   border: 1px solid white;

//   display: flex;
//   justify-content: center;
//   align-items: center;

//   background-image: ${props => `url("${props.src}")`};
//   background-size: cover;
//   overflow: hidden;
//   background-position: 50%;
// `;


const GridItemWrapper = styled.div`
  flex: ${props => `${props._flex}`};
  display: flex;
  justify-content: center;
  align-items: stretch;

  box-sizing: border-box;

  :before {
    content: "";
    display: table;
    padding-top: 100%;
  }
`;

export const GridItem = ({ forwardedRef, ...props }) => (
  <GridItemWrapper ref={forwardedRef} {...props} />
);
