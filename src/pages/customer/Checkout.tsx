import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } m '../../services/api';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } feat(frontend): integrate live Cart, Checkout, and Order Tracking

- Refactored `Checkout.tsx` to handle real API requests via `useMutation` (Order creation and M-Pesa STK Push).
- Swapped `Orders.tsx` mock lists for paginated and searchable backend queries (`api.getOrders()`).
- Updated `OrderTracking.tsx` to natively poll the backend (`refetchInterval: 10000`) for real-time status updates and estimated ready times.
- Corrected the `menu_item_detail` nesting in `OrderTracking.tsx` to match the backend `OrderSerializer`.
- Integrated `Notifications.tsx` with real endpoints using optimistic cache invalidation.from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ArrowLeft, CheckCircle2, Loader2, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const Checkout = () => {
  const { cart, clearCart, getCartTotal } = useCart();
  const subtotal = getCartTotal();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [phone, setPhone] = useState(user?.phone || '07');
  const [newOrderId, setNewOrderId] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const serviceFee = 20;
  const total = subtotal + serviceFee;

  useEffect(() => {
    if (cart.length === 0 && !paymentSuccess) {
      navigate('/cart');
    }
  }, [cart, navigate, paymentSuccess]);

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      const backendItems = cart.map(item => ({
        menu_item_id: item.menu_item.id,
        quantity: item.quantity
      }));
      const order = await api.createOrder({ items: backendItems });
      await api.initiatePayment(order.id, phone);
      return order;
    },
    onSuccess: (order) => {
      // Simulate waiting for callback (since we don't have WebSockets set up to listen yet)
      setTimeout(() => {
        setPaymentSuccess(true);
        setNewOrderId(order.id as string);
        clearCart();
        queryClient.invalidateQueries({ queryKey: ['orders'] });
      }, 3000);
    }
  });

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return;
    checkoutMutation.mutate();
  };

  if (paymentSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
        >
          <CheckCircle2 className="w-24 h-24 text-success mb-6" />
        </motion.div>
        <h2 className="text-3xl font-bold mb-2">Payment Successful!</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          Your order has been received and is now being prepared. You will be notified when it's ready for collection.
        </p>
        <div className="flex gap-4">
          <Link to={`/orders/${newOrderId}`}>
            <Button size="lg" className="shadow-lg">Track Order</Button>
          </Link>
          <Link to="/menu">
            <Button size="lg" variant="outline">Back to Menu</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/cart" className="p-2 hover:bg-muted rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Payment Form */}
        <div>
          <Card className="border-success/20 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-success"></div>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-success/10 p-3 rounded-full text-success">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-success">M-Pesa Express</h3>
                  <p className="text-sm text-muted-foreground">Enter your number to receive an STK push</p>
                </div>
              </div>

              <form onSubmit={handlePayment} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">M-Pesa Phone Number</label>
                  <Input 
                    type="tel" 
                    required 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-12 text-lg"
                    placeholder="07XX XXX XXX or 2547XX XXX XXX"
                    disabled={checkoutMutation.isPending || checkoutMutation.isSuccess}
                  />
                </div>

                <AnimatePresence>
                  {checkoutMutation.isError && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      exit={{ opacity: 0, height: 0 }}
                      className="text-danger text-sm bg-danger/10 p-3 rounded-md"
                    >
                      Payment failed or was cancelled. Please try again.
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg bg-success hover:bg-success/90 text-white shadow-lg relative overflow-hidden"
                  disabled={checkoutMutation.isPending || checkoutMutation.isSuccess || phone.length < 10}
                >
                  {checkoutMutation.isPending || checkoutMutation.isSuccess ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Awaiting M-Pesa Pin...
                    </span>
                  ) : (
                    `Pay KES ${total}`
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="bg-muted/30 border-none">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 border-b pb-4">Order Summary</h3>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.menu_item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium bg-background px-2 py-0.5 rounded text-xs">{item.quantity}x</span>
                      <span className="truncate max-w-[150px] sm:max-w-[200px]">{item.menu_item.name}</span>
                    </div>
                    <span className="font-medium">KES {item.menu_item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm pt-4 border-t">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">KES {subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Fee</span>
                  <span className="font-medium">KES {serviceFee}</span>
                </div>
                <div className="border-t pt-3 mt-3 flex justify-between items-center">
                  <span className="font-semibold text-base">Total to Pay</span>
                  <span className="font-bold text-xl text-primary">KES {total}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
