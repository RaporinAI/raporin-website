"use client";
import { motion } from "framer-motion";
import { FaQuoteLeft, FaStar } from "react-icons/fa";

export default function TestimonialsSectionEN() {
  const testimonials = [
    {
      name: "Pharm. Ayse Yilmaz",
      location: "Istanbul",
      role: "Pharmacy Owner",
      rating: 5,
      comment: "Thanks to RaporinAI, our insurance deductions decreased by 80%. We used to spend hours on manual checks, now we verify all reports in minutes. It's truly a lifesaver!",
      avatar: "AY",
      gradient: "from-teal-400 to-emerald-500"
    },
    {
      name: "Pharm. Mehmet Kaya",
      location: "Ankara",
      role: "Pharmacy Manager",
      rating: 5,
      comment: "Detecting regulatory non-compliance early provided a huge financial advantage. The system is very user-friendly and its data protection compliance gives us confidence. I recommend it to all my pharmacist colleagues.",
      avatar: "MK",
      gradient: "from-emerald-400 to-teal-500"
    },
    {
      name: "Pharm. Zeynep Demir",
      location: "Izmir",
      role: "Pharmacy Owner",
      rating: 5,
      comment: "Being able to verify reports without logging into the insurance portal is incredibly practical. Thanks to the team management feature, our employees can also use the system. We recovered our investment in the first month.",
      avatar: "ZD",
      gradient: "from-cyan-400 to-teal-500"
    },
    {
      name: "Pharm. Can Ozkan",
      location: "Bursa",
      role: "Pharmacy Owner",
      rating: 5,
      comment: "The AI technology is truly impressive. It instantly catches ICD code errors and offers correction suggestions. Being able to track past reports is also a very useful feature.",
      avatar: "CO",
      gradient: "from-teal-500 to-emerald-400"
    },
    {
      name: "Pharm. Elif Arslan",
      location: "Antalya",
      role: "Pharmacy Manager",
      rating: 5,
      comment: "We started as pilot users and the results exceeded our expectations. Customer support is very fast and solution-oriented. I can't remember how we worked without RaporinAI!",
      avatar: "EA",
      gradient: "from-emerald-500 to-cyan-400"
    },
    {
      name: "Pharm. Burak Sahin",
      location: "Adana",
      role: "Pharmacy Owner",
      rating: 5,
      comment: "Our monthly insurance deductions decreased by an average of $500. The system paid for itself in the first month. It saves both time and money. Definitely worth trying!",
      avatar: "BS",
      gradient: "from-teal-400 to-cyan-500"
    }
  ];

  const stats = [
    { number: "600+", label: "Active Pharmacies" },
    { number: "95%", label: "Accuracy Rate" },
    { number: "50K+", label: "Reports Verified" },
    { number: "4.9/5", label: "User Satisfaction" }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white via-[#F9FFFD] to-[#E8FFFB]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Pharmacists{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600">
              Are Saying
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the experiences and success stories of pharmacists using RaporinAI.
          </p>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 text-center shadow-lg border border-teal-100 hover:shadow-xl transition-shadow"
            >
              <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-8 border border-teal-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Write Your Own Success Story
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Reduce your insurance deductions and save time with RaporinAI, trusted by thousands of pharmacists.
            </p>
            <a
              href="/kayit"
              className="inline-block px-8 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold rounded-full hover:shadow-xl transition-all hover:scale-105"
            >
              Try for Free
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
