from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
base = Path(__file__).resolve().parents[1]
out = base.parent / 'Assignment_2_Portfolio_Submission.zip'
with ZipFile(out, 'w', ZIP_DEFLATED) as z:
    for p in base.rglob('*'):
        if not p.is_file(): continue
        rel = p.relative_to(base)
        if any(x in rel.parts for x in ['node_modules', '.git', '.history', 'dist', 'report-render', 'scripts']): continue
        if p.name in ['.env', 'yarn.lock'] or p.suffix == '.log': continue
        z.write(p, 'MyPortfolio/' + rel.as_posix())
    z.write(base.parent / 'Assignment_2_Screenshot_Report.docx', 'Assignment_2_Screenshot_Report.docx')
with ZipFile(out) as z:
    assert not any('/node_modules/' in n or n.endswith('/.env') for n in z.namelist())
    assert 'MyPortfolio/server.js' in z.namelist()
    assert 'MyPortfolio/package-lock.json' in z.namelist()
    print(str(out), len(z.namelist()), 'files', out.stat().st_size, 'bytes')
