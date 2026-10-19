/**
 * Stpatyal Social Media Services - Main Interactive Script
 * Smooth x100 Architecture:
 * - Ultra-Smooth Inertial Scroll & Anchor Interpolation
 * - Magnetic Sliding Indicator Navigation Bar
 * - Active Scroll Spy
 * - Dynamic Card Spotlight Tracking
 * - Staggered Scroll Reveal Animations
 * - Interactive Case Dossier Modal (No Videos)
 * - Lead Gen Form & Instant Case Reference Generator
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. Magnetic Sliding Pill Navigation & Scroll Spy (Best Interactive Navbar)
  // =========================================================================
  const navbarIsland = document.querySelector('.navbar-island');
  const siteHeader = document.getElementById('siteHeader');
  const navMenu = document.querySelector('.nav-links');
  const navLinks = document.querySelectorAll('.nav-links a');
  const indicator = document.querySelector('.nav-indicator-pill');
  const menuToggle = document.getElementById('menuToggle');

  // Track active navigation link
  let activeLink = document.querySelector('.nav-links a.active') || navLinks[0];

  function positionIndicator(target) {
    if (!target || !indicator || !navMenu) return;
    const navRect = navMenu.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const left = targetRect.left - navRect.left;
    const width = targetRect.width;

    indicator.style.width = `${width}px`;
    indicator.style.transform = `translateX(${left}px)`;
    indicator.classList.add('active');
  }

  // Initial positioning
  if (activeLink) {
    setTimeout(() => positionIndicator(activeLink), 150);
  }

  // Window resize: keep indicator anchored perfectly
  window.addEventListener('resize', () => {
    if (activeLink) {
      positionIndicator(activeLink);
    }
  });

  // Hover effect: glide pill to hovered link with spring physics
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      positionIndicator(link);
    });

    link.addEventListener('mouseleave', () => {
      positionIndicator(activeLink);
    });
  });

  // Dynamic Cursor Spotlight on Navbar Island (VisionOS Glass Refraction)
  if (navbarIsland) {
    navbarIsland.addEventListener('mousemove', (e) => {
      const rect = navbarIsland.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      navbarIsland.style.setProperty('--nav-x', `${x}px`);
      navbarIsland.style.setProperty('--nav-y', `${y}px`);
    });

    navbarIsland.addEventListener('mouseleave', () => {
      navbarIsland.style.setProperty('--nav-x', '50%');
      navbarIsland.style.setProperty('--nav-y', '50%');
    });
  }

  // Mobile menu toggle
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuToggle?.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Header scroll appearance
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  }, { passive: true });

  // =========================================================================
  // 2. Ultra-Smooth Scroll Anchor Interpolation (Smooth x100)
  // =========================================================================
  let activeScrollAnimationId = null;

  function smoothScrollTo(targetY, duration = 800) {
    if (activeScrollAnimationId) {
      window.cancelAnimationFrame(activeScrollAnimationId);
      activeScrollAnimationId = null;
    }

    const startY = window.pageYOffset;
    const diff = targetY - startY;
    if (Math.abs(diff) < 2) return;

    let startTimestamp = null;

    // Cubic bezier ease-in-out curve for silk-smooth acceleration & deceleration
    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function step(timestamp) {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      const ease = easeInOutCubic(progress);

      window.scrollTo(0, startY + diff * ease);

      if (progress < 1) {
        activeScrollAnimationId = window.requestAnimationFrame(step);
      } else {
        activeScrollAnimationId = null;
      }
    }

    activeScrollAnimationId = window.requestAnimationFrame(step);
  }

  // Cancel inertial scroll immediately if user manually wheels/touches
  ['wheel', 'touchmove'].forEach(evt => {
    window.addEventListener(evt, () => {
      if (activeScrollAnimationId) {
        window.cancelAnimationFrame(activeScrollAnimationId);
        activeScrollAnimationId = null;
      }
    }, { passive: true });
  });

  // Intercept all anchor link clicks for buttery smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '') return;

      const targetEl = document.querySelector(href);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 95; // Account for floating navbar island height
        const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        smoothScrollTo(targetPosition, 750);

        // Update active nav link
        if (this.closest('.nav-links')) {
          navLinks.forEach(l => l.classList.remove('active'));
          this.classList.add('active');
          activeLink = this;
          positionIndicator(activeLink);
        }
      }
    });
  });

  // Scroll Spy: Update active link as user smoothly scrolls
  const spySections = document.querySelectorAll('section[id], div[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.pageYOffset + 140;

    spySections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    if (current) {
      navLinks.forEach(link => {
        if (link.getAttribute('href') === `#${current}`) {
          if (activeLink !== link) {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            activeLink = link;
            positionIndicator(activeLink);
          }
        }
      });
    }
  }, { passive: true });

  // =========================================================================
  // 3. Dynamic Cursor Spotlight Glow Tracking (Interactive x100)
  // =========================================================================
  const interactiveCards = document.querySelectorAll('.peak-card, .stat-card-screenshot, .service-card, .case-card, .testimonial-card');
  interactiveCards.forEach(card => {
    card.classList.add('spotlight-card');
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // =========================================================================
  // 4. Staggered Scroll Reveal Animations
  // =========================================================================
  const revealElements = document.querySelectorAll('.reveal-item');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // =========================================================================
  // 5. Case Breakdown Dossier Modal (No Videos)
  // =========================================================================
  const caseDossierModal = document.getElementById('caseDossierModal');
  const closeDossierModalBtn = document.getElementById('closeDossierModalBtn');
  const dossierCaseTitle = document.getElementById('dossierCaseTitle');
  const dossierPlatformBadge = document.getElementById('dossierPlatformBadge');
  const dossierTimeline = document.getElementById('dossierTimeline');
  const caseTriggers = document.querySelectorAll('.case-breakdown-trigger');

  const caseData = {
    '1042': {
      title: 'Instagram Creator Account Mistaken Ban Reversal',
      platform: 'Instagram Verified Appeal',
      timeline: [
        { step: 'Hour 0-2: Case Intake & Policy Audit', desc: 'Identified false-positive AI flag alleging impersonation against a 120,000 follower public figure.' },
        { step: 'Hour 3-12: Dossier Formulation', desc: 'Assembled notarized government identity credentials, original media copyright timestamps, and trademark registry.' },
        { step: 'Hour 13-28: Escalation & Account Restoration', desc: 'Direct submission to platform Trust & Safety operations. Account fully restored with 100% follower and post retention.' }
      ]
    },
    '1088': {
      title: 'Commercial E-Commerce Account Suspension Dispute',
      platform: 'Meta Business Escalation',
      timeline: [
        { step: 'Hour 0-4: Incident Diagnostics', desc: 'Commercial account targeted by competitor DMCA strikes resulting in automated platform-wide restriction.' },
        { step: 'Hour 5-24: Counter-Notification & Evidence Prep', desc: 'Compiled supplier licensing agreements, proprietary manufacturing proofs, and verified merchant authorization.' },
        { step: 'Hour 25-48: Platform Enforcement & Handover', desc: 'All wrongful strikes nullified by Meta IP division. Ad accounts unblocked and full revenue flow resumed.' }
      ]
    },
    '2019': {
      title: 'Multi-Account Impersonation & Clone Profile Banning',
      platform: 'Instagram & Facebook Takedowns',
      timeline: [
        { step: 'Hour 0-3: Network Discovery', desc: 'Detected 4 coordinated spoof accounts copying bio, reels, and defrauding community followers in DMs.' },
        { step: 'Hour 4-10: Priority Identity Filing', desc: 'Prepared expedited likeness violation dossiers referencing official Meta creator identification channels.' },
        { step: 'Hour 11-18: Permanent Ban Enforcement', desc: 'All 4 fraudulent clone accounts permanently banned and device fingerprints blacklisted.' }
      ]
    },
    '3104': {
      title: 'Post-Breach Security Hardening & Session Revocation',
      platform: 'Multi-Platform Shield',
      timeline: [
        { step: 'Hour 0-2: Breach Containment', desc: 'High-profile account compromised via malware browser cookie theft, locking out the legitimate administrator.' },
        { step: 'Hour 3-8: Credential Reclamation', desc: 'Coordinated identity-authenticated bypass of rogue authenticator keys via official platform routing.' },
        { step: 'Hour 9-14: Hardened Lockdown', desc: 'Configured hardware FIDO2 security keys, revoked all unauthorized OAuth tokens, and implemented ban-immunity protocols.' }
      ]
    }
  };

  caseTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const caseId = btn.getAttribute('data-case-id');
      const data = caseData[caseId];

      if (data && caseDossierModal) {
        if (dossierCaseTitle) dossierCaseTitle.textContent = data.title;
        if (dossierPlatformBadge) dossierPlatformBadge.textContent = data.platform;

        if (dossierTimeline) {
          dossierTimeline.innerHTML = data.timeline.map(item => `
            <div class="timeline-step">
              <h5>${item.step}</h5>
              <p>${item.desc}</p>
            </div>
          `).join('');
        }

        caseDossierModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeDossierModal() {
    if (caseDossierModal) {
      caseDossierModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  closeDossierModalBtn?.addEventListener('click', closeDossierModal);

  caseDossierModal?.addEventListener('click', (e) => {
    if (e.target === caseDossierModal) {
      closeDossierModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && caseDossierModal?.classList.contains('active')) {
      closeDossierModal();
    }
  });

  // =========================================================================
  // 6. FAQ Accordion (Smooth Height Interpolation)
  // =========================================================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    trigger?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close siblings
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const ans = otherItem.querySelector('.faq-answer');
          if (ans) ans.style.maxHeight = null;
        }
      });

      // Toggle current
      item.classList.toggle('active', !isActive);
      const answer = item.querySelector('.faq-answer');
      if (answer) {
        if (!isActive) {
          answer.style.maxHeight = `${answer.scrollHeight + 30}px`;
        } else {
          answer.style.maxHeight = null;
        }
      }
    });
  });

  // =========================================================================
  // 7. Contact Form & Instant Case Reference Generator
  // =========================================================================
  const contactForm = document.getElementById('supportInquiryForm');
  const successModal = document.getElementById('successModal');
  const closeSuccessModalBtn = document.getElementById('closeSuccessModalBtn');
  const dossierTicketId = document.getElementById('dossierTicketId');
  const copyCaseTicketBtn = document.getElementById('copyCaseTicketBtn');
  const copyCaseTicketText = document.getElementById('copyCaseTicketText');
  const emailIntakeBtn = document.getElementById('emailIntakeBtn');

  let currentCaseReceipt = '';

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const platformInput = contactForm.querySelector('input[name="platform"]:checked');
      const issueTypeInput = contactForm.querySelector('input[name="issue_type"]:checked');
      const fullName = (document.getElementById('formFullName')?.value || '').trim();
      const handle = (document.getElementById('formHandle')?.value || '').trim();
      const contactDetail = (document.getElementById('formContact')?.value || '').trim();
      const description = (document.getElementById('formDescription')?.value || '').trim();

      const platform = platformInput ? platformInput.value : 'Instagram';
      const issueType = issueTypeInput ? issueTypeInput.value : 'Account Recovery Appeal';

      // Generate unique Case Reference Number
      const randomTicketNum = Math.floor(10000 + Math.random() * 90000);
      const ticketId = `STP-${randomTicketNum}`;

      if (dossierTicketId) {
        dossierTicketId.textContent = ticketId;
      }

      currentCaseReceipt = 
`=========================================
STPATYAL SOCIAL MEDIA SERVICES - CASE RECEIPT
=========================================
Assigned Reference : ${ticketId}
Date Logged        : ${new Date().toLocaleString()}
Target Platform    : ${platform}
Issue Type         : ${issueType}
Target Handle      : ${handle}
Client Name        : ${fullName}
Contact Info       : ${contactDetail}
Case Description   : ${description}
Status             : Forensic Review Queue (Active)
=========================================`;

      // Set up direct email consultation mailto URL
      if (emailIntakeBtn) {
        const mailSubject = encodeURIComponent(`[${ticketId}] Priority Support Request - ${platform} (${handle})`);
        const mailBody = encodeURIComponent(currentCaseReceipt);
        emailIntakeBtn.href = `mailto:support@stpatyal.com?subject=${mailSubject}&body=${mailBody}`;
      }

      if (successModal) {
        successModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }

      contactForm.reset();
    });
  }

  // Copy Case Reference Receipt to Clipboard
  if (copyCaseTicketBtn) {
    copyCaseTicketBtn.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && currentCaseReceipt) {
          await navigator.clipboard.writeText(currentCaseReceipt);
        }
        if (copyCaseTicketText) {
          copyCaseTicketText.textContent = 'Receipt Copied to Clipboard!';
          copyCaseTicketBtn.style.background = 'linear-gradient(135deg, #059669 0%, #10B981 100%)';
          setTimeout(() => {
            copyCaseTicketText.textContent = 'Copy Reference Receipt';
            copyCaseTicketBtn.style.background = '';
          }, 3000);
        }
      } catch (err) {
        console.warn('Clipboard write failed:', err);
      }
    });
  }

  closeSuccessModalBtn?.addEventListener('click', () => {
    if (successModal) {
      successModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  successModal?.addEventListener('click', (e) => {
    if (e.target === successModal) {
      successModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // =========================================================================
  // 8. Animated Stats Counter (Smooth x100)
  // =========================================================================
  const statNumbers = document.querySelectorAll('.stat-number[data-target], .stat-number-big[data-target]');
  let counted = false;

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        statNumbers.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const prefix = counter.getAttribute('data-prefix') || '';
          const suffix = counter.getAttribute('data-suffix') || '';
          let count = 0;
          const speed = target / 45;

          const updateCount = () => {
            count += speed;
            if (count < target) {
              counter.textContent = prefix + Math.ceil(count) + suffix;
              requestAnimationFrame(updateCount);
            } else {
              counter.textContent = prefix + target + suffix;
            }
          };
          updateCount();
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.trust-section');
  if (statsSection) {
    countObserver.observe(statsSection);
  }
});
