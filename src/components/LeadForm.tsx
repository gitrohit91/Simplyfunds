import { useState, FormEvent } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { CheckCircle2, ArrowRight, ArrowLeft, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, collection, addDoc, serverTimestamp, handleFirestoreError, OperationType } from '../lib/firebase';
import { User } from 'firebase/auth';

const STEPS = [
  { id: 'personal', title: 'Personal Details' },
  { id: 'financial', title: 'Financial Info' },
  { id: 'documents', title: 'Final Review' }
];

interface LeadFormProps {
  user: User | null;
}

export default function LeadForm({ user }: LeadFormProps) {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: user?.email || '',
    loanType: '',
    loanAmount: '',
    monthlyIncome: '',
    employmentType: 'salaried',
    city: '',
    termsAccepted: false
  });

  const nextStep = () => {
    if (step === 0 && (!formData.name || !formData.phone || !formData.loanType)) {
      toast.error("Please fill in basic details");
      return;
    }
    setStep(s => Math.min(s + 1, STEPS.length - 1));
  };

  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to submit your application");
      return;
    }
    if (!formData.termsAccepted) {
      toast.error("Please accept the terms and conditions");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'leads'), {
        ...formData,
        loanAmount: Number(formData.loanAmount),
        monthlyIncome: Number(formData.monthlyIncome),
        ownerId: user.uid,
        status: 'received',
        createdAt: serverTimestamp()
      });
      
      toast.success("Application Submitted Successfully!");
      setStep(0);
      setIsOpen(false);
      setFormData({
        name: '',
        phone: '',
        email: user?.email || '',
        loanType: '',
        loanAmount: '',
        monthlyIncome: '',
        employmentType: 'salaried',
        city: '',
        termsAccepted: false
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'leads');
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<Button size="lg" className="bg-gradient-to-r from-blue-600 to-amber-500 hover:from-blue-700 hover:to-amber-600 h-14 px-8 text-lg rounded-xl shadow-lg shadow-blue-100 group border-none" />}>
        Apply for Loan <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none rounded-3xl">
        <div className="bg-slate-900 p-8 text-white">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Loan Application</h2>
            <Badge variant="secondary" className="bg-amber-500 text-white border-none uppercase tracking-tighter text-[10px]">Step {step + 1} of {STEPS.length}</Badge>
          </div>
          
          <div className="flex gap-2">
            {STEPS.map((s, i) => (
              <div 
                key={s.id} 
                className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-amber-500' : 'bg-slate-700'}`} 
              />
            ))}
          </div>
        </div>

        {!user ? (
          <div className="p-12 text-center space-y-6">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Authentication Required</h3>
              <p className="text-slate-500">Please sign in with your Google account to submit a loan application securely.</p>
            </div>
            <div className="flex flex-col gap-3">
              <Button variant="outline" className="w-full border-blue-600 text-blue-600 h-12 rounded-xl" onClick={() => setIsOpen(false)}>
                Close
              </Button>
              <a href="mailto:support@simplyfunds.in?subject=Loan Inquiry" className="w-full">
                <Button variant="ghost" className="w-full text-slate-400 hover:text-blue-600 text-xs">
                  Or inquiry via email: support@simplyfunds.in
                </Button>
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white shrink-0">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="app-name">Full Name</Label>
                      <Input id="app-name" placeholder="John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="app-phone">Phone Number</Label>
                      <Input id="app-phone" placeholder="9876543210" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="app-email">Email Address</Label>
                    <Input id="app-email" type="email" placeholder="john@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="app-loan-type">Loan Type</Label>
                    <Select onValueChange={val => setFormData({...formData, loanType: val})} value={formData.loanType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select loan type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="home">Home Loan</SelectItem>
                        <SelectItem value="personal">Personal Loan</SelectItem>
                        <SelectItem value="business">Business Loan</SelectItem>
                        <SelectItem value="lap">Loan Against Property</SelectItem>
                        <SelectItem value="gold">Gold Loan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="app-amount">Desired Loan Amount (₹)</Label>
                    <Input id="app-amount" type="number" placeholder="500000" value={formData.loanAmount} onChange={e => setFormData({...formData, loanAmount: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="app-income">Monthly Income (₹)</Label>
                    <Input id="app-income" type="number" placeholder="50000" value={formData.monthlyIncome} onChange={e => setFormData({...formData, monthlyIncome: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Employment Type</Label>
                    <div className="flex gap-4">
                      {['Salaried', 'Self-Employed'].map(t => (
                        <div key={t} className="flex items-center space-x-2">
                           <Checkbox 
                            id={t} 
                            checked={formData.employmentType === t.toLowerCase()} 
                            onCheckedChange={() => setFormData({...formData, employmentType: t.toLowerCase()})} 
                          />
                           <Label htmlFor={t}>{t}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="app-city">Current City</Label>
                    <Input id="app-city" placeholder="Mumbai" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6 text-center"
                >
                  <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                     <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Review Your Application</h3>
                    <p className="text-slate-500 text-sm">Please verify your details before submitting</p>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl text-left space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Name</span>
                      <span className="font-bold">{formData.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Loan Type</span>
                      <span className="font-bold uppercase">{formData.loanType}</span>
                    </div>
                    <div className="flex justify-between text-sm text-blue-600">
                      <span className="text-slate-400">Request Amount</span>
                      <span className="font-bold">₹{Number(formData.loanAmount).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 text-left">
                    <Checkbox 
                      id="terms" 
                      checked={formData.termsAccepted} 
                      onCheckedChange={(val) => setFormData({...formData, termsAccepted: !!val})} 
                    />
                    <Label htmlFor="terms" className="text-xs text-slate-500 leading-tight">
                      I agree to the terms and conditions and authorize SimplyFunds to share my details with partner banks for loan processing.
                    </Label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-4 pt-4">
              {step > 0 && (
                <Button type="button" variant="outline" className="flex-1 h-12 rounded-xl" onClick={prevStep} disabled={isSubmitting}>
                  <ArrowLeft className="mr-2 w-4 h-4" /> Back
                </Button>
              )}
              
              {step < STEPS.length - 1 ? (
                <Button type="button" className="flex-1 bg-blue-600 h-12 rounded-xl" onClick={nextStep}>
                  Next Step <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              ) : (
                <Button type="submit" className="flex-1 bg-emerald-600 h-12 rounded-xl" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              )}
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
