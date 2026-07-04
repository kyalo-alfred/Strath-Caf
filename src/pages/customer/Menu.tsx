import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { MenuItem } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Search, Filter, Clock, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

export const Menu = () => {
  const [meals, setMeals] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const { addToCart } = useCart();

  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Drinks'];

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const data = await api.getMeals();
        setMeals(data);
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, []);

  const filteredMeals = meals.filter(meal => {
    const matchesSearch = meal.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          meal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || meal.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Menu</h1>
          <p className="text-muted-foreground mt-1">Discover and pre-order your favorite meals.</p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search meals..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="shrink-0">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 hide-scrollbar">
        {categories.map(cat => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? 'default' : 'outline'}
            className="rounded-full shrink-0"
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Menu Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="rounded-xl border bg-card overflow-hidden animate-pulse">
              <div className="h-48 bg-muted"></div>
              <div className="p-5 space-y-3">
                <div className="h-5 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="flex justify-between pt-4">
                  <div className="h-8 bg-muted rounded w-1/3"></div>
                  <div className="h-8 bg-muted rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredMeals.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
          <p className="text-muted-foreground">No meals found matching your criteria.</p>
          <Button variant="link" onClick={() => {setSearchTerm(''); setSelectedCategory('All')}}>Clear filters</Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMeals.map((meal, idx) => (
            <motion.div 
              key={meal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow group">
                <Link to={`/menu/${meal.id}`} className="block relative h-48 overflow-hidden bg-muted">
                  <img src={meal.image_url} alt={meal.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {!meal.is_available && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                      <Badge variant="destructive">Sold Out</Badge>
                    </div>
                  )}
                  <Badge variant="secondary" className="absolute top-3 right-3 bg-background/90 backdrop-blur shadow-sm">
                    {meal.category}
                  </Badge>
                </Link>
                <CardContent className="p-5 flex flex-col flex-1">
                  <Link to={`/menu/${meal.id}`}>
                    <h3 className="font-semibold text-lg hover:text-primary transition-colors">{meal.name}</h3>
                  </Link>
                  <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{meal.description}</p>
                  
                  <div className="mt-auto pt-4 space-y-4">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {meal.prep_time_minutes} mins
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold">KES {meal.price}</span>
                      <Button 
                        size="sm" 
                        disabled={!meal.is_available}
                        onClick={() => addToCart(meal)}
                        className="gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" /> Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
