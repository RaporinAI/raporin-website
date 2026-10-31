"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaQuestionCircle } from "react-icons/fa";

export default function FAQSectionEN() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: "General",
      questions: [
        {
          q: "What is RaporinAI and how does it work?",
          a: "RaporinAI is an AI-powered reimbursement verification platform designed for pharmacies. You sign in to the insurance portal from inside the application, pick an invoice type and a claim period, and bring that period's prescriptions into RaporinAI. From there you can either open one prescription and check a single medicine, or send the whole period to analysis with one click. Reports are assessed against the current regulations, including diagnosis matching and prescription-versus-report dosage."
        },
        {
          q: "How does the insurance portal integration work? Do I have to share my password?",
          a: "No. You sign in to the insurance portal yourself, through a secure browser embedded in the application. Your portal credentials are never sent to or stored on our servers. If you enable optional auto-login, your username and password are encrypted and kept only on your own computer, and you can delete them at any time from the Profile screen."
        },
        {
          q: "Do I have to import prescriptions from scratch every time?",
          a: "No. Importing a period once is enough. When new prescriptions appear later, \"Update Import\" is all it takes — only what is missing gets filled in."
        },
        {
          q: "What is bulk analysis and how is it different from single analysis?",
          a: "In single analysis you open one prescription and check one medicine. In bulk analysis, every reported medicine in the selected period goes to analysis with one click and runs in the background while you keep working. When it finishes, a single filter lists everything that is not compliant."
        },
        {
          q: "Can I verify a single report by uploading a PDF?",
          a: "Yes. You can upload a report you downloaded as PDF and verify it directly. When you only need to check one report you already have at hand, this is the quicker route."
        },
        {
          q: "Which report types can I verify?",
          a: "RaporinAI can verify all types of insurance reports including prescription reports, chronic disease reports, special medication reports, and all other insurance report types. The system supports all report types with its continuously updated regulatory database."
        },
        {
          q: "Do I need technical knowledge to use the system?",
          a: "No. You sign in to the insurance portal as you always do, select the invoice type and period, and start the import — RaporinAI handles the rest. Starting the analysis takes a single click, and results are presented criterion by criterion. No technical knowledge is required."
        }
      ]
    },
    {
      category: "Regulatory Compliance",
      questions: [
        {
          q: "How are regulatory non-compliance issues detected?",
          a: "Our system continuously monitors the latest healthcare regulations database. ICD-10 diagnosis codes, drug interactions, dosage appropriateness, and regulatory restrictions are automatically checked. When non-compliance is detected, detailed explanations and correction suggestions are provided."
        },
        {
          q: "What is the prescription-versus-report dosage check?",
          a: "Even when every regulatory criterion is met, a medicine is not reimbursed if the dosage written on the prescription exceeds the dosage allowed by the report's treatment scheme. RaporinAI compares the two automatically and flags the medicine as non-compliant when the report dosage is exceeded."
        },
        {
          q: "How are regulatory updates tracked?",
          a: "The RaporinAI team tracks all regulatory updates made by the health authority and automatically updates our system. Users don't need to take any action. The system always analyzes according to the most current rules."
        }
      ]
    },
    {
      category: "Security & Data Protection",
      questions: [
        {
          q: "How is personal data protected?",
          a: "RaporinAI is built around data protection standards. In the portal-integrated flow, patient ID numbers, names, surnames and report numbers are never sent to our servers and never written to our database — analysis runs only on clinical fields such as diagnosis codes, active ingredients and dosage. In the PDF flow, patient and doctor personal details are masked on your own computer before the report is sent. Your data is stored on secure servers and is never shared with any third party."
        }
      ]
    },
    {
      category: "Pricing & Plans",
      questions: [
        {
          q: "How does pricing work?",
          a: "RaporinAI is offered as monthly or yearly plans sized to your pharmacy's prescription volume. Creating an account is free and no credit card is required; you can buy or cancel your plan anytime from your account."
        }
      ]
    }
  ];

  const toggleFAQ = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-[#E8FFFB] via-white to-[#F9FFFD]">
      <div className="max-w-5xl mx-auto px-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-4">
            <FaQuestionCircle size={50} className="text-teal-600" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600">
              Questions
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find everything you want to know about RaporinAI here.
          </p>
        </motion.div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqs.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Category Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-2 h-8 bg-gradient-to-b from-teal-500 to-emerald-600 rounded-full"></span>
                {category.category}
              </h3>

              {/* Questions */}
              <div className="space-y-3">
                {category.questions.map((faq, questionIndex) => {
                  const index = `${categoryIndex}-${questionIndex}`;
                  const isOpen = openIndex === index;

                  return (
                    <div
                      key={questionIndex}
                      className="bg-white rounded-xl shadow-md border border-teal-100 overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {/* Question */}
                      <button
                        onClick={() => toggleFAQ(categoryIndex, questionIndex)}
                        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-teal-50/50 transition-colors"
                      >
                        <span className="font-semibold text-gray-900 pr-4">
                          {faq.q}
                        </span>
                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex-shrink-0"
                        >
                          <FaChevronDown className="text-teal-600" size={20} />
                        </motion.div>
                      </button>

                      {/* Answer */}
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-5 text-gray-700 leading-relaxed border-t border-teal-50 pt-4">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-8 border border-teal-100"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Didn&apos;t Find Your Answer?
          </h3>
          <p className="text-gray-600 mb-6">
            Our support team is happy to help you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/en#contact"
              className="inline-block px-8 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold rounded-full hover:shadow-xl transition-all hover:scale-105"
            >
              Contact Us
            </a>
            <a
              href="/en/download"
              className="inline-block px-8 py-4 bg-white text-teal-600 font-semibold rounded-full border-2 border-teal-600 hover:bg-teal-50 transition-all"
            >
              Try for Free
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
