'use client';

import styles from './PrivacyPolicyPage.module.scss';

import { Button } from '@/shared/ui/Button';
import { useDictionary } from 'next-intlayer';
import privacyPolicyContent from '../privacy-policy.content';

export function PrivacyPolicyPage() {
  const content = useDictionary(privacyPolicyContent);

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
          <h3 className={`h3 ${styles.title_policy_item}`}>{content.introTitle}</h3>
          <p>
            {content.introText}
          </p>
        </div>

        <div className={styles.privacy_policy_item}>
          <h3 className={`h3 ${styles.title_policy_item}`}>{content.collectTitle}</h3>
          <p>{content.collectLead}</p>
          <ul>
            <li>
              <span>{content.collectAccountLabel}</span> {content.collectAccountText}
            </li>
            <li>
              <span>{content.collectContentLabel}</span> {content.collectContentText}
            </li>
            <li>
              <span>{content.collectUsageLabel}</span> {content.collectUsageText}
            </li>
            <li>
              <span>{content.collectTechLabel}</span> {content.collectTechText}
            </li>
          </ul>
        </div>

        <div className={styles.privacy_policy_item}>
          <h3 className={`h3 ${styles.title_policy_item}`}>{content.useTitle}</h3>
          <ul>
            <li>{content.useItem1}</li>
            <li>{content.useItem2}</li>
            <li>{content.useItem3}</li>
            <li>{content.useItem4}</li>
            <li>{content.useItem5}</li>
          </ul>
        </div>

        <div className={styles.privacy_policy_item}>
          <h3 className={`h3 ${styles.title_policy_item}`}>{content.shareTitle}</h3>
          <ul>
            <li>{content.shareItem1}</li>
            <li>{content.shareItem2}</li>
            <li>{content.shareItem3}</li>
          </ul>
        </div>

        <div className={styles.privacy_policy_item}>
          <h3 className={`h3 ${styles.title_policy_item}`}>{content.storageTitle}</h3>
          <p>
            {content.storageText}
          </p>
        </div>

        <div className={styles.privacy_policy_item}>
          <h3 className={`h3 ${styles.title_policy_item}`}>{content.rightsTitle}</h3>
          <ul>
            <li>{content.rightsItem1}</li>
            <li>{content.rightsItem2}</li>
            <li>{content.rightsItem3}</li>
          </ul>
        </div>

        <div className={styles.privacy_policy_item}>
          <h3 className={`h3 ${styles.title_policy_item}`}>{content.cookiesTitle}</h3>
          <p>
            {content.cookiesText}
          </p>
        </div>

        <div className={styles.privacy_policy_item}>
          <h3 className={styles.title_policy_item}>{content.childrenTitle}</h3>
          <p>{content.childrenText}</p>
        </div>

        <div className={styles.privacy_policy_item}>
          <h3 className={styles.title_policy_item}>{content.changesTitle}</h3>
          <p>{content.changesText}</p>
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
