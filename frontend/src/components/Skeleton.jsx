import React from 'react';

const Skeleton = ({ type }) => {
    const baseStyle = {
        backgroundColor: '#202020',
        borderRadius: '4px',
        animation: 'skeleton-loading 1.5s infinite',
    };

    if (type === 'card') {
        return (
            <div style={{ ...baseStyle, width: '100%', height: '300px', marginBottom: '20px' }}></div>
        );
    }

    if (type === 'text') {
        return (
            <div style={{ ...baseStyle, width: '100%', height: '20px', marginBottom: '10px' }}></div>
        );
    }

    if (type === 'title') {
        return (
            <div style={{ ...baseStyle, width: '60%', height: '40px', marginBottom: '20px' }}></div>
        );
    }

    return <div style={baseStyle}></div>;
};

export default Skeleton;
