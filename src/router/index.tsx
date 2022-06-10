import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Loadding from '@/components/Loadding';

import Routes from './Routes';

const Router = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <React.Suspense fallback={<Loadding />}>
        <Routes />
      </React.Suspense>
    </BrowserRouter>
  );
};

export default Router;

export * from './cnode';
export * from './Routes';
