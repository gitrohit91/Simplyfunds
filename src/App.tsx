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
  User as UserIcon
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
import { LOAN_TYPES, TRUST_MARKERS, PARTNERS, TESTIMONIALS } from './constants';
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
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 border border-slate-200" />}>
                  <img src={user.photoURL || ''} alt={user.displayName || ''} className="h-full w-full rounded-full object-cover" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal border-l-4 border-amber-500 pl-4">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer focus:bg-amber-50">
                    <UserIcon className="mr-2 h-4 w-4 text-amber-500" /> My Applications
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer focus:bg-red-50">
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={handleLogin} variant="outline" className="border-amber-500 text-amber-600 hover:bg-amber-50">Login</Button>
            )}
            
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
                  {user ? (
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border-l-4 border-amber-500">
                      <img src={user.photoURL || ''} alt={user.displayName || ''} className="w-12 h-12 rounded-full" />
                      <div className="flex-1">
                        <p className="font-bold">{user.displayName}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={handleLogout} className="text-red-600">
                        <LogOut className="w-5 h-5" />
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={handleLogin} className="w-full bg-gradient-to-r from-blue-600 to-amber-500 border-none h-12 rounded-xl text-white font-bold">Login with Google</Button>
                  )}
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
                Connect with 30+ leading banks and NBFCs through SimplyFunds. Home, Personal, or Business - we find the lowest rates for you.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <LeadForm user={user} />
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-xl border-2 border-slate-200 hover:border-amber-500 hover:text-amber-600 transition-all">
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
                  <Button type="submit" className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-bold shadow-lg shadow-emerald-100">
                    Get Free Consultation
                  </Button>
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
                    <Button variant="ghost" className="w-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 text-xs p-0 h-auto justify-start font-medium group/btn">
                      Visit Partner Page <ArrowRight className="w-3 h-3 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 p-8 bg-blue-50 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="space-y-2">
              <h4 className="text-xl font-bold text-blue-900">Looking for a specific lender?</h4>
              <p className="text-blue-700 text-sm">We are an authorized DSA for over 30+ major financial institutions across India.</p>
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

                    <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 group-hover:bg-blue-50 p-0 h-auto font-bold justify-between">
                      Learn More <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculators Section */}
      <section id="emi-calculator" className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="grid grid-cols-12 h-full">
            {Array.from({length: 12}).map((_, i) => (
              <div key={i} className="border-r border-white h-full"></div>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-4 space-y-8">
              <div className="space-y-4">
                <Badge className="bg-emerald-500/20 text-emerald-400 border-none uppercase tracking-widest text-[10px] py-1 px-3">Power Tools</Badge>
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Plan Your Finances Better</h2>
                <p className="text-slate-400 leading-relaxed text-lg">
                  Use our advanced calculators to understand your monthly commitments and eligibility before you apply.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  { t: 'EMI Calculator', d: 'Predict your monthly outflows' },
                  { t: 'Eligibility Tool', d: 'Based on income and existing obligations' },
                  { t: 'Prepayment Tool', d: 'See how much and when you can save' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 flex-shrink-0 mt-1">
                      <Plus className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-white uppercase text-xs tracking-wider">{item.t}</h5>
                      <p className="text-slate-400 text-sm mt-1">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-8">
              <Tabs defaultValue="emi" className="w-full">
                <div className="flex justify-center mb-6">
                  <TabsList className="bg-white/10 p-1 border border-white/20">
                    <TabsTrigger value="emi" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">EMI Calculator</TabsTrigger>
                    <TabsTrigger value="eligibility" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">Eligibility Tool</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="emi">
                  <EMICalculator />
                </TabsContent>
                <TabsContent value="eligibility">
                  <EligibilityCalculator />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-fuchsia-100 text-fuchsia-600 hover:bg-fuchsia-100 border-none uppercase tracking-widest text-[10px] py-1 px-3">Success Stories</Badge>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">What Our Customers Say</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Real experiences from people who realized their dreams with SimplyFunds.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full border-none shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardContent className="pt-8 space-y-6">
                    <p className="text-slate-600 italic leading-relaxed text-lg">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center gap-6 pt-4 border-t border-slate-50">
                      <img src={testimonial.avatar} alt={testimonial.name} className="w-20 h-20 rounded-full object-cover shadow-md border-2 border-white ring-4 ring-slate-50" />
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg">{testimonial.name}</h4>
                        <p className="text-sm text-slate-500 font-medium">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
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
                        <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500" /> 3 Months Pay Slips</li>
                        <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500" /> 6 Months Bank Stmt</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Self-Employed</h6>
                      <ul className="text-sm space-y-2 text-slate-600">
                        <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Business Reg Proof</li>
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
                Empowering individuals and businesses with the right financial solutions. Authorized DSA for 30+ major financial institutions.
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
                <a href="#" className="hover:text-white transition-colors">Education Loans</a>
                <a href="#" className="hover:text-white transition-colors">Vehicle Loans</a>
              </div>
            </div>

            <div className="space-y-6">
              <h5 className="font-bold text-white text-sm uppercase tracking-widest">Tools</h5>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <a href="#" className="hover:text-white transition-colors">EMI Calculator</a>
                <a href="#" className="hover:text-white transition-colors">Eligibility Finder</a>
                <a href="#" className="hover:text-white transition-colors">Document Picker</a>
                <a href="#" className="hover:text-white transition-colors">Bank Partner List</a>
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
                  <HelpCircle className="w-5 h-5 text-emerald-500 mt-1" />
                  <div>
                    <h6 className="text-white text-sm font-bold">support@simplyfunds.in</h6>
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
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Disclaimer</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 left-6 z-40 hidden md:flex flex-col gap-3">
        <Button className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 shadow-lg p-0">
          <Phone className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
