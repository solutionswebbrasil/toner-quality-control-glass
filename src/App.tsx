
import React from 'react';
import { AppProviders } from '@/components/AppProviders';
import { AppRoutes } from '@/config/routes';

function App() {
  const handleSuccess = () => {
    console.log('Operation completed successfully');
  };

  const handlePageChange = (page: string) => {
    console.log('Page changed to:', page);
  };

  return (
    <AppProviders>
      <AppRoutes 
        handleSuccess={handleSuccess}
        handlePageChange={handlePageChange}
      />
    </AppProviders>
  );
}

export default App;
