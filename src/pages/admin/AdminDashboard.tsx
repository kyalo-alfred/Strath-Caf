import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Users, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', revenue: 4000, orders: 24 },
  { name: 'Tue', revenue: 3000, orders: 18 },
  { name: 'Wed', revenue: 2000, orders: 12 },
  { name: 'Thu', revenue: 2780, orders: 16 },
  { name: 'Fri', revenue: 1890, orders: 10 },
  { name: 'Sat', revenue: 2390, orders: 14 },
  { name: 'Sun', revenue: 3490, orders: 20 },
];

export const AdminDashboard = () => {
  const stats = [
    { title: 'Total Revenue', value: 'KES 24,560', icon: DollarSign, trend: '+12.5%' },
    { title: 'Total Orders', value: '114', icon: TrendingUp, trend: '+8.2%' },
    { title: 'Active Users', value: '342', icon: Users, trend: '+2.1%' },
    { title: 'Avg Wait Time', value: '14 mins', icon: Clock, trend: '-1.5%' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Analytics</h1>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-accent/10 text-accent rounded-lg">
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className={`text-sm font-semibold ${stat.trend.startsWith('+') ? 'text-success' : 'text-danger'}`}>
                  {stat.trend}
                </span>
              </div>
              <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#003366" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#003366" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `KES ${value}`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#003366" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Peak Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: '12:00 PM - 1:00 PM', pct: 85 },
                { time: '1:00 PM - 2:00 PM', pct: 60 },
                { time: '8:00 AM - 9:00 AM', pct: 45 },
                { time: '5:00 PM - 6:00 PM', pct: 30 },
              ].map(slot => (
                <div key={slot.time}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{slot.time}</span>
                    <span className="font-semibold">{slot.pct}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: `${slot.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
