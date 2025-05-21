"use client"
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { useState } from "react";
import Private from "../layout/Private";

export default function Faqs() {

    const [activeTab, setActiveTab] = useState(0); // To track active tab
    const [openQuestion, setOpenQuestion] = useState(null); // To track open questions

    const toggleQuestion = (index) => {
        setOpenQuestion(openQuestion === index ? null : index);
    };

    const tabs = [
        "General",
        "Try Virtual",
        "Chat Support",
        "Wallet Features",
        "Orders & Delivery",
    ];

    // FAQ data for each tab
    const faqData = {
        general: [
            {
                question: "How do I create an account on the app?",
                answer:
                    'To create an account on the app, simply download it, tap "Sign Up," and follow the prompts to enter your information.',
            },
            {
                question: "How do I reset my password if I forgot it?",
                answer:
                    'To reset your password, tap "Forgot Password" on the sign-in screen and follow the instructions to reset your password.',
            },
            {
                question: "What payment methods do you accept?",
                answer:
                    "We accept a variety of payment methods, including credit/debit cards, PayPal, and in-app payments.",
            },
            {
                question: "What happens if my order is not delivered?",
                answer:
                    "If your order is not delivered within 24 hours, we will contact you to confirm the status of your order.",
            },
        ],
        tryVirtual: [
            {
                question: "How does the virtual try-on feature work?",
                answer:
                    'You can use your camera to try on glasses virtually by selecting the "Try Virtual" option in the app.',
            },
            {
                question: "Is the virtual try-on accurate?",
                answer:
                    "The virtual try-on feature uses advanced technology to give an accurate representation of how the outfit will look.",
            },
            {
                question: "How do I use the virtual try-on feature?",
                answer:
                    "To use the virtual try-on feature, simply click on the glasses icon in the app and select your desired outfit.",
            },
            {
                question: "Can I try on multiple outfits at once?",
                answer: "Yes, you can try on multiple outfits at once in the app.",
            },
            {
                question: "Can I share the virtual try-on with friends or family?",
                answer:
                    "Yes, you can share the virtual try-on with friends or family in the app.",
            },
        ],
        chatSupport: [
            {
                question: "How can I contact customer support?",
                answer:
                    "You can contact our customer support via the chat feature in the app, available 24/7.",
            },
            {
                question: "Can I chat with multiple customers at once?",
                answer: "Yes, you can chat with multiple customers at once in the app.",
            },
            {
                question: "How long does it take for me to get a response?",
                answer:
                    "Our customer support team will respond to your message within 24 hours.",
            },
            {
                question: "What types of queries can be resolve through the chat?",
                answer:
                    "We have a variety of queries that can be resolved through the chat.",
            },
        ],
        walletFeature: [
            {
                question: "What is the wallet feature?",
                answer:
                    "The wallet feature allows you to store and manage your payment methods for quicker checkout.",
            },
            {
                question: "How do I add funds to my wallet?",
                answer:
                    'To add funds to your wallet, simply click on the "Add Funds" button in the app.',
            },
            {
                question: "Can I get refund to my wallet if I return an item?",
                answer:
                    "Yes, you can get refund to your wallet if you return an item in the app.",
            },
            {
                question: "What payment methods do you accept?",
                answer:
                    "We accept a variety of payment methods, including credit/debit cards, PayPal, and in-app payments.",
            },
        ],
        ordersDelivery: [
            {
                question: "How can I track my order?",
                answer:
                    "Once your order is shipped, you will receive a tracking number via email or app notification.",
            },
            {
                question: "What happens if my order is not delivered?",
                answer:
                    "If your order is not delivered within 24 hours, we will contact you to confirm the status of your order.",
            },
            {
                question: "Can I cancel my order?",
                answer: "Yes, you can cancel your order in the app.",
            },
            {
                question: "What should I do if I receive an incorrect item?",
                answer:
                    "If you receive an incorrect item, please contact our customer support team for assistance.",
            },
            {
                question: "Can I return an item?",
                answer: "Yes, you can return an item in the app.",
            },
        ],
    };

    const getFaqsForActiveTab = () => {
        switch (activeTab) {
            case 0:
                return faqData.general;
            case 1:
                return faqData.tryVirtual;
            case 2:
                return faqData.chatSupport;
            case 3:
                return faqData.walletFeature;
            case 4:
                return faqData.ordersDelivery;
            default:
                return [];
        }
    };

    const router = useRouter();

    const handleBack = () => {
        router.back();
    }

    return (
        <Private>
            <div className='relative flex gap-4 container'>
                                      {/* <button
                                          className="absolute top-8 -left-0 transform -translate-x-1/2 -translate-y-1/2 bg-slate-400 rounded-full pr-6 p-4  text-white flex group transition-all duration-300 ease-in-out"
                                          onClick={() => {
                                              const prevPath = localStorage.getItem("prevPath");
                                              if (prevPath === "/auth") {
                                                  router.push("/");
                                              } else {
                                                  router.back();
                                              }
                                          }}
                                      >
                                          <Icon
                                              icon="material-symbols:arrow-back"
                                              width={20}
                                              className="ml-8 transform transition-transform duration-300 group-hover:-translate-x-2"
                                          />
                                      </button> */}
                      
                                      <h1 className='text-2xl font-medium text-[#1d2e36]  mt-4'>FAQ</h1>
                      
                      
                                  </div>
            <div className="container mx-auto bg-white rounded-lg  my-4">
                 

                <div className="flex flex-nowrap w-full overflow-x-auto space-x-4 mb-6">
                    {tabs.map((tab, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveTab(index)}
                            className={`px-4 md:py-2 py-2  border font-medium rounded-lg flex w-full text-nowrap justify-between  ${activeTab === index
                                ? "bg-[#7b9220] text-white border-[#7b9220]"
                                : "bg-white text-[#1d2e36] border-gray-300"
                                } transition-colors`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    {getFaqsForActiveTab().map((faq, index) => (
                        <div key={index} className="border-b border-gray-300 bg-[#f7f7f7] p-2">
                            <button
                                onClick={() => toggleQuestion(index)}
                                className="w-full flex justify-between items-center py-4 text-left focus:outline-none"
                            >
                                <span className="text-lg font-medium">{faq.question}</span>
                                <span className="text-gray-600">
                                    {openQuestion === index ? "-" : "+"}
                                </span>
                            </button>
                            {openQuestion === index && (
                                <p className="pb-4 text-gray-700">{faq.answer}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </Private>
    )
}