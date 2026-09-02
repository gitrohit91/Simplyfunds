import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Info, Calculator, CheckCircle2, ArrowRight } from 'lucide-react';

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

export default function EligibilityCalculator() {
  const [income, setIncome] = useState<number>(50000);
  const [emis, setEmis] = useState<number>(0);
  const [deductions, setDeductions] = useState<number>(0);
  const [tenure, setTenure] = useState<number>(20);
  const [tenureType, setTenureType] = useState<'years' | 'months'>('years');
  const [rate, setRate] = useState<number>(8.75);
  const [foir, setFoir] = useState<string>("60");

  const handleTenureTypeChange = (type: 'years' | 'months') => {
    if (type === tenureType) return;
    if (type === 'months') {
      setTenure(prev => prev * 12);
    } else {
      setTenure(prev => Math.max(1, Math.round(prev / 12)));
    }
    setTenureType(type);
  };

  const calculateEligibility = () => {
    const foirMultiplier = Number(foir) / 100;
    const maxEMI = (income * foirMultiplier) - emis - deductions;
    const r = rate / 12 / 100;
    const n = tenureType === 'years' ? tenure * 12 : tenure;
    
    if (maxEMI <= 0 || n <= 0 || r <= 0) {
      return {
        maxEMI: Math.max(0, Math.round(maxEMI)),
        maxLoan: 0
      };
    }

    // Reverse EMI formula: P = (EMI * ( (1+r)^n - 1 )) / ( r * (1+r)^n )
    const maxLoan = (maxEMI * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));
    
    return {
      maxEMI: Math.max(0, Math.round(maxEMI)),
      maxLoan: Math.max(0, Math.round(maxLoan))
    };
  };

  const results = calculateEligibility();

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg border-t-4 border-t-amber-500 overflow-hidden">
      <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
            Loan Eligibility Tool
          </CardTitle>
          <Badge variant="outline" className="w-fit bg-amber-50 text-amber-800 border-amber-200 text-xs px-2.5 py-0.5 font-medium">
            Multi-Bank FOIR Engine
          </Badge>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Estimate the maximum loan amount banks will sanction based on your monthly income and current liabilities.
        </p>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Column: Form Inputs */}
        <div className="lg:col-span-7 space-y-5">
          {/* Monthly Gross Income */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <Label htmlFor="income" className="text-xs sm:text-sm font-semibold text-slate-700">
                Monthly Gross Income (₹)
              </Label>
              <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                {formatInWords(income)}
              </span>
            </div>
            <Input 
              id="income" 
              type="number" 
              value={income || ''} 
              onChange={(e) => setIncome(Math.max(0, Number(e.target.value)))} 
              className="text-base sm:text-lg font-semibold h-11"
              min={0}
              placeholder="e.g. 50000"
            />
            {/* Quick Presets for Touch */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[30000, 50000, 75000, 100000, 150000, 250000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setIncome(amt)}
                  className={`text-[11px] px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    income === amt 
                      ? 'bg-amber-600 text-white font-medium shadow-xs' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  ₹{amt >= 100000 ? `${amt / 100000}L` : `${amt / 1000}k`}
                </button>
              ))}
            </div>
          </div>

          {/* Existing Monthly EMIs */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <Label htmlFor="emis" className="text-xs sm:text-sm font-semibold text-slate-700">
                Existing Monthly EMIs (₹)
              </Label>
              {emis > 0 && (
                <span className="text-xs font-medium text-slate-500">
                  {formatInWords(emis)}
                </span>
              )}
            </div>
            <Input 
              id="emis" 
              type="number" 
              value={emis || ''} 
              onChange={(e) => setEmis(Math.max(0, Number(e.target.value)))} 
              className="text-base sm:text-lg font-semibold h-11"
              min={0}
              placeholder="0 (if none)"
            />
          </div>

          {/* Payslip Deductions */}
          <div className="space-y-1.5">
            <Label htmlFor="deductions" className="text-xs sm:text-sm font-semibold text-slate-700">
              Payslip Deductions (₹)
            </Label>
            <Input 
              id="deductions" 
              type="number" 
              value={deductions || ''} 
              onChange={(e) => setDeductions(Math.max(0, Number(e.target.value)))} 
              className="text-base sm:text-lg font-semibold h-11"
              min={0}
              placeholder="0 (PF, PTax, etc.)"
            />
            <p className="text-[11px] text-slate-400 italic">
              Example: PF, Professional Tax, or standard employer deductions.
            </p>
          </div>

          {/* Tenure & Rate in Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tenure */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="elig-tenure" className="text-xs sm:text-sm font-semibold text-slate-700">
                  Tenure
                </Label>
                <div className="flex bg-slate-100 rounded-md p-0.5 text-xs text-slate-600 border border-slate-200">
                  <button 
                    type="button"
                    onClick={() => handleTenureTypeChange('years')}
                    className={`px-2 py-0.5 rounded text-xs transition-all cursor-pointer ${
                      tenureType === 'years' 
                        ? 'bg-white text-slate-900 shadow-xs font-bold' 
                        : 'hover:text-slate-900'
                    }`}
                  >
                    Years
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleTenureTypeChange('months')}
                    className={`px-2 py-0.5 rounded text-xs transition-all cursor-pointer ${
                      tenureType === 'months' 
                        ? 'bg-white text-slate-900 shadow-xs font-bold' 
                        : 'hover:text-slate-900'
                    }`}
                  >
                    Months
                  </button>
                </div>
              </div>
              <Input 
                id="elig-tenure" 
                type="number" 
                value={tenure || ''} 
                onChange={(e) => setTenure(Math.max(1, Number(e.target.value)))} 
                className="text-base font-semibold h-11"
                min={1}
              />
              {/* Touch Slider for Tenure */}
              <input
                type="range"
                min={tenureType === 'years' ? 1 : 12}
                max={tenureType === 'years' ? 30 : 360}
                step={tenureType === 'years' ? 1 : 12}
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            {/* Rate */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="elig-rate" className="text-xs sm:text-sm font-semibold text-slate-700">
                  Expected Rate (% p.a.)
                </Label>
                <span className="text-xs font-bold text-amber-700">{rate}%</span>
              </div>
              <Input 
                id="elig-rate" 
                type="number" 
                step="0.05"
                value={rate || ''} 
                onChange={(e) => setRate(Math.max(0.1, Number(e.target.value)))} 
                className="text-base font-semibold h-11"
                min={1}
                max={30}
              />
              {/* Touch Slider for Rate */}
              <input
                type="range"
                min={7}
                max={18}
                step={0.25}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>
          </div>

          {/* FOIR Select */}
          <div className="space-y-1.5">
            <Label htmlFor="foir" className="text-xs sm:text-sm font-semibold text-slate-700">
              Bank FOIR Norm (%)
            </Label>
            <Select value={foir} onValueChange={setFoir}>
              <SelectTrigger id="foir" className="w-full h-11 text-sm font-medium">
                <SelectValue placeholder="Select FOIR" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="40">40% FOIR (Conservative / Entry Level)</SelectItem>
                <SelectItem value="50">50% FOIR (Standard PSU Banks)</SelectItem>
                <SelectItem value="60">60% FOIR (Private Banks & NBFCs - Recommended)</SelectItem>
                <SelectItem value="65">65% FOIR (High Income Category)</SelectItem>
                <SelectItem value="70">70% FOIR (Super Prime / HNI Category)</SelectItem>
                <SelectItem value="75">75% FOIR (Maximum Exception Norm)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[11px] text-slate-400 italic">
              FOIR: Percentage of gross income lenders allow towards total loan repayments.
            </p>
          </div>
        </div>

        {/* Right Column: Estimated Results */}
        <div className="lg:col-span-5 flex flex-col justify-between p-5 sm:p-6 bg-gradient-to-br from-amber-50/90 to-orange-50/70 rounded-2xl border border-amber-200/80 shadow-xs space-y-6">
          <div className="text-center space-y-2">
            <Badge className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              Estimated Eligibility
            </Badge>
            <h3 className="text-3xl sm:text-4xl font-black text-amber-950 tracking-tight break-words pt-1">
              ₹{results.maxLoan.toLocaleString('en-IN')}
            </h3>
            <p className="text-xs sm:text-sm font-bold text-amber-700">
              {results.maxLoan > 0 ? `Approx. ${formatInWords(results.maxLoan)} Sanction Potential` : 'Please adjust income / liabilities'}
            </p>
          </div>
          
          <Separator className="bg-amber-200/80" />
          
          <div className="space-y-3.5">
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-amber-900/80 font-medium">Max Affordable EMI</span>
              <span className="font-extrabold text-amber-950 text-base sm:text-lg">
                ₹{results.maxEMI.toLocaleString('en-IN')} <span className="text-xs font-normal text-amber-800">/ mo</span>
              </span>
            </div>

            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-amber-900/80 font-medium">Applicable FOIR Multiplier</span>
              <span className="font-bold text-amber-900">{foir}% of Income</span>
            </div>

            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-amber-900/80 font-medium">Chosen Tenure</span>
              <span className="font-bold text-amber-900">{tenure} {tenureType}</span>
            </div>

            <div className="flex items-start gap-2 p-3 bg-white/80 rounded-xl text-[11px] text-amber-900 border border-amber-200/60 leading-relaxed">
              <Info className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
              <p>
                Actual sanction may be higher based on co-applicant addition, rental income, or special banking surrogate programs.
              </p>
            </div>

            <Button 
              onClick={scrollToContact}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold h-12 shadow-md shadow-amber-200 text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              Get Precise Bank Quote
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

