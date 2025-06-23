import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface DisabledFeatureMessageProps {
  title: string;
  description: string;
}

export const DisabledFeatureMessage: React.FC<DisabledFeatureMessageProps> = ({ title, description }) => {
  return (
    <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
          <AlertCircle className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-yellow-700 dark:text-yellow-300 text-sm">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};