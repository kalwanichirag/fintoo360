(function () {
  // Calculator pages are intentionally presented without the global site shell.
  const siteShell = Array.from(document.body.children).find(function (element) {
    const isShellElement = element.tagName === 'HEADER' || element.tagName === 'NAV';
    const isPageHeading = Boolean(element.querySelector && element.querySelector('h1'));
    const hasGlobalNavigation = Boolean(element.querySelector && element.querySelector('nav')) || /Talk to an advisor/.test(element.textContent || '');
    return isShellElement && !isPageHeading && hasGlobalNavigation;
  });
  if (siteShell) siteShell.remove();
  document.querySelectorAll('footer').forEach(function (footer) { footer.remove(); });

  const icons = {
    'SIP Calculator': '<rect x="3.5" y="5.5" width="18" height="20" rx="4" fill="white" stroke="currentColor" stroke-width="1.7"/><path d="M7.5 3.8v4M17.5 3.8v4M3.8 11h17.4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="21.5" cy="21" r="7" fill="#e88414"/><path d="M18.7 18.2h5.6M18.7 20.2h5.6M19 18.2c3.6 0 3.6 4.8 0 4.8l4 3" fill="none" stroke="white" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/>',
    'Step-Up SIP Calculator': '<rect x="4" y="21" width="5" height="6" rx="1.5" fill="#e88414"/><rect x="12" y="16" width="5" height="11" rx="1.5" fill="#f3ad5d"/><rect x="20" y="10" width="5" height="17" rx="1.5" fill="currentColor"/><path d="M5 15l7-7 5 3 9-7M21 4h5v5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    'Lumpsum Calculator': '<ellipse cx="14" cy="22.5" rx="10" ry="4" fill="#e88414"/><path d="M4 17.5v5c0 2.2 4.5 4 10 4s10-1.8 10-4v-5" fill="#f8c98f" stroke="currentColor" stroke-width="1.5"/><ellipse cx="14" cy="17.5" rx="10" ry="4" fill="white" stroke="currentColor" stroke-width="1.5"/><path d="M13.7 13V7.5c0-2.3 1.7-3.7 4-3.7M14 8c-2-2.4-4.3-2.6-6.3-1.1 1.2 2.6 3.6 3.3 6.3 1.1zM14.2 6.1c1.9-2.5 4.4-2.8 6.5-1.3-1.2 2.7-3.7 3.5-6.5 1.3z" fill="#e88414" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>',
    'SWP Calculator': '<rect x="3.5" y="8" width="20" height="16" rx="4" fill="white" stroke="currentColor" stroke-width="1.7"/><path d="M3.5 13h20" stroke="currentColor" stroke-width="1.7"/><circle cx="23.5" cy="22" r="6" fill="#e88414"/><path d="M21 22h5m-2-2 2 2-2 2" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 6v4M18 6v4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    'Income Tax Calculator': '<path d="M7 3.5h12l6 6v18H7z" fill="white" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M19 3.8v6h5.8M11 14h10M11 18h6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="21.5" cy="23" r="6" fill="#e88414"/><path d="m18.8 23 1.8 1.8 3.6-4" fill="none" stroke="white" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
    'HRA Exemption Calculator': '<path d="M4 14.5 16 5l12 9.5" fill="#e88414" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 13v13h18V13L16 6z" fill="white" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M13 26v-7h6v7" fill="#f8c98f" stroke="currentColor" stroke-width="1.5"/><path d="m21.5 13 4 1.6v3.2c0 3-1.9 4.8-4 5.6-2.1-.8-4-2.6-4-5.6v-3.2z" fill="#e88414"/><path d="m19.6 18 1.2 1.2 2.4-2.5" fill="none" stroke="white" stroke-width="1.25" stroke-linecap="round"/>',
    'Retirement Calculator': '<path d="M7 20v-7c0-3 2.2-5 5-5h8c2.8 0 5 2 5 5v7" fill="white" stroke="currentColor" stroke-width="1.7"/><path d="M5 17c0-1.7 1.2-3 2.8-3s2.7 1.3 2.7 3v4h11v-4c0-1.7 1.2-3 2.8-3s2.7 1.3 2.7 3v8H5z" fill="#f8c98f" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="24" cy="8" r="5" fill="#e88414"/><path d="M22 6.5h4M22 8h4M22.2 6.5c2.5 0 2.5 3.2 0 3.2l2.5 1.8" fill="none" stroke="white" stroke-width="1.1" stroke-linecap="round"/>',
    'NPS Calculator': '<path d="M5 13h22L16 5z" fill="#e88414" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M7 14v10M12.5 14v10M19.5 14v10M25 14v10M4 27h24" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="23.5" cy="22.5" r="5.5" fill="white" stroke="#e88414" stroke-width="1.7"/>',
    'EMI Calculator': '<path d="M3.5 15 13 7l9.5 8" fill="#e88414" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M6 13v13h14V13l-7-5.8z" fill="white" stroke="currentColor" stroke-width="1.6"/><path d="M11 26v-6h4v6" fill="#f8c98f"/><rect x="19" y="11" width="10" height="16" rx="2" fill="currentColor"/><rect x="21" y="13" width="6" height="3" rx=".7" fill="white"/><path d="M22 19h.1M25 19h.1M22 22h.1M25 22h.1" stroke="white" stroke-width="2" stroke-linecap="round"/>',
    'Capital Gains Tax Calculator': '<path d="M4 26V7M4 26h24" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="m8 21 6-6 4 3 9-10" fill="none" stroke="#e88414" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 8h5v5" fill="none" stroke="#e88414" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="11" cy="23" r="5" fill="white" stroke="currentColor" stroke-width="1.4"/>',
    'Mutual Fund Overlap Calculator': '<circle cx="12" cy="16" r="9" fill="#e88414" fill-opacity=".9" stroke="currentColor" stroke-width="1.6"/><circle cx="20" cy="16" r="9" fill="#0a3f82" fill-opacity=".82" stroke="currentColor" stroke-width="1.6"/><path d="M16 8.1A9 9 0 0 0 16 24a9 9 0 0 0 0-15.9z" fill="#fff1df" fill-opacity=".9"/><circle cx="16" cy="16" r="2" fill="currentColor"/>',
    'Goal Planner': '<circle cx="15" cy="17" r="11" fill="white" stroke="currentColor" stroke-width="1.7"/><circle cx="15" cy="17" r="6.5" fill="#f8c98f" stroke="#e88414" stroke-width="1.7"/><circle cx="15" cy="17" r="2.2" fill="currentColor"/><path d="m17 15 9-9M22 6h4v4" fill="none" stroke="#e88414" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  };

  const destinations = {
    'SIP Calculator': 'sip-calculator.html',
    'Step-Up SIP Calculator': 'stepup-sip-calculator.html',
    'Lumpsum Calculator': 'lumpsum-calculator.html',
    'SWP Calculator': 'swp-calculator.html',
    'Income Tax Calculator': 'income-tax-calculator.html',
    'HRA Exemption Calculator': 'hra-exemption-calculator.html',
    'Retirement Calculator': 'retirement-calculator.html',
    'NPS Calculator': 'nps-calculator.html',
    'EMI Calculator': 'emi-calculator.html',
    'Capital Gains Tax Calculator': 'capital-gains-tax-calculator.html',
    'Mutual Fund Overlap Calculator': 'mutual-fund-overlap-calculator.html',
    'Goal Planner': 'goal-planner-sip-calculator.html'
  };

  const style = document.createElement('style');
  style.textContent = '.inner-tool-link{color:inherit!important;text-decoration:none!important;cursor:pointer;transition:transform .25s ease,border-color .25s ease,box-shadow .25s ease}.inner-tool-link:hover{transform:translateY(-2px);border-color:#c9d5ea!important;box-shadow:0 10px 22px -16px rgba(4,43,98,.5)}.inner-tool-link:focus-visible{outline:2px solid #063569;outline-offset:3px}.inner-tool-art,.page-tool-art{display:grid!important;place-items:center!important;color:#063569!important;background:linear-gradient(145deg,#fff7eb 0%,#fde8cc 100%)!important;border:1px solid rgba(232,132,20,.13)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.8),0 7px 16px -14px rgba(4,43,98,.55)!important}.inner-tool-art{width:42px!important;height:42px!important;min-width:42px;border-radius:13px!important}.page-tool-art{width:58px!important;height:58px!important;min-width:58px;border-radius:17px!important}.inner-tool-art.tax,.page-tool-art.tax{background:linear-gradient(145deg,#eef5ff 0%,#dce9fb 100%)!important;border-color:rgba(6,53,105,.1)!important}.inner-tool-art.retirement,.page-tool-art.retirement{background:linear-gradient(145deg,#f1f3ff 0%,#e4e7f8 100%)!important;border-color:rgba(6,53,105,.09)!important}.inner-tool-art.planning,.page-tool-art.planning{background:linear-gradient(145deg,#edfbf6 0%,#d9f3e9 100%)!important;border-color:rgba(17,121,90,.1)!important}.inner-tool-art svg{width:24px!important;height:24px!important;stroke:none!important;overflow:visible}.page-tool-art svg{width:31px!important;height:31px!important;stroke:none!important;overflow:visible}';
  document.head.appendChild(style);

  // Replace the large legacy icon beside the page title as well.
  const pageHeading = document.querySelector('h1');
  if (pageHeading) {
    const pageName = Object.keys(icons).find(function (name) { return pageHeading.textContent.trim().startsWith(name); });
    const headingRow = pageHeading.parentElement && pageHeading.parentElement.parentElement;
    const iconTile = headingRow && headingRow.firstElementChild;
    if (pageName && iconTile && iconTile.querySelector('svg')) {
      const variant = /Tax|HRA/.test(pageName) ? ' tax' : /Retirement|NPS/.test(pageName) ? ' retirement' : /EMI|Goal/.test(pageName) ? ' planning' : '';
      iconTile.className = 'page-tool-art' + variant;
      iconTile.setAttribute('role', 'img');
      iconTile.setAttribute('aria-label', pageName);
      iconTile.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true">' + icons[pageName] + '</svg>';
    }
  }

  document.querySelectorAll('h2').forEach(function (heading) {
    if (heading.textContent.trim() !== 'Related calculators') return;
    const section = heading.closest('section') || heading.parentElement;
    section.querySelectorAll('.t, p, div').forEach(function (title) {
      let name = title.textContent.trim();
      if (title.children.length) return;

      if (!icons[name] || !destinations[name]) return;
      const card = title.parentElement && title.parentElement.parentElement;
      const oldSvg = card && card.querySelector('svg');
      if (!oldSvg) return;
      const tile = oldSvg.parentElement;
      const variant = /Tax|HRA/.test(name) ? ' tax' : /Retirement|NPS/.test(name) ? ' retirement' : '';
      tile.className = 'inner-tool-art' + variant;
      tile.setAttribute('role', 'img');
      tile.setAttribute('aria-label', name);
      tile.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true">' + icons[name] + '</svg>';

      if (card.tagName === 'A') {
        card.href = destinations[name];
        card.classList.add('inner-tool-link');
        card.setAttribute('aria-label', 'Open ' + name);
      } else {
        const link = document.createElement('a');
        [...card.attributes].forEach(function (attribute) {
          link.setAttribute(attribute.name, attribute.value);
        });
        link.href = destinations[name];
        link.classList.add('inner-tool-link');
        link.setAttribute('aria-label', 'Open ' + name);
        link.innerHTML = card.innerHTML;
        card.replaceWith(link);
      }
    });
  });
})();
