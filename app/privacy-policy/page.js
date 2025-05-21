"use client";
import React from 'react';
import './PrivacyPolicy.css'; // Import your CSS file for styling
import Private from '../layout/Private';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';

const PrivacyPolicy = () => {
  const router = useRouter();
  return (
    <Private>
      <div className='relative'>
      <button
                          className="absolute top-10 left-0 transform -translate-x-1/2 -translate-y-1/2 bg-slate-400 rounded-full pr-6 p-4  text-white  group transition-all duration-300 ease-in-out"
                          onClick={() => {
                            router.back();
                          }}
                        >
                          <Icon icon="material-symbols:arrow-back" width={20} className="ml-8 transform transition-transform duration-300 group-hover:-translate-x-2" />
                        </button>
      </div>

    <div className="privacy-policy-container">
      
      <h1>Privacy Policy</h1>

      <section className="section">
        <h2>Introduction</h2>
        <p>
          We value the trust you place in us and recognize the importance of secure transactions and information privacy. This Privacy Policy describes how Fashion Mate AI and its affiliates (collectively Fashion Mate, we, our, us) collect, use, share, protect, or otherwise process your personal data through the Fashion Mate AI Application.
        </p>
        <p>
          While you may be able to browse certain sections of the Platform without registering with us, please note we do not offer any product/service under this Platform outside India, and your personal data will primarily be stored and processed in India. By visiting this Platform, providing your information, or availing any product/service offered on the Platform, you expressly agree to be bound by the terms and conditions of this Privacy Policy and the applicable service/product terms and conditions, and agree to be governed by the laws of India, including but not limited to the laws applicable to data protection and privacy. If you do not agree, please do not use or access our Platform.
        </p>
      </section>

      <section className="section">
        <h2>Collection</h2>
        <p>
          We collect your personal data relating to your identity, demographics, and other information when you use our Platform, services, or otherwise interact with us during the course of our relationship. Some of the information that we may collect includes but is not limited to:
        </p>
        <ul>
          <li>Information provided during sign-up/registering or using our Platform, such as name, date of birth, address, telephone/mobile number, email ID, and any such information shared as proof of identity or address.</li>
          <li>Sensitive personal data, such as bank account or credit/debit card information, biometric information (e.g., facial features), and other payment instrument details, collected with your consent.</li>
          <li>Information related to your shopping behavior, preferences, call data records, device location, voice, browsing history, and other details you provide to us.</li>
        </ul>
        <p>
          Our primary goal in collecting this information is to provide you with a safe, efficient, smooth, and customized experience. This allows us to offer services and features that meet your needs and to customize our Platform to make your experience safer and easier.
        </p>
      </section>

      <section className="section">
        <h2>Use</h2>
        <p>
          We use personal data to provide the services you request. To the extent we use your personal data to market to you, we will provide you with the ability to opt-out of such uses. We use your personal data to assist sellers and business partners in handling and fulfilling orders, enhancing customer experience, resolving disputes, troubleshooting problems, and promoting a safe service.
        </p>
      </section>

      <section className="section">
        <h2>Cookies</h2>
        <p>
          We use data collection devices such as cookies on certain pages of the Platform to help analyze our web page flow, measure promotional effectiveness, and promote trust and safety. Cookies are small files placed on your hard drive that assist us in providing our services. You are always free to decline/delete our cookies if your browser permits, although in that case, you may not be able to use certain features on the Platform.
        </p>
      </section>

      <section className="section">
        <h2>Sharing</h2>
        <p>
          We may share your personal data internally within the company, with third parties, including Credit Bureaus and business partners, for purposes of providing products and services offered by them. We may also disclose personal data to government agencies or authorized law enforcement agencies if required by law.
        </p>
      </section>

      <section className="section">
        <h2>Security Precautions</h2>
        <p>
          To protect your personal data from unauthorized access or disclosure, loss, or misuse, we adopt reasonable security practices and procedures. However, by using the Platform, users accept the security implications of data transmission over the internet, which cannot always be guaranteed as completely secure.
        </p>
      </section>

      <section className="section">
        <h2>Your Rights</h2>
        <p>
          You have the right to access, rectify, and update your personal data directly through the functionalities provided on the Platform. If you have any queries, concerns, or complaints regarding the collection or usage of your personal data, please contact us at the contact information provided below.
        </p>
      </section>

      <section className="section">
        <h2>Grievance Officer</h2>
        <p>
          <strong>Mr. Rajendhar Mamidala</strong><br />
          Designation: Manager - CC - Social Media<br />
          Techiebears Pvt Ltd<br />
          Email: Rajendhar.Mamidala@techiebears.com<br />
          Phone: 080-61561999<br />
          Time: Monday - Friday (9:00 - 18:00)
        </p>
      </section>

      <section className="section">
        <h2>Changes to this Privacy Policy</h2>
        <p>
          We may update this Privacy Policy to reflect changes to our information practices. We will alert you to significant changes by posting the date our Privacy Policy was last updated, placing a notice on our Platform, or by sending you an email when required by applicable law.
        </p>
      </section>
    </div>
    </Private>
  );
};

export default PrivacyPolicy;