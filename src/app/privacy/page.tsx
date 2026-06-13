import { Nav } from '@/components/shared/Nav'
import { Footer } from '@/components/shared/Footer'

export const metadata = {
  title: 'Privacy Policy',
}

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-[--color-bc-surface] pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6 prose prose-slate dark:prose-invert">
          <h1 className="text-3xl font-bold text-[--color-bc-ink] mb-8">Privacy Policy</h1>
          <p className="text-[--color-bc-muted] mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-6 text-[--color-bc-ink-2]">
            <section>
              <h2 className="text-xl font-semibold text-[--color-bc-ink] mb-3">1. Information We Collect</h2>
              <p>When you use BidCopy, we collect information you provide directly to us, including your name, email address (via Clerk authentication), profile details (skills, bio, past projects), and the job descriptions you submit for proposal generation.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[--color-bc-ink] mb-3">2. How We Use Your Information</h2>
              <p>We use your information to provide, maintain, and improve our services. Specifically, your profile data and submitted job descriptions are processed by our AI partners (OpenAI) strictly for the purpose of generating your personalized proposals.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[--color-bc-ink] mb-3">3. Data Sharing and Third Parties</h2>
              <p>We do not sell your personal data. We share necessary information with trusted third-party services to operate BidCopy:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>OpenAI:</strong> Receives prompts to generate text. They do not use API data to train their general models.</li>
                <li><strong>Clerk:</strong> Manages user authentication and secure login.</li>
                <li><strong>Razorpay:</strong> Securely processes payments. We do not store your credit card information.</li>
                <li><strong>Supabase:</strong> securely hosts our database infrastructure.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[--color-bc-ink] mb-3">4. Cookies and Analytics</h2>
              <p>We use cookies and similar tracking technologies (such as Vercel Analytics) to track user behavior on our website and improve performance. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[--color-bc-ink] mb-3">5. Data Security</h2>
              <p>We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is entirely secure, and we cannot guarantee absolute security.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[--color-bc-ink] mb-3">6. Your Rights</h2>
              <p>You have the right to access, update, or delete your personal information. You can manage your profile data within the BidCopy dashboard or request full account deletion by contacting support.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[--color-bc-ink] mb-3">7. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at <strong>hello@bidcopy.com</strong>.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
