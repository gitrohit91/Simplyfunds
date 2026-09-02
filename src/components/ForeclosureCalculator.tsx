import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Calculator, Info, Calendar, Percent, IndianRupee } from 'lucide-react';

export default function ForeclosureCalculator() {
  const [principal, setPrincipal] = useState<number>(1000000); // ₹10,00,000 default
  const [roi, setRoi] = useState<number>(9.5); // 9.5% p.a. default
  const [foreclosureFeePct, setForeclosureFeePct] = useState<number>(2); // 2% default
  const [includeGst, setIncludeGst] = useState<boolean>(true);
  const [gstPct] = useState<number>(18); // 18% standard GST
  const [days, setDays] = useState<number>(15); // 15 days default

  // Calculations
  const calculateForeclosure = () => {
    const p = Math.max(0, principal || 0);
    const rate = Math.max(0, roi || 0);
    const feePct = Math.max(0, foreclosureFeePct || 0);
    const numDays = Math.max(0, days || 0);

    // Per day interest = (Principal * (ROI / 100)) / 365
    const perDayInterest = (p * (rate / 100)) / 365;
    const totalAccruedInterest = perDayInterest * numDays;

    // Foreclosure fee
    const feeAmount = p * (feePct / 100);
    const gstAmount = includeGst ? feeAmount * (gstPct / 100) : 0;
    const totalFeeWithGst = feeAmount + gstAmount;

    // Total Foreclosure Settlement
    const totalPayable = p + totalFeeWithGst + totalAccruedInterest;

    return {
      perDayInterest: Math.round(perDayInterest * 100) / 100, // round to 2 decimals
      totalAccruedInterest: Math.round(totalAccruedInterest),
      feeAmount: Math.round(feeAmount),
      gstAmount: Math.round(gstAmount),
      totalFeeWithGst: Math.round(totalFeeWithGst),
      totalPayable: Math.round(totalPayable),
    };
  };

  const results = calculateForeclosure();

  const chartData = [
    { name: 'Outstanding Principal', value: Math.max(0, principal || 0) },
    { name: 'Foreclosure Fee & GST', value: results.totalFeeWithGst },
    { name: 'Accrued Interest', value: results.totalAccruedInterest },
  ];

  const COLORS = ['#2563eb', '#f59e0b', '#8b5cf6'];

  const handleQuickDays = (selectedDays: number) => {
    setDays(selectedDays);
  };

  return (
    <Card id="foreclosure-calculator" className="w-full max-w-4xl mx-auto shadow-lg border-t-4 border-t-purple-600 overflow-hidden">
      <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              Loan Foreclosure Calculator
            </CardTitle>
            <p className="text-xs text-slate-500 mt-1">
              Calculate exact loan closure amount, daily accrued interest, and applicable foreclosure charges.
            </p>
          </div>
          <Badge variant="outline" className="w-fit bg-purple-50 text-purple-700 border-purple-200 text-xs font-semibold px-2.5 py-0.5">
            Real-time Accrual Engine
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Column: Form Inputs */}
        <div className="lg:col-span-7 space-y-5">
          {/* Outstanding Principal */}
          <div className="space-y-1.5">
            <Label htmlFor="principal" className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-1">
              <IndianRupee className="w-3.5 h-3.5 text-slate-500" />
              Outstanding Principal Balance (₹)
            </Label>
            <Input
              id="principal"
              type="number"
              value={principal || ''}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              placeholder="e.g. 1000000"
              className="text-base sm:text-lg font-semibold h-11"
              min={0}
            />
            <span className="text-[11px] text-slate-400">
              ₹{Number(principal || 0).toLocaleString('en-IN')}
            </span>
          </div>

          {/* ROI Rate */}
          <div className="space-y-1.5">
            <Label htmlFor="roi" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <Percent className="w-3.5 h-3.5 text-slate-500" />
              Interest Rate (ROI % p.a.)
            </Label>
            <Input
              id="roi"
              type="number"
              step="0.05"
              value={roi || ''}
              onChange={(e) => setRoi(Number(e.target.value))}
              placeholder="e.g. 9.5"
              className="text-base font-semibold"
              min={0}
            />
          </div>

          {/* Foreclosure Fee % */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <Label htmlFor="foreclosureFeePct" className="text-xs font-semibold text-slate-700">
                Foreclosure Fee (%)
              </Label>
              <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeGst}
                  onChange={(e) => setIncludeGst(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500 h-3.5 w-3.5"
                />
                Include 18% GST
              </label>
            </div>
            <Input
              id="foreclosureFeePct"
              type="number"
              step="0.1"
              value={foreclosureFeePct ?? ''}
              onChange={(e) => setForeclosureFeePct(Number(e.target.value))}
              placeholder="e.g. 2"
              className="text-base font-semibold"
              min={0}
            />
          </div>

          {/* Number of Days for Interest */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="days" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Interim Days for Interest
              </Label>
              <div className="flex gap-1">
                {[1, 7, 15, 30].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => handleQuickDays(d)}
                    className={`px-2 py-0.5 text-[11px] font-semibold rounded transition-colors ${
                      days === d
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {d}d
                  </button>
                ))}
              </div>
            </div>
            <Input
              id="days"
              type="number"
              value={days ?? ''}
              onChange={(e) => setDays(Number(e.target.value))}
              placeholder="e.g. 15"
              className="text-base font-semibold"
              min={0}
            />
          </div>

          {/* Daily Interest Callout */}
          <div className="p-3.5 bg-purple-50/80 border border-purple-200/60 rounded-xl space-y-1">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-medium text-purple-900">Per Day Interest Accrual:</span>
              <span className="text-lg font-bold text-purple-700">
                ₹{results.perDayInterest.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / day
              </span>
            </div>
            <p className="text-[11px] text-purple-700/80">
              Calculated using standard 365-day annual basis: <span className="font-mono text-[10px]">({principal ? `₹${principal.toLocaleString('en-IN')}` : 'P'} × {roi || 0}% ÷ 365)</span>
            </p>
          </div>
        </div>

        {/* Right Column: Results & Chart */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
          <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-inner space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300 block mb-1">
                Total Foreclosure Payable
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight break-words">
                ₹{results.totalPayable.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3 space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-300">
                <span>Outstanding Principal</span>
                <span className="font-semibold text-white">₹{Number(principal || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>
                  Foreclosure Fee ({foreclosureFeePct}%)
                  {includeGst ? ' + 18% GST' : ''}
                </span>
                <span className="font-semibold text-amber-400">₹{results.totalFeeWithGst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Accrued Interest ({days} days)</span>
                <span className="font-semibold text-purple-400">₹{results.totalAccruedInterest.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Pie Chart Representation */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 sm:p-4 flex flex-col items-center min-w-0 w-full">
            <div className="h-[180px] sm:h-[200px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {chartData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => `₹${Number(val).toLocaleString('en-IN')}`} />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Info Banner */}
          <div className="flex items-start gap-2 text-[11px] text-slate-500 bg-slate-100/80 p-3 rounded-xl border border-slate-200/50">
            <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <span>
              Note: Floating rate home loans to individual borrowers from RBI-regulated banks generally feature <strong>0% foreclosure charges</strong>. Commercial or fixed-rate loans may carry 2-4% charges.
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
