import Image from 'next/image';
import React from 'react';
import Spinner from './common/Spinner/Spinner';
import styled from 'styled-components'

const Loading = () => {
    return (
        <center style={{ display: 'grid', placeItems: 'center', height: '100vh'}}>
            <div>
                <Image 
                    src="https://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png"
                    alt="Whatsapp" 
                    height="200"
                    width="200"
                    style={{ marginBottom: "10px" }}
                />
                <Spinner color="#3cbc28" size={60}/>
            </div>
        </center>
    );
};

export default Loading;