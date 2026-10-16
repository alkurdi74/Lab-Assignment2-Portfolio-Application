export default function Project() {
  return (
    <>
      <p className="eyebrow">Learning through practice</p>
      <h1>My Projects</h1>
      <p>These completed Willis College lab projects are listed in my résumé. The illustrations show each topic; they are not screenshots of the original labs.</p>
      <div className="cards">
        <article className="card">
          <img src="/images/cloud.svg" alt="Diagram of an HTML document going to S3, CloudFront and a browser" />
          <div className="card-content">
            <h2>Cloud Security Lab</h2>
            <p><strong>Role:</strong> As a student, I created an S3 bucket with the AWS CLI, added a bucket policy and uploaded an HTML document. I also created a CloudFront distribution.</p>
            <p><strong>Outcome:</strong> I completed the lab steps to upload, update and view a hosted webpage.</p>
          </div>
        </article>
        <article className="card">
          <img src="/images/database.svg" alt="Diagram showing database tables, queries and backups" />
          <div className="card-content">
            <h2>SQL Database Lab</h2>
            <p><strong>Role:</strong> As a student, I worked through Microsoft SQL database exercises about database structure, tables, queries, backups and security.</p>
            <p><strong>Outcome:</strong> I completed the database administration lab and practised working with table information and backups.</p>
          </div>
        </article>
        <article className="card">
          <img src="/images/network.svg" alt="Diagram of a server connected to three virtual computers" />
          <div className="card-content">
            <h2>Network Infrastructure Lab</h2>
            <p><strong>Role:</strong> As a student, I created virtual machines in a sandbox and practised IP addressing, DNS, Active Directory, domain joining and Group Policy.</p>
            <p><strong>Outcome:</strong> I completed a proof-of-design network infrastructure lab and practised configuring a virtual network.</p>
          </div>
        </article>
      </div>
    </>
  );
}
