import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';

export default function TermsOfService() {
  return (
    <Dialog>
      <DialogTrigger render={<button className="hover:text-white transition-colors cursor-pointer text-xs" />}>
        Terms of Service
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">Terms of Service</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 text-slate-600 text-sm py-4">
          <section className="space-y-2">
            <h3 className="font-bold text-slate-900 border-l-4 border-amber-500 pl-3">1. Acceptance of Terms</h3>
            <p>By accessing or using SimplyFunds, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our services.</p>
          </section>

          <section className="space-y-4">
            <h3 className="font-bold text-slate-900 border-l-4 border-emerald-500 pl-3 text-emerald-700">2. Service Charges</h3>
            <div className="space-y-3">
              <p className="font-medium bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                Our service charges for loan facilitation and financial consultancy vary from <span className="font-bold text-emerald-800">5% to 15%</span> of the sanctioned loan amount, depending on the specific file conditions, processing complexity, and loan type.
              </p>
              
              <div className="flex gap-3 items-start p-3 bg-blue-50/50 rounded-lg border border-blue-100 text-blue-800">
                <div className="mt-1 flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                </div>
                <p className="font-bold">We DO NOT collect any service charges or processing fees before the loan is successfully disbursed.</p>
              </div>

              <div className="flex gap-3 items-start p-3 bg-red-50 rounded-lg border border-red-100 text-red-800">
                <div className="mt-1 flex-shrink-0 uppercase font-black text-[10px] bg-red-600 text-white px-1.5 rounded">Security</div>
                <p className="font-medium italic">If any individual or entity requests money upfront in the name of SimplyFunds before your loan disbursement, please <span className="font-bold underline">refuse and inform us immediately</span> at support@simplyfunds.in.</p>
              </div>
              
              <p className="text-xs text-slate-500">Exact charges will be communicated and agreed upon during the consultation phase before final submission to the lending partner.</p>
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-slate-900 border-l-4 border-amber-500 pl-3">3. No Guarantee of Approval</h3>
            <p>SimplyFunds acts as an intermediary and facilitator. We do not provide loans directly, and we do not guarantee the approval of any loan application. Final sanctioning authority remains solely with the respective bank or NBFC.</p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-slate-900 border-l-4 border-amber-500 pl-3">4. Information Accuracy</h3>
            <p>Users are responsible for providing accurate and truthful information. Furnishing false documentation or misrepresenting financial status may lead to immediate termination of our services and potential legal action by lending institutions.</p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-slate-900 border-l-4 border-amber-500 pl-3">5. Intellectual Property</h3>
            <p>All content, including the AI advisor logic, estimators, and website design, is the intellectual property of SimplyFunds.</p>
          </section>

          <footer className="pt-6 border-t border-slate-100 text-slate-400 italic">
            Last updated: May 19, 2026. For any questions regarding these terms, contact support@simplyfunds.in
          </footer>
        </div>
      </DialogContent>
    </Dialog>
  );
}
