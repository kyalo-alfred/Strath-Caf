import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Meal } from '../../types';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

export const AdminMenu = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    api.getMeals().then(setMeals);
  }, []);

  const filteredMeals = meals.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Menu Management</h1>
        <Button className="gap-2"><Plus className="w-4 h-4" /> Add New Meal</Button>
      </div>

      <div className="flex gap-4 items-center bg-card p-4 rounded-xl border">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search meals..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Meal</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredMeals.map((meal) => (
                <tr key={meal.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded overflow-hidden shrink-0">
                        <img src={meal.imageUrl} alt={meal.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-semibold">{meal.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4"><Badge variant="secondary">{meal.category}</Badge></td>
                  <td className="px-6 py-4 font-medium">KES {meal.price}</td>
                  <td className="px-6 py-4">
                    {/* @ts-ignore */}
                    <Badge variant={meal.isAvailable ? 'success' : 'destructive'}>
                      {meal.isAvailable ? 'Available' : 'Sold Out'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-danger hover:text-danger hover:bg-danger/10"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredMeals.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No meals found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
