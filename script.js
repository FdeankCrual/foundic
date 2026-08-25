document.addEventListener('DOMContentLoaded', () => {
    // Waitlist backend config
    const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwktUv9pSVeKP1lKmapm1I0BahicJDRy9OOjMrYHVXV7DusoELMh9oZVROXlRjOS3_ROA/exec';
    const SHARED_SECRET = 'foundic_waitlist_2026_x7k9q2';

    // Current Year for Footer
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const iconMenu = document.getElementById('icon-menu');
    const iconClose = document.getElementById('icon-close');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isMenuOpen = mobileMenu.classList.contains('active');

            if (isMenuOpen) {
                // Close menu
                mobileMenu.classList.remove('active');
                iconMenu.style.display = 'block';
                iconClose.style.display = 'none';
            } else {
                // Open menu
                mobileMenu.classList.add('active');
                iconMenu.style.display = 'none';
                iconClose.style.display = 'block';
            }
        });

        // Close mobile menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                iconMenu.style.display = 'block';
                iconClose.style.display = 'none';
            });
        });
    }

    // Navbar Scroll Effect (Optional depending on design, but good for fixed navs)
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
            } else {
                navbar.style.boxShadow = 'none';
            }
        });
    }
    // Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-up');
    animatedElements.forEach(el => observer.observe(el));

    // Scroll Spy - highlight active nav link
    const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
    const sections = document.querySelectorAll('section[id]');
    const sectionIds = Array.from(sections).map(s => s.id);

    function updateActiveLink() {
        let current = '';
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 150 && rect.bottom > 150) {
                current = section.id;
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('nav-link-active', 'mobile-link-active');
            const href = link.getAttribute('href');
            if (href && href.includes('#') && href.split('#')[1] === current) {
                if (link.classList.contains('nav-link')) {
                    link.classList.add('nav-link-active');
                } else {
                    link.classList.add('mobile-link-active');
                }
            }
        });
    }
    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();

    // Back to Top Button
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Animated Stat Counters
    const statsBand = document.querySelector('.stats-band');
    if (statsBand) {
        const statNumbers = statsBand.querySelectorAll('.stat-number');
        let statsAnimated = false;

        function animateCounters() {
            statNumbers.forEach(el => {
                const target = parseInt(el.getAttribute('data-target'), 10);
                const duration = 2000;
                const startTime = performance.now();

                function update(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.round(target * eased);
                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        el.textContent = target;
                    }
                }
                requestAnimationFrame(update);
            });
        }

        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsAnimated) {
                    statsAnimated = true;
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        statsObserver.observe(statsBand);
    }

    // Scroll Progress Bar
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            scrollProgress.style.width = progress + '%';
        }, { passive: true });
    }

    // Parallax Hero Background
    const heroBg = document.querySelector('.hero-bg-pattern');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            if (window.scrollY < window.innerHeight) {
                heroBg.style.transform = 'translateY(' + (window.scrollY * 0.3) + 'px)';
            }
        }, { passive: true });
    }

    // Staggered List Reveal
    const revealLists = document.querySelectorAll('.service-list.reveal');
    if (revealLists.length) {
        const listObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    listObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        revealLists.forEach(list => listObserver.observe(list));
    }

    // Waitlist multi-step form
    const waitlistForm = document.getElementById('waitlist-form');
    if (waitlistForm) {
        const roleCards = document.querySelectorAll('.role-card');
        const journeyEls = {
            company: document.getElementById('company-journey'),
            expert: document.getElementById('expert-journey'),
            angel: document.getElementById('angel-journey')
        };
        const journeyNames = {
            company: 'Company Journey',
            expert: 'Expert Journey',
            angel: 'Angel Investor Journey'
        };
        const submitLabels = {
            company: 'Join Early Access',
            expert: 'Apply as a Foundic Expert',
            angel: 'Join the Foundic Angel Investor Network'
        };
        const journeyTitles = {
            company: 'Company',
            expert: 'Expert',
            angel: 'Angel Investor'
        };
        const journeyMeta = {
            company: { email: 'c-email', name: 'c-company' },
            expert: { email: 'e-email', name: 'e-fullname' },
            angel: { email: 'a-email', name: 'a-fullname' }
        };

        let currentRole = 'company';
        let submitting = false;
        let submitted = false;

        const journeyNameEl = document.getElementById('journey-name');
        const stepCountEl = document.getElementById('step-count');
        const progressBar = document.getElementById('progress-bar');
        const backBtn = document.getElementById('btn-back');
        const nextBtn = document.getElementById('btn-next');
        const errorEl = document.getElementById('form-error');
        const statusEl = document.getElementById('form-status');

        function stepsFor(role) {
            return Array.from(journeyEls[role].querySelectorAll('.form-step'));
        }

        function updateStepper() {
            const steps = stepsFor(currentRole);
            const active = steps.findIndex(s => s.classList.contains('active'));
            stepCountEl.textContent = `Step ${active + 1} of ${steps.length}`;
            journeyNameEl.textContent = journeyNames[currentRole];
            progressBar.style.width = ((active + 1) / steps.length * 100) + '%';
            const isLast = active === steps.length - 1;
            if (!submitting && !submitted) {
                nextBtn.textContent = isLast ? submitLabels[currentRole] : 'Next Step';
            }
            backBtn.disabled = (active === 0) || submitting || submitted;
            nextBtn.disabled = submitting || submitted;
        }

        function goToStep(role, index) {
            const steps = stepsFor(role);
            steps.forEach((s, i) => s.classList.toggle('active', i === index));
            errorEl.classList.remove('show');
            statusEl.classList.remove('show');
            updateStepper();
        }

        function showJourney(role) {
            currentRole = role;
            Object.entries(journeyEls).forEach(([r, el]) => {
                el.style.display = (r === role) ? 'block' : 'none';
            });
            roleCards.forEach(c => c.classList.toggle('active', c.dataset.role === role));
            const roleInput = document.getElementById('role');
            if (roleInput) roleInput.value = role;
            document.querySelectorAll('[data-why]').forEach(el => {
                el.style.display = el.dataset.why === role ? 'block' : 'none';
            });
            goToStep(role, 0);
        }

        roleCards.forEach(card => {
            card.addEventListener('click', () => showJourney(card.dataset.role));
        });

        // Checkbox / radio pill toggles
        document.querySelectorAll('.check-item input, .radio-item input').forEach(input => {
            input.addEventListener('change', () => {
                const item = input.closest('.check-item, .radio-item');
                const group = input.closest('[data-group]');
                if (group) group.classList.remove('group-invalid');
                if (input.type === 'radio') {
                    group.querySelectorAll('.radio-item').forEach(ri => ri.classList.remove('active'));
                    item.classList.add('active');
                } else {
                    item.classList.toggle('active', input.checked);
                }
            });
        });

        // Industry "Other" toggle
        const cIndustry = document.getElementById('c-industry');
        const cIndustryOtherWrap = document.getElementById('c-industry-other-wrap');
        const cIndustryOther = document.getElementById('c-industry-other');
        if (cIndustry && cIndustryOtherWrap && cIndustryOther) {
            cIndustry.addEventListener('change', () => {
                const isOther = cIndustry.value === 'Other';
                cIndustryOtherWrap.style.display = isOther ? 'block' : 'none';
                cIndustryOther.required = isOther;
                if (!isOther) cIndustryOther.value = '';
            });
        }

        const eIndustry = document.getElementById('e-industry');
        const eIndustryOtherWrap = document.getElementById('e-industry-other-wrap');
        const eIndustryOther = document.getElementById('e-industry-other');
        if (eIndustry && eIndustryOtherWrap && eIndustryOther) {
            eIndustry.addEventListener('change', () => {
                const isOther = eIndustry.value === 'Other';
                eIndustryOtherWrap.style.display = isOther ? 'block' : 'none';
                eIndustryOther.required = isOther;
                if (!isOther) eIndustryOther.value = '';
            });
        }

        // Team Training sub-form toggles
        function setupTrainingToggle(checkboxValue, wrapId) {
            const checkbox = document.querySelector(`input[type="checkbox"][value="${checkboxValue}"]`);
            const wrap = document.getElementById(wrapId);
            if (checkbox && wrap) {
                checkbox.addEventListener('change', () => {
                    wrap.style.display = checkbox.checked ? 'block' : 'none';
                    if (!checkbox.checked) {
                        wrap.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                            cb.checked = false;
                            cb.closest('.check-item').classList.remove('active');
                        });
                    }
                });
            }
        }
        setupTrainingToggle('Team Training', 'c-training-type-wrap');
        setupTrainingToggle('Team Training Execution', 'c-exec-training-type-wrap');

        const eTrainingWrap = document.getElementById('e-training-type-wrap');
        if (eTrainingWrap) {
            const expertJourney = document.getElementById('expert-journey');
            if (expertJourney) {
                const eTeamCb = expertJourney.querySelector('input[type="checkbox"][value="Team Training"]');
                if (eTeamCb) {
                    eTeamCb.addEventListener('change', () => {
                        eTrainingWrap.style.display = eTeamCb.checked ? 'block' : 'none';
                        if (!eTeamCb.checked) {
                            eTrainingWrap.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                                cb.checked = false;
                                cb.closest('.check-item').classList.remove('active');
                            });
                        }
                    });
                }
            }
        }

        function setInvalid(el, bad) {
            el.classList.toggle('invalid', bad);
        }

        function validateStep(step) {
            let valid = true;
            const emailRe = /^\S+@\S+\.\S+$/;

            step.querySelectorAll('input, select, textarea').forEach(el => {
                if (el.type === 'file') return;
                if (el.type === 'checkbox' && el.hasAttribute('required')) {
                    const ok = el.checked;
                    setInvalid(el, !ok);
                    if (!ok) valid = false;
                    return;
                }
                if (el.type === 'checkbox' || el.type === 'radio') return;
                if (el.hasAttribute('required')) {
                    let ok = false;
                    if (el.type === 'email') ok = emailRe.test(el.value.trim());
                    else if (el.type === 'url') ok = /^https?:\/\/.+\..+/.test(el.value.trim());
                    else ok = el.value.trim().length > 0;
                    setInvalid(el, !ok);
                    if (!ok) valid = false;
                }
            });

            step.querySelectorAll('[data-group]').forEach(g => {
                const hasChecked = g.querySelectorAll('input:checked').length > 0;
                g.classList.toggle('group-invalid', !hasChecked);
                if (!hasChecked) valid = false;
            });

            if (!valid) {
                errorEl.textContent = 'Please fill in all required fields and select at least one option where applicable.';
                errorEl.classList.add('show');
            } else {
                errorEl.classList.remove('show');
            }
            return valid;
        }

        function collectBody() {
            const lines = [];
            lines.push('ROLE: ' + journeyTitles[currentRole]);
            lines.push('');

            stepsFor(currentRole).forEach(step => {
                const t = step.querySelector('.step-title');
                if (t) lines.push('--- ' + t.textContent + ' ---');

                step.querySelectorAll('input, select, textarea').forEach(el => {
                    if (el.type === 'file') {
                        if (el.files.length) {
                            lines.push((el.dataset.label || 'File') + ': ' + Array.from(el.files).map(f => f.name).join(', '));
                        }
                        return;
                    }
                    if (el.type === 'checkbox' && el.checked) {
                        const group = el.closest('[data-group]');
                        const item = el.closest('.check-item');
                        const label = item ? item.textContent.trim() : '';
                        lines.push((group ? group.dataset.label : 'Option') + ': ' + label);
                        return;
                    }
                    if (el.type === 'radio' && el.checked) {
                        const item = el.closest('.radio-item');
                        const label = item ? item.textContent.trim() : '';
                        lines.push((el.dataset.label || 'Option') + ': ' + label);
                        return;
                    }
                    if (el.type !== 'checkbox' && el.type !== 'radio' && el.value.trim()) {
                        lines.push((el.dataset.label || 'Field') + ': ' + el.value.trim());
                    }
                });
                lines.push('');
            });

            lines.push('Consent: I agree to be contacted by Foundic Network regarding platform updates, early access, business opportunities and future communication: YES');
            return lines.join('\n');
        }

        function readFileAsDataURL(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = () => reject(reader.error);
                reader.readAsDataURL(file);
            });
        }

        function showStatus(type, message) {
            errorEl.classList.remove('show');
            statusEl.className = 'form-status ' + type + ' show';
            statusEl.textContent = message;
        }

        function setSubmitting(on) {
            submitting = on;
            if (on) nextBtn.textContent = 'Submitting...';
            updateStepper();
        }

        async function submitApplication() {
            const steps = stepsFor(currentRole);
            const finalStep = steps[steps.length - 1];
            if (!validateStep(finalStep)) return;

            setSubmitting(true);
            statusEl.classList.remove('show');

            const fileEntries = [];
            steps.forEach(step => {
                step.querySelectorAll('input[type="file"]').forEach(input => {
                    Array.from(input.files || []).forEach(file => {
                        fileEntries.push({ field: input.dataset.label || 'file', file });
                    });
                });
            });

            const files = [];
            try {
                for (const entry of fileEntries) {
                    const dataUrl = await readFileAsDataURL(entry.file);
                    const prefix = dataUrl.split(',')[0] || '';
                    files.push({
                        field: entry.field,
                        filename: entry.file.name,
                        mime: entry.file.type || prefix.slice(5) || 'application/octet-stream',
                        data: dataUrl.split(',')[1] || ''
                    });
                }

                const meta = journeyMeta[currentRole];
                const emailEl = document.getElementById(meta.email);
                const nameEl = document.getElementById(meta.name);
                const hpEl = document.getElementById('website');

                const res = await fetch(WEB_APP_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain' },
                    body: JSON.stringify({
                        role: currentRole,
                        secret: SHARED_SECRET,
                        website: hpEl ? hpEl.value : '',
                        email: emailEl ? emailEl.value.trim() : '',
                        name: nameEl ? nameEl.value.trim() : '',
                        details: collectBody(),
                        files: files
                    })
                });

                let data = {};
                try {
                    data = await res.json();
                } catch (e) {
                    data = { status: 'error' };
                }

                if (data.status === 'success') {
                    submitted = true;
                    nextBtn.textContent = 'Submitted';
                    updateStepper();
                    showStatus('success', "Application submitted successfully! We'll review your application and get back to you within 2 business days.");
                } else if (data.status === 'duplicate') {
                    showStatus('duplicate', "You've already applied with this email. We'll be in touch with you soon.");
                } else if (data.status === 'full') {
                    showStatus('error', data.message || 'The waitlist is currently full. Please check back later.');
                } else if (data.status === 'error') {
                    showStatus('error', data.message || 'Something went wrong. Please try again.');
                } else {
                    showStatus('error', 'Something went wrong. Please try again.');
                }
            } catch (err) {
                showStatus('error', 'Network error. Please check your connection and try again.');
            } finally {
                setSubmitting(false);
            }
        }

        nextBtn.addEventListener('click', () => {
            const steps = stepsFor(currentRole);
            const active = steps.findIndex(s => s.classList.contains('active'));
            if (active < steps.length - 1) {
                if (validateStep(steps[active])) goToStep(currentRole, active + 1);
            } else {
                submitApplication();
            }
        });

        backBtn.addEventListener('click', () => {
            const steps = stepsFor(currentRole);
            const active = steps.findIndex(s => s.classList.contains('active'));
            if (active > 0) goToStep(currentRole, active - 1);
        });

        showJourney('company');
    }
});
