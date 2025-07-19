import React from 'react'
import { assets } from '../assets/assets'
import { motion } from "framer-motion"

const policies = [
  {
    icon: assets.exchange_icon,
    title: "Easy Exchange Policy",
    desc: "We offer hassle free exchange policy",
    alt: "Easy Exchange"
  },
  {
    icon: assets.quality_icon,
    title: "7 Days Return Policy",
    desc: "We provide 7 days free return policy",
    alt: "7 Days Return"
  },
  {
    icon: assets.support_img,
    title: "Best Customer Support",
    desc: "We provide 24/7 customer support",
    alt: "Customer Support"
  }
];

const cardVariants = {
  offscreen: { opacity: 0, y: 60 },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", bounce: 0.2, duration: 0.7 }
  }
};

const OurPolicy = () => {
  return (
    <section className="py-16 px-2 mx-auto max-w-5xl">
      <div className='flex flex-col sm:flex-row justify-around gap-10 sm:gap-5 text-center'>
        {policies.map((policy) => (
          <motion.div
            key={policy.title}
            className="bg-white/80 shadow-lg rounded-xl p-7 flex-1 flex flex-col items-center
              hover:shadow-2xl transition-shadow duration-300"
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.45 }}
            variants={cardVariants}
          >
            <motion.img
              src={policy.icon}
              alt={policy.alt}
              className='w-14 mb-5 drop-shadow-sm'
              whileHover={{ scale: 1.15, boxShadow: "0px 4px 30px 2px rgba(60,120,250,.12)" }}
              transition={{ type: "spring", stiffness: 400, damping: 16 }}
            />
            <p className='font-semibold text-gray-700 text-base md:text-lg mb-1'>{policy.title}</p>
            <p className='text-gray-400 text-xs md:text-sm'>{policy.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default OurPolicy
