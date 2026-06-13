import { Nav } from '@/components/shared/Nav'
import { Footer } from '@/components/shared/Footer'

export const metadata = {
  title: 'Terms & Conditions',
}

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-[--color-bc-surface] pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6 prose prose-slate dark:prose-invert">
          <h1 className="text-3xl font-bold text-[--color-bc-ink] mb-8">Terms & Conditions</h1>
          <p className="text-[--color-bc-muted] mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-6 text-[--color-bc-ink-2]">
            <section>
              <h2 className="text-xl font-semibold text-[--color-bc-ink] mb-3">1. Acceptance of Terms</h2>
              <p>By accessing and using BidCopy ("we", "our", "the Service"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our Service.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[--color-bc-ink] mb-3">2. Description of Service</h2>
              <p>BidCopy is an AI-powered proposal generator designed to assist freelancers in drafting bids for various platforms. We do not guarantee employment, jobs, or any specific success rate resulting from the use of the generated proposals.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[--color-bc-ink] mb-3">3. User Responsibilities</h2>
              <p>You are solely responsible for the content you generate and submit using BidCopy. You agree not to use the Service for any unlawful or prohibited activities. You must review and edit all AI-generated content before sending it to clients to ensure accuracy and compliance with third-party platform rules.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[--color-bc-ink] mb-3">4. Subscription and Payments</h2>
              <p>Certain features of BidCopy require a paid "Pro" subscription. Payments are processed securely via Razorpay. By subscribing, you agree to our pricing terms. We reserve the right to modify pricing with prior notice.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[--color-bc-ink] mb-3">5. Intellectual Property</h2>
              <p>The BidCopy platform, including its code, design, and original content, is protected by intellectual property laws. You may not duplicate, copy, or reuse any portion of our visual design elements or concepts without express written permission.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[--color-bc-ink] mb-3">6. Limitation of Liability</h2>
              <p>BidCopy and its creators shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use the Service, including but not limited to loss of clients, income, or account suspension on freelance platforms.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[--color-bc-ink] mb-3">7. Contact Information</h2>
              <p>If you have any questions regarding these Terms & Conditions, please contact us at <strong>hello@bidcopy.com</strong>.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
