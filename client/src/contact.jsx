import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Contact({ onSubmit }) {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");

  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const response = await fetch('/api/contacts', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstname: firstName, lastname: lastName, email, phone, message: text })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to save your message.');
      onSubmit({ firstName, lastName, phone, email, text });
      navigate('/');
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  }

  return (
    <>
      <p className="eyebrow">Get in touch</p>
      <h1>Contact Me</h1>
      <div className="contact-layout">
        <section className="panel">
          <h2>Contact information</h2>
          <p><strong>Mohamad Alkurdi</strong><br />Ottawa, Ontario</p>
          <p><a href="mailto:malkurd2@my.centennialcollege.ca">malkurd2@my.centennialcollege.ca</a></p>
        </section>
        <form className="panel" onSubmit={handleSubmit}>
          <h2>Leave a message</h2>
          <p>Your message is saved to the portfolio database. All fields are required.</p>
          <label htmlFor="first-name">First Name</label>
          <input id="first-name" name="firstName" autoComplete="given-name" value={firstName} onChange={(event) => setFirstName(event.target.value)} required pattern=".*\S.*" maxLength="60" />
          <label htmlFor="last-name">Last Name</label>
          <input id="last-name" name="lastName" autoComplete="family-name" value={lastName} onChange={(event) => setLastName(event.target.value)} required pattern=".*\S.*" maxLength="60" />
          <label htmlFor="phone">Contact Number</label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} required maxLength="30" />
          <label htmlFor="email">Email Address</label>
          <input id="email" name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required maxLength="150" />
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" rows="5" value={text} onChange={(event) => setText(event.target.value)} required maxLength="2000" />
          {error && <p role="alert">{error}</p>}
          <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Submit message'}</button>
        </form>
      </div>
    </>
  );
}
