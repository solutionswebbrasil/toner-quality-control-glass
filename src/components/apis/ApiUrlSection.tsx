
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy, Eye, EyeOff } from 'lucide-react';

interface ApiUrlSectionProps {
  apiUrl: string;
  showUrl: boolean;
  onToggleShowUrl: () => void;
  onCopyUrl: () => void;
}

export const ApiUrlSection: React.FC<ApiUrlSectionProps> = ({
  apiUrl,
  showUrl,
  onToggleShowUrl,
  onCopyUrl
}) => {
  return (
    <div>
      <Label htmlFor="api-url">URL da API</Label>
      <div className="flex gap-2 mt-1">
        <Input
          id="api-url"
          value={showUrl ? apiUrl : '••••••••••••••••••••••••••••••••'}
          readOnly
          className="font-mono text-sm"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleShowUrl}
          title={showUrl ? "Ocultar URL" : "Mostrar URL"}
        >
          {showUrl ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onCopyUrl}
          title="Copiar URL"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
