import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';

const PublicLayout: React.FC = () => {
    return (
        <>
            <Header />
            <Outlet />
        </>
    );
};

export default PublicLayout;
