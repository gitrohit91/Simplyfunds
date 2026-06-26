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
    name: 'Chiranjib Seal',
    role: 'Central Govt. Employee',
    content: 'Having both my major SBI Personal Loan for debt consolidation and subsequent BOI Home Loan Balance Transfer & Top-up processed by SimplyFunds was an absolute dream. Their transparency is unmatched, and they arranged extremely competitive rates!',
    rating: 5
  },
  {
    name: 'Kakali Ganguly',
    role: 'Pvt. Employee',
    content: 'Excellent service! SimplyFunds helped me secure a high-ticket BOB Personal Loan for debt consolidation at an interest rate lower than most banks, with zero hidden charges. Highly recommend their transparent fee structure!',
    rating: 5
  },
  {
    name: 'Nupur Karmakar',
    role: 'AAI Employee',
    content: 'Excellent support from start to finish! They helped me choose the best BOB Personal Loan with the lowest interest rate and flexible repayment options. Absolutely transparent and helpful.',
    rating: 5
  },
  {
    name: 'Anushree Biswas Dutt',
    role: 'Pvt. Employee',
    content: 'Highly professional and transparent team. They assisted me with an urgent high-value BOB Personal Loan smoothly with minimal documents. Completely hassle-free!',
    rating: 5
  },
  {
    name: 'Ankur Rudra',
    role: 'Business Person',
    content: 'SimplyFunds\' online EMI calculator guided me perfectly, and Rohit Sir helped me throughout the process. I received my BOB Personal Loan sanction within 3 days. Their transparency is commendable.',
    rating: 5
  },
  {
    name: 'Debjyoti Paul',
    role: 'TCS Employee',
    content: 'Their loan assistance was fantastic. They helped me organize the proper documentation and secured the SBI Personal Loan for my medical needs quickly when time was of the essence.',
    rating: 5
  },
  {
    name: 'Soumyajit Ghosh',
    role: 'CESC Employee',
    content: 'Securing my BOB Personal Loan through SimplyFunds was incredibly smooth. They managed an amazing sanctioned amount of ₹18.87 Lakhs with complete transparency and guided me through every documentation stage.',
    rating: 5
  }
];

export const VERIFIED_SANCTIONS = [
  {
    name: 'Krishnendu Kundu',
    date: '24-06-2026',
    amount: 2200000,
    charges: 0,
    other: 0,
    type: 'PL',
    bank: 'BOI'
  },
  {
    name: 'Soumyajit Ghosh',
    date: '02-06-2026',
    amount: 1887000,
    charges: 0,
    other: 0,
    type: 'PL',
    bank: 'BOB'
  },
  {
    name: 'Chiranjib Seal',
    date: '20-04-2026',
    amount: 2720000,
    charges: 311250,
    other: 0,
    type: 'PL',
    bank: 'SBI'
  },
  {
    name: 'Kakali Ganguly',
    date: '24-04-2026',
    amount: 1600000,
    charges: 192000,
    other: 0,
    type: 'PL',
    bank: 'BOB'
  },
  {
    name: 'Nupur Karmakar',
    date: '06-05-2026',
    amount: 1910000,
    charges: 229200,
    other: 0,
    type: 'PL',
    bank: 'BOB'
  },
  {
    name: 'Anushree Biswas Dutt',
    date: '08-05-2026',
    amount: 500000,
    charges: 60000,
    other: 0,
    type: 'PL',
    bank: 'BOB'
  },
  {
    name: 'Ankur Rudra',
    date: '08-05-2026',
    amount: 1200000,
    charges: 180000,
    other: 0,
    type: 'PL',
    bank: 'BOB'
  },
  {
    name: 'Debjyoti Paul',
    date: '12-05-2026',
    amount: 2886000,
    charges: 100000,
    other: 0,
    type: 'PL',
    bank: 'SBI'
  },
  {
    name: 'Chiranjib Seal',
    date: '18-05-2026',
    amount: 4488000,
    charges: 448800,
    other: 17792,
    type: 'HL',
    bank: 'BOI'
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
