/* ============================================
   GARIMA SINGHAL PORTFOLIO v4 SCRIPTS
   ============================================ */

// ── Theme ──
const html = document.documentElement;
html.setAttribute('data-theme', localStorage.getItem('gs-theme') || 'light');
document.getElementById('themeToggle').addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', next);
  localStorage.setItem('gs-theme', next);
});

// ── Nav ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 20));
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

// ── Scroll Reveal ──
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const siblings = [...e.target.parentElement.querySelectorAll('[data-reveal]:not(.in)')];
    const idx = Math.max(siblings.indexOf(e.target), 0);
    setTimeout(() => e.target.classList.add('in'), idx * 90);
    ro.unobserve(e.target);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -28px 0px' });
document.querySelectorAll('[data-reveal]').forEach(el => ro.observe(el));

window.addEventListener('load', () => {
  document.querySelectorAll('.hero [data-reveal]').forEach((el, i) => {
    setTimeout(() => el.classList.add('in'), 120 + i * 130);
  });
});

// ── Typewriter ──
const words = ['Biomedical Engineer', 'AI Researcher', 'Medical Imaging Specialist', 'PhD Aspirant'];
let wi = 0, ci = 0, del = false;
const tw = document.getElementById('typewriter');
function type() {
  const w = words[wi];
  if (!del) { tw.textContent = w.slice(0, ++ci); if (ci === w.length) { del = true; setTimeout(type, 1800); return; } }
  else { tw.textContent = w.slice(0, --ci); if (ci === 0) { del = false; wi = (wi + 1) % words.length; } }
  setTimeout(type, del ? 58 : 92);
}
type();

// ── Neural Canvas ──
(function () {
  const canvas = document.getElementById('neuralCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let nodes = [];
  function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
  function makeNodes() {
    const n = Math.min(Math.floor((innerWidth * innerHeight) / 20000), 55);
    nodes = Array.from({ length: n }, () => ({
      x: Math.random() * innerWidth, y: Math.random() * innerHeight,
      vx: (Math.random() - .5) * .42, vy: (Math.random() - .5) * .42,
      r: Math.random() * 2 + .8, p: Math.random() * Math.PI * 2,
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const dark = html.getAttribute('data-theme') === 'dark';
    const c = dark ? '74,144,217' : '43,108,176';
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy; n.p += .018;
      if (n.x < 0 || n.x > innerWidth) n.vx *= -1;
      if (n.y < 0 || n.y > innerHeight) n.vy *= -1;
    });
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 165) {
          ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(${c},${(1 - d / 165) * (dark ? .3 : .18)})`; ctx.lineWidth = .8; ctx.stroke();
        }
      }
    }
    nodes.forEach(n => {
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r + Math.sin(n.p) * .5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${c},${dark ? .5 : .4})`; ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  resize(); makeNodes(); draw();
  window.addEventListener('resize', () => { resize(); makeNodes(); });
})();

// ── Research cards expand ──
document.querySelectorAll('.ri-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const body = btn.closest('.ri-card').querySelector('.ri-body');
    const open = body.classList.contains('open');
    document.querySelectorAll('.ri-body').forEach(b => b.classList.remove('open'));
    document.querySelectorAll('.ri-toggle').forEach(b => { b.classList.remove('open'); b.innerHTML = 'Read more <span>↓</span>'; });
    if (!open) { body.classList.add('open'); btn.classList.add('open'); btn.innerHTML = 'Show less <span>↓</span>'; }
  });
});

// ── Project Filter ──
document.querySelectorAll('.fb').forEach(fb => {
  fb.addEventListener('click', () => {
    document.querySelectorAll('.fb').forEach(b => b.classList.remove('active'));
    fb.classList.add('active');
    const f = fb.dataset.f;
    document.querySelectorAll('.pcard').forEach(c => {
      const show = f === 'all' || (c.dataset.cat || '').includes(f);
      c.classList.toggle('hide', !show);
      if (show) {
        c.style.opacity = '0'; c.style.transform = 'translateY(14px)';
        requestAnimationFrame(() => { c.style.transition = 'opacity .4s, transform .4s'; c.style.opacity = '1'; c.style.transform = 'translateY(0)'; });
      }
    });
  });
});

// ── Project Modal ──
const modalData = {
  portal: {
    inst: 'Institute of Liver and Biliary Sciences · Feb 2025 – Present',
    title: 'Multimodal Deep Learning for Non-invasive Portal Hypertension Estimation',
    status: '🟢 Ongoing',
    body: `<p>Portal hypertension is a critical complication of chronic liver disease. The gold standard HVPG measurement is invasive, costly, and carries procedural risks. This project builds a non-invasive AI alternative.</p>
    <ul>
      <li>Extracting 3D radiomic features from volumetric CT scans: shape descriptors, texture features, and intensity statistics</li>
      <li>Integrating CT features with routine laboratory parameters using multimodal deep learning fusion</li>
      <li>Predicting HVPG values non-invasively to reduce reliance on hepatic venous catheterization</li>
      <li>Under PI Dr. Ashok Choudhury, Dept. of Hepatology, Institute of Liver and Biliary Sciences, New Delhi</li>
    </ul>`,
  },
  aki: {
    inst: 'Institute of Liver and Biliary Sciences · 2024–2025',
    title: 'Predictive Modeling for Acute Kidney Injury (AKI) in ACLF Patients',
    status: '✅ Published',
    body: `<p>Acute kidney injury in acute-on-chronic liver failure patients significantly worsens prognosis. Early risk identification enables timely intervention and improves survival outcomes.</p>
    <ul>
      <li>ML model trained on routine EHR variables: serum bilirubin, PT-INR, creatinine, age, sodium, leukocyte count</li>
      <li>Feature importance analysis confirmed clinical relevance of selected biomarkers</li>
      <li>Decision tree incorporating bilirubin, INR and age stratified patients into high, intermediate and low AKI risk</li>
      <li>Published in Journal of Clinical and Experimental Hepatology, 2025 (DOI: 10.1016/j.jceh.2025.102726)</li>
    </ul>`,
  },
  pancreatic: {
    inst: 'IIT Ropar, Biomedical-Photonics Lab · Jul–Dec 2024',
    title: 'Cross-Modality Image Translation for Pancreatic Tumor Assessment',
    status: '✅ Published | 🏆 Best Paper Award',
    body: `<p>Second Harmonic Generation (SHG) microscopy reveals collagen morphology critical for pancreatic tumor staging, but is expensive and inaccessible. This project builds a computational bridge from standard H&E slides.</p>
    <ul>
      <li>Implemented deep learning image-to-image translation from H&E-stained BF images to SHG-equivalent images</li>
      <li>Multi-resolution image registration for paired training data preparation</li>
      <li>First-order intensity-based texture analysis on translated images to extract collagen measures</li>
      <li>ML classifiers differentiated pancreatic tumor from normal tissue on translated images</li>
      <li>Published in Lecture Notes in Networks and Systems, 2026 · Best Paper Award, National Institute of Technology Raipur 2024</li>
    </ul>`,
  },
  citrus: {
    inst: 'IIT Ropar, Biomedical-Photonics Lab · Jul–Dec 2024',
    title: 'Multimodal Fusion for Early Detection of Citrus Greening Disease',
    status: '📝 Manuscript in Preparation',
    body: `<p>Huanglongbing (HLB) or citrus greening is devastating to global citrus agriculture. Early, non-invasive detection is essential for large-scale crop protection.</p>
    <ul>
      <li>Collected fluorescence and near-infrared spectroscopy data from healthy and HLB-infected citrus leaves</li>
      <li>Applied ML-based data fusion combining both modalities, outperforming single-modality baselines</li>
      <li>Incorporated vegetation indices (NDVI, SR, NDRE) and biochemical change markers as additional features</li>
      <li>Demonstrated potential for scalable, non-invasive field-deployable orchard monitoring</li>
    </ul>`,
  },
  skin: {
    inst: 'National Institute of Technology Rourkela · Oct 2023 – May 2024 (M.Tech Thesis)',
    title: 'CNN-Based Multiclass Skin Cancer Classification',
    status: '✅ Completed',
    body: `<p>Master's thesis exploring optimized CNN architectures for automated multiclass skin cancer detection from whole-slide images.</p>
    <ul>
      <li>Optimized pretrained CNN models using transfer learning in MATLAB with comprehensive data augmentation</li>
      <li>Worked with 25,000+ whole-slide images, developing expertise in large-scale medical imaging pipelines</li>
      <li>Achieved accuracy comparable to state-of-the-art with reduced computational requirements</li>
      <li>Proficiency in transfer learning strategies applicable to limited-label clinical scenarios</li>
    </ul>`,
  },
  vep: {
    inst: 'National Institute of Technology Rourkela · May–Sept 2023',
    title: 'VEP Analysis Post-Caffeine Consumption',
    status: '✅ Published',
    body: `<p>Investigated how caffeine alters the visual pathway by analyzing visual evoked potential biosignals using multiple ML classifiers.</p>
    <ul>
      <li>Comparative study: Logistic Regression, KNN, SVM, Decision Trees, Gradient Boosting, Random Forest</li>
      <li>Random Forest achieved highest accuracy in detecting caffeine-induced VEP changes</li>
      <li>Revealed biological processes linking caffeine intake to visual and cognitive signal alterations</li>
      <li>Published: Communications in Computer and Information Science, 2025 (DOI: 10.1007/978-3-031-81342-9_22)</li>
    </ul>`,
  },
  airway: {
    inst: 'National Institute of Technology Rourkela · May–Sept 2023',
    title: 'AI for 2D-to-3D Airway Volume Estimation',
    status: '✅ Systematic Review',
    body: `<p>Systematic evaluation of whether 2D imaging can reliably substitute 3D cone-beam CT for upper airway volume estimation, and where AI can bridge the gap.</p>
    <ul>
      <li>Comprehensive systematic review of 2D vs 3D airway imaging literature across multiple modalities</li>
      <li>Compared: MRI, lateral cephalograms, endoscopy vs cone-beam CT for airway volume estimation</li>
      <li>Identified conflicting findings and key limitations of 2D imaging in capturing airway complexity</li>
      <li>Defined a clear research gap where AI-driven 2D-to-3D estimation approaches could advance the field</li>
    </ul>`,
  },
  sars: {
    inst: 'IIT Delhi, Biochemical Engineering & Biotechnology · Jun–Dec 2021 (B.Tech Thesis)',
    title: 'In-Host Modeling of SARS-CoV-2 Infections',
    status: '✅ Completed',
    body: `<p>Bachelor's thesis using mathematical modeling to understand SARS-CoV-2 pathophysiology and identify therapeutic targets.</p>
    <ul>
      <li>Developed and analyzed ODE-based in-host models for viral dynamics and immune response quantification</li>
      <li>Compared SARS-CoV-2 and influenza infection kinetics and disease severity implications</li>
      <li>Demonstrated that integrating metabolic insights improves model accuracy and biological relevance</li>
      <li>Identified candidate antiviral targets and gene therapy opportunities for COVID-19 treatment</li>
    </ul>`,
  },
};

const modalBg = document.getElementById('modalBg');
const modalContent = document.getElementById('modalContent');
const modalX = document.getElementById('modalX');
document.querySelectorAll('.pcard-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const d = modalData[btn.dataset.key];
    if (!d) return;
    modalContent.innerHTML = `<span class="modal-inst">${d.inst}</span><h2>${d.title}</h2><span class="modal-status">${d.status}</span>${d.body}`;
    modalBg.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});
function closeModal() { modalBg.classList.remove('open'); document.body.style.overflow = ''; }
modalX.addEventListener('click', closeModal);
modalBg.addEventListener('click', e => { if (e.target === modalBg) closeModal(); });

// ── Scicomm image modal ──
function openScicommModal(src, title) {
  document.getElementById('scicommModalImg').src = src;
  document.getElementById('scicommModalTitle').textContent = title;
  document.getElementById('scicommModalBg').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeScicommModal() {
  document.getElementById('scicommModalBg').classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { document.getElementById('scicommModalImg').src = ''; }, 300);
}

// ── Publication image modal ──
const pdfModalBg = document.getElementById('pdfModalBg');
const pdfModalTitle = document.getElementById('pdfModalTitle');
const pdfModalImg = document.getElementById('pdfModalImg');
const pdfModalX = document.getElementById('pdfModalX');

function openImgModal(imgSrc, title) {
  pdfModalTitle.textContent = title;
  pdfModalImg.src = imgSrc;
  pdfModalBg.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closePdfModal() {
  pdfModalBg.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { pdfModalImg.src = ''; }, 300);
}
pdfModalX.addEventListener('click', closePdfModal);
pdfModalBg.addEventListener('click', e => { if (e.target === pdfModalBg) closePdfModal(); });

// Click on pub-thumb to open image modal
document.querySelectorAll('.pub-thumb[data-img]').forEach(thumb => {
  thumb.addEventListener('click', () => {
    openImgModal(thumb.dataset.img, thumb.dataset.title || 'Figure');
  });
});

// ── Close all on Escape ──
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); closePdfModal(); } });

// ── Contact Form ──
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const { name, email, subject, message } = e.target;
  window.location.href = `mailto:garima99nitrkl@gmail.com?subject=${encodeURIComponent(subject.value || 'Portfolio Inquiry')}&body=${encodeURIComponent(`Name: ${name.value}\nEmail: ${email.value}\n\n${message.value}`)}`;
});
