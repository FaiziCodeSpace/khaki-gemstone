
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: var(--font-sans); }
  .wrap { max-width: 860px; margin: 0 auto; padding: 2rem 1rem; }
  .hero { text-align: center; padding: 2.5rem 1rem 2rem; border-bottom: 0.5px solid var(--color-border-tertiary); margin-bottom: 2rem; }
  .hero h1 { font-size: 28px; font-weight: 500; color: #CA0A7F; margin-bottom: 0.5rem; }
  .hero p { color: var(--color-text-secondary); font-size: 15px; margin-bottom: 1.25rem; }
  .badges { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
  .badge { display: inline-flex; align-items: center; gap: 6px; padding: 5px 14px; border-radius: 999px; font-size: 13px; font-weight: 500; text-decoration: none; border: 0.5px solid var(--color-border-secondary); color: var(--color-text-primary); background: var(--color-background-secondary); }
  .badge.primary { background: #CA0A7F; color: #fff; border-color: #CA0A7F; }
  .section { margin-bottom: 2.5rem; }
  .section h2 { font-size: 18px; font-weight: 500; margin-bottom: 1rem; padding-bottom: 6px; border-bottom: 0.5px solid var(--color-border-tertiary); color: var(--color-text-primary); }
  .section p { font-size: 15px; color: var(--color-text-secondary); line-height: 1.7; }
  .modules { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; }
  .mod-card { background: var(--color-background-primary); border: 0.5px solid var(--color-border-tertiary); border-radius: var(--border-radius-lg); padding: 1rem 1.25rem; }
  .mod-card .mod-icon { font-size: 22px; margin-bottom: 10px; }
  .mod-card h3 { font-size: 15px; font-weight: 500; margin-bottom: 6px; color: var(--color-text-primary); }
  .mod-card ul { list-style: none; padding: 0; }
  .mod-card ul li { font-size: 13px; color: var(--color-text-secondary); padding: 3px 0; display: flex; align-items: flex-start; gap: 6px; line-height: 1.5; }
  .mod-card ul li::before { content: "—"; color: var(--color-border-secondary); flex-shrink: 0; }
  .arch { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; }
  .arch-item { background: var(--color-background-secondary); border-radius: var(--border-radius-md); padding: 0.75rem 1rem; }
  .arch-item .layer { font-size: 11px; color: var(--color-text-tertiary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
  .arch-item .tech { font-size: 14px; font-weight: 500; color: var(--color-text-primary); }
  .repo-link { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; color: #CA0A7F; text-decoration: none; padding: 8px 14px; border: 0.5px solid #CA0A7F44; border-radius: var(--border-radius-md); background: var(--color-background-primary); }
  .repo-link:hover { background: var(--color-background-secondary); }
</style>
<div class="wrap">
  <div class="hero">
    <h1>Khaki Gemstone Platform</h1>
    <p>A full-stack multi-portal system for gemstone trading, investment, and agent-based services</p>
    <div class="badges">
      <a class="badge primary" href="https://khaki-gemstone-37sf.vercel.app/" target="_blank"><i class="ti ti-external-link" aria-hidden="true"></i> Live Site</a>
      <a class="badge primary" href="https://khakigemstone.com" target="_blank"><i class="ti ti-world" aria-hidden="true"></i> Website</a>
      <span class="badge"><i class="ti ti-code" aria-hidden="true"></i> MERN Stack</span>
      <span class="badge" style="color: var(--color-text-success); border-color: var(--color-border-success);"><i class="ti ti-circle-check" aria-hidden="true"></i> Active</span>
    </div>
  </div>

  <div class="section">
    <h2>Overview</h2>
    <p>Khaki Gemstone modernizes the gemstone industry by integrating e-commerce, investment capabilities, and service-based interactions into a single ecosystem. The platform is structured into multiple portals, each serving a specific user type while sharing a unified backend.</p>
  </div>

  <div class="section">
    <h2>Repositories</h2>
    <a class="repo-link" href="https://github.com/FaiziCodeSpace/khaki-gemstone-Backend.git" target="_blank">
      <i class="ti ti-brand-github" aria-hidden="true"></i> khaki-gemstone-Backend
    </a>
  </div>

  <div class="section">
    <h2>Platform modules</h2>
    <div class="modules">
      <div class="mod-card">
        <div class="mod-icon"><i class="ti ti-shopping-bag" style="color:#CA0A7F;" aria-hidden="true"></i></div>
        <h3>Public portal</h3>
        <ul>
          <li>Browse cut stones, rough stones, rings, beads, specimens</li>
          <li>Detailed product pages</li>
          <li>Cart and purchase flow</li>
          <li>Discounts and featured products</li>
        </ul>
      </div>
      <div class="mod-card">
        <div class="mod-icon"><i class="ti ti-chart-line" style="color:#CA0A7F;" aria-hidden="true"></i></div>
        <h3>Investor portal</h3>
        <ul>
          <li>Invest in gemstone inventory</li>
          <li>Track returns and portfolio</li>
          <li>Investment history</li>
          <li>Financial insights dashboard</li>
        </ul>
      </div>
      <div class="mod-card">
        <div class="mod-icon"><i class="ti ti-layout-dashboard" style="color:#CA0A7F;" aria-hidden="true"></i></div>
        <h3>Admin panel</h3>
        <ul>
          <li>Product and category management</li>
          <li>User management</li>
          <li>Order and transaction tracking</li>
          <li>Platform analytics</li>
        </ul>
      </div>
      <div class="mod-card">
        <div class="mod-icon"><i class="ti ti-map-pin" style="color:#CA0A7F;" aria-hidden="true"></i></div>
        <h3>Agent hub</h3>
        <ul>
          <li>Call closest agent feature</li>
          <li>Location-based matching</li>
          <li>Distance and ETA calculation</li>
          <li>Map-based visualization</li>
        </ul>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>System architecture</h2>
    <div class="arch">
      <div class="arch-item"><div class="layer">Frontend</div><div class="tech">React.js</div></div>
      <div class="arch-item"><div class="layer">Backend</div><div class="tech">Node.js + Express</div></div>
      <div class="arch-item"><div class="layer">Database</div><div class="tech">MongoDB + Mongoose</div></div>
      <div class="arch-item"><div class="layer">Auth</div><div class="tech">Role-based JWT</div></div>
    </div>
  </div>
</div>
