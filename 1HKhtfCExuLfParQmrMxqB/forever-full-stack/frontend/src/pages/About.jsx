import React, { useState, useEffect } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  const [isVisible, setIsVisible] = useState({})
  const [counters, setCounters] = useState({
    customers: 0,
    products: 0,
    years: 0
  })

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

  // Counter animation
  useEffect(() => {
    if (isVisible.stats) {
      const animateCounter = (key, target, duration = 2000) => {
        const start = Date.now()
        const timer = setInterval(() => {
          const progress = Math.min((Date.now() - start) / duration, 1)
          setCounters(prev => ({
            ...prev,
            [key]: Math.floor(target * progress)
          }))
          if (progress === 1) clearInterval(timer)
        }, 16)
      }

      animateCounter('customers', 50000)
      animateCounter('products', 10000)
      animateCounter('years', 5)
    }
  }, [isVisible.stats])

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [assets.about_img]);

  const features = [
    {
      icon: "🛡️",
      title: "Quality Assurance",
      description: "We meticulously select and vet each product to ensure it meets our stringent quality standards.",
      color: "border-blue-200 hover:border-blue-400"
    },
    {
      icon: "⚡",
      title: "Convenience",
      description: "With our user-friendly interface and hassle-free ordering process, shopping has never been easier.",
      color: "border-green-200 hover:border-green-400"
    },
    {
      icon: "🎯",
      title: "Exceptional Customer Service",
      description: "Our team of dedicated professionals is here to assist you every step of the way, ensuring your satisfaction is our top priority.",
      color: "border-purple-200 hover:border-purple-400"
    }
  ]

  const stats = [
    { label: "Happy Customers", value: counters.customers, suffix: "+" },
    { label: "Products Available", value: counters.products, suffix: "+" },
    { label: "Years of Excellence", value: counters.years, suffix: "" }
  ]

  const timeline = [
    { year: "2019", event: "VERVIX Founded", description: "Started with a vision to revolutionize online shopping" },
    { year: "2020", event: "First 1000 Customers", description: "Reached our first milestone during challenging times" },
    { year: "2022", event: "Global Expansion", description: "Extended our services to international markets" },
    { year: "2024", event: "50K+ Happy Customers", description: "Continuing to grow and serve our community" }
  ]

  return (
    <div>
      {/* Header Section */}
      <div className='text-2xl text-center pt-8 mt-20 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      {/* Main About Section with Enhanced Animation */}
      <div className='my-6 flex flex-col md:flex-row gap-16'>
        
        <div 
          id="about-image"
          className={`animate-on-scroll transition-all duration-1000 ${
            isVisible['about-image'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}
        >
          <img 
            className='w-full md:max-w-[450px] rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300' 
            src={assets.about_img} 
            alt="About VERVIX" 
          />
        </div>
        
        <div 
          id="about-content"
          className={`animate-on-scroll flex flex-col justify-center gap-6 md:w-2/4 text-gray-600 transition-all duration-1000 delay-300 ${
            isVisible['about-content'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`}
        >
          <p className="leading-relaxed hover:text-gray-800 transition-colors duration-300">
            <span className="font-semibold text-gray-800">VERVIX</span> was born out of a passion for innovation and a desire to revolutionize the way people shop online. Our journey began with a simple idea: to provide a platform where customers can easily discover, explore, and purchase a wide range of products from the comfort of their homes.
          </p>
          
          <p className="leading-relaxed hover:text-gray-800 transition-colors duration-300">
            Since our inception, we've worked tirelessly to curate a diverse selection of high-quality products that cater to every taste and preference. From fashion and beauty to electronics and home essentials, we offer an extensive collection sourced from trusted brands and suppliers.
          </p>
          
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border-l-4 border-gray-800">
            <b className='text-gray-800 text-lg'>Our Mission</b>
            <p className="mt-2 leading-relaxed">
              Our mission at VERVIX is to empower customers with choice, convenience, and confidence. We're dedicated to providing a seamless shopping experience that exceeds expectations, from browsing and ordering to delivery and beyond.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div 
        id="stats"
        className={`animate-on-scroll my-16 transition-all duration-1000 ${
          isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-3xl font-bold text-gray-800 mb-2">
                {stat.value.toLocaleString()}{stat.suffix}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className='text-xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20 gap-0'>
        {features.map((feature, index) => (
          <div 
            key={index}
            className={`border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${feature.color} group`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </span>
              <b className="group-hover:text-gray-900 transition-colors duration-300">
                {feature.title}
              </b>
            </div>
            <p className='text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300'>
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Journey Timeline Section */}
      <div className="mb-20">
        <div className='text-xl py-4 text-center'>
          <Title text1={'OUR'} text2={'JOURNEY'} />
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 transform md:-translate-x-px h-full w-0.5 bg-gray-300"></div>
            
            {timeline.map((item, index) => (
              <div 
                key={index} 
                id={`timeline-${index}`}
                className={`animate-on-scroll relative flex items-center mb-8 transition-all duration-700 delay-${index * 200} ${
                  isVisible[`timeline-${index}`] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                }`}
              >
                <div className="flex items-center w-full">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white text-sm font-bold z-10">
                    {index + 1}
                  </div>
                  <div className="ml-6 md:ml-8 bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex-grow">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {item.year}
                      </span>
                      <h3 className="font-bold text-gray-800">{item.event}</h3>
                    </div>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced CTA Section */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-lg mb-12 text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Experience VERVIX?</h3>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Join thousands of satisfied customers who have made VERVIX their go-to destination for quality products and exceptional service.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-300 font-semibold">
            Start Shopping
          </button>
          <button className="border-2 border-gray-800 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-800 hover:text-white transition-all duration-300 font-semibold">
            Contact Us
          </button>
        </div>
      </div>

      <NewsletterBox/>
    </div>
  )
}

export default About