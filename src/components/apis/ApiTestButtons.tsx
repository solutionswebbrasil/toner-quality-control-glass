
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, ExternalLink } from 'lucide-react';

interface ApiTestButtonsProps {
  isTestingApi: boolean;
  onTestApi: () => void;
  onOpenInBrowser: () => void;
}

export const ApiTestButtons: React.FC<ApiTestButtonsProps> = ({
  isTestingApi,
  onTestApi,
  onOpenInBrowser
}) => {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={onTestApi}
        disabled={isTestingApi}
        className="flex items-center gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${isTestingApi ? 'animate-spin' : ''}`} />
        {isTestingApi ? 'Testando...' : 'Testar API'}
      </Button>
      <Button
        variant="outline"
        onClick={onOpenInBrowser}
        className="flex items-center gap-2"
      >
        <ExternalLink className="h-4 w-4" />
        Abrir no Navegador
      </Button>
    </div>
  );
};
