import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Printer, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  DollarSign, 
  Sparkles,
  UtensilsCrossed,
  Receipt,
  FileCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/orders/${id}`);
      setOrder(data.data);
    } catch (error) {
      console.error('Error fetching order detail:', error);
      toast.error('Failed to load order record');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/orders/${id}/status`, { status: newStatus });
      setOrder(prev => ({ ...prev, status: newStatus }));
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleSettlePayment = async (method) => {
    try {
      setProcessingPayment(true);
      await axios.put(`${import.meta.env.VITE_API_URL}/orders/${id}`, {
        paymentStatus: 'Paid',
        paymentMethod: method,
        status: order.status === 'Completed' ? 'Completed' : 'Ready'
      });
      setOrder(prev => ({ ...prev, paymentStatus: 'Paid', paymentMethod: method }));
      toast.success(`Payment settled via ${method}!`);
    } catch (error) {
      console.error('Error recording payment:', error);
      toast.error('Failed to settle payment');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="p-16 text-center text-[#817985]">Loading digital ticket...</div>;
  }

  if (!order) {
    return (
      <div className="p-16 text-center">
        <p className="text-lg font-bold text-[#242026] dark:text-[#F9F4F8]">Order not found</p>
        <Link to="/orders">
          <Button className="mt-4 rounded-xl bg-[#400849] text-white">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  const steps = ['Confirmed', 'Preparing', 'Ready', 'Completed'];
  const currentStepIndex = steps.indexOf(order.status);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Bar Navigation (Hidden on print) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => navigate('/orders')} 
            className="rounded-xl border-[#EADFE8] dark:border-[#3D2C42]"
          >
            <ArrowLeft size={18} className="mr-1.5" /> Back
          </Button>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-[#242026] dark:text-[#F9F4F8] tracking-tight">
                {order.orderId}
              </h2>
              <Badge className="bg-[#400849] text-white text-xs px-2.5 py-0.5">
                Table #{order.table?.tableNumber || 'Takeout'}
              </Badge>
            </div>
            <p className="text-xs text-[#817985] dark:text-[#B4A9B8]">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={handlePrint}
            className="rounded-xl border-[#EADFE8] dark:border-[#3D2C42] bg-white dark:bg-[#231826] font-semibold text-xs"
          >
            <Printer size={16} className="mr-2 text-[#FF5A0A]" />
            Print Receipt
          </Button>

          {order.status !== 'Completed' && (
            <Button
              onClick={() => handleUpdateStatus('Completed')}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
            >
              <CheckCircle2 size={16} className="mr-2" />
              Complete Order
            </Button>
          )}
        </div>
      </div>

      {/* Lifecycle Progress Bar (Hidden on print) */}
      <Card className="print:hidden rounded-2xl border-[#EADFE8] dark:border-[#3D2C42] bg-white dark:bg-[#231826] shadow-sm p-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#817985] dark:text-[#B4A9B8] mb-4">
          Order Fulfillment Stepper
        </h4>
        <div className="relative flex items-center justify-between">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#EADFE8] dark:bg-[#3D2C42] w-full z-0" />
          {steps.map((step, idx) => {
            const isCompleted = currentStepIndex >= idx;
            const isCurrent = currentStepIndex === idx;

            return (
              <div key={step} className="relative z-10 flex flex-col items-center">
                <div 
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-sm ${
                    isCurrent
                      ? 'bg-[#FF5A0A] text-white ring-4 ring-[#FF5A0A]/20 scale-110'
                      : isCompleted
                      ? 'bg-[#400849] dark:bg-[#E7B0DE] text-white dark:text-[#400849]'
                      : 'bg-white dark:bg-[#231826] border-2 border-[#EADFE8] dark:border-[#3D2C42] text-[#817985]'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 size={16} /> : idx + 1}
                </div>
                <span className={`text-xs font-bold mt-2 ${isCurrent ? 'text-[#FF5A0A]' : 'text-[#817985]'}`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Printable Receipt Card */}
      <Card className="rounded-2xl border-[#EADFE8] dark:border-[#3D2C42] bg-white dark:bg-[#231826] shadow-md p-8 relative overflow-hidden">
        {/* Receipt Header */}
        <div className="text-center border-b border-[#EADFE8] dark:border-[#3D2C42] pb-6 space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5A0A] to-[#E7B0DE] text-white flex items-center justify-center mx-auto mb-3 shadow-md">
            <UtensilsCrossed size={24} />
          </div>
          <h3 className="text-2xl font-black text-[#400849] dark:text-white tracking-tight">
            RestaurantOS
          </h3>
          <p className="text-xs text-[#817985] dark:text-[#B4A9B8]">
            Fine Dining & Artisan Kitchen · Main Branch
          </p>
          <div className="pt-2 flex items-center justify-center gap-4 text-xs font-semibold text-[#817985] dark:text-[#B4A9B8]">
            <span>Ticket: <b className="text-[#242026] dark:text-white">{order.orderId}</b></span>
            <span>·</span>
            <span>Table: <b className="text-[#242026] dark:text-white">#{order.table?.tableNumber || 'Takeout'}</b></span>
            <span>·</span>
            <span>Server: <b className="text-[#242026] dark:text-white">Aditya</b></span>
          </div>
        </div>

        {/* Items Table */}
        <div className="py-6 border-b border-[#EADFE8] dark:border-[#3D2C42]">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#EADFE8] dark:border-[#3D2C42] text-[10px] uppercase font-bold text-[#817985] tracking-wider">
                <th className="py-2 text-left">Qty</th>
                <th className="py-2 text-left">Description</th>
                <th className="py-2 text-right">Unit Price</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EADFE8]/60 dark:divide-[#3D2C42]/60">
              {order.items?.map((item, idx) => (
                <tr key={idx} className="py-3">
                  <td className="py-3 font-black text-[#400849] dark:text-[#E7B0DE]">{item.quantity}x</td>
                  <td className="py-3">
                    <p className="font-bold text-[#242026] dark:text-[#F9F4F8]">{item.name}</p>
                    {item.specialInstructions && (
                      <p className="text-[10px] text-[#FF5A0A] italic">Note: {item.specialInstructions}</p>
                    )}
                  </td>
                  <td className="py-3 text-right text-[#817985] dark:text-[#B4A9B8]">${item.price.toFixed(2)}</td>
                  <td className="py-3 text-right font-bold text-[#242026] dark:text-[#F9F4F8]">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pricing Subtotals & Summary */}
        <div className="py-4 space-y-2 max-w-xs ml-auto text-xs">
          <div className="flex justify-between text-[#817985] dark:text-[#B4A9B8]">
            <span>Subtotal</span>
            <span className="font-semibold text-[#242026] dark:text-[#F9F4F8]">${order.subtotal?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[#817985] dark:text-[#B4A9B8]">
            <span>Tax (5%)</span>
            <span className="font-semibold text-[#242026] dark:text-[#F9F4F8]">${order.tax?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-black text-[#242026] dark:text-[#F9F4F8] pt-2 border-t border-[#EADFE8] dark:border-[#3D2C42]">
            <span>Total</span>
            <span className="text-[#FF5A0A]">${order.total?.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Status & Actions (Hidden on print) */}
        <div className="print:hidden mt-6 pt-6 border-t border-[#EADFE8] dark:border-[#3D2C42] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#817985]">Payment Status:</span>
            {order.paymentStatus === 'Paid' ? (
              <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                <CheckCircle2 size={13} className="mr-1" /> Paid via {order.paymentMethod || 'Card'}
              </Badge>
            ) : (
              <Badge variant="destructive" className="bg-amber-500 text-white font-bold">
                Payment Pending
              </Badge>
            )}
          </div>

          {order.paymentStatus !== 'Paid' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#817985]">Settle Bill:</span>
              <Button
                size="sm"
                variant="outline"
                disabled={processingPayment}
                onClick={() => handleSettlePayment('Cash')}
                className="h-8 rounded-lg text-xs font-bold"
              >
                Cash
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={processingPayment}
                onClick={() => handleSettlePayment('Credit Card')}
                className="h-8 rounded-lg text-xs font-bold border-[#400849] text-[#400849] dark:border-[#E7B0DE] dark:text-[#E7B0DE]"
              >
                <CreditCard size={13} className="mr-1" /> Card
              </Button>
              <Button
                size="sm"
                disabled={processingPayment}
                onClick={() => handleSettlePayment('UPI')}
                className="h-8 rounded-lg bg-[#FF5A0A] hover:bg-[#e04e06] text-white text-xs font-bold"
              >
                UPI
              </Button>
            </div>
          )}
        </div>

        {/* Receipt Footer Message */}
        <div className="mt-8 text-center text-xs text-[#817985] dark:text-[#B4A9B8] italic">
          <p>Thank you for dining with us at RestaurantOS!</p>
          <p className="text-[10px] mt-0.5">GSTIN: GSTIN123456789 · Keep this slip for your records</p>
        </div>
      </Card>

      {/* Print media stylesheet */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print\\:hidden { display: none !important; }
          .max-w-4xl, .max-w-4xl * { visibility: visible; }
          .max-w-4xl { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none !important; border: none !important; }
        }
      `}</style>
    </div>
  );
};

export default OrderDetail;
