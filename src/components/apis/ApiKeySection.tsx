
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

interface ApiKeySectionProps {
  apiKey: string;
  onCopyKey: () => void;
}

export const ApiKeySection: React.FC<ApiKeySectionProps> = ({
  apiKey,
  onCopyKey
}) => {
  return (
    <div>
      <Label htmlFor="api-key">Chave de API (Opcional)</Label>
      <div className="flex gap-2 mt-1">
        <Input
          id="api-key"
          value={apiKey}
          readOnly
          className="font-mono text-sm"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={onCopyKey}
          title="Copiar Chave"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-slate-500 mt-1">
        Adicione como header: X-API-Key para acesso autenticado
      </p>
    </div>
  );
};
