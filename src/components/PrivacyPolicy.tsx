import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';

export default function PrivacyPolicy() {
  return (
    <Dialog>
      <DialogTrigger render={<button className="hover:text-white transition-colors cursor-pointer text-xs" />}>
        Privacy Policy
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">Privacy Policy</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 text-slate-600 text-sm py-4">
          <section className="space-y-2">
            <h3 className="font-bold text-slate-900 border-l-4 border-amber-500 pl-3">1. Information We Collect</h3>
            <p>At SimplyFunds, we collect personal information that you provide to us directly through our loan inquiry forms, AI advisor, and lead generation tools. This includes:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Name, email address, and phone number</li>
              <li>Financial information related to loan requirements</li>
              <li>Employment details for eligibility assessment</li>
              <li>IP addresses and browsing behavior for service improvement</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-slate-900 border-l-4 border-amber-500 pl-3">2. How We Use Your Information</h3>
            <p>We use the collected data to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Facilitate loan application processes with our banking partners</li>
              <li>Provide personalized financial advice through our AI advisor</li>
              <li>Verify your identity and eligibility for various financial products</li>
              <li>Communicate updates regarding your inquiry or application</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-slate-900 border-l-4 border-amber-500 pl-3">3. Data Sharing and Disclosure</h3>
            <p>We share your information with authorized banking partners and NBFCs only when necessary to process your loan request. We do not sell your personal data to third-party marketing companies.</p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-slate-900 border-l-4 border-amber-500 pl-3">4. Data Security</h3>
            <p>We implement industry-standard security measures to protect your data from unauthorized access, alteration, or disclosure. However, no method of transmission over the internet is 100% secure.</p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-slate-900 border-l-4 border-amber-500 pl-3">5. Your Rights</h3>
            <p>You have the right to request access to the personal data we hold about you and to ask for corrections or deletion of your information from our records.</p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-slate-900 border-l-4 border-amber-500 pl-3">6. Cookies</h3>
            <p>We use cookies to enhance your experience on our website. You can choose to disable cookies through your browser settings.</p>
          </section>

          <footer className="pt-6 border-t border-slate-100 text-slate-400 italic">
            Last updated: May 19, 2026. For any questions, contact us at support@simplyfunds.in
          </footer>
        </div>
      </DialogContent>
    </Dialog>
  );
}
