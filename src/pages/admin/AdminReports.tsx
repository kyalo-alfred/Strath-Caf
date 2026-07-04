import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Download, FileText } from 'lucide-react';

export const AdminReports = () => {
  const reports = [
    { title: 'Daily Sales Report', desc: 'Summary of all transactions today.', type: 'CSV' },
    { title: 'Weekly Revenue Analysis', desc: 'Detailed breakdown of revenue streams.', type: 'PDF' },
    { title: 'Monthly Order Metrics', desc: 'Order volume, peak times, and popularity.', type: 'CSV' },
    { title: 'Inventory Alert Report', desc: 'List of frequently sold out items.', type: 'PDF' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reports</h1>
        <Button className="gap-2" onClick={() => alert('TODO: Connect to GET /api/reports/generate')}>Generate Custom Report</Button>
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
                <Button variant="outline" size="sm" className="gap-2 text-xs">
                  <Download className="w-4 h-4" /> Export {report.type}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
