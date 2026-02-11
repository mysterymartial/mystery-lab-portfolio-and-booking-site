import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };

  return (
    <section id="contact" className="p-8 text-center text-white min-h-screen flex items-center justify-center">
      <div>
        <h1 className="text-4xl">Contact Me</h1>
        <form onSubmit={handleSubmit} className="inline-block text-left">
          <div className="my-4">
            <label>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="ml-2 p-2 border border-gray-300 rounded" />
          </div>
          <div className="my-4">
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="ml-2 p-2 border border-gray-300 rounded" />
          </div>
          <div className="my-4">
            <label>Message:</label>
            <textarea name="message" value={formData.message} onChange={handleChange} required className="ml-2 p-2 border border-gray-300 rounded" />
          </div>
          <button type="submit" className="px-4 py-2 bg-black text-white rounded">Send</button>
        </form>
      </div>
    </section>
  );
};

export default Contact;

