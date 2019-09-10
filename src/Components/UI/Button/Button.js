import React from 'react';

const button = (prop) => (
    <button
        onClick={props.clicked}
    >{props.children}</button>
);
export default button;