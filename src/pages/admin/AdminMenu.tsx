import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { MenuItem, Category } from '../../types';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Plus, Edit, Trash2, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';

const CategoryModal = ({ isOpen, onClose, mode, initialData }: any) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<Category>>(initialData || { name: '', description: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createMutation = useMutation({
    mutationFn: (data: Partial<Category>) => api.createCategory(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-categories'] }); onClose(); }
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Category>) => api.updateCategory(data.id!, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-categories'] }); onClose(); }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (mode === 'create') createMutation.mutate(formData);
    else updateMutation.mutate(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm bg-card shadow-lg border relative">
        <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={onClose}><X className="w-5 h-5" /></Button>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4">{mode === 'create' ? 'Add Category' : 'Edit Category'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={errors.name ? 'border-danger' : ''} />
              {errors.name && <p className="text-danger text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea className="w-full px-3 py-2 rounded-md border bg-background text-sm min-h-[80px]" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>
            <Button type="submit" className="w-full mt-4" disabled={createMutation.isPending || updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Category'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const MenuItemModal = ({ isOpen, onClose, mode, initialData, categories }: any) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<MenuItem>>(initialData || {
    name: '', price: 0, category: categories.length > 0 ? categories[0].id : '', image_url: '', description: '', prep_time_minutes: 15, is_available: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Price must be positive';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.image_url) newErrors.image_url = 'Image URL is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createMutation = useMutation({
    mutationFn: (data: Partial<MenuItem>) => api.createMeal(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-meals'] }); onClose(); }
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<MenuItem>) => api.updateMeal(data.id!, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-meals'] }); onClose(); }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (mode === 'create') createMutation.mutate(formData);
    else updateMutation.mutate(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-card shadow-lg border relative">
        <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={onClose}><X className="w-5 h-5" /></Button>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4">{mode === 'create' ? 'Add Menu Item' : 'Edit Menu Item'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={errors.name ? 'border-danger' : ''} />
              {errors.name && <p className="text-danger text-xs mt-1">{errors.name}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Price (KES)</label>
                <Input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} className={errors.price ? 'border-danger' : ''} />
                {errors.price && <p className="text-danger text-xs mt-1">{errors.price}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                  <option value="">Select Category</option>
                  {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {errors.category && <p className="text-danger text-xs mt-1">{errors.category}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <Input value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} className={errors.image_url ? 'border-danger' : ''} />
              {errors.image_url && <p className="text-danger text-xs mt-1">{errors.image_url}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea className="w-full px-3 py-2 rounded-md border bg-background text-sm min-h-[80px]" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer pb-2">
                <input type="checkbox" checked={formData.is_available} onChange={(e) => setFormData({...formData, is_available: e.target.checked})} className="w-4 h-4 rounded border-gray-300" />
                <span className="text-sm font-medium">Available</span>
              </label>
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
  const [activeTab, setActiveTab] = useState<'meals' | 'categories'>('meals');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedItem, setSelectedItem] = useState<any>(undefined);

  React.useEffect(() => {
    const timer = setTimeout(() => { setDebouncedSearch(searchTerm); setPage(1); }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: mealsData, isLoading: mealsLoading } = useQuery({
    queryKey: ['admin-meals', page, debouncedSearch],
    queryFn: () => api.getMeals({ page, search: debouncedSearch }),
  });

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['admin-categories', page, debouncedSearch],
    queryFn: () => api.getCategories({ page, search: debouncedSearch }),
  });

  const deleteMealMutation = useMutation({ mutationFn: api.softDeleteMeal, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-meals'] }) });
  const deleteCatMutation = useMutation({ mutationFn: api.deleteCategory, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-categories'] }) });

  const meals = mealsData?.results || [];
  const categories = categoriesData?.results || [];
  const totalPages = activeTab === 'meals' 
    ? (mealsData?.count ? Math.ceil(mealsData.count / 10) : 1)
    : (categoriesData?.count ? Math.ceil(categoriesData.count / 10) : 1);

  const handleCreate = () => { setModalMode('create'); setSelectedItem(undefined); setIsModalOpen(true); };
  const handleEdit = (item: any) => { setModalMode('edit'); setSelectedItem(item); setIsModalOpen(true); };
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      if (activeTab === 'meals') deleteMealMutation.mutate(id);
      else deleteCatMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Menu Management</h1>
        <Button className="gap-2" onClick={handleCreate}><Plus className="w-4 h-4" /> Add New {activeTab === 'meals' ? 'Meal' : 'Category'}</Button>
      </div>

      <div className="flex gap-4 border-b">
        <button className={`pb-2 px-1 font-medium ${activeTab === 'meals' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`} onClick={() => { setActiveTab('meals'); setPage(1); setSearchTerm(''); }}>Menu Items</button>
        <button className={`pb-2 px-1 font-medium ${activeTab === 'categories' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`} onClick={() => { setActiveTab('categories'); setPage(1); setSearchTerm(''); }}>Categories</button>
      </div>

      <div className="flex gap-4 items-center bg-card p-4 rounded-xl border">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder={`Search ${activeTab}...`} className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground border-b">
              <tr>
                {activeTab === 'meals' ? (
                  <>
                    <th className="px-6 py-4 font-medium">MenuItem</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Price</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-4 font-medium">Category Name</th>
                    <th className="px-6 py-4 font-medium">Description</th>
                  </>
                )}
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {(activeTab === 'meals' ? mealsLoading : categoriesLoading) ? (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
              ) : (activeTab === 'meals' ? meals.length : categories.length) === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No records found.</td></tr>
              ) : (
                (activeTab === 'meals' ? meals : categories).map((item: any) => (
                  <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                    {activeTab === 'meals' ? (
                      <>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded overflow-hidden shrink-0"><img src={item.image_url} alt={item.name} className="w-full h-full object-cover bg-muted" /></div>
                            <span className="font-semibold">{item.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4"><Badge variant="secondary">{item.category}</Badge></td>
                        <td className="px-6 py-4 font-medium">KES {item.price}</td>
                        <td className="px-6 py-4"><Badge variant={item.is_available ? 'success' : 'destructive'} className={item.is_available ? 'bg-success/10 text-success' : ''}>{item.is_available ? 'Available' : 'Hidden'}</Badge></td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 font-semibold">{item.name}</td>
                        <td className="px-6 py-4 text-muted-foreground">{item.description}</td>
                      </>
                    )}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Edit className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-danger hover:text-danger hover:bg-danger/10" onClick={() => handleDelete(item.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="p-4 border-t flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Showing page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}><ChevronLeft className="w-4 h-4 mr-1" /> Previous</Button>
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next <ChevronRight className="w-4 h-4 ml-1" /></Button>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && activeTab === 'meals' && <MenuItemModal isOpen={isModalOpen} mode={modalMode} initialData={selectedItem} categories={categories} onClose={() => setIsModalOpen(false)} />}
      {isModalOpen && activeTab === 'categories' && <CategoryModal isOpen={isModalOpen} mode={modalMode} initialData={selectedItem} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};
