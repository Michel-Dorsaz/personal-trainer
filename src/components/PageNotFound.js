import React from 'react';
import NavigationBar from './NavigationBar';

function PageNotFound() {

    return (
        <>
            <NavigationBar/>
            <div style={{verticalAlign:'center'}}>
                <h1>Page not found!</h1>
            </div>
        </>
    );
  }

export default PageNotFound;
