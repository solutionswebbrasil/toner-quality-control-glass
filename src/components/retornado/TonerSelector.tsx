
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { Toner } from '@/types';

interface TonerSelectorProps {
  toners: Toner[];
  selectedTonerId: string;
  onTonerChange: (tonerId: string) => void;
}

export const TonerSelector: React.FC<TonerSelectorProps> = ({
  toners,
  selectedTonerId,
  onTonerChange
}) => {
  const [searchToner, setSearchToner] = useState('');
  const [showTonerSearch, setShowTonerSearch] = useState(false);
  const [filteredToners, setFilteredToners] = useState<Toner[]>([]);

  useEffect(() => {
    setFilteredToners(toners);
  }, [toners]);

  useEffect(() => {
    if (searchToner.trim() === '') {
      setFilteredToners(toners);
    } else {
      const filtered = toners.filter(toner => 
        toner.modelo.toLowerCase().includes(searchToner.toLowerCase()) ||
        toner.cor.toLowerCase().includes(searchToner.toLowerCase())
      );
      setFilteredToners(filtered);
    }
  }, [searchToner, toners]);

  const handleTonerSelect = (tonerId: string) => {
    onTonerChange(tonerId);
    setShowTonerSearch(false);
    setSearchToner('');
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="id_modelo">Modelo do Toner *</Label>
      {!showTonerSearch ? (
        <div className="flex gap-2">
          <Select value={selectedTonerId} onValueChange={handleTonerSelect}>
            <SelectTrigger className="bg-white/50 dark:bg-slate-800/50 backdrop-blur flex-1">
              <SelectValue placeholder="Selecione o modelo" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 shadow-lg max-h-60">
              {toners.map((toner) => (
                <SelectItem key={toner.id} value={toner.id!.toString()}>
                  {toner.modelo} - {toner.cor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setShowTonerSearch(true)}
            className="bg-white/50 dark:bg-slate-800/50 backdrop-blur"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Digite para buscar modelo ou cor..."
              value={searchToner}
              onChange={(e) => setSearchToner(e.target.value)}
              className="bg-white/50 dark:bg-slate-800/50 backdrop-blur flex-1"
              autoFocus
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowTonerSearch(false);
                setSearchToner('');
              }}
              className="bg-white/50 dark:bg-slate-800/50 backdrop-blur"
            >
              Cancelar
            </Button>
          </div>
          <div className="max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md bg-white/50 dark:bg-slate-800/50 backdrop-blur">
            {filteredToners.length > 0 ? (
              filteredToners.map((toner) => (
                <div
                  key={toner.id}
                  className="p-3 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                  onClick={() => handleTonerSelect(toner.id!.toString())}
                >
                  <div className="font-medium">{toner.modelo}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{toner.cor}</div>
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-gray-500 dark:text-gray-400">
                Nenhum toner encontrado
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
