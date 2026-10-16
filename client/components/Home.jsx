import { Link } from "react-router-dom";

export default function Home({ message }) {
  return (
    <>
      <section className="welcome">
        <p className="eyebrow">Welcome to my portfolio</p>
        <h1>Hello, I am Mohamad Alkurdi.</h1>
        <p className="intro">I am a Software Engineering student at Centennial College. I am learning to build useful websites with React and JavaScript.</p>
        <Link className="button" to="/about">About Me</Link>
        <Link className="text-link" to="/project">View my projects</Link>
      </section>
      <section className="panel">
        <h2>My mission</h2>
        <p>My goal is to keep learning and use my background in IT and cybersecurity to build clear, reliable applications that help people.</p>
      </section>
      {message && (
        <section className="panel" aria-labelledby="message-heading">
          <h2 id="message-heading">Thank you, {message.firstName}!</h2>
          <p role="status">Your information was captured for this demonstration. No email was sent. Refreshing the page clears this information.</p>
          <dl>
            <dt>Name</dt><dd>{message.firstName} {message.lastName}</dd>
            <dt>Contact number</dt><dd>{message.phone}</dd>
            <dt>Email</dt><dd>{message.email}</dd>
            <dt>Message</dt><dd className="message-text">{message.text}</dd>
          </dl>
        </section>
      )}
    </>
  );
}
