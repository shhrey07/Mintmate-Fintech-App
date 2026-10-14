import { useState } from 'react'
import * as P from '@phosphor-icons/react'
import { Button, cx } from './ui'
import { Wordmark } from './site'

interface LegalProps {
  onBack: () => void
}

export function PrivacyPolicy({ onBack }: LegalProps) {
  return (
    <div className="mx-auto max-w-[720px] px-5 py-6">
      <button
        onClick={onBack}
        className="mb-6 inline-flex h-10 items-center gap-2 rounded-lg px-3 font-semibold text-muted hover:bg-surface2 hover:text-ink"
      >
        <P.ArrowLeft size={20} weight="bold" />
        Back
      </button>

      <div className="space-y-6">
        <div>
          <Wordmark className="mb-2" />
          <h1 className="serif text-4xl font-bold">Privacy Policy</h1>
          <p className="mt-2 text-sm text-muted">Last updated: October 2026</p>
        </div>

        <div className="space-y-6 text-[15px] leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold">1. Information We Collect</h2>
            <p className="text-muted">
              MintMate collects and stores your financial data locally on your device. We collect:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-muted">
              <li>Account information (name, email)</li>
              <li>Transaction records you manually enter</li>
              <li>Budget preferences and spending limits</li>
              <li>Goals and savings targets</li>
              <li>App usage analytics (optional)</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">2. How We Use Your Data</h2>
            <p className="text-muted">
              Your data is used exclusively to provide budgeting services:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-muted">
              <li>Track your expenses and income</li>
              <li>Generate spending insights and reports</li>
              <li>Provide personalized budget recommendations</li>
              <li>Send notifications for bills and budget alerts</li>
              <li>Improve app features and user experience</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">3. Data Storage & Security</h2>
            <p className="text-muted">
              <strong>Local Storage:</strong> All your financial data is stored locally on your device using encrypted browser storage. We do not send your transaction data to external servers.
            </p>
            <p className="text-muted">
              <strong>Cloud Backup (Optional):</strong> If you enable cloud backup, data is encrypted end-to-end before syncing to secure cloud storage.
            </p>
            <p className="text-muted">
              <strong>Security:</strong> We implement industry-standard security measures including encryption, secure authentication, and regular security audits.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">4. Data Sharing</h2>
            <p className="text-muted">
              We do NOT sell, rent, or share your personal financial data with third parties for marketing purposes. Limited data sharing occurs only for:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-muted">
              <li>Service providers (cloud storage, authentication)</li>
              <li>Legal compliance when required by law</li>
              <li>Anonymous analytics to improve the app</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">5. Your Rights</h2>
            <p className="text-muted">You have the right to:</p>
            <ul className="ml-6 list-disc space-y-2 text-muted">
              <li>Access your data at any time</li>
              <li>Export all your data in CSV/JSON format</li>
              <li>Delete your account and all associated data</li>
              <li>Opt-out of analytics and non-essential features</li>
              <li>Request data corrections or updates</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">6. Cookies & Tracking</h2>
            <p className="text-muted">
              MintMate uses essential cookies for authentication and preferences. We use optional analytics cookies to understand how users interact with the app. You can disable these in Settings.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">7. Children's Privacy</h2>
            <p className="text-muted">
              MintMate is not intended for children under 13. We do not knowingly collect data from children. If you believe a child has provided us with personal information, please contact us immediately.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">8. Changes to This Policy</h2>
            <p className="text-muted">
              We may update this Privacy Policy periodically. We'll notify you of significant changes via email or in-app notification. Continued use of MintMate after changes constitutes acceptance.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">9. Contact Us</h2>
            <p className="text-muted">
              Questions about privacy? Contact us at:
            </p>
            <ul className="ml-6 list-none space-y-2 text-muted">
              <li><strong>Email:</strong> privacy@mintmate.app</li>
              <li><strong>Address:</strong> MintMate Technologies, Bengaluru, India</li>
              <li><strong>Support:</strong> support@mintmate.app</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}

export function TermsOfService({ onBack }: LegalProps) {
  return (
    <div className="mx-auto max-w-[720px] px-5 py-6">
      <button
        onClick={onBack}
        className="mb-6 inline-flex h-10 items-center gap-2 rounded-lg px-3 font-semibold text-muted hover:bg-surface2 hover:text-ink"
      >
        <P.ArrowLeft size={20} weight="bold" />
        Back
      </button>

      <div className="space-y-6">
        <div>
          <Wordmark className="mb-2" />
          <h1 className="serif text-4xl font-bold">Terms of Service</h1>
          <p className="mt-2 text-sm text-muted">Last updated: October 2026</p>
        </div>

        <div className="space-y-6 text-[15px] leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold">1. Agreement to Terms</h2>
            <p className="text-muted">
              By accessing or using MintMate, you agree to be bound by these Terms of Service and our Privacy Policy. If you disagree with any part of these terms, you may not use our service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">2. Description of Service</h2>
            <p className="text-muted">
              MintMate is a personal budget management application that helps you:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-muted">
              <li>Track income and expenses</li>
              <li>Set and monitor budgets</li>
              <li>Manage bills and payment schedules</li>
              <li>Plan savings goals</li>
              <li>Get AI-powered financial insights</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">3. User Accounts</h2>
            <p className="text-muted">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-muted">
              <li>Provide accurate and complete information</li>
              <li>Keep your password secure</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Be at least 13 years old to create an account</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">4. Acceptable Use</h2>
            <p className="text-muted">You agree NOT to:</p>
            <ul className="ml-6 list-disc space-y-2 text-muted">
              <li>Use MintMate for illegal purposes</li>
              <li>Attempt to hack, reverse engineer, or compromise the app</li>
              <li>Share your account with others</li>
              <li>Input false or misleading information deliberately</li>
              <li>Abuse support or customer service</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">5. Financial Disclaimer</h2>
            <p className="text-muted">
              <strong>Important:</strong> MintMate is a budgeting tool, NOT financial advice. We do not:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-muted">
              <li>Provide investment, tax, or legal advice</li>
              <li>Guarantee financial outcomes or savings</li>
              <li>Take responsibility for your financial decisions</li>
              <li>Connect to your bank accounts or process payments</li>
            </ul>
            <p className="text-muted">
              Always consult qualified financial advisors for major financial decisions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">6. Data Accuracy</h2>
            <p className="text-muted">
              You are responsible for the accuracy of data you enter. MintMate provides tools to track and analyze your finances, but we cannot guarantee 100% accuracy of calculations, especially with user-entered data.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">7. Subscription & Payment</h2>
            <p className="text-muted">
              MintMate offers free and premium tiers:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-muted">
              <li><strong>Free:</strong> Basic budgeting features with ads</li>
              <li><strong>Premium:</strong> Ad-free, advanced features, cloud backup</li>
            </ul>
            <p className="text-muted">
              Premium subscriptions auto-renew unless cancelled. Refunds are provided per our refund policy (14-day satisfaction guarantee).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">8. Intellectual Property</h2>
            <p className="text-muted">
              MintMate and its content (designs, text, graphics, logos) are owned by MintMate Technologies and protected by copyright and trademark laws. You may not copy, distribute, or create derivative works without permission.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">9. Limitation of Liability</h2>
            <p className="text-muted">
              MintMate is provided "as is" without warranties. We are not liable for:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-muted">
              <li>Lost data or financial losses</li>
              <li>Service interruptions or bugs</li>
              <li>Financial decisions made using the app</li>
              <li>Third-party integrations or services</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">10. Termination</h2>
            <p className="text-muted">
              We may suspend or terminate your account if you violate these terms. You may delete your account at any time from Settings. Upon termination, you lose access to cloud-stored data.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">11. Changes to Terms</h2>
            <p className="text-muted">
              We reserve the right to modify these terms at any time. Material changes will be notified via email or in-app. Continued use after changes means you accept the new terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">12. Governing Law</h2>
            <p className="text-muted">
              These terms are governed by the laws of India. Disputes will be resolved in Bengaluru courts.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">13. Contact</h2>
            <p className="text-muted">
              Questions? Reach us at:
            </p>
            <ul className="ml-6 list-none space-y-2 text-muted">
              <li><strong>Email:</strong> legal@mintmate.app</li>
              <li><strong>Support:</strong> support@mintmate.app</li>
              <li><strong>Website:</strong> www.mintmate.app</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
