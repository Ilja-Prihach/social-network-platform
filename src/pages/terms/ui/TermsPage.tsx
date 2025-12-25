import styles from './TermsPage.module.scss';
import { Button } from '@/shared/ui/Button';

export function TermsPage() {
  return (
    <section className={styles.page}>
      <div className={styles.back_link}>
        <Button
          href="/src/pages/sign-up"
          variant={'text'}
          style={{ color: 'var(--light-100-color)' }}
        >
          ← Back to Sign Up
        </Button>
      </div>
      <h2 className={styles.title}>Terms of Service</h2>
      <div className={styles.wrapper_items}>
        <div className={styles.privacy_policy_item}>
          <h3 className={styles.title_policy_item}> Acceptance of Terms</h3>
          <p>
            Welcome to <span>SocialNetwork</span>.
          </p>
          <p>
            By accessing or using the SocialNetwork application, website, or any related services
            (collectively, the “Service”), you agree to be bound by these Terms of Service
            (“Terms”). If you do not agree to these Terms, you may not use the Service.
          </p>
        </div>

        <div className={styles.privacy_policy_item}>
          <h3 className={styles.title_policy_item}> Eligibility</h3>
          <p>
            You must be at least 13 years old to use SocialNetwork. By using the Service, you
            confirm that you have the legal capacity to enter into this agreement.
          </p>
        </div>

        <div className={styles.privacy_policy_item}>
          <h3 className={styles.title_policy_item}> User Accounts</h3>
          <p>To access certain features of the Service, you must create an account.</p>
          <ul>
            <li>You agree to provide accurate and current information</li>
            <li>You are responsible for maintaining the confidentiality of your account</li>
            <li>You accept responsibility for all activities that occur under your account</li>
          </ul>
        </div>

        <div className={styles.privacy_policy_item}>
          <h3 className={styles.title_policy_item}> Acceptable Use</h3>
          <p>
            You agree not to misuse the Service. Prohibited activities include, but are not limited
            to:
          </p>
          <ul>
            <li>Violating any applicable laws or regulations</li>
            <li>Posting illegal, abusive, hateful, or harmful content</li>
            <li>Impersonating another person or entity</li>
            <li>Distributing spam, malware, or malicious software</li>
            <li>Attempting to disrupt or compromise the Service</li>
          </ul>
        </div>

        <div className={styles.privacy_policy_item}>
          <h3 className={styles.title_policy_item}> User Content</h3>
          <p>
            SocialNetwork allows users to post content such as photos, videos, text, and comments
            (“User Content”).
          </p>
          <p>
            You retain ownership of your content. By posting content, you grant SocialNetwork a
            non-exclusive, worldwide, royalty-free license to host, display, reproduce, and
            distribute your content within the Service.
          </p>
          <p>You are solely responsible for the content you post.</p>
        </div>

        <div className={styles.privacy_policy_item}>
          <h3 className={styles.title_policy_item}> Intellectual Property</h3>
          <p>
            All content and materials provided by SocialNetwork, excluding User Content, including
            software, design, logos, and trademarks, are the property of SocialNetwork.
          </p>
          <p>
            You may not copy, modify, or distribute any part of the Service without prior written
            permission.
          </p>
        </div>

        <div className={styles.privacy_policy_item}>
          <h3 className={styles.title_policy_item}> Termination</h3>
          <p>
            We reserve the right to suspend or terminate your account at any time if you violate
            these Terms or engage in behavior that harms the Service or other users.
          </p>
        </div>

        <div className={styles.privacy_policy_item}>
          <h3 className={styles.title_policy_item}> Disclaimer of Warranties</h3>
          <p>
            The Service is provided on an “AS IS” and “AS AVAILABLE” basis. We make no warranties
            regarding availability, reliability, or accuracy.
          </p>
        </div>

        <div className={styles.privacy_policy_item}>
          <h3 className={styles.title_policy_item}> Limitation of Liability</h3>
          <p>
            To the maximum extent permitted by law, SocialNetwork shall not be liable for any
            indirect, incidental, or consequential damages arising from your use of the Service.
          </p>
        </div>

        <div className={styles.privacy_policy_item}>
          <h3 className={styles.title_policy_item}> Privacy Policy</h3>
          <p>
            Your use of the Service is also governed by our Privacy Policy, which explains how we
            collect and process personal data.
          </p>
        </div>

        <div className={styles.privacy_policy_item}>
          <h3 className={styles.title_policy_item}> Changes to These Terms</h3>
          <p>
            We may update these Terms from time to time. Continued use of the Service after changes
            indicates acceptance of the updated Terms.
          </p>
        </div>

        <div className={styles.privacy_policy_item}>
          <h3 className={styles.title_policy_item}> Governing Law</h3>
          <p>These Terms shall be governed and interpreted in accordance with applicable laws.</p>
        </div>

        <div className={styles.privacy_policy_item}>
          <h3 className={styles.title_policy_item}> Contact Us</h3>
          <p>If you have any questions about these Terms, please contact us at:</p>
          <p>
            <strong>Email: </strong>
            <a className={`regular_link`} href="mailto:social.network.incubator@gmail.com">
              social.network.incubator@gmail.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
