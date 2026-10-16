import { Link, NavLink } from "react-router-dom";

export default function Layout() {
  return (
    <header>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="container header-content">
        <Link className="brand" to="/">
          <img src="/images/logo.svg" width="48" height="48" alt="MA logo" />
          <span>Mohamad Alkurdi<small>Student Portfolio</small></span>
        </Link>
        <nav aria-label="Main navigation">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/about">About Me</NavLink>
          <NavLink to="/project">Projects</NavLink>
          <NavLink to="/education">Education</NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/contact">Contact Me</NavLink>
        </nav>
      </div>
    </header>
  );
}
