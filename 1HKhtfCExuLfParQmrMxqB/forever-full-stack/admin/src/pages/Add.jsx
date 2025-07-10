import React, { useState } from 'react'
import {assets} from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { useToast } from '../components/ModernToaster'
import { Upload, Plus, X } from 'lucide-react'

const Add = ({token}) => {

  const [image1,setImage1] = useState(false)
  const [image2,setImage2] = useState(false)
  const [image3,setImage3] = useState(false)
  const [image4,setImage4] = useState(false)

   const [name, setName] = useState("");
   const [description, setDescription] = useState("");
   const [price, setPrice] = useState("");
   const [retailPrice, setRetailPrice] = useState("");
   const [category, setCategory] = useState("Men");
   const [subCategory, setSubCategory] = useState("Topwear");
   const [bestseller, setBestseller] = useState(false);
   const [sizes, setSizes] = useState([]);
   const [colors, setColors] = useState([]);
   const [newColor, setNewColor] = useState("");
   const { success, error } = useToast()

   const colorOptions = [
     "Red", "Blue", "Green", "Yellow", "Black", "White", "Gray", "Pink", 
     "Purple", "Orange", "Brown", "Navy", "Maroon", "Teal", "Coral", "Lavender"
   ];

   const addColor = () => {
     if (newColor && !colors.includes(newColor)) {
       setColors([...colors, newColor]);
       setNewColor("");
     }
   };

   const removeColor = (colorToRemove) => {
     setColors(colors.filter(color => color !== colorToRemove));
   };

   const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      
      const formData = new FormData()

      formData.append("name",name)
      formData.append("description",description)
      formData.append("price",price)
      formData.append("retailPrice",retailPrice)
      formData.append("category",category)
      formData.append("subCategory",subCategory)
      formData.append("bestseller",bestseller)
      formData.append("sizes",JSON.stringify(sizes))
      formData.append("colors",JSON.stringify(colors))

      image1 && formData.append("image1",image1)
      image2 && formData.append("image2",image2)
      image3 && formData.append("image3",image3)
      image4 && formData.append("image4",image4)

      const response = await axios.post(backendUrl + "/api/product/add",formData,{headers:{token}})

      if (response.data.success) {
        success(response.data.message)
        setName('')
        setDescription('')
        setPrice('')
        setRetailPrice('')
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setSizes([])
        setColors([])
      } else {
        error(response.data.message)
      }

    } catch (error) {
      console.log(error);
      error(error.message)
    }
   }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Product</h1>
        
        <form onSubmit={onSubmitHandler} className='space-y-6'>
          {/* Image Upload Section */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Images</h3>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <label htmlFor="image1" className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                  {!image1 ? (
                    <div className="text-center">
                      <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Upload Image 1</p>
                    </div>
                  ) : (
                    <img className='w-full h-24 object-cover rounded' src={URL.createObjectURL(image1)} alt="" />
                  )}
                </div>
                <input onChange={(e)=>setImage1(e.target.files[0])} type="file" id="image1" hidden accept="image/*"/>
              </label>
              
              <label htmlFor="image2" className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                  {!image2 ? (
                    <div className="text-center">
                      <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Upload Image 2</p>
                    </div>
                  ) : (
                    <img className='w-full h-24 object-cover rounded' src={URL.createObjectURL(image2)} alt="" />
                  )}
                </div>
                <input onChange={(e)=>setImage2(e.target.files[0])} type="file" id="image2" hidden accept="image/*"/>
              </label>
              
              <label htmlFor="image3" className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                  {!image3 ? (
                    <div className="text-center">
                      <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Upload Image 3</p>
                    </div>
                  ) : (
                    <img className='w-full h-24 object-cover rounded' src={URL.createObjectURL(image3)} alt="" />
                  )}
                </div>
                <input onChange={(e)=>setImage3(e.target.files[0])} type="file" id="image3" hidden accept="image/*"/>
              </label>
              
              <label htmlFor="image4" className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                  {!image4 ? (
                    <div className="text-center">
                      <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Upload Image 4</p>
                    </div>
                  ) : (
                    <img className='w-full h-24 object-cover rounded' src={URL.createObjectURL(image4)} alt="" />
                  )}
                </div>
                <input onChange={(e)=>setImage4(e.target.files[0])} type="file" id="image4" hidden accept="image/*"/>
              </label>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
              <input 
                onChange={(e)=>setName(e.target.value)} 
                value={name} 
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                type="text" 
                placeholder='Enter product name' 
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select 
                onChange={(e) => setCategory(e.target.value)} 
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sub Category</label>
              <select 
                onChange={(e) => setSubCategory(e.target.value)} 
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                <option value="Topwear">Topwear</option>
                <option value="Bottomwear">Bottomwear</option>
                <option value="Winterwear">Winterwear</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bestseller</label>
              <div className="flex items-center mt-2">
                <input 
                  onChange={() => setBestseller(prev => !prev)} 
                  checked={bestseller} 
                  type="checkbox" 
                  id='bestseller' 
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className='ml-2 text-sm text-gray-700 cursor-pointer' htmlFor="bestseller">
                  Mark as bestseller
                </label>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price</label>
              <input 
                onChange={(e) => setPrice(e.target.value)} 
                value={price} 
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                type="number" 
                placeholder='Enter selling price' 
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Retail Price</label>
              <input 
                onChange={(e) => setRetailPrice(e.target.value)} 
                value={retailPrice} 
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                type="number" 
                placeholder='Enter retail price' 
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Description</label>
            <textarea 
              onChange={(e)=>setDescription(e.target.value)} 
              value={description} 
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
              rows="4"
              placeholder='Write product description here' 
              required
            />
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Available Sizes</label>
            <div className='flex flex-wrap gap-3'>
              {["S", "M", "L", "XL", "XXL"].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSizes(prev => 
                    prev.includes(size) ? prev.filter(item => item !== size) : [...prev, size]
                  )}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    sizes.includes(size) 
                      ? "bg-blue-500 text-white border-blue-500" 
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Available Colors</label>
            
            {/* Add new color */}
            <div className="flex gap-2 mb-4">
              <select
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a color</option>
                {colorOptions.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={addColor}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </button>
            </div>

            {/* Selected colors */}
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <div
                  key={color}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
                >
                  <span className="text-sm">{color}</span>
                  <button
                    type="button"
                    onClick={() => removeColor(color)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button 
              type="submit" 
              className='px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium'
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Add