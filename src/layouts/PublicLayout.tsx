import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';

const PublicLayout: React.FC = () => {
    return (
        <>
            <Header />
            <Outlet />
            <BottomNav />
        </>
    );
};

export default PublicLayout;
