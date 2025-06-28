import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Download } from 'lucide-react';

export const MobileAppAccess: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mobile App Access</CardTitle>
        <CardDescription>
          Access Salenus A.I on iOS and Android with basic offline functionality.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <Smartphone className="h-6 w-6 text-blue-600" />
          <span className="text-slate-700 font-medium">Download the App</span>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://salenus.ai/app" alt="QR Code" className="rounded" />
          <div className="flex flex-col gap-2">
            <a href="#" className="flex items-center gap-2 text-blue-600 hover:underline">
              <Download className="h-4 w-4" /> iOS App (coming soon)
            </a>
            <a href="#" className="flex items-center gap-2 text-blue-600 hover:underline">
              <Download className="h-4 w-4" /> Android App (coming soon)
            </a>
          </div>
        </div>
        <div className="text-sm text-slate-600">
          Scan the QR code or use the links above to download the Salenus A.I mobile app.<br />
          <Badge className="bg-blue-100 text-blue-800 mt-2">Mobile access included in all plans</Badge>
        </div>
      </CardContent>
    </Card>
  );
}; 