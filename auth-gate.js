/**
 * Clerk Auth Gate for Blackbaud Coworker
 * Loads Clerk JS SDK, checks authentication and domain restrictions,
 * then reveals page content or redirects to sign-in.
 */
(function () {
  var CLERK_PK = 'pk_test_Y3Jpc3Atcm9kZW50LTI0NzQuY2xlcmsuYWNjb3VudHMuZGV2JA';
  var ALLOWED_DOMAINS = ['blackbaud.com', 'salesforce.com'];
  var ADMIN_EMAILS = ['afisher@salesforce.com', 'bill.schermer@salesforce.com'];

  // Hide the page content immediately
  document.documentElement.style.visibility = 'hidden';

  // Skip auth gate on sign-in, sign-up, and domain-rejected pages
  var currentPath = window.location.pathname;
  if (
    currentPath === '/sign-in.html' ||
    currentPath === '/sign-up.html' ||
    currentPath === '/domain-rejected.html'
  ) {
    document.documentElement.style.visibility = 'visible';
    return;
  }

  // Load Clerk SDK
  var script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@clerk/clerk-js@5/dist/clerk.browser.js';
  script.crossOrigin = 'anonymous';
  script.onload = initClerk;
  script.onerror = function () {
    // Clerk SDK failed to load — show page anyway as fallback
    document.documentElement.style.visibility = 'visible';
  };
  document.head.appendChild(script);

  function initClerk() {
    try {
      var clerk = new window.Clerk(CLERK_PK);
      clerk
        .load()
        .then(function () {
          if (!clerk.user) {
            // Not signed in — redirect to sign-in page
            window.location.href =
              '/sign-in.html?redirect_url=' + encodeURIComponent(window.location.href);
            return;
          }

          // Check domain restriction
          var email = (clerk.user.emailAddresses[0] && clerk.user.emailAddresses[0].emailAddress) || '';
          var domain = email.split('@')[1] || '';
          var isAdmin = ADMIN_EMAILS.indexOf(email.toLowerCase()) !== -1;
          var isDomainAllowed = ALLOWED_DOMAINS.indexOf(domain.toLowerCase()) !== -1;

          if (!isAdmin && !isDomainAllowed) {
            window.location.href = '/domain-rejected.html';
            return;
          }

          // User is authenticated and authorized — reveal the page
          document.documentElement.style.visibility = 'visible';

          // Inject user nav bar into the sidebar
          injectUserNav(clerk);
        })
        .catch(function () {
          // Clerk load failed — redirect to sign-in as fallback
          window.location.href =
            '/sign-in.html?redirect_url=' + encodeURIComponent(window.location.href);
        });
    } catch (e) {
      // Clerk constructor failed — redirect to sign-in
      window.location.href =
        '/sign-in.html?redirect_url=' + encodeURIComponent(window.location.href);
    }
  }

  function injectUserNav(clerk) {
    var sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    var email = (clerk.user.emailAddresses[0] && clerk.user.emailAddresses[0].emailAddress) || '';

    var userNav = document.createElement('div');
    userNav.style.cssText =
      'position:absolute;bottom:0;left:0;right:0;padding:12px 16px;border-top:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:space-between;gap:8px;';

    var emailSpan = document.createElement('span');
    emailSpan.style.cssText =
      'font-size:11px;color:rgba(255,255,255,0.6);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;';
    emailSpan.textContent = email;

    var signOutBtn = document.createElement('button');
    signOutBtn.textContent = 'Sign out';
    signOutBtn.style.cssText =
      'font-size:11px;padding:4px 10px;border-radius:4px;border:1px solid rgba(255,255,255,0.2);background:transparent;color:rgba(255,255,255,0.7);cursor:pointer;white-space:nowrap;';
    signOutBtn.onmouseover = function () {
      signOutBtn.style.borderColor = 'rgba(255,255,255,0.4)';
      signOutBtn.style.color = '#fff';
    };
    signOutBtn.onmouseout = function () {
      signOutBtn.style.borderColor = 'rgba(255,255,255,0.2)';
      signOutBtn.style.color = 'rgba(255,255,255,0.7)';
    };
    signOutBtn.onclick = function () {
      clerk.signOut().then(function () {
        window.location.href = '/sign-in.html';
      });
    };

    userNav.appendChild(emailSpan);
    userNav.appendChild(signOutBtn);
    sidebar.style.position = 'relative';
    sidebar.appendChild(userNav);
  }
})();
