import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Calculator, ArrowRight, IndianRupee, Percent, Calendar } from 'lucide-react';

const formatInWords = (num: number): string => {
  if (!num || num <= 0) return '';
  if (num >= 10000000) {
    const cr = (num / 10000000).toFixed(2).replace(/\.00$/, '');
    return `₹${cr} Crore${Number(cr) > 1 ? 's' : ''}`;
  }
  if (num >= 100000) {
    const lakh = (num / 100000).toFixed(2).replace(/\.00$/, '');
    return `₹${lakh} Lakh${Number(lakh) > 1 ? 's' : ''}`;
  }
  if (num >= 1000) {
    return `₹${(num / 1000).toFixed(1).replace(/\.0$/, '')} Thousand`;
  }
  return `₹${num.toLocaleString('en-IN')}`;
};

export default function EMICalculator() {
  const [amount, setAmount] = useState<number>(1000000);
  const [rate, setRate] = useState<number>(8.5);
  const [tenure, setTenure] = useState<number>(15); // years or months
  const [tenureUnit, setTenureUnit] = useState<'years' | 'months'>('years');

  const calculateEMI = () => {
    const p = Math.max(0, amount || 0);
    const r = (rate || 0) / 12 / 100;
    const n = tenureUnit === 'years' ? (tenure || 0) * 12 : (tenure || 0);
    
    if (n <= 0 || p <= 0) {
      return { emi: 0, totalPayment: p, totalInterest: 0 };
    }
    
    if (r === 0) {
      const emi = p / n;
      return {
        emi: Math.round(emi),
        totalPayment: p,
        totalInterest: 0
      };
    }

    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - p;
    
    return {
      emi: isNaN(emi) || !isFinite(emi) ? 0 : Math.round(emi),
      totalPayment: isNaN(totalPayment) || !isFinite(totalPayment) ? p : Math.round(totalPayment),
      totalInterest: isNaN(totalInterest) || !isFinite(totalInterest) ? 0 : Math.round(totalInterest)
    };
  };

  const results = calculateEMI();

  const data = [
    { name: 'Principal Amount', value: Math.max(0, amount || 0) },
    { name: 'Total Interest', value: Math.max(0, results.totalInterest || 0) },
  ];

  const COLORS = ['#2563eb', '#f59e0b'];

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Card id="emi-calculator" className="w-full max-w-4xl mx-auto shadow-lg border-t-4 border-t-blue-600 overflow-hidden">
      <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            EMI Calculator
          </CardTitle>
          <Badge variant="outline" className="w-fit bg-blue-50 text-blue-700 border-blue-200 text-xs px-2.5 py-0.5 font-medium">
            Accurate Amortization
          </Badge>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Calculate your monthly installment, overall interest burden, and total repayment schedule in real time.
        </p>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 space-y-5">
          {/* Loan Amount */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <Label htmlFor="amount" className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-blue-600" />
                Loan Amount (₹)
              </Label>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                {formatInWords(amount)}
              </span>
            </div>
            <Input 
              id="amount" 
              type="number" 
              value={amount || ''} 
              onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))} 
              className="text-base sm:text-lg font-semibold h-11"
              min={10000}
              placeholder="e.g. 1000000"
            />
            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[500000, 1000000, 2500000, 5000000, 7500000, 10000000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className={`text-[11px] px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    amount === val 
                      ? 'bg-blue-600 text-white font-medium shadow-xs' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  ₹{val >= 10000000 ? `${val / 10000000}Cr` : `${val / 100000}L`}
                </button>
              ))}
            </div>
            {/* Range Slider for Touch */}
            <input
              type="range"
              min={100000}
              max={15000000}
              step={50000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg mt-1"
            />
          </div>

          {/* Interest Rate */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <Label htmlFor="rate" className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-1">
                <Percent className="w-3.5 h-3.5 text-blue-600" />
                Interest Rate (% p.a.)
              </Label>
              <span className="text-xs font-bold text-blue-700">{rate}%</span>
            </div>
            <Input 
              id="rate" 
              type="number" 
              step="0.05"
              value={rate || ''} 
              onChange={(e) => setRate(Math.max(0, Number(e.target.value)))} 
              className="text-base sm:text-lg font-semibold h-11"
              min={1}
              max={30}
              placeholder="e.g. 8.5"
            />
            {/* Quick category rates */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { label: 'Home (8.4%)', val: 8.4 },
                { label: 'Takeover (8.6%)', val: 8.6 },
                { label: 'LAP (9.25%)', val: 9.25 },
                { label: 'Personal (10.5%)', val: 10.5 },
              ].map((r) => (
                <button
                  key={r.label}
                  type="button"
                  onClick={() => setRate(r.val)}
                  className={`text-[11px] px-2 py-0.5 rounded transition-colors cursor-pointer ${
                    rate === r.val
                      ? 'bg-blue-600 text-white font-medium'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
            {/* Range Slider for Rate */}
            <input
              type="range"
              min={6.5}
              max={18}
              step={0.1}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg mt-1"
            />
          </div>

          {/* Tenure */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <Label htmlFor="tenure" className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                Tenure
              </Label>
              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    if (tenureUnit !== 'years') {
                      setTenureUnit('years');
                      setTenure(prev => Math.max(1, Math.round(prev / 12)));
                    }
                  }}
                  className={`px-2.5 py-0.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    tenureUnit === 'years'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Years
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (tenureUnit !== 'months') {
                      setTenureUnit('months');
                      setTenure(prev => prev * 12);
                    }
                  }}
                  className={`px-2.5 py-0.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    tenureUnit === 'months'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Months
                </button>
              </div>
            </div>
            <Input 
              id="tenure" 
              type="number" 
              value={tenure || ''} 
              onChange={(e) => setTenure(Math.max(1, Number(e.target.value)))} 
              className="text-base font-semibold h-11"
              min={1}
            />
            {/* Range Slider for Tenure */}
            <input
              type="range"
              min={tenureUnit === 'years' ? 1 : 12}
              max={tenureUnit === 'years' ? 30 : 360}
              step={tenureUnit === 'years' ? 1 : 6}
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg mt-1"
            />
          </div>
        </div>

        {/* Right Column: Results & Interactive Pie Chart */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
          {/* Main Output Box */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-inner space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300 block mb-1">
                Monthly Loan EMI
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight break-words">
                ₹{results.emi.toLocaleString('en-IN')}
                <span className="text-xs sm:text-sm font-normal text-slate-300 ml-1">/ month</span>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3 space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-300">
                <span>Principal Loan Amount</span>
                <span className="font-semibold text-white">₹{Number(amount || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Total Interest Payable</span>
                <span className="font-semibold text-amber-400">₹{results.totalInterest.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-300 pt-1 border-t border-slate-800">
                <span className="font-bold text-white">Total Amount (P + I)</span>
                <span className="font-extrabold text-blue-400">₹{results.totalPayment.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Pie Chart Representation */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 sm:p-4 flex flex-col items-center min-w-0 w-full">
            <div className="h-[200px] sm:h-[220px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {data.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`} />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-500 italic mt-1 text-center">
              Breakup: Principal ({(amount && results.totalPayment ? (amount / results.totalPayment * 100).toFixed(1) : 0)}%) vs Interest ({(results.totalInterest && results.totalPayment ? (results.totalInterest / results.totalPayment * 100).toFixed(1) : 0)}%)
            </p>
          </div>

          <Button 
            onClick={scrollToContact}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 shadow-md shadow-blue-200 text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer"
          >
            Apply with this EMI
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

