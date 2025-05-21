"use client";
import React from "react";
import "./terms.css"; // Import the CSS file for styling
import Private from "../layout/Private";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

const TermsOfUse = () => {
  const router = useRouter();
  return (
    <Private>
      <div className='relative'>
            <button
                                className="absolute top-10 left-0 transform -translate-x-1/2 -translate-y-1/2 bg-slate-400 rounded-full pr-6 p-4  text-white group transition-all duration-300 ease-in-out "
                                onClick={() => {
                                  router.back();
                                }}
                              >
                                <Icon icon="material-symbols:arrow-back" width={20} className="ml-8 transform transition-transform duration-300 group-hover:-translate-x-2" />
                              </button>
            </div>
    <div className="terms-of-use-container">
      <h1>FASHIONMATE AI: TERMS OF USE</h1>

      <section className="section">
        <h2>Introduction</h2>
        <p>
          The Platform is owned by Techiebears Private Limited. Your use of the
          Fashion Mate and services and tools are governed by the following
          terms and conditions (Terms of Use) as applicable to the Fashion
          Mate, including the applicable policies which are incorporated herein
          by way of reference. By mere use of the Fashion Mate, You shall be
          contracting with Techiebears Private Limited, the owner of the
          Platform. These terms and conditions, including the policies,
          constitute Your binding obligations with Fashion Mate.
        </p>
        <p>
          For the purpose of these Terms of Use, wherever the context so
          requires, You or User shall mean any natural or legal person who
          has agreed to become a buyer on the Platform by providing data while
          registering on the Platform as a Registered User. The term Fashion
          Mate, We Us, Our shall mean Techiebears Private Limited and
          its affiliates.
        </p>
        <p>
          When You use any of the services provided by Us through the Platform,
          including but not limited to, (e.g. Product Reviews, Seller Reviews),
          You will be subject to the rules, guidelines, policies, terms, and
          conditions applicable to such service, and they shall be deemed to be
          incorporated into this Terms of Use and shall be considered as part
          and parcel of this Terms of Use. We reserve the right, at Our sole
          discretion, to change, modify, add or remove portions of these Terms
          of Use, at any time without any prior written notice to You. You shall
          ensure to review these Terms of Use periodically for updates/changes.
          Your continued use of the Platform following the posting of changes
          will mean that You accept and agree to the revisions. As long as You
          comply with these Terms of Use, We grant You a personal,
          non-exclusive, non-transferable, limited privilege to enter and use
          the Platform. By impliedly or expressly accepting these Terms of Use,
          You also accept and agree to be bound by Fashion Mate Policies
          including but not limited to Privacy Policy as amended from time to
          time.
        </p>
      </section>

      <section className="section">
        <h2>1. User Account, Password, and Security</h2>
        <p>
          If You use the Platform, You shall be responsible for maintaining the
          confidentiality of your Display Name and Password and shall be
          responsible for all activities that occur under your Display Name and
          Password. You agree that if You provide any information that is
          untrue, inaccurate, not current, or incomplete or not in accordance
          with this Terms of Use, We shall have the right to indefinitely
          suspend, terminate, or block Your access to the Platform.
        </p>
        <p>
          If there is reason to believe that there is likely to be a breach of
          security or misuse of Your account, We may request You to change the
          password or suspend Your account without any liability to Fashion Mate
          for such period of time as we deem appropriate in the circumstances.
          We shall not be liable for any loss or damage arising from Your
          failure to comply with this provision.
        </p>
        <p>
          In the event of a device being associated with multiple logins or sign
          ups, as a measure to enhance customer&lsquo;s security and privacy as well
          as safeguarding your sensitive information for any potential risks,
          Fashion Mate sometimes consider moderating users and their association
          with devices while using the Fashion Mate app or website. Your mobile
          phone number is treated as Your primary identifier on the Platform. It
          is your responsibility to ensure that Your mobile phone number and
          your email address is up to date on the Platform at all times. You
          agree to notify Us promptly if your mobile phone number or e-mail
          address changes by updating the same on the Platform through an OTP
          verification. You agree that Fashion Mate shall not be liable or
          responsible for the activities or consequences of use or misuse of any
          information that occurs under your Account in cases, including, where
          You have failed to update Your revised mobile phone number and/or
          e-mail address on the Platform. You agree to immediately notify
          Fashion Mate of any unauthorized use/breach of your password or
          account. If You share or allow others to have access to Your account
          on the Platform (Account), by creating separate profiles under Your
          Account, or otherwise, they will be able to view and access Your
          Account information, You shall be solely liable and responsible for
          all the activities undertaken under Your Account, and any consequences
          therefrom. If You have not accessed Platform for a period of 2 (two)
          Years, Your data (including transactional data) will be deleted from
          Our record and You will not be able to access such data.
        </p>
      </section>

      <section className="section">
        <h2>2. Services Offered</h2>
        <p>
          Fashion Mate provides a number of Internet-based services through the
          Platform. One such Service enables Users to purchase original
          merchandise such as clothing, footwear, and accessories from various
          fashion and lifestyle brands (collectively, Products). The Products
          can be purchased through the Platform using various methods of payment
          offered.
        </p>
        <p>
          The sale/purchase of Products shall be additionally governed by
          specific policies of sale, such as cancellation policy, exchange
          policy, return policy, etc. (which are found on the FAQ tab on the
          Platform and all of which are incorporated here by reference). ). It
          is clarified that at the time of creating a return request, users are
          required to confirm (via a check box click) that the product being
          returned is unused and has the original tags intact. If the product
          returned by the user is used, damaged or if the original tags are
          missing, the user’s return request shall be declined, and the said
          product shall be re-shipped back to the customer. In the event that
          the return request is declined, the user shall not be eligible for a
          refund, and Fashion Mate assumes no liability in this regard. Further,
          in the event that the user fails to accept the receipt of the said
          re-shipped product, the user shall continue to be not eligible for a
          refund, and Fashion Mate assumes no liability with respect to the
          return or refund for the said re-shipped product. In addition, these
          Terms of Use may be further supplemented by Product specific
          conditions, which may be displayed with that Product. Fashion Mate
          does not warrant that Product description or other content on the
          Platform is accurate, complete, reliable, current, or error-free and
          assumes no liability in this regard.
        </p>
      </section>

      <section className="section">
        <h2>3. Platform for Transaction and Communication</h2>
        <p>
          The Users utilize the Platform to meet and interact with one another
          for their transactions. Fashion Mate is not and cannot be a party to
          or control in any manner any transaction between the Fashion Mate&lsquo;s
          Users. Henceforward:
        </p>
        <ul>
          <li>
            All commercial/contractual terms are offered by and agreed to
            between Buyers and Sellers alone.
          </li>
          <li>
            Fashion Mate does not make any representation or warranty as to
            specifics (such as quality, value, salability, etc.) of the products
            or services proposed to be sold or offered to be sold or purchased
            on the Platform.
          </li>
          <li>
            Fashion Mate is not responsible for any non-performance or breach of
            any contract entered into between Buyers and Sellers.
          </li>

          <li>
            
            At no time shall Fashion Mate hold any right, title or interest over
            the products nor shall Fashion Mate have any obligations or
            liabilities in respect of such contract entered into between Buyers
            and Sellers.
          </li>
          <li>
            
            At no time shall Fashion Mate hold any any right, title or interest
            over the products nor shall Fashion Mate have any obligations or
            liabilities in respect of such contract. Fashion Mate is not
            responsible for unsatisfactory or delayed performance of services or
            damages or delays as a result of products which are out of stock,
            unavailable or back ordered.
          </li>
          <li>
            
            You release and indemnify Fashion Mate and/or any of its officers
            and representatives from any cost, damage, liability or other
            consequence of any of the actions of the Users of the Fashion Mate
            and specifically waive any claims that you may have in this behalf
            under any applicable law. Notwithstanding its reasonable efforts in
            that behalf, Fashion Mate cannot take responsibility or control the
            information provided by other Users which is made available on the
            Platform.
          </li>
          <li>
            
            The Fashion Mate is only a platform that can be utilized by Users to
            reach a larger base to buy and sell products or services. Fashion
            Mate is only providing a platform for communication and it is agreed
            that the contract for sale of any of the products or services shall
            be a strictly bipartite contract between the Seller and the Buyer.
            Pricing on any product(s) as is reflected on the Platform may due to
            some technical issue, typographical error or product information
            published by seller may be incorrectly reflected and in such an
            event seller may cancel such your order(s).
          </li>
        </ul>
      </section>

      <section className="section">
        <h2>4. User Conduct and Rules on the Platform</h2>
        <p>
          You agree, undertake, and confirm that Your use of the Platform shall
          be strictly governed by the following binding principles:
        </p>
        <ul>
          <li>
            You shall not host, display, upload, modify, publish, transmit,
            update, or share any information that belongs to another person and
            to which You do not have any right.
          </li>
          <li>
            You shall not engage in advertising to, or solicitation of, other
            Users of the Platform to buy or sell any products or services.
          </li>
          <li>
            You shall not use any false email address, impersonate any person or
            entity, or otherwise mislead Fashion Mate by sharing multiple
            addresses and phone numbers or transacting with malafide intentions.
          </li>
        </ul>
        <p>
          o contains restricted or password-only access pages, or hidden pages
          or images (those not linked to or from another accessible page) o
          provides instructional information about illegal activities such as
          making or buying illegal weapons, violating someone&lsquo;s privacy, or
          providing or creating computer viruses o contains video, photographs,
          or images of another person (with a minor or an adult). o tries to
          gain unauthorized access or exceeds the scope of authorized access to
          the Platform or to profiles, blogs, communities, account information,
          bulletins, friend request, or other areas of the Platform or solicits
          passwords or personal identifying information for commercial or
          unlawful purposes from other users o interferes with another USER&lsquo;s
          use and enjoyment of the Platform or any other individual&lsquo;s User and
          enjoyment of similar services o infringes any patent, trademark,
          copyright or other proprietary rights or third party&lsquo;s trade secrets
          or rights of publicity or privacy or shall not be fraudulent or
          involve the sale of counterfeit or stolen products o violates any law
          for the time being in force o threatens the unity, integrity, defence,
          security or sovereignty of India, friendly relations with foreign
          states, or public order or causes incitement to thecommission of any
          cognizable offence or prevents investigation of any offence or is
          insulting any other nation o shall not be false, inaccurate or
          misleading
        </p>
      </section>

      <section className="section">
        <h2>5. Contents Posted on Platform</h2>
        <p>
          All text, graphics, user interfaces, visual interfaces, photographs,
          trademarks, logos, sounds, music and artwork (collectively,
          Content), is a third party user generated content and Fashion Mate
          has no control over such third party user generated content as Fashion
          Mate is merely an intermediary for the purposes of this Terms of Use.
          Such Content will become Our property and You grant Us the worldwide,
          perpetual and transferable rights in such Content. We shall be
          entitled to, consistent with Our Privacy Policy as adopted in
          accordance with applicable law, use the Content or any of its elements
          for any type of use forever, including but not limited to promotional
          and advertising purposes and in any media whether now known or
          hereafter devised, including the creation of derivative works that may
          include the Content You provide.
        </p>
        <p>
          You may use information on the products and services purposely made
          available on the Platform for downloading, provided that You do not
          remove any proprietary notice language in all copies of such
          documents, use such information only for your personal, non-commercial
          informational purpose and do not copy or post such information on any
          networked computer or broadcast it in any media, make no modifications
          to any such information, and do not make any additional
          representations or warranties relating to such documents, In the event
          of return/cancellation of any products in the order placed with an
          offer, thereby falling below the minimum required threshold as
          required by the offer, the user shall be deemed ineligible for the
          offer. Any cashback already credited would be void & be deducted from
          the value of the item being returned/canceled & the remaining balance
          would be processed as a refund.Fashion Mate reserves the right to
          modify the terms and conditions at any time, without prior notice..
        </p>
      </section>

      <section className="section">
        <h2>6. Disclaimer of Warranties and Liability</h2>
        <p>
          All the materials and products (including but not limited to software)
          and services, included on or otherwise made available to You through
          Platform are provided on as is and as available basis without any
          representation or warranties, express or implied except otherwise
          specified in writing. Without prejudice to the forgoing paragraph,
          Fashion Mate does not warrant that: Platform will be constantly
          available, or available at all or The information on Platform is
          complete, true, accurate or non-misleading.
        </p>
        <p>
          All the Products sold on Platform are governed by different state laws
          and if Seller is unable to deliver such Products due to implications
          of different state laws, Seller will return or will give credit for
          the amount (if any) received in advance by Seller from the sale of
          such Product that could not be delivered to You. You will be required
          to enter a valid phone number while placing an order on the Platform.
          By registering Your phone number with us, You consent to be contacted
          by Us via phone calls and/or SMS notifications, in case of any order
          or shipment or delivery related updates. We will not use your personal
          information to initiate any promotional phone calls or SMS.
        </p>
      </section>

      <section className="section">
        <h2>7. Selling</h2>
        <p>
          As a registered seller, you are allowed to list item(s) for sale on
          the Platform in accordance with the Policies which are incorporated by
          way of reference in this Terms of Use. You must be legally able to
          sell the item(s) you list for sale on the Platform. You must ensure
          that the listed items do not infringe upon the intellectual property,
          trade secret or other proprietary rights or rights of publicity or
          privacy rights of third parties. Listings may only include text
          descriptions, graphics and pictures that describe your item for sale.
          All listed items must be listed in an appropriate category on the
          Platform. All listed items must be kept in stock for successful
          fulfilment of sales. The listing description of the item must not be
          misleading and must describe actual condition of the product. If the
          item description does not match the actual condition of the item, you
          agree to refund any amounts that you may have received from the Buyer.
          You agree not to list a single product in multiple quantities across
          various categories on the Platform. Fashion Mate reserves the right to
          delete such multiple listings of the same product listed by you in
          various categories.
        </p>
        <p>
          We may provide you alternation services (limited to alteration of
          length, alteration of the waist size) for the garments purchased by
          You from Us. This service shall be free of cost and no amount would be
          collected from You for such alteration. However, a nominal fee as
          mentioned by Fashion Mate at the time of creating the alteration
          request (inclusive of service tax) would be applicable as convenience
          charge towards pick up and drop of the garments or towards tailor
          visit (wherever applicable).
        </p>
      </section>

      <section className="section">
        <h2>8. Payment</h2>
        <p>
          While availing any of the payment method/s available on the Platform,
          we will not be responsible or assume any liability, whatsoever in
          respect of any loss or damage arising directly or indirectly to You
          due to: • Lack of authorization for any transaction/s, or • Exceeding
          the preset limit mutually agreed by You and between &lsquo;Bank/s&lsquo;, or • Any
          payment issues arising out of the transaction, or • Decline of
          transaction for any other reason/s All payments made against the
          purchases/services on Platform by you shall be compulsorily in Indian
          Rupees acceptable in the Republic of India. Platform will not
          facilitate transaction with respect to any other form of currency with
          respect to the purchases made on Platform.
        </p>
        <p>
          Before shipping / delivering your order to you, Seller may request you
          to provide supporting documents (including but not limited to Govt.
          issued ID and address proof) to establish the ownership of the payment
          instrument used by you for your purchase. This is done in the interest
          of providing a safe online shopping environment to Our Users.
        </p>

        <ul>
          <li>
            • Transactions, Transaction Price and all commercial terms such as
            Delivery, Dispatch of products and/or services are as per principal
            to principal bipartite contractual obligations between Buyer and
            Seller and payment facility is merely used by the Buyer and Seller
            to facilitate the completion of the Transaction. Use of the payment
            facility shall not render Fashion Mate liable or responsible for the
            non-delivery, non-receipt, non-payment, damage, breach of
            representations and warranties, non-provision of after sales or
            warranty services or fraud as regards the products and /or services
            listed on Fashion Mate&lsquo;s Platform.
          </li>
          <li>
            • You have specifically authorized Fashion Mate or its service
            providers to collect, process, facilitate and remit payments and /
            or the Transaction Price electronically or through Cash on Delivery
            to and from other Users in respect of transactions through Payment
            Facility. Your relationship with Fashion Mate is on a principal to
            principal basis and by accepting these Terms of Use you agree that
            Fashion Mate is an independent contractor for all purposes, and does
            not have control of or liability for the products or services that
            are listed on Fashion Mate&lsquo;s Platform that are paid for by using the
            Payment Facility. Fashion Mate does not guarantee the identity of
            any User nor does it ensure that a Buyer or a Seller will complete a
            transaction.
          </li>
          <li>
            • You understand, accept and agree that the payment facility
            provided by Fashion Mate is neither a banking nor financial service
            but is merely a facilitator providing an electronic, automated
            online electronic payment, receiving payment through Cash On
            Delivery, collection and remittance facility for the Transactions on
            the Fashion Mate Platform using the existing authorized banking
            infrastructure and Credit Card payment gateway networks. Further, by
            providing Payment Facility, Fashion Mate is neither acting as
            trustees nor acting in a fiduciary capacity with respect to the
            Transaction or the Transaction Price.
          </li>
          <li>
            • You, as a Buyer, understand that upon initiating a Transaction You
            are entering into a legally binding and enforceable contract with
            the Seller to purchase the products and /or services from the Seller
            using the Payment Facility, and You shall pay the Transaction Price
            through Your Issuing Bank to the Seller using Payment Facility.
          </li>
          <li>
            • You, as a Buyer, may agree with the Seller through electronic
            communication and electronic records and using the automated
            features as may be provided by Payment Facility on any extension /
            increase in the Dispatch and/or Delivery time and the Transaction
            shall stand amended to such extent. Any such extension / increase of
            Dispatch / Delivery time or subsequent novation / variation of the
            Transaction should be in compliance with Payment Facility Rules and
            Policies.
          </li>

          <li>
            • You, as a Buyer, shall electronically notify Payment Facility
            using the appropriate Fashion Mate Platform features immediately
            upon Delivery or non Delivery within the time period as provided in
            Policies. Non notification by You of Delivery or non Delivery within
            the time period specified in the Policies shall be construed as a
            deemed Delivery in respect of that Transaction. In case of Cash On
            Delivery transactions, Buyer is not required to confirm the receipt
            of products or services.
          </li>
          <li>
            • You, as a Buyer, shall be entitled to claim a refund of the
            Transaction Price (as Your sole and exclusive remedy) in case You do
            not receive the Delivery within the time period agreed in the
            Transaction or within the time period as provided in the Policies,
            whichever is earlier. In case you do not raise a refund claim using
            Platform features within the stipulated time than this would make
            You ineligible for a refund.
          </li>
          <li>
            • Refund shall be made in Indian Rupees only and shall be equivalent
            to the Transaction Price received in Indian Rupees. • For
            electronics payments, refund shall be made through payment facility
            using NEFT / RTGS or any other online banking / electronic funds
            transfer system approved by Reserve Bank India (RBI). • Refunds may
            be supported for select banks. Where a bank is not supported for
            processing refunds, You will be required to share alternate bank
            account details with us for processing the refund. • Refund shall be
            conditional and shall be with recourse available to Fashion Mate in
            case of any misuse by Buyer.
          </li>
        </ul>
      </section>

      <section className="section">
        <h2>9. E-Platform for Communication</h2>
        <p>
          You agree, understand, and acknowledge that Fashion Mate is an online
          platform that enables you to purchase products listed on the Platform
          at the price indicated therein at any time. You further agree and
          acknowledge that Fashion Mate is only a facilitator and is not and
          cannot be a party to or control in any manner any transactions on
          Fashion Mate.
        </p>
      </section>

      <section className="section">
        <h2>10. Indemnity</h2>
        <p>
          You shall indemnify and hold harmless Fashion Mate, its owner,
          licensee, affiliates, subsidiaries, group companies (as applicable)
          and their respective officers, directors, agents, and employees, from
          any claim or demand, or actions including reasonable attorneys&lsquo; fees,
          made by any third party or penalty imposed due to or arising out of
          Your breach of this Terms of Use, privacy Policy and other Policies,
          or Your violation of any law, rules or regulations or the rights
          (including infringement of intellectual property rights) of a third
          party.
        </p>
      </section>

      <section className="section">
        <h2>11. Trademark, Copyright, and Restriction</h2>
        <p>
          Platform is controlled and operated by Fashion Mate and products are
          sold by respective Sellers. All material on Platform, including
          images, illustrations, audio clips, and video clips, are protected by
          copyrights, trademarks, and other intellectual property rights.
          Material on Fashion Mate is solely for Your personal, non-commercial
          use. You must not copy, reproduce, republish, upload, post, transmit
          or distribute such material in any way, including by email or other
          electronic means and whether directly or indirectly and You must not
          assist any other person to do so. Without the prior written consent of
          the owner, modification of the materials, use of the materials on any
          other Fashion Mate or networked computer environment or use of the
          materials for any purpose other than personal, non-commercial use is a
          violation of the copyrights, trademarks and other proprietary rights,
          and is prohibited. Any use for which You receive any remuneration,
          whether in money or otherwise, is a commercial use for the purposes of
          this clause. It is expressly clarified that You will retain ownership
          and shall solely be responsible for any content that You provide or
          upload when using any Service, including any text, data, information,
          images, photographs, music, sound, video or any other material which
          you may upload, transmit or store when making use of Our various
          Service. However, We reserve the right to use/reproduce any content
          uploaded by You and You agree to grant royalty free, irrevocably,
          unconditionally, perpetually and worldwide right to Us to use the
          content for reasonable business purpose.
        </p>
      </section>

      <section className="section">
        <h2>12. Limitation of Liability</h2>
        <p>
          In no event shall Fashion Mate be liable for any indirect, punitive,
          incidental, special, consequential damages, or any other damages
          resulting from the use or the inability to use the Services or
          Products.
        </p>
        <p>
          • the use or the inability to use the Services or Products •
          unauthorized access to or alteration of the user&lsquo;s transmissions or
          data • breach of condition, representations or warranties by the
          manufacturer of the Products • any other matter relating to the
          services including, without limitation, damages for loss of use, data
          or profits, arising out of or in any way connected with the use or
          performance of the Platform or Service. Fashion Mate shall not be held
          responsible for non-availability of the Fashion Mate during periodic
          maintenance operations or any unplanned suspension of access to the
          Fashion Mate. The User understands and agrees that any material and/or
          data downloaded at Fashion Mate is done entirely at Users own
          discretion and risk and they will be solely responsible for any damage
          to their mobile or loss of data that results from the download of such
          material and/or data. To the maximum extend that is permissible under
          law, Fashion Mate’s liability shall be limited to an amount equal to
          the Products purchased value bought by You. Fashion Mate shall not be
          liable for any dispute or disagreement between Users
        </p>
      </section>

      <section className="section">
        <h2>13. Termination</h2>
        <p>
          Fashion Mate may suspend or terminate your use of the Fashion Mate or
          any Service if it believes, in its sole and absolute discretion that
          you have infringed, breached, violated, abused, or unethically
          manipulated or exploited any term of these Terms of Service or anyway
          otherwise acted unethically. Notwithstanding anything in this clause,
          these Terms of Service will survive indefinitely unless and until
          Fashion Mate chooses to terminate them.
        </p>
      </section>

      <section className="section">
        <h2>14. Jurisdictional Issues/Sale in India Only</h2>
        <p>
          Unless otherwise specified, the material on the Platform is presented
          solely for the purpose of sale in India. Fashion Mate makes no
          representation that materials in the Platform are appropriate or
          available for use in other locations/Countries other than India.
        </p>
        <p>
          • If You or Fashion Mate terminates your use of the Platform or any
          Service, Fashion Mate may delete any content or other materials
          relating to your use of the Service and Fashion Mate will have no
          liability to you or any third party for doing so. However, your
          transactions details may be preserved by Fashion Mate for purposes of
          tax or regulatory compliance.
        </p>
        <p>
          • Fashion Mate may unilaterally terminate Your account on any event as
          mentioned in the Terms Of Use under the point no. 4. User Conduct and
          Rules on the Platform. Any Fashion Mate credits earned as goodwill
          compensation, earned via loyalty or referral program or promotional
          campaigns or earned through gift cards purchased on other platforms
          will be forfeited in such cases. Returns/Refund for such Users shall
          be at the sole discretion of Fashion Mate.
        </p>
        <p>
          • If You use any false e-mail address or use the portal for any
          unlawful and fraudulent purposes, which may cause annoyance and
          inconvenience and abuses any policy and rules of the company or
          mislead Fashion Mate by sharing multiple address and phone numbers or
          transacting with malafide intentions then Fashion Mate reserves the
          right to refuse access to the portal, terminate accounts including any
          linked accounts without notice to you.
        </p>
      </section>

      <section className="section">
        <h2>15. Governing Law</h2>
        <p>
          These terms shall be governed by and constructed in accordance with
          the laws of India without reference to conflict of laws principles,
          and disputes arising in relation hereto shall be subject to the
          exclusive jurisdiction of courts, tribunals, fora, and applicable
          authorities at Bangalore.
        </p>
      </section>

      <section className="section">
        <h2>16. Contacting the Seller</h2>
        <p>
          At Fashion Mate, we are committed to ensuring that disputes between
          Sellers and Buyers are settled amicably by way of the above dispute
          resolution mechanisms and procedures. However, in the event that You
          wish to contact Fashion Mate about the seller, You may proceed to do
          so by clicking on the seller name on the product listing pages.
        </p>
      </section>

      <section className="section">
        <h2>17. Disclaimer</h2>
        <p>
          You acknowledge and undertake that you are accessing the services on
          the Platform and transacting at your own risk and are using your best
          and prudent judgment before entering into any transactions through
          Fashion Mate. We shall neither be liable nor responsible for any
          actions or inactions of sellers nor any breach of conditions,
          representations or warranties by the sellers or manufacturers of the
          products and hereby expressly disclaim and any all responsibility and
          liability in that regard. We shall not mediate or resolve any dispute
          or disagreement between You and the sellers or manufacturers of the
          products. We further expressly disclaim any warranties or
          representations (express or implied) in respect of quality,
          suitability, accuracy, reliability, completeness, timeliness,
          performance, safety, merchantability, fitness for a particular
          purpose, or legality of the products listed or displayed or transacted
          or the content (including product or pricing information and/or
          specifications) on Platform. While we have taken precautions to avoid
          inaccuracies in content, this website, all content, information
          (including the price of products), software, products, services and
          related graphics are provided as is, without warranty of any kind. At
          no time shall any right, title or interest in the products sold
          through or displayed on Platform vest with Fashion Mate nor shall
          Fashion Mate have any obligations or liabilities in respect of any
          transactions on Platform.
        </p>
        <p>
          Delivery Related - User agrees and acknowledges that any claims
          regarding order delivery (including non-receipt/ non- delivery of
          order or signature verification) shall be notified to Fashion Mate
          within 5 days from the alleged date of delivery of product reflecting
          on the Fashion Mate portal. Non notification by You of non-receipt or
          non-delivery within the time period specified shall be construed as a
          deemed delivery in respect of that transaction. Fashion Mate disclaims
          any liability or responsibility for claims regarding non-delivery,
          non-receipt of order (including signature verification in Proof of
          delivery) after 5 days from the alleged date of delivery of product
          reflecting on the Fashion Mate portal.
        </p>
      </section>

      <section className="section">
        <h2>20. Customisation</h2>
        <p>
          Fashion Mate acts solely as a facilitator in connecting buyers with
          sellers. Our role is to provide a platform for these transactions, and
          we do not have any control over or responsibility for the quality of
          the products or services offered by sellers. By using our facilitation
          services, you acknowledge and agree that: 1. Any issues or disputes
          arising from the purchase or use of the seller&lsquo;s products or services
          must be resolved directly with the seller. 2. Fashion Mate does not
          endorse, guarantee, or assume any responsibility for the actions or
          omissions of any seller. 3. Fashion Mate makes no representations or
          warranties regarding the goods or services provided by sellers,
          including but not limited to, their quality, fitness for a particular
          purpose, or compliance with any laws or regulations. 4. You consent to
          share your name and contact details with the seller or brand to
          facilitate this service. You may be required to share some additional
          personal data directly with the seller, Fashion Mate shall not be
          responsible for any use or handling of your additional personal data
          shared with the seller or brand, and you acknowledge that such sharing
          is necessary for the fulfillment of the service.
        </p>
      </section>

      <section className="section">
        <h2>22. Cart Notification</h2>
        <p>
          You understand that, in the event selected products in your cart are
          out of inventory, Fashion Mate provides You an option in your cart to
          select the product of another seller. You understand that the price of
          the product by another seller may differ.
        </p>
      </section>

      <section className="section">
        <h2>23. Multiple Sellers</h2>
        <p>
          You understand that products of a particular style may be sold on the
          Platform by multiple sellers and the product price on the listing page
          of the Platform, may not always reflect the lowest price for that
          particular style. This is because the seller whose price is displayed
          on the list page is selected based on the application of a number of
          parameters and price is only one such parameter. However, once you
          land on the product display page on the Platform for a specific style,
          You will have access to the price offered by all sellers on the
          Platform for the relevant style.
        </p>
      </section>
    </div>
    </Private>
  );
};

export default TermsOfUse;
