import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function EMICalculator() {
  const [amount, setAmount] = useState<number>(1000000);
  const [rate, setRate] = useState<number>(7.25);
  const [tenure, setTenure] = useState<number>(10); // years

  const calculateEMI = () => {
    const p = amount;
    const r = rate / 12 / 100;
    const n = tenure * 12;
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - p;
    
    return {
      emi: Math.round(emi),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest)
    };
  };

  const results = calculateEMI();

  const data = [
    { name: 'Principal Amount', value: amount },
    { name: 'Total Interest', value: results.totalInterest },
  ];

  const COLORS = ['#3b82f6', '#f59e0b'];

  return (
    <Card id="emi-calculator" className="w-full max-w-4xl mx-auto shadow-lg border-t-4 border-t-blue-500">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">EMI Calculator</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="amount">Loan Amount (₹)</Label>
            <Input 
              id="amount" 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(Number(e.target.value))} 
              className="text-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rate">Interest Rate (%)</Label>
            <Input 
              id="rate" 
              type="number" 
              step="0.1"
              value={rate} 
              onChange={(e) => setRate(Number(e.target.value))} 
              className="text-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tenure">Tenure (Years)</Label>
            <Input 
              id="tenure" 
              type="number" 
              value={tenure} 
              onChange={(e) => setTenure(Number(e.target.value))} 
              className="text-lg"
            />
          </div>
          
          <div className="pt-6 border-t">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Monthly EMI</span>
              <span className="text-2xl font-bold text-blue-500">₹{results.emi.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Total Interest</span>
              <span className="text-lg font-semibold text-amber-500">₹{results.totalInterest.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Payment</span>
              <span className="text-lg font-semibold text-gray-800">₹{results.totalPayment.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl">
           <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500 italic">Breakup of Total Payment</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
