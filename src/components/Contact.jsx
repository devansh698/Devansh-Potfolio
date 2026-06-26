import { useState, useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { links } from '../data';
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
      setError(`Form is not configured yet. Please email ${links.email}.`);
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
      setError(`Unable to send right now. Please email ${links.email}.`);
    }
  };

  return (
    <section id="contact" className="sec contact-sec" ref={ref}>
      <span className="ghost-num" style={{ top: '-2rem', left: '-1rem' }}>07</span>
      <div className="wrap">
        <div className="sec-hdr">
          <h2 className="sec-title">Get In <em>Touch</em></h2>
          <span className="sec-num">Section 07</span>
        </div>

        <div className="contact-grid">
          <div className="contact-left sr-left">
            <p className="contact-lead">
              Open to backend &amp; full-stack roles. Got a project, an opening,
              or just want to talk shop — my inbox is open. I reply fast.
            </p>

            <div className="contact-items">
              <a href={`mailto:${links.email}`} className="contact-item">
                <span className="ci-n">01</span>
                <div>
                  <div className="ci-label">Email</div>
                  <div className="ci-val">{links.email}</div>
                </div>
              </a>
              <a href={links.github} target="_blank" rel="noopener noreferrer" className="contact-item">
                <span className="ci-n">02</span>
                <div>
                  <div className="ci-label">GitHub</div>
                  <div className="ci-val">github.com/devansh698</div>
                </div>
              </a>
              <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="contact-item">
                <span className="ci-n">03</span>
                <div>
                  <div className="ci-label">LinkedIn</div>
                  <div className="ci-val">linkedin.com/in/devanshhanda</div>
                </div>
              </a>
              <span className="contact-item static">
                <span className="ci-n">04</span>
                <div>
                  <div className="ci-label">Location</div>
                  <div className="ci-val">{links.location}</div>
                </div>
              </span>
            </div>
          </div>

          <div className="contact-right sr-right">
            {status === 'sent' ? (
              <div className="sent-msg">
                <span className="sent-stamp">SENT</span>
                <h3>Message Received</h3>
                <p>Thanks for reaching out — I'll get back to you shortly.</p>
                <button className="btn-ghost" onClick={() => { setError(''); setStatus('idle'); }}>
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="field">
                  <label>Name</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
                </div>
                <div className="field">
                  <label>Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
                </div>
                <div className="field">
                  <label>Message</label>
                  <textarea name="message" value={form.message} onChange={handleChange} placeholder="What's on your mind?" rows={5} required />
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
