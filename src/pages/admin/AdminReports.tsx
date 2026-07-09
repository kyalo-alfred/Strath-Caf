import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Download, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminReports = () => {
  const { data: reportsData, isLoading } = useQuery({
    queryKey: ['admin-reports'],
    queryFn: api.getReports,
  });

  const handleExportCSV = async () => {
    try {
      toast.loading('Generating 30-day report...', { id: 'csv-export' });
      const blob = await api.exportOrdersCSV();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "cafeteria_30day_report.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('CSV Report downloaded successfully!', { id: 'csv-export' });
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate report', { id: 'csv-export' });
    }
  };

  const reports = [
    { 
      title: 'Recent Orders Export', 
      desc: 'Download a spreadsheet of recent transactions.', 
      type: 'CSV', 
      icon: <Download className="w-4 h-4" />,
      action: handleExportCSV 
    }
  ];

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading report data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reports Export</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {reports.map((report, idx) => (
          <Card key={idx} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{report.title}</h3>
                <p className="text-muted-foreground text-sm mt-1 mb-4">{report.desc}</p>
                <Button variant="outline" size="sm" className="gap-2 text-xs" onClick={report.action}>
                  {report.icon} Export {report.type}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
