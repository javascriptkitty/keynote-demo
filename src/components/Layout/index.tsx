import { type ReactNode } from 'react';
import Header from '../Header';
import './index.css';

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="layout">
            <Header />
            <main>{children}</main>
        </div>
    );
};

export default Layout;
