import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { MenuItem, Category } from '../../types';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Plus, Edit, Trash2, Search, X } from 'lucide-react';

const MenuItemModal = ({ 
  isOpen, 
  onClose, 
  mode, 
  initialData, 
  categories 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  mode: 'create' | 'edit'; 
  initialData?: Partial<MenuItem>;
  categories: Category[];
}) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<MenuItem>>(initialData || {
    name: '',
    price: 0,
    category: categories.length > 0 ? categories[0].id : '',
    image_url: '',
    description: '',
    prep_time_minutes: 15,
    is_available: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Price must be positive';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.prep_time_minutes || formData.prep_time_minutes <= 0) newErrors.prep_time_minutes = 'Prep time must be positive';
    
    if (formData.image_url) {
      try {
        new URL(formData.image_url);
      } catch {
        newErrors.image_url = 'Invalid URL format';
      }
    } else {
      newErrors.image_url = 'Image URL is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createMutation = useMutation({
    mutationFn: (data: Partial<MenuItem>) => api.createMeal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-meals'] });
      onClose();
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<MenuItem>) => api.updateMeal(data.id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-meals'] });
      onClose();
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (mode === 'create') {
      createMutation.mutate(formData);
    } else {
      updateMutation.mutate(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-card shadow-lg border relative">
        <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4">{mode === 'create' ? 'Add Menu Item' : 'Edit Menu Item'}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                className={errors.name ? 'border-danger' : ''}
              />
              {errors.name && <p className="text-danger text-xs mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Price (KES)</label>
                <Input 
                  type="number" 
                  value={formData.price} 
                  onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                  className={errors.price ? 'border-danger' : ''}
                />
                {errors.price && <p className="text-danger text-xs mt-1">{errors.price}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select 
                  className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="">Select Category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.category && <p className="text-danger text-xs mt-1">{errors.category}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <Input 
                value={formData.image_url} 
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                className={errors.image_url ? 'border-danger' : ''}
              />
              {errors.image_url && <p className="text-danger text-xs mt-1">{errors.image_url}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea 
                className="w-full px-3 py-2 rounded-md border bg-background text-sm min-h-[80px]"
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Prep Time (mins)</label>
                <Input 
                  type="number" 
                  value={formData.prep_time_minutes} 
                  onChange={(e) => setFormData({...formData, prep_time_minutes: Number(e.target.value)})}
                  className={errors.prep_time_minutes ? 'border-danger' : ''}
                />
                {errors.prep_time_minutes && <p className="text-danger text-xs mt-1">{errors.prep_time_minutes}</p>}
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer pb-2">
                  <input 
                    type="checkbox" 
                    checked={formData.is_available} 
                    onChange={(e) => setFormData({...formData, is_available: e.target.checked})}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm font-medium">Available</span>
                </label>
              </div>
            </div>

            <Button type="submit" className="w-full mt-4" disabled={createMutation.isPending || updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Menu Item'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export const AdminMenu = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedMeal, setSelectedMeal] = useState<Partial<MenuItem> | undefined>(undefined);

  const { data: meals = [], isLoading } = useQuery({
    queryKey: ['admin-meals'],
    queryFn: api.getMeals,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: api.getCategories,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const deleteMutation = useMutation({
    mutationFn: api.softDeleteMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-meals'] });
    }
  });

  const filteredMeals = meals.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleCreate = () => {
    setModalMode('create');
    setSelectedMeal(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (meal: MenuItem) => {
    setModalMode('edit');
    setSelectedMeal(meal);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Menu Management</h1>
        <Button className="gap-2" onClick={handleCreate}><Plus className="w-4 h-4" /> Add New MenuItem</Button>
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
                <th className="px-6 py-4 font-medium">MenuItem</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">Loading menu items...</td>
                </tr>
              ) : filteredMeals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">No meals found.</td>
                </tr>
              ) : (
                filteredMeals.map((meal) => (
                  <tr key={meal.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded overflow-hidden shrink-0">
                          <img src={meal.image_url} alt={meal.name} className="w-full h-full object-cover bg-muted" />
                        </div>
                        <span className="font-semibold">{meal.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary">
                        {categories.find(c => c.id == meal.category)?.name || meal.category}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-medium">KES {meal.price}</td>
                    <td className="px-6 py-4">
                      <Badge variant={meal.is_available ? 'success' : 'destructive'} className={meal.is_available ? 'bg-success/10 text-success' : ''}>
                        {meal.is_available ? 'Available' : 'Sold Out / Hidden'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(meal)}><Edit className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-danger hover:text-danger hover:bg-danger/10" onClick={() => handleDelete(meal.id)} disabled={deleteMutation.isPending}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <MenuItemModal 
          isOpen={isModalOpen}
          mode={modalMode}
          initialData={selectedMeal}
          categories={categories}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};
