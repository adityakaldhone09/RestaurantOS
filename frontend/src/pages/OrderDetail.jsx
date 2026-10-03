import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Printer, ArrowLeft, CreditCard, CheckCircle } from 'lucide-react';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/orders/${id}`);
      setOrder(data.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const completePayment = async (method) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/orders/${id}`, {
        paymentStatus: 'Paid',
        paymentMethod: method,
        status: 'Completed'
      });
      fetchOrder();
      alert(`Payment of $${order.total.toFixed(2)} completed via ${method}`);
    } catch (error) {
      console.error('Payment error', error);
      alert('Payment failed');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!order) return <div className="p-8 text-center text-red-500">Order not found!</div>;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Hide controls when printing */}
      <div className="flex justify-between items-center mb-6 print:hidden">
        <button 
          onClick={() => navigate('/orders')} 
          className="text-gray-600 hover:text-gray-900 flex items-center font-medium"
        >
          <ArrowLeft size={18} className="mr-1" /> Back to Orders
        </button>
        <button 
          onClick={handlePrint}
          className="bg-gray-800 text-white px-4 py-2 rounded flex items-center hover:bg-gray-700"
        >
          <Printer size={18} className="mr-2" /> Print Bill
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
        <div className="p-8 text-center border-b border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900">RestaurantOS</h2>
          <p className="text-gray-500 mt-1">123 Tech Street, SF, CA 94105</p>
          <p className="text-gray-500">GSTIN: GSTIN123456789 | Phone: +1 (555) 123-4567</p>
        </div>

        <div className="p-8">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-6">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Order ID</p>
              <p className="text-lg font-bold text-gray-900">{order.orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Table & Date</p>
              <p className="font-medium text-gray-900">Table {order.table?.tableNumber || 'N/A'}</p>
              <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
          </div>

          <table className="w-full mb-8">
            <thead>
              <tr className="border-b border-gray-200 text-left text-sm font-semibold text-gray-700">
                <th className="py-3">Item</th>
                <th className="py-3 text-center">Qty</th>
                <th className="py-3 text-right">Price</th>
                <th className="py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {order.items.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-100">
                  <td className="py-3 font-medium">{item.name}</td>
                  <td className="py-3 text-center">{item.quantity}</td>
                  <td className="py-3 text-right">${item.price.toFixed(2)}</td>
                  <td className="py-3 text-right font-medium">${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="w-full md:w-1/2 ml-auto space-y-2 text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-medium">${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Tax (5%):</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
              <span className="text-lg font-bold">Grand Total:</span>
              <span className="text-xl font-bold text-blue-600">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-8 border-t border-gray-200 text-center">
          <div className="mb-4">
            {order.paymentStatus === 'Paid' ? (
              <div className="inline-flex items-center text-green-600 font-bold bg-green-100 px-4 py-2 rounded-full">
                <CheckCircle size={20} className="mr-2" /> 
                PAID VIA {order.paymentMethod.toUpperCase()}
              </div>
            ) : (
              <div className="print:hidden">
                <p className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">Process Payment</p>
                <div className="flex justify-center gap-4">
                  <button onClick={() => completePayment('Cash')} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-medium flex items-center">
                    Cash
                  </button>
                  <button onClick={() => completePayment('Card')} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-medium flex items-center">
                    <CreditCard size={18} className="mr-2" /> Card
                  </button>
                  <button onClick={() => completePayment('UPI')} className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 font-medium flex items-center">
                    UPI
                  </button>
                </div>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 italic mt-6">Thank you for dining with us!</p>
        </div>
      </div>
      
      {/* Print styles inserted directly for simplicity */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .max-w-3xl, .max-w-3xl * { visibility: visible; }
          .max-w-3xl { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none; border: none; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default OrderDetail;
