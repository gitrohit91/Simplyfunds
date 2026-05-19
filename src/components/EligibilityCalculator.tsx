import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Info } from 'lucide-react';

export default function EligibilityCalculator() {
  const [income, setIncome] = useState<number>(50000);
  const [emis, setEmis] = useState<number>(0);
  const [deductions, setDeductions] = useState<number>(0);
  const [tenure, setTenure] = useState<number>(20);
  const [rate, setRate] = useState<number>(9);
  const [foir, setFoir] = useState<string>("60");

  const calculateEligibility = () => {
    // FOIR of selected percentage
    const foirMultiplier = Number(foir) / 100;
    const maxEMI = (income * foirMultiplier) - emis - deductions;
    const r = rate / 12 / 100;
    const n = tenure * 12;
    
    // Reverse EMI formula: P = (EMI * ( (1+r)^n - 1 )) / ( r * (1+r)^n )
    const maxLoan = (maxEMI * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));
    
    return {
      maxEMI: Math.max(0, Math.round(maxEMI)),
      maxLoan: Math.max(0, Math.round(maxLoan))
    };
  };

  const results = calculateEligibility();

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg border-t-4 border-t-amber-500">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          Loan Eligibility Tool
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="income">Monthly Gross Income (₹)</Label>
            <Input 
              id="income" 
              type="number" 
              value={income} 
              onChange={(e) => setIncome(Number(e.target.value))} 
              className="text-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emis">Existing Monthly EMIs (₹)</Label>
            <Input 
              id="emis" 
              type="number" 
              value={emis} 
              onChange={(e) => setEmis(Number(e.target.value))} 
              className="text-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deductions">Payslip Deduction (₹)</Label>
            <Input 
              id="deductions" 
              type="number" 
              value={deductions} 
              onChange={(e) => setDeductions(Number(e.target.value))} 
              className="text-lg border-amber-200 focus:border-amber-500"
            />
            <p className="text-[10px] text-slate-400 italic">Example: PF, Professional Tax, or any office deductions.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="elig-tenure">Tenure (Years)</Label>
              <Input 
                id="elig-tenure" 
                type="number" 
                value={tenure} 
                onChange={(e) => setTenure(Number(e.target.value))} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="elig-rate">Expected Rate (%)</Label>
              <Input 
                id="elig-rate" 
                type="number" 
                step="0.1"
                value={rate} 
                onChange={(e) => setRate(Number(e.target.value))} 
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="foir">FOIR (%)</Label>
            <Select value={foir} onValueChange={setFoir}>
              <SelectTrigger id="foir" className="w-full">
                <SelectValue placeholder="Select FOIR" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="40">40% FOIR</SelectItem>
                <SelectItem value="60">60% FOIR</SelectItem>
                <SelectItem value="65">65% FOIR</SelectItem>
                <SelectItem value="70">70% FOIR</SelectItem>
                <SelectItem value="75">75% FOIR</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[10px] text-slate-400 italic mt-1">FOIR: Fixed Obligation to Income Ratio - the percentage of your income banks allow for all your EMIs.</p>
          </div>
        </div>

        <div className="flex flex-col justify-center p-8 bg-amber-50 rounded-2xl border border-amber-100">
          <div className="text-center space-y-2 mb-6">
            <Badge className="bg-amber-600 text-white hover:bg-amber-700">Estimated Eligibility</Badge>
            <h3 className="text-4xl font-black text-amber-800 tracking-tight">
              ₹{results.maxLoan.toLocaleString()}
            </h3>
            <p className="text-amber-600 font-medium">Approximate Loan Amount</p>
          </div>
          
          <Separator className="my-4 bg-amber-200" />
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-amber-700/70 text-sm">Max Affordable EMI</span>
              <span className="font-bold text-amber-900 text-lg">₹{results.maxEMI.toLocaleString()}</span>
            </div>
            <div className="flex items-start gap-2 p-3 bg-white/50 rounded-lg text-xs text-amber-800">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>Based on a {foir}% FOIR (Fixed Obligation to Income Ratio). Final eligibility depends on credit score and bank policy.</p>
            </div>
             <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold h-12 shadow-md shadow-amber-200 mt-4">
               Get Precise Quote
             </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
