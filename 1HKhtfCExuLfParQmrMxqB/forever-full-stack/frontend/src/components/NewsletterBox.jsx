import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from 'emailjs-com';

const NewsletterBox = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  // useRef is required for sendForm
  const formRef = useRef();

  const validateEmail = (value) => {
    if (!value) return "Email is required.";
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value))
      return "Please enter a valid email address.";
    return "";
  };

  const onChangeHandler = (e) => {
    setEmail(e.target.value);
    if (error) setError(validateEmail(e.target.value));
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    const validation = validateEmail(email);
    if (validation) {
      setError(validation);
      return;
    }
    setLoading(true);

    // 👇 EmailJS sendForm requires a "name" matching your template variable!
    emailjs.sendForm(
      'service_9l0mnxm',         // e.g. 'service_XXXXXX'
      'template_jmkj2bc',        // e.g. 'template_YYYYY'
      formRef.current,           // Form reference containing fields below
      'bNiInDhtKry2IfSbp',         // e.g. 'user_ABCD1234EFGH5678'
    )
    .then(() => {
      setSubscribed(true);
      setLoading(false);
      setEmail("");
      setError("");
      setTimeout(() => setSubscribed(false), 3000);
    })
    .catch(() => {
      setError("Oops! Could not subscribe, please try again.");
      setLoading(false);
    });
  };

  
  // Animation for section/children
  const cascadeItem = {
    hidden: { opacity: 0, y: 25 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.13, type: "spring", bounce: 0.22, duration: 0.54 },
    }),
  };

  return (
    <motion.section
      className="py-14 px-3 w-full max-w-xl mx-auto text-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.48 }}
      transition={{ staggerChildren: 0.14 }}
    >
      <motion.h2
        className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1"
        variants={cascadeItem}
        custom={0}
      >
        Subscribe now
      </motion.h2>
      <motion.p
        className="text-gray-400 mt-2 max-w-lg mx-auto"
        variants={cascadeItem}
        custom={1}
      >
        Join our newsletter and never miss out on exclusive offers, new arrivals, and insider discounts.
      </motion.p>
      <motion.form
        ref={formRef}
        onSubmit={onSubmitHandler}
        className="w-full flex flex-col sm:flex-row items-center gap-3 mx-auto my-7 
          rounded-2xl bg-white shadow-md border border-gray-200 px-3 py-2 sm:px-4 sm:py-1 
          transition-all"
        variants={cascadeItem}
        custom={2}
        role="form"
        aria-label="Newsletter subscription"
        noValidate
      >
        <label htmlFor="user_email" className="sr-only">
          Email address
        </label>
        {/* IMPORTANT: name must match your EmailJS template variable! */}
        <input
          id="user_email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          required
          disabled={loading}
          onChange={onChangeHandler}
          placeholder="Enter your email"
          className={`flex-1 bg-transparent py-3 px-4 text-sm text-gray-700 placeholder-gray-400
            outline-none border-none rounded-xl transition 
            focus:ring-2 focus:ring-black/10 ${error ? "ring-2 ring-red-400" : ""}`}
          aria-invalid={!!error}
          aria-describedby={error ? "newsletter-email-error" : undefined}
        />
        <motion.button
          type="submit"
          className={`flex gap-2 items-center bg-black text-white text-xs font-bold px-7 py-3 rounded-xl
            transition hover:bg-gray-900 focus:outline-none relative
            disabled:opacity-60 disabled:cursor-not-allowed`}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: loading ? 1 : 1.045 }}
          transition={{ type: "spring", stiffness: 350, damping: 20 }}
          disabled={loading}
          aria-label={loading ? "Subscribing..." : "Subscribe"}
        >
          <svg width="19" height="19" viewBox="0 0 20 20" fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="inline mr-1">
            <path d="M2 10L17.5 2L10 17.5L8.5 11.5L2 10Z" stroke="white" strokeWidth="1.6" strokeLinejoin="round"/>
          </svg>
          {loading ? "Subscribing..." : "SUBSCRIBE"}
        </motion.button>
      </motion.form>
      <AnimatePresence>
        {error && (
          <motion.div
            id="newsletter-email-error"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-red-500 text-xs font-semibold mb-1"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {subscribed && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-green-600 font-semibold text-sm mt-2"
            role="status"
            aria-live="polite"
          >
            Thank you for subscribing!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default NewsletterBox;
