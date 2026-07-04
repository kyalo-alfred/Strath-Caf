import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { MenuItem } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ArrowLeft, Clock, Plus, Minus, ShoppingCart, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

export const MealDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [meal, setMeal] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) return;
    const fetchMeal = async () => {
      try {
        const data = await api.getMeal(id);
        setMeal(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMeal();
  }, [id]);

  const handleAddToCart = () => {
    if (meal) {
      addToCart(meal, quantity);
      navigate('/cart');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!meal) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">MenuItem not found</h2>
        <Button onClick={() => navigate('/menu')}>Back to Menu</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/menu" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Menu
      </Link>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        {/* Image */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl overflow-hidden bg-muted relative aspect-square md:aspect-auto md:h-[500px]"
        >
          <img src={meal.image_url} alt={meal.name} className="w-full h-full object-cover" />
          {!meal.is_available && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
              <Badge variant="destructive" className="text-lg px-4 py-1">Sold Out</Badge>
            </div>
          )}
        </motion.div>

        {/* Details */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="secondary">{meal.category}</Badge>
              <div className="flex items-center text-muted-foreground text-sm">
                <Clock className="w-4 h-4 mr-1" /> {meal.prep_time_minutes} mins prep
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{meal.name}</h1>
            <p className="text-2xl font-bold text-primary">KES {meal.price}</p>
          </div>

          <p className="text-muted-foreground mb-8 text-lg">{meal.description}</p>

          {meal.ingredients && (
            <div className="mb-8 border-t border-b py-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-success" /> Ingredients
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {meal.ingredients.join(', ')}
              </p>
            </div>
          )}

          {meal.nutrition && (
            <div className="mb-8 grid grid-cols-4 gap-4 text-center">
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Calories</p>
                <p className="font-semibold">{meal.nutrition.calories}</p>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Protein</p>
                <p className="font-semibold">{meal.nutrition.protein}g</p>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Carbs</p>
                <p className="font-semibold">{meal.nutrition.carbs}g</p>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Fat</p>
                <p className="font-semibold">{meal.nutrition.fat}g</p>
              </div>
            </div>
          )}

          <div className="mt-auto pt-6 flex items-center gap-4">
            <div className="flex items-center border rounded-lg p-1 bg-background">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 shrink-0" 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={!meal.is_available}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <div className="w-12 text-center font-medium">{quantity}</div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 shrink-0"
                onClick={() => setQuantity(quantity + 1)}
                disabled={!meal.is_available}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <Button 
              size="lg" 
              className="flex-1 text-lg gap-2"
              disabled={!meal.is_available}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-5 h-5" /> 
              Add to Cart - KES {meal.price * quantity}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
