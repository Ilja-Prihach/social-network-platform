import styles from "./PrivacyPolicyPage.module.scss";
import Link from "next/link";

export function PrivacyPolicyPage() {
    return (
        <section className={styles.page}>
            <Link href="/sign-up" className={styles.back_link} aria-label="Back to Sign Up">
                ← Back to Sign Up
            </Link>
            <h2 className={styles.title}>Privacy Policy</h2>
            <div className={styles.wrapper_items}>
                <div className={styles.privacy_policy_item}>
                    <h3 className={styles.title_policy_item}>Introduction</h3>
                    <p>
                        This Privacy Policy explains how we collect, use, store, and protect your personal information when you
                        use our application (the “Service”). By accessing or using the Service, you agree to the practices
                        described in this Privacy Policy.
                    </p>
                </div>

                <div className={styles.privacy_policy_item}>
                    <h3 className={styles.title_policy_item}>Information We Collect</h3>
                    <p>We may collect the following types of information:</p>
                    <ul>
                        <li>
                            <span>Account Information:</span> username, email address, profile
                            photo, and other information you provide when creating an account.
                        </li>
                        <li>
                            <span>Content:</span> photos, videos, comments, likes, and messages
                            you post or send through the Service.
                        </li>
                        <li>
                            <span>Usage Data:</span> viewed content, interactions, and activity
                            timestamps.
                        </li>
                        <li>
                            <span>Technical Data:</span> device type, OS, browser type, IP
                            address, and log data.
                        </li>
                    </ul>
                </div>

                <div className={styles.privacy_policy_item}>
                    <h3 className={styles.title_policy_item}>How We Use Your Information</h3>
                    <ul>
                        <li>Provide, operate, and maintain the Service</li>
                        <li>Personalize user experience and recommendations</li>
                        <li>Enable likes, comments, and messaging</li>
                        <li>Improve performance, security, and reliability</li>
                        <li>Communicate about updates and support</li>
                    </ul>
                </div>

                <div className={styles.privacy_policy_item}>
                    <h3 className={styles.title_policy_item}> Sharing of Information </h3>
                    <ul>
                        <li>With service providers supporting the Service</li>
                        <li>To comply with legal obligations</li>
                        <li>To protect users, rights, and security</li>
                    </ul>
                </div>

                <div className={styles.privacy_policy_item}>
                    <h3 className={styles.title_policy_item}> Data Storage and Security </h3>
                    <p>
                        We use reasonable technical and organizational measures to protect your
                        data. However, no Internet transmission is 100% secure.
                    </p>
                </div>

                <div className={styles.privacy_policy_item}>
                    <h3 className={styles.title_policy_item}>User Rights</h3>
                    <ul>
                        <li>Access your personal data</li>
                        <li>Request correction or deletion</li>
                        <li>Restrict or object to processing</li>
                    </ul>
                </div>


                <div className={styles.privacy_policy_item}>
                    <h3 className={styles.title_policy_item}>Cookies and Tracking</h3>
                    <p>
                        We may use cookies to improve functionality and analyze usage. You can
                        control cookies via browser settings.
                    </p>
                </div>


                <div className={styles.privacy_policy_item}>
                    <h3 className={styles.title_policy_item}>Children’s Privacy</h3>
                    <p>
                        The Service is not intended for users under 13 years old.
                    </p>
                </div>

                <div className={styles.privacy_policy_item}>
                    <h3 className={styles.title_policy_item}>Changes to This Policy</h3>
                    <p>
                        We may update this Privacy Policy from time to time.
                    </p>
                </div>

                <div className={styles.privacy_policy_item}>
                    <h3 className={styles.title_policy_item}>Contact Us</h3>
                    <p>
                        <a href="mailto:social.network.incubator@gmail.com">
                            social.network.incubator@gmail.com
                        </a>
                    </p>
                </div>

            </div>
        </section>
    );
}
