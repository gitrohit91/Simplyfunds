import { 
  Home, 
  User, 
  Briefcase, 
  Car, 
  Building2, 
  Coins, 
  ShieldCheck, 
  FileText 
} from 'lucide-react';

export const LOAN_TYPES = [
  {
    id: 'home',
    title: 'Home Loan',
    description: 'Get your dream home with our competitive interest rates and flexible tenures.',
    icon: Home,
    interestRate: '7.25% onwards',
    maxTenure: '30 Years',
    documents: ['Aadhaar Card', 'PAN Card', '6 Months Bank Statement', 'Salary Slips', 'Property Documents']
  },
  {
    id: 'personal',
    title: 'Personal Loan',
    description: 'Quick funds for your personal needs, from vacations to medical emergencies.',
    icon: User,
    interestRate: '10.5 - 15%',
    maxTenure: '5 Years',
    documents: ['Aadhaar Card', 'PAN Card', '3 Months Bank Statement', 'Salary Slips']
  },
  {
    id: 'business',
    title: 'Business Loan',
    description: 'Fuel your business growth with collateral-free and secured business loans.',
    icon: Briefcase,
    interestRate: '12 - 18%',
    maxTenure: '7 Years',
    documents: ['Business Proof', 'ITR (Last 2 Years)', 'Bank Statement (1 Year)', 'GST Returns']
  },
  {
    id: 'lap',
    title: 'Loan Against Property',
    description: 'Unlock the value of your property for your financial needs.',
    icon: Building2,
    interestRate: '9 - 11%',
    maxTenure: '15 Years',
    documents: ['Property Documents', 'Identity Proof', 'Income Proof']
  },
  {
    id: 'gold',
    title: 'Gold Loan',
    description: 'Instant cash against your gold ornaments with minimal documentation.',
    icon: Coins,
    interestRate: '9 - 14%',
    maxTenure: '2 Years',
    documents: ['Aadhaar Card', 'PAN Card', 'Gold Valuation Certificate']
  }
];

export const TRUST_MARKERS = [
  { icon: ShieldCheck, title: 'Safe & Secure', description: 'Your data is encrypted and handled with utmost confidentiality.' },
  { icon: FileText, title: 'Paperless Process', description: 'Digital document submission for faster processing.' },
  { icon: Coins, title: 'Best Rates', description: 'Affiliated with top 30+ Banks & NBFCs to get you the lowest rates.' }
];

export const PARTNERS = [
  {
    name: 'State Bank of India',
    alias: 'SBI',
    color: 'bg-blue-600',
    description: 'India\'s largest public sector bank offering a wide range of loan products with trust and reliability.',
    offerings: ['PMAY Benefits', 'Zero Processing Fee offers', 'Lowest Interest Rates'],
    logoText: 'SBI'
  },
  {
    name: 'Bank of Baroda',
    alias: 'BOB',
    color: 'bg-orange-500',
    description: 'A leading international bank known for its innovative digital lending and customer-friendly policies.',
    offerings: ['Digital Approvals', 'Competitive Repo-linked Rates', 'Global Presence'],
    logoText: 'BOB'
  },
  {
    name: 'HDFC Bank',
    alias: 'HDFC',
    color: 'bg-red-600',
    description: 'India\'s leading private sector bank providing premium financing solutions and quick disbursals.',
    offerings: ['Instant Personal Loans', 'Lifestyle Priority Banking', 'Smart Flexi-loans'],
    logoText: 'HDFC'
  },
  {
    name: 'ICICI Bank',
    alias: 'ICICI',
    color: 'bg-orange-700',
    description: 'Renowned for technology-driven banking and a seamless end-to-end digital loan journey.',
    offerings: ['Pre-approved Offers', 'Multi-functional App', 'Low Paperwork'],
    logoText: 'ICICI'
  },
  {
    name: 'Axis Bank',
    alias: 'AXIS',
    color: 'bg-pink-700',
    description: 'Providing comprehensive banking services with a focus on retail and medium enterprise growth.',
    offerings: ['Customized Tenure', 'Relationship Rewards', 'Top-up Facilities'],
    logoText: 'AXIS'
  },
  {
    name: 'Bajaj Finserv',
    alias: 'BAJAJ',
    color: 'bg-blue-800',
    description: 'India\'s largest NBFC specializing in consumer finance and enterprise micro-loans.',
    offerings: ['No Cost EMI', 'Flexi Term Loans', 'High Loan Amounts'],
    logoText: 'BAJAJ'
  }
];

export const TESTIMONIALS = [
  {
    name: 'Anjali Sharma',
    role: 'Homeowner',
    content: 'SimplyFunds made my home loan process incredibly smooth. I was confused by different rates, but their advisor helped me pick SBI with a zero-processing fee offer. Highly recommended!',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?img=32'
  },
  {
    name: 'Vikram Malhotra',
    role: 'Business Owner',
    content: 'Needed urgent capital for my startup expansion. The digital process at SimplyFunds got me a business loan from ICICI Bank in just 48 hours. Minimum documentation and maximum speed.',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?img=12'
  },
  {
    name: 'Rahul Verma',
    role: 'Software Engineer',
    content: 'The EMI calculator is very accurate. It helped me plan my personal loan before even talking to an agent. The AI advisor gave me great tips on improving my CIBIL score too.',
    rating: 4,
    avatar: 'https://i.pravatar.cc/150?img=53'
  }
];
