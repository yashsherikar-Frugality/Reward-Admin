// Login gate. Loaded after db.js; script1.js (the app) is only loaded once a
// Supabase Auth session exists, so no data call is made while signed out.
(function () {
    const sb = window.RGDB && RGDB.client;
    const loadApp = () => {
        const s = document.createElement('script');
        s.src = 'js/script1.js?v=81';
        document.body.appendChild(s);
    };
    if (!sb) { alert('Supabase is not configured — set js/config.js'); return; }

    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#f4f6fb;display:none;align-items:center;justify-content:center;';
    overlay.innerHTML =
        '<form id="rgLogin" class="card-modern" style="background:#fff;padding:28px;border-radius:12px;width:340px;box-shadow:0 4px 24px rgba(0,0,0,.1);">' +
        '<h5 class="fw-bold mb-3">RewardGenius sign in</h5>' +
        '<input id="rgEmail" type="email" class="form-control mb-2" placeholder="Email" required autocomplete="username">' +
        '<input id="rgPass" type="password" class="form-control mb-3" placeholder="Password" required autocomplete="current-password">' +
        '<div id="rgErr" class="text-danger small mb-2"></div>' +
        '<button class="btn btn-primary w-100" type="submit">Sign in</button></form>';
    document.body.appendChild(overlay);

    let started = false;
    function start(session) {
        overlay.style.display = 'none';
        const who = document.getElementById('rgUser');
        if (who) who.textContent = session.user.email;
        if (!started) { started = true; loadApp(); }
    }

    window.rgSignOut = async () => { await sb.auth.signOut(); location.reload(); };

    document.getElementById('rgLogin').addEventListener('submit', async (e) => {
        e.preventDefault();
        const { data, error } = await sb.auth.signInWithPassword({
            email: document.getElementById('rgEmail').value.trim(),
            password: document.getElementById('rgPass').value
        });
        if (error) { document.getElementById('rgErr').textContent = error.message; return; }
        start(data.session);
    });

    sb.auth.getSession().then(({ data }) => {
        if (data.session) start(data.session); else overlay.style.display = 'flex';
    });
})();
