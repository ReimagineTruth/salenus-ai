import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Upload, 
  Trash2, 
  Archive, 
  RotateCcw, 
  Copy, 
  Edit, 
  Settings,
  Database,
  FileText,
  RefreshCw,
  Share2,
  Lock,
  Unlock,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DataManagementPanelProps {
  featureName: string;
  dataCount: number;
  onExport: () => void;
  onImport: (file: File) => void;
  onClearAll: () => void;
  onRestartData: () => void;
  onDuplicate?: () => void;
  onArchive?: () => void;
  onRestore?: () => void;
  onEdit?: () => void;
  onShare?: () => void;
  onBackup?: () => void;
  onRestore?: () => void;
  isArchived?: boolean;
  hasData?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canArchive?: boolean;
  canShare?: boolean;
  canBackup?: boolean;
}

export const DataManagementPanel: React.FC<DataManagementPanelProps> = ({
  featureName,
  dataCount,
  onExport,
  onImport,
  onClearAll,
  onRestartData,
  onDuplicate,
  onArchive,
  onRestore,
  onEdit,
  onShare,
  onBackup,
  isArchived = false,
  hasData = true,
  canEdit = true,
  canDelete = true,
  canArchive = true,
  canShare = true,
  canBackup = true
}) => {
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async (file: File) => {
    setIsImporting(true);
    try {
      await onImport(file);
      toast({
        title: "Data Imported",
        description: "Data has been imported successfully.",
      });
    } catch (error) {
      toast({
        title: "Import Error",
        description: "Failed to import data. Please check the file format.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleExport = () => {
    try {
      onExport();
      toast({
        title: "Data Exported",
        description: "Data has been exported successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Error",
        description: "Failed to export data.",
        variant: "destructive",
      });
    }
  };

  const handleClearAll = () => {
    if (confirm(`Are you sure you want to clear ALL ${featureName.toLowerCase()} data? This action cannot be undone.`)) {
      onClearAll();
      toast({
        title: "Data Cleared",
        description: `All ${featureName.toLowerCase()} data has been cleared.`,
      });
    }
  };

  const handleRestartData = () => {
    if (confirm(`Are you sure you want to restart ${featureName.toLowerCase()} data? This will reset all progress.`)) {
      onRestartData();
      toast({
        title: "Data Restarted",
        description: `${featureName} data has been reset successfully.`,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Data Management
        </CardTitle>
        <CardDescription>
          Manage your {featureName.toLowerCase()} data with comprehensive CRUD operations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Data Status */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium">Data Status</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={hasData ? "default" : "secondary"}>
                {dataCount} items
              </Badge>
              {isArchived && (
                <Badge variant="outline" className="text-orange-600">
                  Archived
                </Badge>
              )}
            </div>
          </div>

          {/* Primary Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Export Data */}
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleExport}
                disabled={!hasData}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <p className="text-xs text-gray-500">Export as JSON file</p>
            </div>

            {/* Import Data */}
            <div className="space-y-2">
              <input
                type="file"
                accept=".json"
                onChange={(e) => e.target.files?.[0] && handleImport(e.target.files[0])}
                className="hidden"
                id={`import-${featureName.toLowerCase()}`}
                disabled={isImporting}
              />
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => document.getElementById(`import-${featureName.toLowerCase()}`)?.click()}
                disabled={isImporting}
              >
                <Upload className="h-4 w-4 mr-2" />
                {isImporting ? 'Importing...' : 'Import Data'}
              </Button>
              <p className="text-xs text-gray-500">Import from JSON file</p>
            </div>

            {/* Restart Data */}
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleRestartData}
                disabled={!hasData}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Restart Data
              </Button>
              <p className="text-xs text-gray-500">Reset all progress</p>
            </div>

            {/* Backup Data */}
            {canBackup && (
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={onBackup}
                  disabled={!hasData}
                >
                  <Database className="h-4 w-4 mr-2" />
                  Backup Data
                </Button>
                <p className="text-xs text-gray-500">Create backup</p>
              </div>
            )}
          </div>

          {/* Secondary Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Edit Data */}
            {canEdit && onEdit && (
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={onEdit}
                  disabled={!hasData}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Data
                </Button>
                <p className="text-xs text-gray-500">Modify existing data</p>
              </div>
            )}

            {/* Duplicate Data */}
            {onDuplicate && (
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={onDuplicate}
                  disabled={!hasData}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </Button>
                <p className="text-xs text-gray-500">Create a copy</p>
              </div>
            )}

            {/* Share Data */}
            {canShare && onShare && (
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={onShare}
                  disabled={!hasData}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Data
                </Button>
                <p className="text-xs text-gray-500">Share with others</p>
              </div>
            )}
          </div>

          {/* Archive/Restore Actions */}
          {canArchive && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {isArchived ? (
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={onRestore}
                    disabled={!hasData}
                  >
                    <Unlock className="h-4 w-4 mr-2" />
                    Restore Data
                  </Button>
                  <p className="text-xs text-gray-500">Restore from archive</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={onArchive}
                    disabled={!hasData}
                  >
                    <Archive className="h-4 w-4 mr-2" />
                    Archive Data
                  </Button>
                  <p className="text-xs text-gray-500">Move to archive</p>
                </div>
              )}
            </div>
          )}

          {/* Destructive Actions */}
          {canDelete && (
            <div className="border-t pt-4">
              <div className="space-y-2">
                <Button 
                  variant="destructive" 
                  className="w-full" 
                  onClick={handleClearAll}
                  disabled={!hasData}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Data
                </Button>
                <p className="text-xs text-gray-500">Permanently delete all data</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 