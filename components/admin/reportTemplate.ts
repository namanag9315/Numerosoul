/* eslint-disable @typescript-eslint/no-explicit-any */
export function renderReportHTML(data: any) {
  data = data || {};

  const escapeHtml = (value: any) =>
    String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const cleanText = (value: any) => String(value ?? '').replace(/\s+/g, ' ').trim();
  const hasText = (value: any) => cleanText(value).length > 0 && cleanText(value) !== '-';
  const text = (value: any, fallback = '-') => escapeHtml(hasText(value) ? cleanText(value) : fallback);
  const textBlock = (value: any, fallback = '-') => escapeHtml(hasText(value) ? String(value).trim() : fallback);
  const textArray = (value: any) =>
    (Array.isArray(value) ? value : [])
      .map((item) => cleanText(item))
      .filter(Boolean);

  const PLANET_COLORS: Record<string, string> = {
    'Sun': '#DC2626',
    'Moon': '#64748B',
    'Jupiter': '#CA8A04',
    'Rahu': '#475569',
    'Mercury': '#15803D',
    'Venus': '#BE185D',
    'Ketu': '#6B7280',
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
    const match = Object.keys(PLANET_COLORS).find((planet) => String(val).includes(planet));
    return match ? PLANET_COLORS[match] : '#C9973A';
  };

  const pc = hasText(data.psychicPlanet) ? getColor(data.psychicPlanet) : getColor(Number(data.psychicNumber));
  const dc = hasText(data.destinyPlanet) ? getColor(data.destinyPlanet) : getColor(Number(data.destinyNumber));
  const domains = data.domainDescriptions;
  const clientNameRaw = cleanText(data.clientName || data.name || 'Client');
  const [clientFirstName, ...clientLastNameParts] = clientNameRaw.split(' ');
  const clientLastName = clientLastNameParts.join(' ');
  const serviceType = data.serviceSpecificInsight?.serviceType || data.serviceName || data.service || 'Numerology Consultation';
  const favorablePeriods = textArray(data.timingAndPeriods?.favorable);
  const unfavorablePeriods = textArray(data.timingAndPeriods?.unfavorable);
  const luckyColors = textArray(data.luckyElements?.colors);
  const naturalGifts = (Array.isArray(data.naturalGifts) ? data.naturalGifts : [])
    .filter((gift: any) => hasText(gift?.title) || hasText(gift?.description));
  const challengesAndGrowth = (Array.isArray(data.challengesAndGrowth) ? data.challengesAndGrowth : [])
    .filter((challenge: any) => hasText(challenge?.challenge) || hasText(challenge?.remedy));
  const recommendedNameSeries = (Array.isArray(data.recommendedNameSeries) ? data.recommendedNameSeries : [])
    .filter((number: any) => number !== null && number !== undefined && String(number).trim() !== '');

  let loshuGridHtml = '';
  if (data.loShuGrid && data.loShuGrid.grid) {
    const grid = data.loShuGrid.grid;
    const stdNums = [[4, 9, 2], [3, 5, 7], [8, 1, 6]];
    let gridCellsHtml = '';
    
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const repeats = grid[r][c];
        const num = stdNums[r][c];
        if (repeats > 0) {
          gridCellsHtml += `<div class="loshu-cell present"><div class="loshu-cell-num">${num}</div><div class="loshu-cell-repeats">${repeats}x</div></div>`;
        } else {
          gridCellsHtml += `<div class="loshu-cell missing"><div class="loshu-cell-num">${num}</div></div>`;
        }
      }
    }
    
    const activePlanes = (data.loShuGrid.planes || []).filter((p: any) => p.status === 'complete' || p.status === 'partial');
    let planesHtml = '';
    if (activePlanes.length > 0) {
      planesHtml = activePlanes.map((p: any) => 
        `<div class="loshu-plane">
          <div class="loshu-plane-name">${text(p.name)} (${text(p.status)})</div>
          <div class="loshu-plane-desc">${textBlock(p.description)}</div>
        </div>`
      ).join('');
    } else {
      planesHtml = `<div class="loshu-plane-desc" style="font-style:italic">No dominant planes found.</div>`;
    }

    loshuGridHtml = `
    <section class="report-section keep-together">
      <div class="section-title">✦ Lo Shu Grid Analysis</div>
      <div class="loshu-container">
        <div class="loshu-grid-wrapper">
          ${gridCellsHtml}
        </div>
        <div class="loshu-info">
          <div class="loshu-info-title">Active Planes & Traits</div>
          ${planesHtml}
        </div>
      </div>
    </section>`;
  }
  
  let loshuRemediesHtml = '';
  const missingRemedies = (Array.isArray(data.loShuMissingRemedies) ? data.loShuMissingRemedies : [])
    .filter((rem: any) => hasText(rem?.impact) || hasText(rem?.remedy));
  if (missingRemedies.length > 0) {
    const remItems = missingRemedies.map((rem: any) => `
      <div class="challenge-item">
        <div class="challenge-label">Missing Number ${text(rem.number)}: ${text(rem.impact)}</div>
        <div class="remedy-label">Recommended Remedy</div>
        <div class="remedy-text">${textBlock(rem.remedy)}</div>
      </div>
    `).join('');
    
    loshuRemediesHtml = `
      <div class="insight-block" style="margin-bottom:32px; padding-top:8px;">
        <div class="insight-block-title" style="margin-top:16px;">Missing Numbers & Remedies</div>
        ${remItems}
      </div>
    `;
  }

  const naturalGiftsHtml = naturalGifts.length > 0 ? `
  <div class="section-title">✦ Natural Gifts</div>
  <div class="gifts-list">
    ${naturalGifts.map((g: any, i: number) => `
    <div class="gift-item">
      <div class="gift-num">${['◆','◈','◇'][i] || '◆'}</div>
      <div>
        <div class="gift-title">${text(g.title, 'Natural Gift')}</div>
        <div class="gift-desc">${textBlock(g.description)}</div>
      </div>
    </div>`).join('')}
  </div>
  ` : '';

  const challengesHtml = challengesAndGrowth.length > 0 ? `
  <div class="section-title">✦ Challenges & Growth Areas</div>
  <div class="insight-block" style="margin-bottom:24px">
    ${challengesAndGrowth.map((c: any) => `
    <div class="challenge-item">
      <div class="challenge-label">⚠ ${text(c.challenge, 'Growth Area')}</div>
      <div class="remedy-label">Remedy</div>
      <div class="remedy-text" style="white-space:pre-wrap;">• ${textBlock(c.remedy)}</div>
    </div>`).join('')}
  </div>
  ` : '';

  const tensionHtml = hasText(data.psychicDestinyTension) ? `
  <div class="section-title">✦ Psychic–Destiny Number Tension</div>
  <div class="insight-block">
    <div class="insight-block-text">${textBlock(data.psychicDestinyTension)}</div>
  </div>
  ` : '';

  const timingHtml = favorablePeriods.length > 0 || unfavorablePeriods.length > 0 ? `
  <section class="report-section">
    <div class="section-title">✦ Timing & Periods</div>
    <div class="timing-grid">
      ${favorablePeriods.length > 0 ? `
      <div class="timing-card">
        <div class="insight-block-title">Favorable Periods (Best Time for Decisions)</div>
        <ul>
          ${favorablePeriods.map((p: string) => `<li>${text(p)}</li>`).join('')}
        </ul>
      </div>` : ''}
      ${unfavorablePeriods.length > 0 ? `
      <div class="timing-card">
        <div class="insight-block-title" style="color:#B91C1C;">Unfavorable Periods (Exercise Caution)</div>
        <ul>
          ${unfavorablePeriods.map((p: string) => `<li>${text(p)}</li>`).join('')}
        </ul>
      </div>` : ''}
    </div>
  </section>
  ` : '';

  const nameAssessmentHtml = hasText(data.nameAssessment) ? `
  <section class="report-section keep-together">
    <div class="section-title">✦ Name Number Assessment</div>
    <div class="name-box">
      <div class="name-box-title">Chaldean Name Analysis</div>
      <div class="name-box-text" style="white-space:pre-wrap;">${textBlock(data.nameAssessment)}</div>
      ${recommendedNameSeries.length ? `
      <div class="name-box-title" style="margin-top:12px">Recommended Name Series</div>
      <div class="name-series">
        ${recommendedNameSeries.map((n: any)=>`
        <div class="series-num" style="background:${getColor(Number(n))}18;border:1.5px solid ${getColor(Number(n))}70;color:${getColor(Number(n))}">${text(n)}</div>`).join('')}
      </div>` : ''}
    </div>
  </section>
  ` : '';

  const generalLifeGuidanceHtml = hasText(data.generalLifeGuidance) ? `
  <div class="section-title">✦ General Life Guidance</div>
  <div class="insight-block">
    <div class="insight-block-text" style="white-space:pre-wrap;">${textBlock(data.generalLifeGuidance)}</div>
  </div>
  ` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Numerology Report — ${text(clientNameRaw, 'Client')}</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,600&family=DM+Sans:wght@300;400;500&family=Cinzel:wght@400;600&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  html{background:#ECE7DD;}
  body{background:#FAF6EE;color:#292524;font-family:'DM Sans',Arial,sans-serif;font-size:13px;line-height:1.65;}
  
  /* TOP STRIPE */
  .stripe{height:5px;background:linear-gradient(90deg,#C9973A,#E8A020,#F5C842,#C9973A);}
  
  /* HEADER */
  .header{background:linear-gradient(135deg,#1C1917 0%,#2D2418 100%);padding:32px 52px;display:flex;justify-content:space-between;align-items:flex-start;break-inside:avoid;page-break-inside:avoid;}
  .header-brand-name{font-family:'Cinzel',serif;font-size:11px;letter-spacing:4px;color:#C9973A;text-transform:uppercase;margin-bottom:6px;}
  .header-by{font-size:12px;color:rgba(250,243,224,.45);}
  .header-contact{font-size:11px;color:rgba(250,243,224,.3);margin-top:3px;line-height:1.6;}
  .header-right{text-align:right;}
  .header-report-title{font-family:'Cormorant Garamond',serif;font-size:30px;font-weight:500;color:#FAF3E0;}
  .header-report-sub{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:16px;color:#C9973A;margin-top:3px;}
  .header-date{font-size:11px;color:rgba(250,243,224,.35);margin-top:6px;}
  
  /* CLIENT BANNER */
  .client-banner{background:rgba(201,151,58,.1);border-top:1px solid rgba(201,151,58,.2);border-bottom:1px solid rgba(201,151,58,.2);padding:22px 52px;display:flex;justify-content:space-between;align-items:center;gap:24px;break-inside:avoid;page-break-inside:avoid;}
  .client-name{font-family:'Cormorant Garamond',serif;font-size:34px;font-weight:500;color:#1C1917;line-height:1;}
  .client-name em{font-style:italic;color:#C9973A;}
  .client-meta{display:flex;gap:26px;align-items:flex-start;}
  .meta-item label{font-size:9px;letter-spacing:1.6px;text-transform:uppercase;color:rgba(28,25,23,.48);display:block;margin-bottom:3px;}
  .meta-item span{font-family:'Cinzel',serif;font-size:14px;color:#1C1917;}
  
  /* BODY */
  .body{padding:30px 52px 34px;}
  
  /* SECTION TITLES */
  .section-title{font-family:'Cinzel',serif;font-size:10px;letter-spacing:2.6px;color:#C9973A;text-transform:uppercase;padding-bottom:8px;border-bottom:1px solid rgba(201,151,58,.25);margin:22px 0 14px;display:flex;align-items:center;gap:10px;break-after:avoid;page-break-after:avoid;}
  .section-title::after{content:'';flex:1;border-bottom:1px solid rgba(201,151,58,.15);}
  .body > .section-title:first-child{margin-top:0;}
  .report-section{margin-bottom:26px;}
  .keep-together{break-inside:avoid;page-break-inside:avoid;}
  
  /* CORE NUMBERS ROW */
  .numbers-row{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:26px;}
  .num-card{background:#FFFFFF;border:1px solid rgba(201,151,58,.2);border-radius:10px;padding:18px;text-align:center;position:relative;overflow:hidden;break-inside:avoid;page-break-inside:avoid;}
  .num-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--pc);}
  .num-card-label{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:rgba(28,25,23,.45);margin-bottom:8px;}
  .num-card-number{font-family:'Cinzel',serif;font-size:50px;line-height:1;color:var(--pc);margin-bottom:4px;}
  .num-card-arch{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:16px;color:#1C1917;}
  .num-card-planet{font-size:10px;color:rgba(28,25,23,.45);margin-top:3px;}
  
  /* DOMAIN SCORES */
  .domains-row{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:26px;}
  .domain-card{background:#FFFFFF;border:1px solid rgba(201,151,58,.18);border-radius:9px;padding:15px;text-align:center;break-inside:avoid;page-break-inside:avoid;}
  .domain-icon{font-size:20px;margin-bottom:6px;}
  .domain-label{font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(28,25,23,.45);margin-bottom:10px;}
  .domain-bar-wrap{background:rgba(28,25,23,.06);border-radius:3px;height:5px;margin-bottom:8px;overflow:hidden;}
  .domain-bar{height:100%;border-radius:3px;}
  .domain-score{font-family:'Cinzel',serif;font-size:22px;}
  .domain-verdict{font-size:10px;color:rgba(28,25,23,.5);margin-top:2px;}
  
  /* SUMMARY BLOCK */
  .summary-block{background:linear-gradient(135deg,#1C1917,#2D2418);border-radius:12px;padding:24px 28px;margin-bottom:22px;break-inside:avoid;page-break-inside:avoid;}
  .summary-combo{font-family:'Cinzel',serif;font-size:28px;color:#C9973A;margin-bottom:4px;}
  .summary-nature{display:inline-block;font-size:10px;padding:3px 12px;border-radius:20px;background:rgba(201,151,58,.15);color:#C9973A;letter-spacing:1px;margin-bottom:14px;}
  .summary-text{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:18px;color:rgba(250,243,224,.8);line-height:1.85;}
  
  /* INSIGHT BLOCK */
  .insight-block{background:#FFFFFF;border:1px solid rgba(201,151,58,.18);border-radius:10px;padding:20px 22px;margin-bottom:14px;break-inside:avoid;page-break-inside:avoid;}
  .insight-block-title{font-size:10px;letter-spacing:1.8px;text-transform:uppercase;color:#C9973A;margin-bottom:10px;}
  .insight-block-text{font-size:13px;color:rgba(28,25,23,.78);line-height:1.75;white-space:pre-wrap;}
  
  /* GIFTS LIST */
  .gifts-list{display:flex;flex-direction:column;gap:12px;margin-bottom:22px;}
  .gift-item{background:#FFFFFF;border:1px solid rgba(201,151,58,.18);border-radius:10px;padding:16px 20px;display:flex;gap:14px;align-items:flex-start;break-inside:avoid;page-break-inside:avoid;}
  .gift-num{font-family:'Cinzel',serif;font-size:22px;color:#C9973A;width:28px;flex-shrink:0;line-height:1;}
  .gift-title{font-size:14px;font-weight:500;color:#1C1917;margin-bottom:4px;}
  .gift-desc{font-size:13px;color:rgba(28,25,23,.72);line-height:1.65;}
  
  /* CHALLENGES */
  .challenge-item{padding:12px 0;border-bottom:1px solid rgba(201,151,58,.1);break-inside:avoid;page-break-inside:avoid;}
  .challenge-item:last-child{border-bottom:none;}
  .challenge-label{font-size:12px;font-weight:500;color:#B91C1C;margin-bottom:4px;}
  .remedy-label{font-size:11px;font-weight:500;color:#16A34A;margin-bottom:2px;}
  .remedy-text{font-size:12px;color:rgba(22,163,74,.8);line-height:1.6;}
  
  /* LUCKY ELEMENTS */
  .lucky-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px;}
  .lucky-card{background:#FFFFFF;border:1px solid rgba(201,151,58,.18);border-radius:10px;padding:14px;break-inside:avoid;page-break-inside:avoid;}
  .lucky-card-title{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:rgba(28,25,23,.4);margin-bottom:8px;}
  .lucky-pill{display:inline-block;background:rgba(201,151,58,.08);border:1px solid rgba(201,151,58,.2);border-radius:20px;padding:3px 10px;font-size:11px;color:#C9973A;margin:2px;}
  
  /* ORNAMENT DIVIDER */
  .ornament{text-align:center;color:rgba(201,151,58,.4);font-size:12px;letter-spacing:8px;margin:22px 0;}
  
  /* UMA'S NOTE */
  .uma-section{background:linear-gradient(135deg,#1C1917,#2D2418);border-radius:12px;padding:26px 30px;margin-bottom:24px;break-inside:avoid;page-break-inside:avoid;}
  .uma-section-label{font-family:'Cinzel',serif;font-size:9px;letter-spacing:3px;color:#C9973A;text-transform:uppercase;margin-bottom:4px;}
  .uma-section-title{font-family:'Cormorant Garamond',serif;font-size:22px;color:#FAF3E0;margin-bottom:14px;}
  .uma-section-text{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:17px;color:rgba(250,243,224,.78);line-height:1.9;}
  .uma-signature{font-family:'Cormorant Garamond',serif;font-size:14px;color:#C9973A;margin-top:16px;}
  
  /* NAME BOX */
  .name-box{background:rgba(201,151,58,.06);border:1px solid rgba(201,151,58,.2);border-radius:10px;padding:16px 20px;margin-bottom:24px;break-inside:avoid;page-break-inside:avoid;}
  .name-box-title{font-size:10px;letter-spacing:1.8px;color:#C9973A;text-transform:uppercase;margin-bottom:6px;}
  .name-box-text{font-size:13px;color:rgba(28,25,23,.74);line-height:1.65;}
  .name-series{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;}
  .series-num{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Cinzel',serif;font-size:13px;font-weight:700;}
  
  /* LO SHU GRID */
  .loshu-container{display:flex;gap:22px;background:#FFFFFF;border:1px solid rgba(201,151,58,.18);border-radius:10px;padding:20px;align-items:stretch;break-inside:avoid;page-break-inside:avoid;}
  .loshu-grid-wrapper{flex-shrink:0;display:grid;grid-template-columns:repeat(3,1fr);gap:6px;width:140px;height:140px;}
  .loshu-cell{background:#FFFFFF;border:1px solid rgba(28,25,23,.08);border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;}
  .loshu-cell.present{background:rgba(201,151,58,.12);border-color:#E8A020;color:#D4700A;}
  .loshu-cell.missing{color:rgba(28,25,23,.2);}
  .loshu-cell-num{font-family:'Cinzel',serif;font-size:22px;font-weight:700;line-height:1;}
  .loshu-cell-repeats{font-size:9px;text-transform:uppercase;letter-spacing:1px;font-weight:700;margin-top:4px;}
  .loshu-info{flex:1;display:flex;flex-direction:column;justify-content:center;}
  .loshu-info-title{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#C9973A;margin-bottom:12px;border-bottom:1px solid rgba(201,151,58,.15);padding-bottom:8px;}
  .loshu-plane{margin-bottom:10px;}
  .loshu-plane:last-child{margin-bottom:0;}
  .loshu-plane-name{font-size:11px;font-weight:700;color:#1C1917;text-transform:uppercase;letter-spacing:1px;margin-bottom:3px;}
  .loshu-plane-desc{font-size:12px;color:rgba(28,25,23,.75);line-height:1.5;}
  
  /* TIMING */
  .timing-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:24px;}
  .timing-card{background:#FFFFFF;border:1px solid rgba(201,151,58,.18);border-radius:10px;padding:18px 20px;break-inside:avoid;page-break-inside:avoid;}
  .timing-card ul{padding-left:18px;margin-top:8px;}
  .timing-card li{margin-bottom:7px;line-height:1.55;}
  .timing-card li:last-child{margin-bottom:0;}

  .footer{background:#1C1917;padding:22px 52px;display:flex;justify-content:space-between;align-items:center;break-inside:avoid;page-break-inside:avoid;}
  .footer-brand{font-family:'Cinzel',serif;font-size:10px;letter-spacing:3px;color:#C9973A;}
  .footer-note{font-size:10px;color:rgba(250,243,224,.3);text-align:right;max-width:300px;line-height:1.6;}
  .bottom-stripe{height:4px;background:linear-gradient(90deg,#C9973A,#E8A020,#F5C842,#C9973A);}
  
  @media print {
    @page { margin: 0 !important; size: A4; }
    html, body { background: #fff; margin: 0; padding: 0; }
    .header,.uma-section,.summary-block,.client-banner {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .keep-together,.report-section,.num-card,.domain-card,.summary-block,.insight-block,.gift-item,.challenge-item,.lucky-card,.name-box,.loshu-container,.timing-card,.uma-section,.footer {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  }
  @page { margin: 0 !important; }
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
  <div class="client-name">${text(clientFirstName, 'Client')} <em>${text(clientLastName, '')}</em></div>
  <div class="client-meta">
    <div class="meta-item">
      <label>Psychic Number</label>
      <span style="color:${pc}">${text(data.psychicNumber)} · ${text(data.psychicArchetype)}</span>
    </div>
    <div class="meta-item">
      <label>Destiny Number</label>
      <span style="color:${dc}">${text(data.destinyNumber)} · ${text(data.destinyArchetype)}</span>
    </div>
    <div class="meta-item">
      <label>Combination</label>
      <span>${text(data.psychicNumber)}–${text(data.destinyNumber)} · ${text(data.combinationNature)}</span>
    </div>
  </div>
</div>

<div class="body">

  <!-- CORE NUMBERS -->
  <div class="section-title">✦ Core Numbers</div>
  <div class="numbers-row">
    <div class="num-card" style="--pc:${pc}">
      <div class="num-card-label">Psychic / Birth Number</div>
      <div class="num-card-number">${text(data.psychicNumber)}</div>
      <div class="num-card-arch">${text(data.psychicArchetype)}</div>
      <div class="num-card-planet">${text(data.psychicPlanet)}</div>
    </div>
    <div class="num-card" style="--pc:${dc}">
      <div class="num-card-label">Destiny / Conductor Number</div>
      <div class="num-card-number">${text(data.destinyNumber)}</div>
      <div class="num-card-arch">${text(data.destinyArchetype)}</div>
      <div class="num-card-planet">${text(data.destinyPlanet)}</div>
    </div>
    <div class="num-card" style="--pc:#C9973A">
      <div class="num-card-label">Service</div>
      <div style="font-family:'Cormorant Garamond',serif;font-size:20px;color:#C9973A;margin:12px 0;font-style:italic">${text(serviceType, 'Consultation')}</div>
      <div style="font-size:11px;color:rgba(28,25,23,.5);line-height:1.5">Prepared personally by Uma Rastogi</div>
    </div>
  </div>

  <!-- THREE DOMAINS -->
  <div class="section-title">✦ Three Life Domains</div>
  <div class="domains-row">
    <div class="domain-card" style="text-align:left;">
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
        <div class="domain-icon" style="margin:0;">💚</div>
        <div class="domain-label" style="margin:0;">Health & Vitality</div>
      </div>
      <div style="font-size:13px; color:rgba(28,25,23,.75); line-height:1.6; white-space:pre-wrap;">${textBlock(domains?.health)}</div>
    </div>
    <div class="domain-card" style="text-align:left;">
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
        <div class="domain-icon" style="margin:0;">💕</div>
        <div class="domain-label" style="margin:0;">Relationships</div>
      </div>
      <div style="font-size:13px; color:rgba(28,25,23,.75); line-height:1.6; white-space:pre-wrap;">${textBlock(domains?.relationships)}</div>
    </div>
    <div class="domain-card" style="text-align:left;">
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
        <div class="domain-icon" style="margin:0;">💰</div>
        <div class="domain-label" style="margin:0;">Career & Finance</div>
      </div>
      <div style="font-size:13px; color:rgba(28,25,23,.75); line-height:1.6; white-space:pre-wrap;">${textBlock(domains?.career)}</div>
    </div>
  </div>

  <!-- COMBINATION SUMMARY -->
  ${loshuGridHtml}
  ${loshuRemediesHtml}

  <div class="section-title">✦ DOB Combination Reading</div>
  <div class="summary-block">
    <div class="summary-combo">${text(data.psychicNumber)} — ${text(data.destinyNumber)}</div>
    <div class="summary-nature">${text(data.combinationNature)}</div>
    <div class="summary-text">${textBlock(data.executiveSummary)}</div>
  </div>
  
  <div class="insight-block">
    <div class="insight-block-title">How These Numbers Work Together</div>
    <div class="insight-block-text">${textBlock(data.combinationReading)}</div>
  </div>

  <!-- CORE PERSONALITY -->
  <div class="section-title">✦ Core Personality — Psychic ${text(data.psychicNumber)}</div>
  <div class="insight-block">
    <div class="insight-block-text">${textBlock(data.corePersonality)}</div>
  </div>
  
  ${hasText(data.soulUrgeMeaning) ? `
  <div class="insight-block">
    <div class="insight-block-title">Soul Urge (Inner Desires)</div>
    <div class="insight-block-text">${textBlock(data.soulUrgeMeaning)}</div>
  </div>
  ` : ''}
  
  <div class="insight-block">
    <div class="insight-block-title">Life Path — Destiny ${text(data.destinyNumber)}</div>
    <div class="insight-block-text">${textBlock(data.lifePathMeaning)}</div>
  </div>

  ${naturalGiftsHtml}
  ${challengesHtml}
  ${tensionHtml}
  ${timingHtml}

  <!-- CAREER GUIDANCE -->
  <div class="section-title">✦ Career Guidance</div>
  <div class="insight-block">
    <div class="insight-block-text">${textBlock(data.careerGuidance)}</div>
  </div>

  <!-- HEALTH -->
  <div class="section-title">✦ Health & Wellbeing</div>
  <div class="insight-block">
    <div class="insight-block-text">${textBlock(data.healthFocus)}</div>
  </div>

  <!-- LUCKY ELEMENTS -->
  <div class="section-title">✦ Lucky Elements</div>
  <div class="lucky-grid" style="grid-template-columns: repeat(2, 1fr);">
    <div class="lucky-card">
      <div class="lucky-card-title">Lucky Colors</div>
      ${luckyColors.length ? luckyColors.map((c: any)=>`<span class="lucky-pill">${text(c)}</span>`).join('') : '<span class="lucky-pill">Consult Uma for color guidance</span>'}
    </div>
    <div class="lucky-card">
      <div class="lucky-card-title">Number Compatibility</div>
      ${hasText(data.luckyElements?.friends) ? `
      <div style="font-size:13px; margin-bottom:10px; margin-top:8px;">
        <span style="color:#16A34A; font-weight:600; min-width:60px; display:inline-block;">Friends:</span> ${text(data.luckyElements.friends)}
      </div>
      <div style="font-size:13px; margin-bottom:10px;">
        <span style="color:#C9973A; font-weight:600; min-width:60px; display:inline-block;">Neutral:</span> ${text(data.luckyElements.neutral)}
      </div>
      <div style="font-size:13px;">
        <span style="color:#B91C1C; font-weight:600; min-width:60px; display:inline-block;">Avoid:</span> ${text(data.luckyElements.enemies)}
      </div>
      ` : `
      ${(data.luckyElements?.compatibleNumbers || []).map((n: any)=>`<span class="lucky-pill" style="color:${getColor(Number(n))};border-color:${getColor(Number(n))}40">Number ${text(n)}</span>`).join('')}
      `}
    </div>
  </div>

  ${nameAssessmentHtml}
  ${generalLifeGuidanceHtml}

  <div class="ornament">✦ &nbsp; ✦ &nbsp; ✦</div>

  <!-- UMA'S PERSONAL NOTE -->
  <div class="uma-section">
    <div class="uma-section-label">Personal Note</div>
    <div class="uma-section-title">Uma's Insight for ${text(clientFirstName, 'the client')}</div>
    <div class="uma-section-text">"${textBlock(data.umaPersonalInsight, 'Your numbers show a unique pattern of strengths and growth areas. Use this report as a focused guide, and revisit it before important decisions.')}"</div>
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
  <div class="footer-note">This report is confidential and prepared exclusively for ${text(clientNameRaw, 'the client')}. © ${new Date().getFullYear()} NumeraSoul by Uma Rastogi.</div>
</div>
<div class="bottom-stripe"></div>

</body></html>`;
}
