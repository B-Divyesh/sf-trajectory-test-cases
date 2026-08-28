# Demo sandbox

Open <https://trajectory-test-cases.sociobot.in/?demo=1> or choose **Try it with
sample data** on the landing page. Both paths enter `/demo/?demo=1` directly.

The demo starts with a passing “research then save” fixture. Its sample trace
contains two `docs.search` calls followed by one `report.write` call. The
example controls also load a missing call, wrong order, or empty trace.

Demo edits use only `sessionStorage` keys prefixed with `demo:`. They never read
or write the normal `ttc-theme` preference. **Reset demo** deletes the demo
workspace and restores the passing sample. **Start for real** deletes the demo
workspace before returning to the documentation. Closing the tab also discards
all demo state.

The package matcher executes in the page. The demo needs no account and sends
no fixture or event data to a server. After one online visit, the service worker
caches the demo shell so the sample can be reloaded and run offline.
