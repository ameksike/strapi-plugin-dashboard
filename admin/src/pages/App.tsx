import { Page } from '@strapi/strapi/admin';
import { Routes, Route } from 'react-router-dom';

import { HomePage } from './HomePage';
import ViewPage from './ViewPage';

const App = () => {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="/:id" element={<ViewPage />} />
      <Route path="*" element={<Page.Error />} />
    </Routes>
  );
};

export { App };
