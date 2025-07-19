import React, { useState, useEffect } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const Contact = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    orderType: '',
    quantity: '',
    budget: '',
    timeline: '',
    clothingType: '',
    size: '',
    color: '',
    design: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('')
  const [isVisible, setIsVisible] = useState({})


  useEffect(() => {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);
  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }))
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = document.querySelectorAll('.animate-on-scroll')
    elements.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitStatus('success')
      setIsSubmitting(false)
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: '', email: '', phone: '', subject: '', message: '',
          orderType: '', quantity: '', budget: '', timeline: '',
          clothingType: '', size: '', color: '', design: ''
        })
        setSubmitStatus('')
      }, 3000)
    }, 2000)
  }

  const contactTabs = [
    { id: 'general', label: 'General Inquiry', icon: '💬' },
    { id: 'custom', label: 'Custom Clothing', icon: '👕' },
    { id: 'bulk', label: 'Bulk Orders', icon: '📦' }
  ]

  const contactInfo = [
    {
      icon: '📸',
      title: 'Follow Us On Instagram',
      details: ['@vervix.in', 'Get daily fashion inspiration'],
      color: 'text-pink-600',
      link: 'https://instagram.com/vervix.in',
      hoverColor: 'hover:bg-pink-50'
    },
    {
      icon: '📞',
      title: 'Call Us',
      details: ['Phone: (415) 555-0132', 'Mon-Fri: 9AM-6PM PST'],
      color: 'text-green-600',
      link: 'tel:+14155550132',
      hoverColor: 'hover:bg-green-50'
    },
    {
      icon: '✉️',
      title: 'Email Us',
      details: ['General: admin@VERVIX.com', 'Support: support@VERVIX.com'],
      color: 'text-blue-600',
      link: 'mailto:admin@vervix.com',
      hoverColor: 'hover:bg-blue-50'
    }
  ]

  const renderFormFields = () => {
    const commonFields = (
      <>
      {/* Header Section */}
      <div className='text-2xl text-center'>
        <Title text1={'Contact'} text2={'US'} />
      </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-300"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-300"
              placeholder="Enter your email"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-300"
            placeholder="Enter your phone number"
          />
        </div>
      </>
    )

    switch (activeTab) {
      case 'general':
        return (
          <>
            {commonFields}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-300"
              >
                <option value="">Select a subject</option>
                <option value="product-inquiry">Product Inquiry</option>
                <option value="order-status">Order Status</option>
                <option value="return-exchange">Return/Exchange</option>
                <option value="technical-support">Technical Support</option>
                <option value="partnership">Partnership</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows="5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-300 resize-none"
                placeholder="Tell us how we can help you..."
              />
            </div>
          </>
        )

      case 'custom':
        return (
          <>
            {commonFields}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clothing Type *
                </label>
                <select
                  name="clothingType"
                  value={formData.clothingType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-300"
                >
                  <option value="">Select clothing type</option>
                  <option value="t-shirt">T-Shirt</option>
                  <option value="hoodie">Hoodie</option>
                  <option value="dress">Dress</option>
                  <option value="jacket">Jacket</option>
                  <option value="pants">Pants</option>
                  <option value="shirt">Shirt</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size Range *
                </label>
                <select
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-300"
                >
                  <option value="">Select size range</option>
                  <option value="xs-s">XS - S</option>
                  <option value="m-l">M - L</option>
                  <option value="xl-xxl">XL - XXL</option>
                  <option value="all-sizes">All Sizes</option>
                  <option value="custom-sizing">Custom Sizing</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Colors
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-300"
                  placeholder="e.g., Black, White, Navy Blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeline *
                </label>
                <select
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-300"
                >
                  <option value="">Select timeline</option>
                  <option value="1-2-weeks">1-2 Weeks</option>
                  <option value="3-4-weeks">3-4 Weeks</option>
                  <option value="1-2-months">1-2 Months</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Design Requirements *
              </label>
              <textarea
                name="design"
                value={formData.design}
                onChange={handleInputChange}
                required
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-300 resize-none"
                placeholder="Describe your design ideas, logo placement, text, patterns, etc..."
              />
            </div>
          </>
        )

      case 'bulk':
        return (
          <>
            {commonFields}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Type *
                </label>
                <select
                  name="orderType"
                  value={formData.orderType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-300"
                >
                  <option value="">Select order type</option>
                  <option value="wholesale">Wholesale Purchase</option>
                  <option value="corporate">Corporate Orders</option>
                  <option value="event">Event/Promotional</option>
                  <option value="reseller">Reseller Program</option>
                  <option value="custom-bulk">Custom Bulk Items</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Quantity *
                </label>
                <select
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-300"
                >
                  <option value="">Select quantity range</option>
                  <option value="50-100">50 - 100 pieces</option>
                  <option value="100-500">100 - 500 pieces</option>
                  <option value="500-1000">500 - 1000 pieces</option>
                  <option value="1000+">1000+ pieces</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Range
                </label>
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-300"
                >
                  <option value="">Select budget range</option>
                  <option value="under-5k">Under $5,000</option>
                  <option value="5k-10k">$5,000 - $10,000</option>
                  <option value="10k-25k">$10,000 - $25,000</option>
                  <option value="25k-50k">$25,000 - $50,000</option>
                  <option value="over-50k">Over $50,000</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeline *
                </label>
                <select
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-300"
                >
                  <option value="">Select timeline</option>
                  <option value="asap">ASAP</option>
                  <option value="1-month">Within 1 Month</option>
                  <option value="2-3-months">2-3 Months</option>
                  <option value="flexible">Flexible Timeline</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Requirements *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-300 resize-none"
                placeholder="Tell us about your specific requirements, delivery preferences, customization needs, etc..."
              />
            </div>
          </>
        )

      default:
        return null
    }
  }

  return (
    <div>
      {/* Header Section */}
      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      {/* Enhanced Contact Info Cards */}
      <div 
        id="contact-info"
        className={`animate-on-scroll my-12 transition-all duration-1000 ${
          isVisible['contact-info'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {contactInfo.map((info, index) => (
            <a
              key={index}
              href={info.link}
              target={info.link.includes('instagram') ? '_blank' : '_self'}
              rel={info.link.includes('instagram') ? 'noopener noreferrer' : ''}
              className={`group text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer ${info.hoverColor} border-2 border-transparent hover:border-gray-200`}
            >
              <div className={`text-5xl mb-4 ${info.color} group-hover:scale-110 transition-transform duration-300`}>
                {info.icon}
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-3 group-hover:text-gray-900">
                {info.title}
              </h3>
              {info.details.map((detail, idx) => (
                <p key={idx} className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  {detail}
                </p>
              ))}
              
              {/* Instagram-specific enhancement */}
              {info.title.includes('Instagram') && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 group-hover:text-pink-600">
                    <span>✨</span>
                    <span>Latest collections & styling tips</span>
                    <span>✨</span>
                  </div>
                </div>
              )}
            </a>
          ))}
        </div>
      </div>

      {/* Main Contact Section */}
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        {/* Image Section */}
        <div 
          id="contact-image"
          className={`animate-on-scroll transition-all duration-1000 ${
            isVisible['contact-image'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}
        >
          <img 
            className='w-full md:max-w-[480px] rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300' 
            src={assets.contact_img} 
            alt="Contact VERVIX" 
          />
          
          {/* Enhanced Contact Info Card */}
          <div className="mt-8 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-md">
            <div className="space-y-6">
              <div className="text-center pb-4 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-2">📞 Get in Touch</h3>
                <p className="text-gray-600 text-sm">We're here to help with all your fashion needs</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-sm transition-shadow duration-200">
                  <div className="text-2xl">📞</div>
                  <div>
                    <p className="font-medium text-gray-800">Phone</p>
                    <p className="text-sm text-gray-600">(415) 555-0132</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-sm transition-shadow duration-200">
                  <div className="text-2xl">✉️</div>
                  <div>
                    <p className="font-medium text-gray-800">Email</p>
                    <p className="text-sm text-gray-600">admin@VERVIX.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-sm transition-shadow duration-200">
                  <div className="text-2xl">🕐</div>
                  <div>
                    <p className="font-medium text-gray-800">Business Hours</p>
                    <p className="text-sm text-gray-600">Mon-Fri: 9AM-6PM PST</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div 
          id="contact-form"
          className={`animate-on-scroll flex-1 max-w-2xl transition-all duration-1000 delay-300 ${
            isVisible['contact-form'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`}
        >
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-8 p-2 bg-gray-100 rounded-xl">
            {contactTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 flex-1 min-w-0 justify-center ${
                  activeTab === tab.id
                    ? 'bg-gray-800 text-white shadow-md transform scale-105'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="text-sm font-semibold truncate">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {renderFormFields()}

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 hover:shadow-lg active:transform active:scale-95'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending Message...
                    </div>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </div>

              {/* Success Message */}
              {submitStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-2xl">✅</span>
                    <span className="font-semibold">Message Sent Successfully!</span>
                  </div>
                  <p className="text-sm">
                    Thank you for contacting us. We'll get back to you within 24 hours.
                  </p>
                </div>
              )}
            </form>
          </div>

          {/* Enhanced Additional Info */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <span>⚡</span> Quick Response
              </h4>
              <p className="text-blue-700 text-sm">
                We typically respond to all inquiries within 24 hours during business days.
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                <span>🎯</span> Dedicated Support
              </h4>
              <p className="text-green-700 text-sm">
                Our team of experts will provide personalized assistance for your needs.
              </p>
            </div>
          </div>
        </div>
      </div>

      <NewsletterBox/>
    </div>
  )
}

export default Contact