'use client';

import styles from './TermsPage.module.scss';
import { Button } from '@/shared/ui/Button';
import { useDictionary } from 'next-intlayer';
import termsContent from '../terms.content';

export function TermsPage() {
  const content = useDictionary(termsContent);

  return (
    <section className={styles.page}>
      <div className={styles.back_link}>
        <Button href="/sign-up" variant={'text'} style={{ color: 'var(--light-100-color)' }}>
          {content.backToSignUp}
        </Button>
      </div>
      <h2 className={styles.title}>{content.title}</h2>
      <div className={styles.wrapper_items}>
        <div className={styles.privacy_policy_item}>
          <h3 className={styles.title_policy_item}>{content.acceptanceTitle}</h3>
          <p>
            {content.welcome}
          </p>
          <p>
            {content.acceptanceText}
          </p>
        </div>

        <div className={styles.privacy_policy_item}>
          <h3 className={styles.title_policy_item}>{content.eligibilityTitle}</h3>
          <p>
            {content.eligibilityText}
          </p>
        </div>

        <div className={styles.privacy_policy_item}>
          <h3 className={styles.title_policy_item}>{content.accountsTitle}</h3>
          <p>{content.accountsText}</p>
          <ul>
            <li>{content.accountsItem1}</li>
            <li>{content.accountsItem2}</li>
            <li>{content.accountsItem3}</li>
          </ul>
        </div>

        <div className={styles.privacy_policy_item}>
          <h3 className={styles.title_policy_item}>{content.acceptableTitle}</h3>
          <p>
            {content.acceptableText}
          </p>
          <ul>
            <li>{content.acceptableItem1}</li>
            <li>{content.acceptableItem2}</li>
            <li>{content.acceptableItem3}</li>
            <li>{content.acceptableItem4}</li>
            <li>{content.acceptableItem5}</li>
          </ul>
        </div>

        <div className={styles.privacy_policy_item}>
          <h3 className={styles.title_policy_item}>{content.userContentTitle}</h3>
          <p>
            {content.userContentText1}
          </p>
          <p>
            {content.userContentText2}
          </p>
          <p>{content.userContentText3}</p>
        </div>

        <div className={styles.privacy_policy_item}>
          <h3 className={styles.title_policy_item}>{content.ipTitle}</h3>
          <p>
            {content.ipText1}
          </p>
          <p>
            {content.ipText2}
          </p>
        </div>

        <div className={styles.privacy_policy_item}>
          <h3 className={styles.title_policy_item}>{content.terminationTitle}</h3>
          <p>
            {content.terminationText}
          </p>
        </div>

        <div className={styles.privacy_policy_item}>
          <h3 className={styles.title_policy_item}>{content.warrantyTitle}</h3>
          <p>
            {content.warrantyText}
          </p>
        </div>

        <div className={styles.privacy_policy_item}>
          <h3 className={styles.title_policy_item}>{content.liabilityTitle}</h3>
          <p>
            {content.liabilityText}
          </p>
        </div>

        <div className={styles.privacy_policy_item}>
          <h3 className={styles.title_policy_item}>{content.privacyTitle}</h3>
          <p>
            {content.privacyText}
          </p>
        </div>

        <div className={styles.privacy_policy_item}>
          <h3 className={styles.title_policy_item}>{content.changesTitle}</h3>
          <p>
            {content.changesText}
          </p>
        </div>

        <div className={styles.privacy_policy_item}>
          <h3 className={styles.title_policy_item}>{content.lawTitle}</h3>
          <p>{content.lawText}</p>
        </div>

        <div className={styles.privacy_policy_item}>
          <h3 className={styles.title_policy_item}>{content.contactTitle}</h3>
          <p>{content.contactText}</p>
          <p>
            <strong>{content.emailLabel} </strong>
            <a className={`regular_link`} href="mailto:social.network.incubator@gmail.com">
              social.network.incubator@gmail.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
