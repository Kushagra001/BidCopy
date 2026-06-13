import { Nav } from '@/components/shared/Nav'
import { Footer } from '@/components/shared/Footer'

export const metadata = {
  title: 'Refund & Cancellation Policy',
}

export default function RefundPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-[--color-bc-surface] pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6 prose prose-slate dark:prose-invert">
          <h1 className="text-3xl font-bold text-[--color-bc-ink] mb-8">Refund & Cancellation Policy</h1>
          <p className="text-[--color-bc-muted] mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-6 text-[--color-bc-ink-2]">
            <section>
              <h2 className="text-xl font-semibold text-[--color-bc-ink] mb-3">1. Subscription Cancellations</h2>
              <p>You may cancel your BidCopy Pro subscription at any time through your account dashboard or billing portal. Upon cancellation, your subscription will remain active until the end of your current billing cycle. You will not be charged again after the current cycle ends.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[--color-bc-ink] mb-3">2. Refund Eligibility</h2>
              <p>Due to the nature of digital goods and the immediate costs associated with AI generation (API usage), we generally do not offer refunds for partial subscription months or unused features once a charge has been processed.</p>
              <p className="mt-2">Exceptions may be made under the following circumstances, strictly at our discretion:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>You were billed multiple times due to a technical error on our platform.</li>
                <li>The service experienced significant, documented downtime exceeding 72 hours that prevented you from using your paid features.</li>
                <li>You request a refund within 24 hours of your initial subscription purchase <strong>and</strong> have not generated more than 3 proposals using the Pro tier.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[--color-bc-ink] mb-3">3. How to Request a Refund</h2>
              <p>To request a refund under the eligible criteria, please email our support team at <strong>hello@bidcopy.com</strong> within 7 days of the charge. Please include your account email address and a detailed explanation of the issue. We aim to review all requests within 3-5 business days.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[--color-bc-ink] mb-3">4. Chargebacks and Disputes</h2>
              <p>If you issue a chargeback or payment dispute with your bank or credit card provider without contacting us first, your BidCopy account will be immediately suspended pending resolution of the dispute.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[--color-bc-ink] mb-3">5. Changes to This Policy</h2>
              <p>We reserve the right to modify this refund policy at any time. Changes will take effect immediately upon their posting on this page.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
