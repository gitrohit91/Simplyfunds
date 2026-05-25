import { useState, useEffect, FormEvent } from 'react';
import { 
  Plus, 
  Menu, 
  X, 
  Phone, 
  MessageSquare, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Star,
  ChevronRight,
  HelpCircle,
  Send,
  LogOut,
  FileText,
  MessageCircle,
  User as UserIcon,
  Search,
  Award,
  Receipt
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

import EMICalculator from './components/EMICalculator';
import EligibilityCalculator from './components/EligibilityCalculator';
import LeadForm from './components/LeadForm';
import Logo from './components/Logo';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import { LOAN_TYPES, TRUST_MARKERS, PARTNERS, TESTIMONIALS, VERIFIED_SANCTIONS, SPECIALIZATIONS } from './constants';
import { getLoanAdvice } from './services/geminiService';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  db, 
  collection, 
  addDoc, 
  serverTimestamp,
  handleFirestoreError,
  OperationType 
} from './lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [advisorQuery, setAdvisorQuery] = useState('');
  const [advisorResponse, setAdvisorResponse] = useState('');
  const [isAdvisorLoading, setIsAdvisorLoading] = useState(false);
  const [activeCalculatorTab, setActiveCalculatorTab] = useState('eligibility');
  const [sanctionsSearch, setSanctionsSearch] = useState('');

  const handleTabChangeAndScroll = (tabValue: 'eligibility' | 'emi') => {
    setActiveCalculatorTab(tabValue);
    const element = document.getElementById('emi-calculator');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Signed in successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to sign in.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out.");
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdvisorSubmit = async () => {
    if (!advisorQuery.trim()) return;
    setIsAdvisorLoading(true);
    setAdvisorResponse('');
    
    const response = await getLoanAdvice(advisorQuery, { 
      name: user?.displayName || 'Guest',
      email: user?.email || 'N/A'
    });
    
    setAdvisorResponse(response);
    setIsAdvisorLoading(false);

    // Persist log if user is logged in
    if (user) {
      try {
        await addDoc(collection(db, 'advisor_logs'), {
          userId: user.uid,
          query: advisorQuery,
          response: response,
          createdAt: serverTimestamp()
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'advisor_logs');
      }
    }
  };

  const handleQuickInquiry = (e: FormEvent) => {
    e.preventDefault();
    toast.success("Lead captured! Our agent will call you within 15 minutes.");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      <Toaster position="top-center" />
      
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Logo />

          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#" className="hover:text-blue-600 transition-colors">Home</a>
            <a href="#loan-types" className="hover:text-blue-600 transition-colors">Loan Types</a>
            <a href="#partners" className="hover:text-blue-600 transition-colors">Partners</a>
            <a href="#emi-calculator" className="hover:text-blue-600 transition-colors">Calculators</a>
            <a href="#document-checklist" className="hover:text-blue-600 transition-colors">Documents</a>
            
            <LeadForm user={user} />
          </div>

          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
            >
              <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
                <div className="pb-4 border-b border-slate-100">
                  <Logo />
                </div>
                <a href="#" className="text-lg font-medium py-2 border-b border-slate-50" onClick={() => setIsMenuOpen(false)}>Home</a>
                <a href="#loan-types" className="text-lg font-medium py-2 border-b border-slate-50" onClick={() => setIsMenuOpen(false)}>Loan Types</a>
                <a href="#partners" className="text-lg font-medium py-2 border-b border-slate-50" onClick={() => setIsMenuOpen(false)}>Partners</a>
                <a href="#emi-calculator" className="text-lg font-medium py-2 border-b border-slate-50" onClick={() => setIsMenuOpen(false)}>Calculators</a>
                <a href="#document-checklist" className="text-lg font-medium py-2 border-b border-slate-50" onClick={() => setIsMenuOpen(false)}>Documents</a>
                
                <div className="pt-4 flex flex-col gap-4">
                  <LeadForm user={user} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-3xl -mr-64 -mt-64"></div>
        <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-emerald-50/50 rounded-full blur-3xl -ml-32 -mb-32"></div>

        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <Badge variant="outline" className="px-3 py-1 bg-white border-amber-100 text-amber-600 font-semibold flex items-center gap-2 w-fit">
                <Zap className="w-3 h-3 fill-amber-500" /> Over 5000+ Happy Clients
              </Badge>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
                Smart Loans. <br />
                <span className="bg-gradient-to-r from-blue-600 via-fuchsia-500 to-amber-500 bg-clip-text text-transparent">Faster</span> Approvals.
              </h1>
              <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
                Connect with leading banks and NBFCs through SimplyFunds. Home, Personal, or Business - we find the lowest rates for you.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <LeadForm user={user} />
              <Button 
                onClick={() => handleTabChangeAndScroll('eligibility')}
                size="lg" 
                variant="outline" 
                className="h-14 px-8 text-lg rounded-xl border-2 border-slate-200 hover:border-amber-500 hover:text-amber-600 transition-all cursor-pointer"
              >
                Check Eligibility
              </Button>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/40?img=${i+10}`} alt="avatar" />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-current" /> 4.9/5
                </div>
                <p className="text-slate-500">Average customer rating</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="w-full max-w-md mx-auto shadow-2xl border-0 overflow-hidden">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white">
                <h3 className="text-xl font-bold">Quick Loan Inquiry</h3>
                <p className="text-blue-100 text-sm mt-1">Get initial feedback on your eligibility</p>
              </div>
              <CardContent className="p-8">
                <form onSubmit={handleQuickInquiry} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex gap-2">
                      <div className="flex items-center justify-center px-3 border rounded-md bg-slate-50 text-sm font-medium">+91</div>
                      <Input id="phone" type="tel" placeholder="98765-43210" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="loan-type">Desired Loan Type</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Home', 'Personal', 'Business', 'Property'].map(type => (
                        <Button 
                          key={type}
                          type="button" 
                          variant="outline" 
                          className="justify-start font-normal h-10 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Button type="submit" className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-bold shadow-lg shadow-emerald-100">
                      Submit Inquiry
                    </Button>
                    <a 
                      href="https://wa.me/918100617164" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block w-full"
                    >
                      <Button type="button" className="w-full h-12 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-50 border-none">
                        <MessageCircle className="w-5 h-5" />
                        Free Consultation over WhatsApp
                      </Button>
                    </a>
                    <a href="mailto:support@simplyfunds.in?subject=Quick Loan Inquiry" className="block w-full">
                      <Button type="button" variant="ghost" className="w-full h-12 text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-bold flex items-center justify-center gap-2 border border-blue-100">
                        <MessageSquare className="w-4 h-4" />
                        Quick Inquiry via Email
                      </Button>
                    </a>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Trust Markers */}
      <section className="bg-white py-16 border-y border-slate-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TRUST_MARKERS.map((marker, i) => (
              <div key={i} className="flex items-start gap-4 p-6 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <marker.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">{marker.title}</h4>
                  <p className="text-slate-500 text-sm mt-1">{marker.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Debt Consolidation & Specialization Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto bg-white rounded-[2rem] shadow-xl shadow-blue-100/50 overflow-hidden border border-blue-100"
          >
            <div className="grid md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-blue-50">
              <div className="md:col-span-3 p-10 md:p-12 space-y-6">
                <div className="space-y-2">
                  <Badge className="bg-blue-100 text-blue-700 border-none px-3 py-1 text-[10px] font-bold uppercase tracking-wider">Our Specialization</Badge>
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{SPECIALIZATIONS.balanceTransfer.title}</h2>
                </div>
                <p className="text-slate-600 text-lg leading-relaxed">
                  {SPECIALIZATIONS.balanceTransfer.description}
                </p>
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex flex-col">
                    <span className="text-3xl font-black text-blue-600">100%</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest text-center">Managed</span>
                  </div>
                  <div className="w-px h-10 bg-slate-100"></div>
                  <div className="flex flex-col">
                    <span className="text-3xl font-black text-amber-500">Fast</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest text-center">Process</span>
                  </div>
                </div>
              </div>
              <div className="md:col-span-2 p-10 md:p-12 bg-slate-50/50 flex flex-col justify-center gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                      <X className="w-3.5 h-3.5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Policy Notice</p>
                      <p className="text-xs text-slate-500 mt-1">{SPECIALIZATIONS.balanceTransfer.policy}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Exception Rule</p>
                      <p className="text-xs text-slate-500 mt-1">{SPECIALIZATIONS.balanceTransfer.exception}</p>
                    </div>
                  </div>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl font-bold font-sans">
                  Consolidate Now
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Calculators Section */}
      <section id="emi-calculator" className="py-24 bg-white border-y border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
          <div className="grid grid-cols-12 h-full">
            {Array.from({length: 12}).map((_, i) => (
              <div key={i} className="border-r border-slate-900 h-full"></div>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-4 space-y-8">
              <div className="space-y-4">
                <Badge className="bg-emerald-100 text-emerald-700 border-none uppercase tracking-widest text-[10px] py-1 px-3">Power Tools</Badge>
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">Plan Your Finances Better</h2>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Use our advanced calculators to understand your monthly commitments and eligibility before you apply.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  { t: 'Eligibility Tool', d: 'Based on income and existing obligations' },
                  { t: 'EMI Calculator', d: 'Predict your monthly outflows' },
                  { t: 'Prepayment Tool', d: 'See how much and when you can save' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0 mt-1">
                      <Plus className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 uppercase text-xs tracking-wider">{item.t}</h5>
                      <p className="text-slate-500 text-sm mt-1">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-8">
              <Tabs value={activeCalculatorTab} onValueChange={setActiveCalculatorTab} className="w-full">
                <div className="flex justify-center mb-6">
                  <TabsList className="bg-slate-100 p-1 border border-slate-200">
                    <TabsTrigger value="eligibility" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white text-slate-600">Eligibility Tool</TabsTrigger>
                    <TabsTrigger value="emi" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-600">EMI Calculator</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="eligibility">
                  <div className="bg-slate-50 rounded-3xl p-1 border border-slate-100">
                    <EligibilityCalculator />
                  </div>
                </TabsContent>
                <TabsContent value="emi">
                  <div className="bg-slate-50 rounded-3xl p-1 border border-slate-100">
                    <EMICalculator />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section id="partners" className="py-24 bg-white border-y border-slate-100 scroll-mt-20">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-100 border-none uppercase tracking-widest text-[10px] py-1 px-3">Trusted Ecosystem</Badge>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Our Lending Partners</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">We partner with India's most trusted Banks and NBFCs to ensure you get the best financial products with complete transparency.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PARTNERS.map((partner, i) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full border-slate-100 hover:shadow-lg transition-all duration-300 group">
                  <CardHeader className="flex flex-row items-center gap-4 pb-4">
                    <div className={`w-14 h-14 rounded-2xl ${partner.color} flex items-center justify-center text-white font-black text-xs tracking-tighter shadow-lg overflow-hidden shrink-0 group-hover:scale-110 transition-transform`}>
                      {partner.logoText}
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold">{partner.name}</CardTitle>
                      <CardDescription className="text-amber-600 font-semibold">{partner.alias}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-slate-500 leading-relaxed italic">
                      "{partner.description}"
                    </p>
                    <div className="space-y-2">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Key Offerings</div>
                      <div className="flex flex-wrap gap-1.5">
                        {partner.offerings.map(offering => (
                          <Badge key={offering} variant="outline" className="text-[10px] bg-slate-50 border-slate-200 text-slate-600 py-0.5">
                            {offering}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 p-8 bg-blue-50 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="space-y-2">
              <h4 className="text-xl font-bold text-blue-900">Looking for a specific lender?</h4>
              <p className="text-blue-700 text-sm">We are an authorized DSA for major financial institutions across India.</p>
            </div>
            <LeadForm user={user} />
          </div>
        </div>
      </section>

      {/* Loan Types Grid */}
      <section id="loan-types" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-amber-100 text-amber-600 hover:bg-amber-100 border-none uppercase tracking-widest text-[10px] py-1 px-3">Our Offerings</Badge>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Financial Solutions Tailored For You</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Choose the loan that fits your needs perfectly. We handle the paperwork, you get the funds.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {LOAN_TYPES.map((loan, i) => (
              <motion.div
                key={loan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-slate-100 group">
                  <CardHeader>
                    <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                      <loan.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl font-bold">{loan.title}</CardTitle>
                    <CardDescription className="text-slate-500 leading-relaxed min-h-[48px]">
                      {loan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-3 rounded-lg">
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Interest Rate</div>
                        <div className="font-bold text-slate-800">{loan.interestRate}</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg">
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Max Tenure</div>
                        <div className="font-bold text-slate-800">{loan.maxTenure}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Key Documents</div>
                      <div className="flex flex-wrap gap-2">
                        {loan.documents.slice(0, 3).map(doc => (
                          <Badge key={doc} variant="secondary" className="bg-white border text-[10px] border-slate-100 font-medium">
                            {doc}
                          </Badge>
                        ))}
                        {loan.documents.length > 3 && (
                          <Badge variant="outline" className="text-[10px] border-none text-slate-400">
                            +{loan.documents.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials & Sanction Logs Section */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none uppercase tracking-widest text-[10px] py-1 px-3">Transparency & Proof</Badge>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Verified Customer Success</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Explore authentic client feedback alongside our official, audited loan sanction logs to experience actual transparency.</p>
          </div>

          <Tabs defaultValue="testimonials" className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="bg-slate-100 p-1 rounded-xl border border-slate-200">
                <TabsTrigger value="testimonials" className="px-6 py-2 rounded-lg text-sm font-semibold transition-all">
                  Customer Reviews
                </TabsTrigger>
                <TabsTrigger value="ledger" className="px-6 py-2 rounded-lg text-sm font-semibold transition-all">
                  Verified Sanctions Ledger
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="testimonials">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {TESTIMONIALS.map((testimonial, i) => {
                  // Find sanction info for this customer to render on their card
                  const customerSanctions = VERIFIED_SANCTIONS.filter(s => s.name === testimonial.name);
                  
                  return (
                    <motion.div
                      key={testimonial.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Card className="h-full border-none shadow-md overflow-hidden bg-white ring-1 ring-slate-100 flex flex-col justify-between hover:shadow-lg transition-transform hover:-translate-y-1">
                        <CardContent className="p-8 flex flex-col h-full justify-between space-y-6">
                          <div className="space-y-4">
                            {/* Star Ratings */}
                            <div className="flex justify-between items-center">
                              <div className="flex gap-1">
                                {Array.from({ length: 5 }).map((_, starIndex) => (
                                  <Star key={starIndex} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                ))}
                              </div>
                              <span className="text-[10px] bg-slate-50 text-slate-500 font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 border border-slate-100">
                                <Award className="w-3 h-3 text-emerald-600 animate-pulse" /> Verified Sourcing
                              </span>
                            </div>
                            
                            <p className="text-slate-600 text-sm leading-relaxed italic">
                              "{testimonial.content}"
                            </p>
                          </div>

                          <div className="space-y-4 pt-4 border-t border-slate-100">
                            {/* Verified Loan Badges */}
                            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-2">
                              <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Official Ledger Record:</p>
                              {customerSanctions.map((s, sIndex) => (
                                <div key={sIndex} className="flex justify-between items-center text-xs">
                                  <span className="font-semibold text-slate-700">
                                    ₹{(s.amount / 100000).toFixed(2)} Lakhs <span className="text-[10px] font-medium text-slate-400">({s.type})</span>
                                  </span>
                                  <span className="text-[10px] font-mono text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                                    {s.date}
                                  </span>
                                </div>
                              ))}
                            </div>

                            <div className="flex items-center gap-4">
                              <img 
                                src={testimonial.avatar} 
                                alt={testimonial.name} 
                                referrerPolicy="no-referrer"
                                className="w-12 h-12 rounded-full object-cover border border-slate-100 bg-slate-100"
                              />
                              <div>
                                <h4 className="font-bold text-slate-900 text-sm">{testimonial.name}</h4>
                                <p className="text-xs text-amber-600 font-semibold">{testimonial.role}</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="ledger">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden p-6 md:p-8 space-y-6">
                
                {/* Search and Summary Blocks */}
                <div className="flex flex-col md:flex-row gap-6 justify-between items-stretch md:items-center">
                  <div className="relative max-w-md w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Search ledger entries by name or loan type..."
                      value={sanctionsSearch}
                      onChange={(e) => setSanctionsSearch(e.target.value)}
                      className="pl-10 h-11 border-slate-200 focus-visible:ring-amber-500"
                    />
                  </div>
                  
                  {/* Ledger Counters */}
                  <div className="flex gap-4 self-center md:self-auto">
                    <div className="bg-amber-50 border border-amber-200/50 rounded-xl px-4 py-2 text-center">
                      <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider block">Capital Sourced</span>
                      <span className="font-extrabold text-slate-900 text-sm">₹1.53 Crores</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Verified Entries</span>
                      <span className="font-extrabold text-slate-900 text-sm">7 Records</span>
                    </div>
                  </div>
                </div>

                {/* Ledger Data Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-100">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="py-4 px-6 border-b border-slate-100">Customer Name</th>
                        <th className="py-4 px-6 border-b border-slate-100">Sanction Date</th>
                        <th className="py-4 px-6 text-right border-b border-slate-100">Loan Amount</th>
                        <th className="py-4 px-6 text-right border-b border-slate-100">Consultancy Fees</th>
                        <th className="py-4 px-6 text-right border-b border-slate-100">Other Fees / GST</th>
                        <th className="py-4 px-6 text-center border-b border-slate-100">Product Code</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-sm">
                      {VERIFIED_SANCTIONS.filter(s => 
                        s.name.toLowerCase().includes(sanctionsSearch.toLowerCase()) ||
                        s.type.toLowerCase().includes(sanctionsSearch.toLowerCase())
                      ).map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            {item.name}
                          </td>
                          <td className="py-4 px-6 text-slate-500 font-medium font-mono">{item.date}</td>
                          <td className="py-4 px-6 text-right font-extrabold text-slate-800 font-mono">
                            ₹{item.amount.toLocaleString('en-IN')}
                          </td>
                          <td className="py-4 px-6 text-right font-semibold text-emerald-600 font-mono">
                            ₹{item.charges.toLocaleString('en-IN')}
                          </td>
                          <td className="py-4 px-6 text-right text-slate-500 font-mono">
                            {item.other > 0 ? `₹${item.other.toLocaleString('en-IN')}` : '₹0'}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <Badge className={`${
                              item.type === 'PL' 
                                ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-50 border-indigo-100' 
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-100'
                            } border text-[10px] font-bold py-0.5 px-2`}>
                              {item.type === 'PL' ? 'Personal Loan (PL)' : 'Home Loan (HL)'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                      {VERIFIED_SANCTIONS.filter(s => 
                        s.name.toLowerCase().includes(sanctionsSearch.toLowerCase()) ||
                        s.type.toLowerCase().includes(sanctionsSearch.toLowerCase())
                      ).length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400">
                            No verified entries matching "{sanctionsSearch}" found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center gap-2.5 bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
                  <Receipt className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>
                    <strong>Fee Transparency Compliance:</strong> Service charges and consultation fees comply strictly with our <strong>5% to 15%</strong> policy parameters depending on processing complexity, and are fully disclosed before submission.
                  </span>
                </div>

              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Document Section */}
      <section id="document-checklist" className="py-24">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-12 space-y-8">
                 <div className="space-y-4">
                  <h2 className="text-3xl font-extrabold tracking-tight">Minimum Documents, Maximum Support</h2>
                  <p className="text-slate-500">We prioritize digital work to keep things fast. Most of our loans require only basic documentation.</p>
                </div>

                <div className="space-y-4">
                  <Separator />
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Salaried Individuals</h6>
                      <ul className="text-sm space-y-2 text-slate-600">
                        <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Identity Proof (PAN)</li>
                        <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Address Proof</li>
                        <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500" /> 6 Months Payslips</li>
                        <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Salary Acc Statement</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Self-Employed</h6>
                      <ul className="text-sm space-y-2 text-slate-600">
                        <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Business Reg Proof (Trade License, GST Reg if applicable, PTax, or Udyam)</li>
                        <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Last 2 Years ITR</li>
                        <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500" /> 12 Months Bank Stmt</li>
                        <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500" /> GST Registration</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white h-14 font-bold text-lg rounded-xl">
                    Download Full Guidelines
                  </Button>
                </div>
              </div>
              
              <div className="bg-slate-50 p-12 flex flex-col justify-center">
                 <Card className="border-none shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                       <HelpCircle className="w-5 h-5 text-blue-600" /> Frequently Asked Questions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Tabs defaultValue="q1" className="w-full">
                      <div className="px-6 pb-2">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="q1">Interest</TabsTrigger>
                          <TabsTrigger value="q2">Collateral</TabsTrigger>
                          <TabsTrigger value="q3">Preadopt</TabsTrigger>
                        </TabsList>
                      </div>
                      <TabsContent value="q1" className="p-6 pt-2">
                        <h4 className="font-bold text-slate-800 mb-2 underline decoration-blue-200">What are the current interest rates?</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">Rates vary by credit score (CIBIL) and loan type. Home loans start at 8.5% and personal loans at 10.5%. We compare across 30 lenders to find you the absolute best rate.</p>
                      </TabsContent>
                      <TabsContent value="q2" className="p-6 pt-2">
                        <h4 className="font-bold text-slate-800 mb-2 underline decoration-blue-200">Is collateral required?</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">For Personal Loans and small Business Loans, typically not. For Home Loans and LAP, the property itself acts as collateral.</p>
                      </TabsContent>
                      <TabsContent value="q3" className="p-6 pt-2">
                        <h4 className="font-bold text-slate-800 mb-2 underline decoration-blue-200">Can I prepay my loan?</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">Most floating rate home loans have zero prepayment charges. Personal loans may have a lock-in period. We negotiate these terms upfront for you.</p>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                 </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Loan Advisor floating window */}
      <Dialog>
        <DialogTrigger render={<Button className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-600 shadow-2xl z-50 p-0 group border-none" />}>
          <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform text-white" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0 overflow-hidden border-none rounded-3xl">
          <DialogHeader className="bg-gradient-to-r from-blue-600 to-amber-500 p-6 text-white text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                <Star className="w-6 h-6 fill-amber-200" />
              </div>
              <div>
                <DialogTitle className="text-xl leading-none">AI Loan Advisor</DialogTitle>
                <p className="text-white/80 text-xs mt-1">Powered by Gemini - Instant guidance</p>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 p-6 overflow-y-auto space-y-6 flex flex-col bg-slate-50">
             <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-[10px]">AI</div>
              <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm text-sm text-slate-700 leading-relaxed">
                Hello! I'm your AI financial assistant. Ask me anything about loans, interest rates, or which loan type is best for your current situation.
              </div>
            </div>

            {advisorResponse && (
               <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-[10px]">AI</div>
                <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {advisorResponse}
                </div>
              </div>
            )}

            {isAdvisorLoading && (
               <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-[10px] animate-pulse">...</div>
                <div className="bg-amber-50 p-4 rounded-2xl rounded-tl-none shadow-sm text-sm text-amber-600 animate-pulse">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
            <Input 
              placeholder="Ask me for a business loan tip..." 
              className="flex-1 rounded-xl h-12 border-slate-200 focus:ring-blue-500"
              value={advisorQuery}
              onChange={(e) => setAdvisorQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdvisorSubmit()}
            />
            <Button 
              className="w-12 h-12 rounded-xl p-0 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
              onClick={handleAdvisorSubmit}
              disabled={isAdvisorLoading}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-slate-900 py-20 text-slate-400 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-6 col-span-1 md:col-span-1">
               <Logo light />
              <p className="text-sm leading-relaxed">
                Empowering individuals and businesses with the right financial solutions. Authorized DSA for major financial institutions.
              </p>
              <div className="flex gap-4">
                {[1, 2, 3].map(i => (
                   <div key={i} className="w-10 h-10 rounded-full border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 cursor-pointer transition-all flex items-center justify-center">
                    <Star className="w-4 h-4" />
                   </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h5 className="font-bold text-white text-sm uppercase tracking-widest">Our Services</h5>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <a href="#" className="hover:text-white transition-colors">Home Loans</a>
                <a href="#" className="hover:text-white transition-colors">Personal Loans</a>
                <a href="#" className="hover:text-white transition-colors">Business Loans</a>
                <a href="#" className="hover:text-white transition-colors">MSME Loan (Mudra)</a>
                <a href="#" className="hover:text-white transition-colors">Vehicle Loans</a>
              </div>
            </div>

            <div className="space-y-6">
              <h5 className="font-bold text-white text-sm uppercase tracking-widest">Tools</h5>
              <div className="grid grid-cols-1 gap-3 text-sm items-start">
                <button 
                  onClick={() => handleTabChangeAndScroll('emi')} 
                  className="hover:text-white transition-colors text-left cursor-pointer bg-transparent border-none p-0 text-slate-400"
                >
                  EMI Calculator
                </button>
                <button 
                  onClick={() => handleTabChangeAndScroll('eligibility')} 
                  className="hover:text-white transition-colors text-left cursor-pointer bg-transparent border-none p-0 text-slate-400"
                >
                  Eligibility Finder
                </button>
                <a href="#document-checklist" className="hover:text-white transition-colors">Document Picker</a>
                <a href="#partners" className="hover:text-white transition-colors">Bank Partner List</a>
              </div>
            </div>

            <div className="space-y-6">
              <h5 className="font-bold text-white text-sm uppercase tracking-widest">Quick Contact</h5>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <Phone className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <h6 className="text-white text-sm font-bold">+91 8100617164</h6>
                    <p className="text-xs mt-1">Available 9 AM - 8 PM IST</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-5 h-5 text-[#25D366] mt-1">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <a 
                      href="https://wa.me/918100617164" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="hover:text-white transition-colors"
                    >
                      <h6 className="text-white text-sm font-bold">WhatsApp Inquiry</h6>
                      <p className="text-xs mt-1">Instant Chat Support</p>
                    </a>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <HelpCircle className="w-5 h-5 text-emerald-500 mt-1" />
                  <div>
                    <a href="mailto:support@simplyfunds.in" className="hover:text-white transition-colors">
                      <h6 className="text-white text-sm font-bold">support@simplyfunds.in</h6>
                    </a>
                    <p className="text-xs mt-1">Response within 4 hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <Separator className="my-12 bg-white/5" />
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs">
            <p>© 2026 SimplyFunds Financial Services. All rights reserved.</p>
            <div className="flex gap-8">
              <PrivacyPolicy />
              <TermsOfService />
              <a href="#" className="hover:text-white transition-colors">Disclaimer</a>
            </div>
          </div>
        </div>
      </footer>


    </div>
  );
}
