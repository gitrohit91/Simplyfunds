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
    maxTenure: '7 Years',
    documents: ['Aadhaar Card', 'PAN Card', '3 Months Bank Statement', 'Salary Slips']
  },
  {
    id: 'business',
    title: 'MSME CC/OD & Mudra Loans',
    description: 'Fuel your business growth with collateral-free and secured business loans, CC/OD limits, and Mudra schemes.',
    icon: Briefcase,
    interestRate: '9.50 - 12.50%',
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
  { icon: Coins, title: 'Best Rates', description: 'Affiliated with top Banks & NBFCs to get you the lowest rates.' }
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
    name: 'Bank of India',
    alias: 'BOI',
    color: 'bg-blue-700',
    description: 'A premier public sector bank offering specialized loan schemes for various segments with competitive rates.',
    offerings: ['Agriculture Focus', 'Star Home Loans', 'Wide Network'],
    logoText: 'BOI'
  },
  {
    name: 'Union Bank of India',
    alias: 'UBI',
    color: 'bg-red-600',
    description: 'Known for its customer-centric approach and widely distributed branch network across rural and urban India.',
    offerings: ['Union Home', 'Salary Gains', 'Digital Banking Perks'],
    logoText: 'UBI'
  },
  {
    name: 'Punjab National Bank',
    alias: 'PNB',
    color: 'bg-yellow-600',
    description: 'One of the oldest and most trusted public sector banks in India, providing robust financial solutions.',
    offerings: ['PNB Pride', 'Low Processing Charges', 'Long Tenure Loans'],
    logoText: 'PNB'
  },
  {
    name: 'Canara Bank',
    alias: 'CANARA',
    color: 'bg-blue-500',
    description: 'A leading commercial bank with a strong domestic and international presence, focused on sustainable banking.',
    offerings: ['Canara Home', 'MSME Support', 'Star Agri Loans'],
    logoText: 'CANARA'
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

export const SPECIALIZATIONS = {
  balanceTransfer: {
    title: 'Debt Consolidation & Balance Transfer',
    description: 'We specialize in transferring small ticket loans from multiple banks and NBFCs into one single, manageable EMI with lower interest rates.',
    policy: 'Please note: We do not take over Payday loans or similar high-interest short-term loans.',
    exception: 'Payday loan takeover is only possible via collateral-backed financing.'
  }
};
