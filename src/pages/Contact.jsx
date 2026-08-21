// src/contact.jsx

import React, { useState } from "react";
import { Send, CheckCircle2, Mail, Phone, MapPin, ArrowUpRight, Loader2 } from "lucide-react";

const ACCENT = "#3c4cfa";
const ACCENT_SOFT = "#EEF0FF";
const INK = "#14161F";

function FloatingField({ label, name, type = "text", required, textarea, rows }) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");
  const active = focused || value.length > 0;

  const sharedProps = {
    name,
    id: name,
    required,
    value,
    onChange: (e) => setValue(e.target.value),
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    className:
      "peer w-full bg-transparent px-4 pt-6 pb-2 text-[15px] text-[#14161F] outline-none placeholder-transparent",
  };

  return (
    <div
      className="relative rounded-xl border transition-colors duration-200"
      style={{
        borderColor: focused ? ACCENT : "#E4E4EA",
        backgroundColor: focused ? ACCENT_SOFT : "#FAFAFA",
      }}
    >
      {textarea ? (
        <textarea {...sharedProps} rows={rows || 4} placeholder={label} />
      ) : (
        <input {...sharedProps} type={type} placeholder={label} />
      )}
      <label
        htmlFor={name}
        className="pointer-events-none absolute left-4 transition-all duration-200"
        style={{
          top: active ? "10px" : "50%",
          transform: active ? "translateY(0)" : "translateY(-50%)",
          fontSize: active ? "11px" : "15px",
          color: focused ? ACCENT : "#8A8C99",
          fontWeight: active ? 600 : 400,
          letterSpacing: active ? "0.02em" : "normal",
        }}
      >
        {label}
        {required && <span style={{ color: ACCENT }}> *</span>}
      </label>
    </div>
  );
}

function Contact() {
  const [status, setStatus] = useState("idle"); // idle | sending | sent

  const handleSubmit = (e) => {
    setStatus("sending");
    // formsubmit.co handles the actual network request via native form POST.
    // We just intercept locally to drive the UI state before the browser navigates.
    setTimeout(() => setStatus("sent"), 600);
  };

  return (
    <div className="min-h-screen bg-[#FCFCFD] relative overflow-hidden">
      {/* ambient dot-grid backdrop */}
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#D8DAF5 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-20 lg:py-28">
        <div className="grid lg:grid-cols-5 gap-16 lg:gap-12">
          {/* Left: pitch */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div>
              <div
                className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-8 text-xs font-semibold tracking-wide"
                style={{ backgroundColor: ACCENT_SOFT, color: ACCENT }}
              >
                <span className="relative flex h-2 w-2">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ backgroundColor: ACCENT }}
                  />
                  <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: ACCENT }} />
                </span>
                AVAILABLE FOR WORK
              </div>

              <h1
                className="text-[2.75rem] sm:text-6xl font-bold leading-[1.05] tracking-tight mb-6"
                style={{ color: INK, fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
              >
                Let's build
                <br />
                something
                <br />
                <span style={{ color: ACCENT }}>worth shipping.</span>
              </h1>

              <p className="text-[#5B5D6B] text-base leading-relaxed max-w-sm">
                Open to full-time roles and select freelance work. Tell me about
                the problem you're solving — I'll get back to you within a day.
              </p>
            </div>

            <div className="mt-12 lg:mt-0 space-y-4">
              <a
                href="mailto:ashokallapalli790@gmail.com"
                className="group flex items-center gap-3 text-sm text-[#14161F] hover:text-[#3c4cfa] transition-colors"
              >
                <span
                  className="flex items-center justify-center w-9 h-9 rounded-lg border border-[#E4E4EA] group-hover:border-[#3c4cfa] transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </span>
                ashokallapalli790@gmail.com
                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <div className="flex items-center gap-3 text-sm text-[#5B5D6B]">
                <span className="flex items-center justify-center w-9 h-9 rounded-lg border border-[#E4E4EA]">
                  <MapPin className="w-4 h-4" />
                </span>
                Remote · Open to relocation
              </div>
            </div>
          </div>

          {/* Right: form card */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-[#ECECEF] shadow-[0_1px_2px_rgba(20,22,31,0.04),0_12px_32px_-12px_rgba(20,22,31,0.10)] p-7 sm:p-9">
              {status === "sent" ? (
                <div className="flex flex-col items-center justify-center text-center py-16">
                  <div
                    className="flex items-center justify-center w-14 h-14 rounded-full mb-5"
                    style={{ backgroundColor: ACCENT_SOFT }}
                  >
                    <CheckCircle2 className="w-7 h-7" style={{ color: ACCENT }} />
                  </div>
                  <h3 className="text-xl font-semibold text-[#14161F] mb-2">Message sent</h3>
                  <p className="text-[#5B5D6B] text-sm max-w-xs">
                    Thanks for reaching out — I'll reply to your email shortly.
                  </p>
                </div>
              ) : (
                <form
                  action="https://formsubmit.co/ashokgowd34@gmail.com"
                  method="POST"
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <input type="hidden" name="_captcha" value="false" />
                  <input type="hidden" name="_template" value="table" />
                  <input
                    type="hidden"
                    name="_autoresponse"
                    value="Thank you! I have received your message."
                  />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FloatingField label="Your name" name="name" required />
                    <FloatingField label="Email address" name="email" type="email" required />
                  </div>

                  <FloatingField label="Phone (optional)" name="phone" type="tel" />
                  <FloatingField label="Tell me about your project" name="message" textarea rows={5} required />

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full py-3.5 px-6 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 transition-transform duration-150 active:scale-[0.98] disabled:opacity-70"
                    style={{ backgroundColor: ACCENT }}
                  >
                    {status === "sending" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send message
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-[#9A9CA8] pt-1">
                    No spam, ever. Just a real reply from a real inbox.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;