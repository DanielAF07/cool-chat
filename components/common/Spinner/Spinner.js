import React from 'react';
import style from './Spinner.module.css'

const Spinner = ({color = 'red', size = '50px'}) => {
    return (
        <div 
            className={style.spinner}
            style={{
                width: size, 
                height: size
            }}
        >
            <div 
                className={style['double-bounce1']}
                style={{backgroundColor: color}}
            ></div>
            <div 
                className={style['double-bounce2']}
                style={{backgroundColor: color}}
            ></div>
        </div>
    );
};

export default Spinner;