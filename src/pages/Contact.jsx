import React, { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

function Contact() {
  const [success, setSuccess] = useState(false);

  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4" style={{ color: "#3c4cfa" }}>
            Contact Me
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Have a question or want to work together? Feel free to reach out!
          </p>
        </div>

        <form
          action="https://formsubmit.co/ashokgowd34@gmail.com"
          method="POST"
          onSubmit={() => setSuccess(true)}
          className="space-y-6 max-w-2xl mx-auto"
        >
          {/* Required hidden fields */}
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_template" value="table" />
          <input
            type="hidden"
            name="_autoresponse"
            value="Thank you! I have received your message."
          />

          <div>
            <label className="block text-sm font-medium mb-2">Your Name</label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="text"
              name="phone"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg"
              placeholder="+91 99999 99999"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea
              name="message"
              rows="5"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg"
              placeholder="Tell me about your project..."
            ></textarea>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-4 px-6 text-white rounded-lg flex items-center justify-center gap-2"
            style={{ backgroundColor: "#3c4cfa" }}
          >
            <Send className="w-5 h-5" />
            Send Message
          </button>

          {success && (
            <div className="bg-green-100 text-green-700 p-4 rounded-lg flex items-center gap-2 justify-center mt-4">
              <CheckCircle className="w-5 h-5" />
              Message sent successfully!
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Contact;
