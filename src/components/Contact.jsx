import { useState, useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent
  const [error, setError] = useState('');
  const ref = useRef(null);
  useScrollReveal(ref);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;

    setError('');
    setStatus('sending');

    const accessKey = process.env.REACT_APP_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      setStatus('idle');
      setError('Form is not configured yet. Please email devanshhanda0001@gmail.com.');
      return;
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
          subject: `Portfolio message from ${form.name.trim() || 'Visitor'}`,
          from_name: 'Portfolio Contact Form',
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to send message');
      }

      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus('idle');
      setError('Unable to send right now. Please email devanshhanda0001@gmail.com.');
    }
  };

  return (
    <section id="contact" className="sec contact-sec" ref={ref}>
      <div className="wrap">
        <div className="sec-hdr">
          <span className="sec-num">06 —</span>
          <h2 className="sec-title">Get In <em>Touch</em></h2>
        </div>

        <div className="contact-grid">
          {/* LEFT */}
          <div className="contact-left sr-left">
            <p className="contact-lead">
              Whether you have a project idea, a job opportunity, or just want
              to say hello — my inbox is always open. I'll get back to you as
              soon as possible!
            </p>

            <div className="contact-items">
              <a href="mailto:devanshhanda0001@gmail.com" className="contact-item">
                <div className="ci-icon">✉</div>
                <div>
                  <div className="ci-label">Email</div>
                  <div className="ci-val">devanshhanda0001@gmail.com</div>
                </div>
              </a>
              <a href="https://github.com/devansh698" target="_blank" rel="noopener" className="contact-item">
                <div className="ci-icon">⌥</div>
                <div>
                  <div className="ci-label">GitHub</div>
                  <div className="ci-val">github.com/devansh698</div>
                </div>
              </a>
              <a href="https://linkedin.com/in/devanshhanda" target="_blank" rel="noopener" className="contact-item">
                <div className="ci-icon">in</div>
                <div>
                  <div className="ci-label">LinkedIn</div>
                  <div className="ci-val">linkedin.com/in/devanshhanda</div>
                </div>
              </a>
            </div>
          </div>

          {/* FORM */}
          <div className="contact-right sr-right">
            {status === 'sent' ? (
              <div className="sent-msg">
                <span className="sent-ico">🎉</span>
                <h3>Message Sent!</h3>
                <p>Thanks for reaching out — I'll get back to you shortly.</p>
                <button
                  className="btn-ghost"
                  onClick={() => {
                    setError('');
                    setStatus('idle');
                  }}
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="field">
                  <label>Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div className="field">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div className="field">
                  <label>Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="What's on your mind?"
                    rows={5}
                    required
                  />
                </div>
                {error && <p className="form-error" role="alert">{error}</p>}
                <button type="submit" className="btn-solid" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : 'Send Message →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
