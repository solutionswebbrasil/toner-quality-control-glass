import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartModal } from './ChartModal';
import { Maximize2 } from 'lucide-react';

export const IshikawaPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  // Dados do diagrama de Ishikawa (Espinha de Peixe)
  const ishikawaData = {
    problema: "Defeitos em Toners",
    categorias: [
      {
        nome: "Máquina/Equipamento",
        causas: [
          "Desgaste de peças",
          "Calibragem inadequada",
          "Manutenção insuficiente",
          "Equipamentos obsoletos"
        ]
      },
      {
        nome: "Material",
        causas: [
          "Qualidade da matéria-prima",
          "Fornecedores inadequados",
          "Armazenamento incorreto",
          "Especificações não atendidas"
        ]
      },
      {
        nome: "Método",
        causas: [
          "Procedimentos inadequados",
          "Falta de padronização",
          "Treinamento insuficiente",
          "Instruções não claras"
        ]
      },
      {
        nome: "Mão de Obra",
        causas: [
          "Falta de treinamento",
          "Experiência insuficiente",
          "Sobrecarga de trabalho",
          "Motivação baixa"
        ]
      },
      {
        nome: "Meio Ambiente",
        causas: [
          "Temperatura inadequada",
          "Umidade excessiva",
          "Contaminação",
          "Espaço insuficiente"
        ]
      },
      {
        nome: "Medida",
        causas: [
          "Instrumentos descalibrados",
          "Frequência inadequada",
          "Critérios mal definidos",
          "Dados insuficientes"
        ]
      }
    ]
  };

  const IshikawaDiagram = ({ isModal = false }) => {
    const containerHeight = isModal ? "80vh" : "600px";
    
    return (
      <div className="relative w-full overflow-hidden bg-slate-50 dark:bg-slate-900 rounded-lg border" style={{ height: containerHeight }}>
        <svg width="100%" height="100%" viewBox="0 0 1200 600" className="absolute inset-0">
          {/* Linha principal (espinha central) */}
          <line x1="150" y1="300" x2="1050" y2="300" stroke="#374151" strokeWidth="4" />
          
          {/* Cabeça do peixe (problema) */}
          <polygon points="1050,300 1100,280 1100,320" fill="#dc2626" />
          
          {/* Texto do problema */}
          <text x="950" y="295" textAnchor="middle" className="fill-slate-700 dark:fill-slate-300 text-lg font-bold">
            {ishikawaData.problema}
          </text>
          
          {/* Categorias e causas */}
          {ishikawaData.categorias.map((categoria, index) => {
            const isTop = index < 3;
            const xPosition = 200 + (index % 3) * 280;
            const yPosition = isTop ? 150 : 450;
            const lineY = isTop ? 300 - 150 : 300 + 150;
            
            return (
              <g key={categoria.nome}>
                {/* Linha da categoria */}
                <line 
                  x1={xPosition} 
                  y1={lineY} 
                  x2={xPosition + 150} 
                  y2="300" 
                  stroke="#6b7280" 
                  strokeWidth="3" 
                />
                
                {/* Texto da categoria */}
                <text 
                  x={xPosition - 10} 
                  y={isTop ? lineY - 10 : lineY + 20} 
                  textAnchor="middle" 
                  className="fill-blue-600 dark:fill-blue-400 text-sm font-bold"
                >
                  {categoria.nome}
                </text>
                
                {/* Causas */}
                {categoria.causas.map((causa, causaIndex) => {
                  const causaY = isTop 
                    ? lineY - 30 - (causaIndex * 25)
                    : lineY + 30 + (causaIndex * 25);
                  const causaX = xPosition - 20 - (causaIndex * 15);
                  
                  return (
                    <g key={causa}>
                      {/* Linha da causa */}
                      <line 
                        x1={causaX} 
                        y1={causaY} 
                        x2={causaX + 40} 
                        y2={isTop ? causaY + 20 : causaY - 20} 
                        stroke="#9ca3af" 
                        strokeWidth="2" 
                      />
                      
                      {/* Texto da causa */}
                      <text 
                        x={causaX - 5} 
                        y={isTop ? causaY - 5 : causaY + 15} 
                        textAnchor="end" 
                        className="fill-slate-600 dark:fill-slate-400 text-xs"
                      >
                        {causa}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
        
        {/* Legenda */}
        <div className="absolute bottom-4 left-4 bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border">
          <h4 className="font-semibold text-sm mb-2">Análise de Ishikawa - 6M</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
              <span>Categorias</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-500 rounded mr-2"></div>
              <span>Causas</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">
          Análise de Ishikawa (Diagrama Espinha de Peixe)
        </h1>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Diagrama de Causa e Efeito - Defeitos em Toners</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setModalOpen(true)}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <IshikawaDiagram />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ishikawaData.categorias.map((categoria, index) => (
          <Card key={categoria.nome}>
            <CardHeader>
              <CardTitle className="text-lg">{categoria.nome}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {categoria.causas.map((causa, causaIndex) => (
                  <li key={causaIndex} className="text-sm text-slate-600 dark:text-slate-400 flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {causa}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <ChartModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Análise de Ishikawa - Diagrama Completo"
      >
        <IshikawaDiagram isModal={true} />
      </ChartModal>
    </div>
  );
};