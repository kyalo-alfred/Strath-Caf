import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingCart } from 'lucide-react';

export const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const subtotal = getCartTotal();
  const navigate = useNavigate();

  const serviceFee = cart.length > 0 ? 20 : 0;
  const total = subtotal + serviceFee;

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <ShoppingCart className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/menu">
          <Button size="lg">Browse Menu</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/menu" className="p-2 hover:bg-muted rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold">Your Cart</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <Card key={item.menu_item.id} className="overflow-hidden">
              <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-24 h-24 sm:w-20 sm:h-20 rounded-md overflow-hidden shrink-0">
                  <img src={item.menu_item.image_url} alt={item.menu_item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 text-center sm:text-left min-w-0 w-full">
                  <h3 className="font-semibold truncate">{item.menu_item.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">KES {item.menu_item.price}</p>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="flex items-center border rounded-md">
                    <button 
                      className="p-2 hover:bg-muted transition-colors disabled:opacity-50"
                      onClick={() => updateQuantity(item.menu_item.id, item.quantity - 1)}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button 
                      className="p-2 hover:bg-muted transition-colors"
                      onClick={() => updateQuantity(item.menu_item.id, item.quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-right w-20 hidden sm:block font-semibold">
                    KES {item.menu_item.price * item.quantity}
                  </div>
                  <button 
                    className="p-2 text-muted-foreground hover:text-danger hover:bg-danger/10 rounded-md transition-colors"
                    onClick={() => removeFromCart(item.menu_item.id)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 border-b pb-4">Order Summary</h3>
              
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">KES {subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Fee</span>
                  <span className="font-medium">KES {serviceFee}</span>
                </div>
                <div className="border-t pt-3 mt-3 flex justify-between items-center">
                  <span className="font-semibold text-base">Total</span>
                  <span className="font-bold text-xl text-primary">KES {total}</span>
                </div>
              </div>

              <Button 
                className="w-full h-12 text-lg shadow-md"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
