export default function About() {
  return (
    <>
      <p className="eyebrow">A little about me</p>
      <h1>About Me</h1>
      <div className="about-layout">
        <figure>
          <img className="portrait" src="/images/logo.png" alt="Portrait placeholder: replace with a photo of Mohamad Alkurdi" />
          <figcaption></figcaption>
        </figure>
        <section>
          <h2>Mohamad Alkurdi</h2>
          <p>I am studying Software Engineering at Centennial College. I also completed the Cyber Security Analyst program at Willis College. I have a background in IT, networking and project management, and I am now developing my skills in React and web applications.</p>
          <p>I enjoy solving problems, working with others and learning through practical projects. I speak English and Arabic, and I am based in Ottawa, Ontario.</p>
          <a className="button" href="/resume.pdf" target="_blank" rel="noreferrer">View my résumé (PDF)</a>
        </section>
      </div>
    </>
  );
}
