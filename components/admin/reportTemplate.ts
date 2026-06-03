/* eslint-disable @typescript-eslint/no-explicit-any */
export function renderReportHTML(data: any) {
  const PLANET_COLORS: Record<string, string> = {
    'Sun': '#DC2626',
    'Moon': '#FFFFFF',
    'Jupiter': '#EAB308',
    'Rahu': '#374151',
    'Mercury': '#16A34A',
    'Venus': '#F3F4F6',
    'Ketu': '#4B5563',
    'Saturn': '#1D4ED8',
    'Mars': '#991B1B'
  };
  const NUMBER_PLANETS: Record<number, string> = {
    1: 'Sun', 2: 'Moon', 3: 'Jupiter', 4: 'Rahu',
    5: 'Mercury', 6: 'Venus', 7: 'Ketu', 8: 'Saturn', 9: 'Mars'
  };
  
  const getColor = (val: number | string) => {
    if (typeof val === 'number') {
      return PLANET_COLORS[NUMBER_PLANETS[val]] || '#C9973A';
    }
    return PLANET_COLORS[val] || '#C9973A';
  }

  const pc = getColor(data.psychicPlanet) || getColor(data.psychicNumber);
  const dc = getColor(data.destinyPlanet) || getColor(data.destinyNumber);
  const nc = data.overallRating;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Numerology Report — ${data.clientName}</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,600&family=DM+Sans:wght@300;400;500&family=Cinzel:wght@400;600&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:#FAF6EE;color:#1C1917;font-family:'DM Sans',sans-serif;font-size:14px;}
  
  /* TOP STRIPE */
  .stripe{height:5px;background:linear-gradient(90deg,#C9973A,#E8A020,#F5C842,#C9973A);}
  
  /* HEADER */
  .header{background:linear-gradient(135deg,#1C1917 0%,#2D2418 100%);padding:40px 56px;display:flex;justify-content:space-between;align-items:flex-start;}
  .header-brand-name{font-family:'Cinzel',serif;font-size:11px;letter-spacing:5px;color:#C9973A;text-transform:uppercase;margin-bottom:6px;}
  .header-by{font-size:12px;color:rgba(250,243,224,.45);}
  .header-contact{font-size:11px;color:rgba(250,243,224,.3);margin-top:3px;line-height:1.6;}
  .header-right{text-align:right;}
  .header-report-title{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:400;color:#FAF3E0;}
  .header-report-sub{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:16px;color:#C9973A;margin-top:3px;}
  .header-date{font-size:11px;color:rgba(250,243,224,.35);margin-top:6px;}
  
  /* CLIENT BANNER */
  .client-banner{background:rgba(201,151,58,.1);border-top:1px solid rgba(201,151,58,.2);border-bottom:1px solid rgba(201,151,58,.2);padding:28px 56px;display:flex;justify-content:space-between;align-items:center;}
  .client-name{font-family:'Cormorant Garamond',serif;font-size:36px;font-weight:400;color:#1C1917;}
  .client-name em{font-style:italic;color:#C9973A;}
  .client-meta{display:flex;gap:32px;}
  .meta-item label{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:rgba(28,25,23,.4);display:block;margin-bottom:3px;}
  .meta-item span{font-family:'Cinzel',serif;font-size:14px;color:#1C1917;}
  
  /* BODY */
  .body{padding:40px 56px;}
  
  /* SECTION TITLES */
  .section-title{font-family:'Cinzel',serif;font-size:10px;letter-spacing:3px;color:#C9973A;text-transform:uppercase;padding-bottom:10px;border-bottom:1px solid rgba(201,151,58,.25);margin-bottom:20px;display:flex;align-items:center;gap:10px;}
  .section-title::after{content:'';flex:1;border-bottom:1px solid rgba(201,151,58,.15);}
  
  /* CORE NUMBERS ROW */
  .numbers-row{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:32px;}
  .num-card{background:#FFFFFF;border:1px solid rgba(201,151,58,.2);border-radius:12px;padding:20px;text-align:center;position:relative;overflow:hidden;}
  .num-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--pc);}
  .num-card-label{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:rgba(28,25,23,.45);margin-bottom:8px;}
  .num-card-number{font-family:'Cinzel',serif;font-size:52px;line-height:1;color:var(--pc);margin-bottom:4px;}
  .num-card-arch{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:16px;color:#1C1917;}
  .num-card-planet{font-size:10px;color:rgba(28,25,23,.45);margin-top:3px;}
  
  /* DOMAIN SCORES */
  .domains-row{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:32px;}
  .domain-card{background:#FFFFFF;border:1px solid rgba(201,151,58,.18);border-radius:10px;padding:16px;text-align:center;}
  .domain-icon{font-size:20px;margin-bottom:6px;}
  .domain-label{font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(28,25,23,.45);margin-bottom:10px;}
  .domain-bar-wrap{background:rgba(28,25,23,.06);border-radius:3px;height:5px;margin-bottom:8px;overflow:hidden;}
  .domain-bar{height:100%;border-radius:3px;}
  .domain-score{font-family:'Cinzel',serif;font-size:22px;}
  .domain-verdict{font-size:10px;color:rgba(28,25,23,.5);margin-top:2px;}
  
  /* SUMMARY BLOCK */
  .summary-block{background:linear-gradient(135deg,#1C1917,#2D2418);border-radius:14px;padding:28px 32px;margin-bottom:28px;}
  .summary-combo{font-family:'Cinzel',serif;font-size:28px;color:#C9973A;margin-bottom:4px;}
  .summary-nature{display:inline-block;font-size:10px;padding:3px 12px;border-radius:20px;background:rgba(201,151,58,.15);color:#C9973A;letter-spacing:1px;margin-bottom:14px;}
  .summary-text{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:18px;color:rgba(250,243,224,.8);line-height:1.85;}
  
  /* INSIGHT BLOCK */
  .insight-block{background:#FFFFFF;border:1px solid rgba(201,151,58,.18);border-radius:12px;padding:24px;margin-bottom:16px;}
  .insight-block-title{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#C9973A;margin-bottom:12px;}
  .insight-block-text{font-size:13px;color:rgba(28,25,23,.75);line-height:1.9;}
  
  /* GIFTS LIST */
  .gifts-list{display:flex;flex-direction:column;gap:14px;margin-bottom:28px;}
  .gift-item{background:#FFFFFF;border:1px solid rgba(201,151,58,.18);border-radius:12px;padding:18px 22px;display:flex;gap:14px;align-items:flex-start;}
  .gift-num{font-family:'Cinzel',serif;font-size:22px;color:#C9973A;width:28px;flex-shrink:0;line-height:1;}
  .gift-title{font-size:14px;font-weight:500;color:#1C1917;margin-bottom:4px;}
  .gift-desc{font-size:13px;color:rgba(28,25,23,.7);line-height:1.75;}
  
  /* CHALLENGES */
  .challenge-item{padding:14px 0;border-bottom:1px solid rgba(201,151,58,.1);}
  .challenge-item:last-child{border-bottom:none;}
  .challenge-label{font-size:12px;font-weight:500;color:#B91C1C;margin-bottom:4px;}
  .remedy-label{font-size:11px;font-weight:500;color:#16A34A;margin-bottom:2px;}
  .remedy-text{font-size:12px;color:rgba(22,163,74,.8);line-height:1.6;}
  
  /* LUCKY ELEMENTS */
  .lucky-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:28px;}
  .lucky-card{background:#FFFFFF;border:1px solid rgba(201,151,58,.18);border-radius:10px;padding:14px;}
  .lucky-card-title{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:rgba(28,25,23,.4);margin-bottom:8px;}
  .lucky-pill{display:inline-block;background:rgba(201,151,58,.08);border:1px solid rgba(201,151,58,.2);border-radius:20px;padding:3px 10px;font-size:11px;color:#C9973A;margin:2px;}
  
  /* ORNAMENT DIVIDER */
  .ornament{text-align:center;color:rgba(201,151,58,.4);font-size:12px;letter-spacing:8px;margin:24px 0;}
  
  /* UMA'S NOTE */
  .uma-section{background:linear-gradient(135deg,#1C1917,#2D2418);border-radius:14px;padding:28px 32px;margin-bottom:28px;}
  .uma-section-label{font-family:'Cinzel',serif;font-size:9px;letter-spacing:3px;color:#C9973A;text-transform:uppercase;margin-bottom:4px;}
  .uma-section-title{font-family:'Cormorant Garamond',serif;font-size:22px;color:#FAF3E0;margin-bottom:14px;}
  .uma-section-text{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:17px;color:rgba(250,243,224,.78);line-height:1.9;}
  .uma-signature{font-family:'Cormorant Garamond',serif;font-size:14px;color:#C9973A;margin-top:16px;}
  
  /* NAME BOX */
  .name-box{background:rgba(201,151,58,.06);border:1px solid rgba(201,151,58,.2);border-radius:10px;padding:16px 20px;margin-bottom:28px;}
  .name-box-title{font-size:10px;letter-spacing:2px;color:#C9973A;text-transform:uppercase;margin-bottom:6px;}
  .name-box-text{font-size:13px;color:rgba(28,25,23,.72);line-height:1.75;}
  .name-series{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;}
  .series-num{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Cinzel',serif;font-size:13px;font-weight:600;}
  
  /* FOOTER */
  .footer{background:#1C1917;padding:24px 56px;display:flex;justify-content:space-between;align-items:center;}
  .footer-brand{font-family:'Cinzel',serif;font-size:10px;letter-spacing:3px;color:#C9973A;}
  .footer-note{font-size:10px;color:rgba(250,243,224,.3);text-align:right;max-width:300px;line-height:1.6;}
  .bottom-stripe{height:4px;background:linear-gradient(90deg,#C9973A,#E8A020,#F5C842,#C9973A);}
  
  @media print{body{background:#fff;} .header,.uma-section,.summary-block,.client-banner{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}
</style>
</head>
<body>

<div class="stripe"></div>

<!-- HEADER -->
<div class="header">
  <div>
    <div class="header-brand-name">NumeraSoul</div>
    <div class="header-by">Uma Rastogi · Certified Numerologist</div>
    <div class="header-contact">Bhopal, Madhya Pradesh<br>uma@numerasoul.com · numerasoul.com</div>
  </div>
  <div class="header-right">
    <div class="header-report-title">Numerology Report</div>
    <div class="header-report-sub">Chaldean System — Personal Analysis</div>
    <div class="header-date">Prepared: ${new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'})}</div>
  </div>
</div>

<!-- CLIENT BANNER -->
<div class="client-banner">
  <div class="client-name">${data.clientName?.split(' ')[0] || ''} <em>${data.clientName?.split(' ').slice(1).join(' ') || ''}</em></div>
  <div class="client-meta">
    <div class="meta-item">
      <label>Psychic Number</label>
      <span style="color:${pc}">${data.psychicNumber || '-'} · ${data.psychicArchetype || '-'}</span>
    </div>
    <div class="meta-item">
      <label>Destiny Number</label>
      <span style="color:${dc}">${data.destinyNumber || '-'} · ${data.destinyArchetype || '-'}</span>
    </div>
    <div class="meta-item">
      <label>Combination</label>
      <span>${data.psychicNumber || '-'}–${data.destinyNumber || '-'} · ${data.combinationNature || '-'}</span>
    </div>
  </div>
</div>

<div class="body">

  <!-- CORE NUMBERS -->
  <div class="section-title">✦ Core Numbers</div>
  <div class="numbers-row">
    <div class="num-card" style="--pc:${pc}">
      <div class="num-card-label">Psychic / Birth Number</div>
      <div class="num-card-number">${data.psychicNumber || '-'}</div>
      <div class="num-card-arch">${data.psychicArchetype || '-'}</div>
      <div class="num-card-planet">${data.psychicPlanet || '-'}</div>
    </div>
    <div class="num-card" style="--pc:${dc}">
      <div class="num-card-label">Destiny / Conductor Number</div>
      <div class="num-card-number">${data.destinyNumber || '-'}</div>
      <div class="num-card-arch">${data.destinyArchetype || '-'}</div>
      <div class="num-card-planet">${data.destinyPlanet || '-'}</div>
    </div>
    <div class="num-card" style="--pc:#C9973A">
      <div class="num-card-label">Service</div>
      <div style="font-family:'Cormorant Garamond',serif;font-size:20px;color:#C9973A;margin:12px 0;font-style:italic">${data.serviceSpecificInsight?.serviceType || 'Consultation'}</div>
      <div style="font-size:11px;color:rgba(28,25,23,.5);line-height:1.5">Prepared personally by Uma Rastogi</div>
    </div>
  </div>

  <!-- THREE DOMAINS -->
  <div class="section-title">✦ Three Life Domains</div>
  <div class="domains-row">
    <div class="domain-card">
      <div class="domain-icon">💚</div>
      <div class="domain-label">Health & Vitality</div>
      <div class="domain-bar-wrap"><div class="domain-bar" style="width:${(nc?.health||6)*10}%;background:#22C55E"></div></div>
      <div class="domain-score" style="color:#22C55E">${nc?.health||6}/10</div>
      <div class="domain-verdict">${(nc?.health||6)>=8?'Strong':nc?.health>=6?'Moderate':'Needs Attention'}</div>
    </div>
    <div class="domain-card">
      <div class="domain-icon">💕</div>
      <div class="domain-label">Relationships</div>
      <div class="domain-bar-wrap"><div class="domain-bar" style="width:${(nc?.relationships||7)*10}%;background:#BE185D"></div></div>
      <div class="domain-score" style="color:#BE185D">${nc?.relationships||7}/10</div>
      <div class="domain-verdict">${(nc?.relationships||7)>=8?'Strong':nc?.relationships>=6?'Moderate':'Needs Attention'}</div>
    </div>
    <div class="domain-card">
      <div class="domain-icon">💰</div>
      <div class="domain-label">Career & Finance</div>
      <div class="domain-bar-wrap"><div class="domain-bar" style="width:${(nc?.career||7)*10}%;background:#C9973A"></div></div>
      <div class="domain-score" style="color:#C9973A">${nc?.career||7}/10</div>
      <div class="domain-verdict">${(nc?.career||7)>=8?'Strong':nc?.career>=6?'Moderate':'Needs Attention'}</div>
    </div>
  </div>

  <!-- COMBINATION SUMMARY -->
  <div class="section-title">✦ DOB Combination Reading</div>
  <div class="summary-block">
    <div class="summary-combo">${data.psychicNumber || '-'} — ${data.destinyNumber || '-'}</div>
    <div class="summary-nature">${data.combinationNature || '-'}</div>
    <div class="summary-text">${data.executiveSummary || '-'}</div>
  </div>
  
  <div class="insight-block" style="margin-bottom:28px">
    <div class="insight-block-title">How These Numbers Work Together</div>
    <div class="insight-block-text">${data.combinationReading || '-'}</div>
  </div>

  <!-- CORE PERSONALITY -->
  <div class="section-title">✦ Core Personality — Psychic ${data.psychicNumber || '-'}</div>
  <div class="insight-block" style="margin-bottom:16px">
    <div class="insight-block-text">${data.corePersonality || '-'}</div>
  </div>
  
  ${data.soulUrgeMeaning ? `
  <div class="insight-block" style="margin-bottom:16px">
    <div class="insight-block-title">Soul Urge (Inner Desires)</div>
    <div class="insight-block-text">${data.soulUrgeMeaning}</div>
  </div>
  ` : ''}
  
  <div class="insight-block" style="margin-bottom:28px">
    <div class="insight-block-title">Life Path — Destiny ${data.destinyNumber || '-'}</div>
    <div class="insight-block-text">${data.lifePathMeaning || '-'}</div>
  </div>

  <!-- NATURAL GIFTS -->
  <div class="section-title">✦ Natural Gifts</div>
  <div class="gifts-list">
    ${(data.naturalGifts || []).map((g: any, i: number) => `
    <div class="gift-item">
      <div class="gift-num">${['◆','◈','◇'][i]||'◆'}</div>
      <div>
        <div class="gift-title">${g.title}</div>
        <div class="gift-desc">${g.description}</div>
      </div>
    </div>`).join('')}
  </div>

  <!-- CHALLENGES -->
  <div class="section-title">✦ Challenges & Growth Areas</div>
  <div class="insight-block" style="margin-bottom:28px">
    ${(data.challengesAndGrowth || []).map((c: any) => `
    <div class="challenge-item">
      <div class="challenge-label">⚠ ${c.challenge}</div>
      <div class="remedy-label">Remedy</div>
      <div class="remedy-text">• ${c.remedy}</div>
    </div>`).join('')}
  </div>

  ${data.timingAndPeriods ? `
  <!-- TIMING & PERIODS -->
  <div class="section-title">✦ Timing & Periods</div>
  <div class="insight-block" style="margin-bottom:28px">
    <div class="insight-block-title">Favorable Periods (Best Time for Decisions)</div>
    <div class="insight-block-text">
      <ul style="padding-left: 20px; margin-top: 8px;">
        ${(data.timingAndPeriods.favorable || []).map((p: string) => `<li style="margin-bottom: 6px;">${p}</li>`).join('')}
      </ul>
    </div>
    
    <div class="insight-block-title" style="margin-top:24px; color:#B91C1C;">Unfavorable Periods (Exercise Caution)</div>
    <div class="insight-block-text">
      <ul style="padding-left: 20px; margin-top: 8px;">
        ${(data.timingAndPeriods.unfavorable || []).map((p: string) => `<li style="margin-bottom: 6px;">${p}</li>`).join('')}
      </ul>
    </div>
  </div>
  ` : ''}

  <!-- SERVICE SPECIFIC -->
  <div class="section-title">✦ ${data.serviceSpecificInsight?.heading || 'Insight'}</div>
  <div class="insight-block" style="margin-bottom:28px">
    <div class="insight-block-text">${data.serviceSpecificInsight?.content || '-'}</div>
  </div>

  <!-- HEALTH -->
  <div class="section-title">✦ Health & Wellbeing</div>
  <div class="insight-block" style="margin-bottom:28px">
    <div class="insight-block-text">${data.healthFocus || '-'}</div>
  </div>

  <!-- LUCKY ELEMENTS -->
  <div class="section-title">✦ Lucky Elements</div>
  <div class="lucky-grid">
    <div class="lucky-card">
      <div class="lucky-card-title">Lucky Days</div>
      ${(data.luckyElements?.days || []).map((d: any)=>`<span class="lucky-pill">${d}</span>`).join('')}
    </div>
    <div class="lucky-card">
      <div class="lucky-card-title">Lucky Colors</div>
      ${(data.luckyElements?.colors || []).map((c: any)=>`<span class="lucky-pill">${c}</span>`).join('')}
    </div>
    <div class="lucky-card" style="grid-column: span 3;">
      <div class="lucky-card-title">Number Compatibility</div>
      ${data.luckyElements?.friends ? `
      <div style="font-size:13px; margin-bottom:10px; margin-top:8px;">
        <span style="color:#16A34A; font-weight:600; min-width:60px; display:inline-block;">Friends:</span> ${data.luckyElements.friends}
      </div>
      <div style="font-size:13px; margin-bottom:10px;">
        <span style="color:#C9973A; font-weight:600; min-width:60px; display:inline-block;">Neutral:</span> ${data.luckyElements.neutral}
      </div>
      <div style="font-size:13px;">
        <span style="color:#B91C1C; font-weight:600; min-width:60px; display:inline-block;">Avoid:</span> ${data.luckyElements.enemies}
      </div>
      ` : `
      ${(data.luckyElements?.compatibleNumbers || []).map((n: any)=>`<span class="lucky-pill" style="color:${getColor(n)};border-color:${getColor(n)}40">Number ${n}</span>`).join('')}
      `}
    </div>
  </div>

  ${data.nameAssessment ? `
  <!-- NAME ASSESSMENT -->
  <div class="section-title">✦ Name Number Assessment</div>
  <div class="name-box">
    <div class="name-box-title">Chaldean Name Analysis</div>
    <div class="name-box-text">${data.nameAssessment}</div>
    ${data.recommendedNameSeries?.length ? `
    <div class="name-box-title" style="margin-top:12px">Recommended Name Series</div>
    <div class="name-series">
      ${data.recommendedNameSeries.map((n: any)=>`
      <div class="series-num" style="background:${getColor(n)}18;border:1.5px solid ${getColor(n)}50;color:${getColor(n)}">${n}</div>`).join('')}
    </div>` : ''}
  </div>` : ''}

  <div class="ornament">✦ &nbsp; ✦ &nbsp; ✦</div>

  <!-- UMA'S PERSONAL NOTE -->
  <div class="uma-section">
    <div class="uma-section-label">Personal Note</div>
    <div class="uma-section-title">Uma's Insight for ${data.clientName?.split(' ')[0] || ''}</div>
    <div class="uma-section-text">"${data.umaPersonalInsight || ''}"</div>
    <div class="uma-signature">— Uma Rastogi, NumeraSoul ✦</div>
  </div>

  <div style="background:rgba(201,151,58,.06);border:1px solid rgba(201,151,58,.15);border-radius:10px;padding:16px 20px;">
    <div style="font-size:10px;letter-spacing:2px;color:#C9973A;text-transform:uppercase;margin-bottom:6px">Note</div>
    <div style="font-size:12px;color:rgba(28,25,23,.55);line-height:1.75">This report is prepared using the Chaldean numerology system and reflects Uma Rastogi's personal analysis of your numbers. For a deeper follow-up or to ask specific questions, book a consultation at numerasoul.com</div>
  </div>

</div>

<!-- FOOTER -->
<div class="footer">
  <div>
    <div class="footer-brand">NUMERASOUL</div>
    <div style="font-size:10px;color:rgba(250,243,224,.3);margin-top:3px">by Uma Rastogi · Bhopal, Madhya Pradesh</div>
  </div>
  <div class="footer-note">This report is confidential and prepared exclusively for ${data.clientName || 'the client'}. © ${new Date().getFullYear()} NumeraSoul by Uma Rastogi.</div>
</div>
<div class="bottom-stripe"></div>

</body></html>`;
}
