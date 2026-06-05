/**
 * app.js
 * Controls all user interactions, scroll observers, dynamic list renders,
 * authentication triggers, and database syncing for Chathura Kodikara's Portfolio.
 */

document.addEventListener("DOMContentLoaded", () => {
  // App state
  const state = {
    isAdmin: false,
    projectsUnsubscribe: null,
    editingProjectId: null
  };

  // DOM Elements
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section");
  const projectsGrid = document.getElementById("projects-grid");
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const navMenu = document.querySelector(".nav-menu");
  
  // Timelines & Grids
  const experienceTrace = document.getElementById("experience-trace");
  const educationTrace = document.getElementById("education-trace");
  const achievementsGrid = document.getElementById("achievements-grid");
  const leadershipGrid = document.getElementById("leadership-grid");
  const certsGrid = document.getElementById("certs-grid");

  // Modals & Panels
  const adminLoginModal = document.getElementById("admin-login-modal");
  const projectModal = document.getElementById("project-modal");
  const configModal = document.getElementById("config-modal");
  
  // Forms & Buttons
  const loginForm = document.getElementById("login-form");
  const projectForm = document.getElementById("project-form");
  const configForm = document.getElementById("config-form");
  const contactForm = document.getElementById("contact-form");
  
  const openLoginBtn = document.getElementById("open-login-btn");
  const openConfigBtn = document.getElementById("open-config-btn");
  const closeLoginBtn = document.getElementById("close-login-btn");
  const closeProjectBtn = document.getElementById("close-project-btn");
  const closeConfigBtn = document.getElementById("close-config-btn");
  
  const logoutBtn = document.getElementById("logout-btn");
  const clearConfigBtn = document.getElementById("clear-config-btn");
  const currentDbModeEl = document.getElementById("current-db-mode");

  // Gradient definitions mapping to gradientIndex
  const GRADIENTS = [
    "linear-gradient(135deg, #00f2fe 0%, #0ea5e9 100%)", // Blue/Aqua
    "linear-gradient(135deg, #a78bfa 0%, #e0c3fc 100%)", // Lavender/Blue
    "linear-gradient(135deg, #f472b6 0%, #fb7185 100%)", // Vibrant Purple/Coral
    "linear-gradient(135deg, #34d399 0%, #059669 100%)", // Cyber Neon Green
    "linear-gradient(135deg, #fb923c 0%, #fbbf24 100%)"  // Orange/Lemon
  ];

  /* ==========================================================================
     1. INITIALIZATION & DATA SYNC
     ========================================================================== */
  
  function init() {
    updateDbModeStatus();
    renderTimelineData();
    renderAuxiliaryGrids();
    observeSkillBars();
    
    // Subscribe to projects stream
    if (state.projectsUnsubscribe) {
      state.projectsUnsubscribe();
    }
    
    state.projectsUnsubscribe = window.portfolioStore.subscribeToProjects((projects) => {
      renderProjects(projects);
    });

    // Check if user is already logged in (local session or Firebase Auth)
    checkAuthState();

    // Compile dynamic vector icons
    lucide.createIcons();
  }

  function updateDbModeStatus() {
    if (!currentDbModeEl) return;
    if (window.portfolioStore.isFirebaseInitialized) {
      currentDbModeEl.innerHTML = '<span class="status-indicator online"></span> Firebase Cloud Connected';
      if (clearConfigBtn) clearConfigBtn.style.display = "block";
    } else {
      currentDbModeEl.innerHTML = '<span class="status-indicator offline"></span> Offline Telemetry (Local Storage)';
      if (clearConfigBtn) clearConfigBtn.style.display = "none";
    }
  }

  function checkAuthState() {
    const localAdminSession = sessionStorage.getItem("admin_session") === "active";
    
    if (window.portfolioStore.isFirebaseInitialized && window.portfolioStore.auth) {
      window.portfolioStore.auth.onAuthStateChanged((user) => {
        setAdminState(!!user);
      });
    } else {
      setAdminState(localAdminSession);
    }
  }

  function setAdminState(isAdmin) {
    state.isAdmin = isAdmin;
    const adminElements = document.querySelectorAll(".admin-only");
    
    adminElements.forEach(el => {
      if (isAdmin) {
        el.classList.remove("hidden");
        el.style.display = ""; // Reset inline
      } else {
        el.classList.add("hidden");
        el.style.display = "none";
      }
    });

    // Toggle logout elements and trigger active header labels
    if (logoutBtn) {
      logoutBtn.style.display = isAdmin ? "block" : "none";
    }
    if (openLoginBtn) {
      openLoginBtn.innerHTML = isAdmin ? '<i data-lucide="shield-check"></i> Workspace Active' : '<i data-lucide="shield-alert"></i> Admin Panel';
      openLoginBtn.classList.toggle("active-admin", isAdmin);
      lucide.createIcons();
    }
  }

  /* ==========================================================================
     2. RENDERING PROCEDURES
     ========================================================================== */

  // Renders both Experience & Education side-by-side Timelines
  function renderTimelineData() {
    const experiences = window.portfolioStore.getExperiences();
    const education = window.portfolioStore.getEducation();

    // Renders experiences
    if (experienceTrace) {
      experienceTrace.innerHTML = experiences.map((exp, idx) => `
        <div class="timeline-node reveal-on-scroll" style="transition-delay: ${idx * 100}ms">
          <div class="timeline-node-dot"></div>
          <div class="timeline-node-header">
            <div class="timeline-node-date">${exp.duration}</div>
            <h4 class="timeline-node-title">${exp.role}</h4>
            <div class="timeline-node-subtitle">${exp.company}</div>
          </div>
          <p class="timeline-node-desc">${exp.description}</p>
          <div class="timeline-node-tags">
            ${exp.tags.map(t => `<span class="tech-badge">${t}</span>`).join("")}
          </div>
        </div>
      `).join("");
    }

    // Renders academic logs
    if (educationTrace) {
      educationTrace.innerHTML = education.map((edu, idx) => `
        <div class="timeline-node reveal-on-scroll" style="transition-delay: ${idx * 100}ms">
          <div class="timeline-node-dot"></div>
          <div class="timeline-node-header">
            <div class="timeline-node-date">${edu.duration}</div>
            <h4 class="timeline-node-title">${edu.degree}</h4>
            <div class="timeline-node-subtitle">${edu.institution}</div>
            ${edu.gpa ? `<div class="timeline-node-date" style="margin-top: 0.2rem;">${edu.gpa}</div>` : ""}
          </div>
          <p class="timeline-node-desc">${edu.description}</p>
        </div>
      `).join("");
    }

    observeScrollElements();
  }

  // Renders achievements, certifications, and leadership boards
  function renderAuxiliaryGrids() {
    const achievements = window.portfolioStore.getAchievements();
    const leadership = window.portfolioStore.getLeadership();
    const certifications = window.portfolioStore.getCertifications();

    if (achievementsGrid) {
      achievementsGrid.innerHTML = achievements.map((ach, idx) => `
        <div class="glass-card achievement-card reveal-on-scroll" style="transition-delay: ${idx * 100}ms">
          <div class="achievement-header">
            <div class="achievement-trophy"><i data-lucide="trophy" style="width: 22px; height: 22px;"></i></div>
            <span class="achievement-year">${ach.year}</span>
          </div>
          <h4 class="achievement-title">${ach.title}</h4>
          <div class="achievement-role">${ach.role}</div>
          <p class="achievement-desc">${ach.description}</p>
        </div>
      `).join("");
    }

    if (leadershipGrid) {
      leadershipGrid.innerHTML = leadership.map((lead, idx) => `
        <div class="glass-card leadership-card reveal-on-scroll" style="transition-delay: ${idx * 100}ms">
          <div style="color: var(--neon-cyan); margin-bottom: 0.8rem;"><i data-lucide="users" style="width: 24px; height: 24px;"></i></div>
          <h4 class="leadership-role">${lead.role}</h4>
          <div class="leadership-org">${lead.organization}</div>
          <div class="leadership-duration">${lead.duration}</div>
          <p class="achievement-desc">${lead.description}</p>
        </div>
      `).join("");
    }

    if (certsGrid) {
      certsGrid.innerHTML = certifications.map((cert, idx) => `
        <div class="glass-card cert-card reveal-on-scroll" style="transition-delay: ${idx * 50}ms">
          <div class="cert-icon-box">
            <i data-lucide="award" style="width: 20px; height: 20px;"></i>
          </div>
          <div class="cert-details">
            <h4 class="cert-title">${cert.title}</h4>
            <div class="cert-provider">${cert.provider}</div>
          </div>
        </div>
      `).join("");
    }
  }

  function renderProjects(projects) {
    if (!projectsGrid) return;
    
    // Scaffolds the 'Add Project' virtual dashboard button if admin authenticated
    const addCardHtml = `
      <div id="add-project-card" class="project-card add-card glass-card admin-only ${state.isAdmin ? "" : "hidden"}" style="${state.isAdmin ? "" : "display: none;"}">
        <div class="add-card-inner">
          <div class="add-icon">
            <i data-lucide="plus" style="width: 22px; height: 22px;"></i>
          </div>
          <span style="font-family: var(--font-header); font-weight: 600; font-size: 0.95rem; letter-spacing: 0.05em; text-transform: uppercase;">Register Project</span>
        </div>
      </div>
    `;

    const projectsHtml = projects.map((proj, index) => {
      const gradient = GRADIENTS[proj.gradientIndex] || GRADIENTS[0];
      const techTag = proj.tags[0] || 'Embedded';
      
      // Determine if a real custom image URL is provided, otherwise fall back to technical blueprint gradient vectors
      const bannerHtml = proj.imageUrl ? 
        `<img src="${proj.imageUrl}" alt="${proj.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
         <div class="project-banner-fallback" style="background: ${gradient}; display: none;">
           <i data-lucide="cpu"></i>
         </div>` :
        `<div class="project-banner-fallback" style="background: ${gradient}">
           <i data-lucide="cpu"></i>
         </div>`;

      return `
        <div class="project-card glass-card reveal-on-scroll" style="transition-delay: ${(index % 3) * 100}ms">
          <div class="project-banner">
            ${bannerHtml}
            <div class="project-gradient-overlay"></div>
            <div class="project-banner-tag">${techTag}</div>
          </div>
          <div class="project-details">
            <h3 class="project-title">${proj.title}</h3>
            <p class="project-desc">${proj.description}</p>
            <div class="project-tech">
              ${proj.tags.map(t => `<span class="tech-badge">${t}</span>`).join("")}
            </div>
            <div class="project-footer">
              <div class="project-links">
                ${proj.githubLink ? `
                  <a href="${proj.githubLink}" target="_blank" class="project-link-icon" title="Source Code" aria-label="GitHub Repository">
                    <i data-lucide="github" style="width: 19px; height: 19px;"></i>
                  </a>
                ` : ""}
                ${proj.liveLink ? `
                  <a href="${proj.liveLink}" target="_blank" class="project-link-icon" title="View Telemetry/Video" aria-label="Live Demo">
                    <i data-lucide="external-link" style="width: 19px; height: 19px;"></i>
                  </a>
                ` : ""}
              </div>
              
              <!-- Administrative CRUD controls -->
              <div class="project-actions admin-only" style="${state.isAdmin ? "" : "display: none;"}">
                <button class="edit-btn" data-id="${proj.id}" title="Edit Specifications">
                  <i data-lucide="edit-3" style="width: 13px; height: 13px;"></i> Edit
                </button>
                <button class="delete-btn" data-id="${proj.id}" title="Delete Records">
                  <i data-lucide="trash-2" style="width: 13px; height: 13px;"></i> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join("");

    projectsGrid.innerHTML = addCardHtml + projectsHtml;
    
    // Bind click events on freshly generated cards
    bindDynamicCardEvents();
    observeScrollElements();
    lucide.createIcons();
  }

  function bindDynamicCardEvents() {
    // Add project card triggers project manager modal in Add Mode
    const addCard = document.getElementById("add-project-card");
    if (addCard) {
      addCard.addEventListener("click", () => {
        state.editingProjectId = null;
        document.getElementById("project-form").reset();
        document.getElementById("proj-id").value = "";
        document.getElementById("project-modal-title").innerHTML = '<i data-lucide="plus-circle"></i> Add Portfolio Project';
        document.getElementById("project-submit-btn").innerHTML = 'Save Project Configuration <i data-lucide="check-square"></i>';
        lucide.createIcons();
        openModal(projectModal);
      });
    }

    // Bind edit clicks
    const editBtns = document.querySelectorAll(".edit-btn");
    editBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const projId = btn.dataset.id;
        state.editingProjectId = projId;

        // Prefill form values from current array
        window.portfolioStore.subscribeToProjects((projects) => {
          const match = projects.find(p => p.id === projId);
          if (match) {
            document.getElementById("proj-id").value = match.id;
            document.getElementById("proj-title").value = match.title || "";
            document.getElementById("proj-desc").value = match.description || "";
            document.getElementById("proj-tags").value = (match.tags || []).join(", ");
            document.getElementById("proj-github").value = match.githubLink || "";
            document.getElementById("proj-live").value = match.liveLink || "";
            document.getElementById("proj-image").value = match.imageUrl || "";
            document.getElementById("proj-gradient").value = match.gradientIndex ?? 0;
            
            document.getElementById("project-modal-title").innerHTML = '<i data-lucide="edit-3"></i> Edit Project Specifications';
            document.getElementById("project-submit-btn").innerHTML = 'Update Project Configuration <i data-lucide="save"></i>';
            lucide.createIcons();
            
            openModal(projectModal);
          }
        })(); // Call immediately
      });
    });

    // Bind delete clicks
    const deleteBtns = document.querySelectorAll(".delete-btn");
    deleteBtns.forEach(btn => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const projectId = btn.dataset.id;
        
        if (confirm("Are you sure you want to remove this project from your portfolio records?")) {
          try {
            btn.disabled = true;
            btn.innerHTML = "Deleting...";
            await window.portfolioStore.deleteProject(projectId);
            showToast("Project record deleted successfully!");
          } catch (err) {
            btn.disabled = false;
            btn.innerHTML = "Delete";
            showToast("Failed to delete project: " + err.message, true);
          }
        }
      });
    });
  }

  // Terminal sequence removed as requested

  /* ==========================================================================
     4. SCROLL & NAVIGATION OBSERVERS
     ========================================================================== */

  // Active section nav linking on scroll
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach(link => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }, {
    rootMargin: "-25% 0px -65% 0px"
  });

  sections.forEach(section => {
    if (section) sectionObserver.observe(section);
  });

  // Slide up transitions on viewport entry
  function observeScrollElements() {
    const revealElements = document.querySelectorAll(".reveal-on-scroll");
    
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          scrollObserver.unobserve(entry.target); // Animate once
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: "0px 0px -30px 0px"
    });

    revealElements.forEach(el => scrollObserver.observe(el));
  }

  // Links skill-meter triggers to section viewport entrance
  function observeSkillBars() {
    const skillBars = document.querySelectorAll(".skill-bar-inner");
    
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const targetPercent = bar.dataset.percent || "0%";
          bar.style.width = targetPercent;
          skillObserver.unobserve(bar);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -10px 0px"
    });

    skillBars.forEach(bar => skillObserver.observe(bar));
  }

  // Smooth scroll links
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      
      navMenu.classList.remove("mobile-active");
      mobileMenuBtn.classList.remove("menu-open");
      
      const targetId = link.getAttribute("href");
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop - 80,
          behavior: "smooth"
        });
      }
    });
  });

  // Sticky nav header trigger on scroll y-axis
  window.addEventListener("scroll", () => {
    const headerEl = document.querySelector("header");
    if (headerEl) {
      headerEl.classList.toggle("scrolled", window.scrollY > 40);
    }
  });

  // Mobile menu expand toggle
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      navMenu.classList.toggle("mobile-active");
      mobileMenuBtn.classList.toggle("menu-open");
    });
  }

  /* ==========================================================================
     5. INTERACTIVE MODAL ACTIONS
     ========================================================================== */

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add("modal-active");
    document.body.style.overflow = "hidden"; // Retain scroll contexts
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("modal-active");
    document.body.style.overflow = "";
    
    const form = modal.querySelector("form");
    if (form) form.reset();
  }

  // Open logins
  if (openLoginBtn) {
    openLoginBtn.addEventListener("click", () => {
      if (state.isAdmin) {
        // If already admin, clicking allows direct project registration shortcut
        state.editingProjectId = null;
        document.getElementById("project-form").reset();
        document.getElementById("proj-id").value = "";
        document.getElementById("project-modal-title").innerHTML = '<i data-lucide="plus-circle"></i> Add Portfolio Project';
        document.getElementById("project-submit-btn").innerHTML = 'Save Project Configuration <i data-lucide="check-square"></i>';
        lucide.createIcons();
        openModal(projectModal);
      } else {
        openModal(adminLoginModal);
      }
    });
  }

  if (openConfigBtn) {
    openConfigBtn.addEventListener("click", () => {
      openModal(configModal);
      prefillConfigForm();
    });
  }

  if (closeLoginBtn) closeLoginBtn.addEventListener("click", () => closeModal(adminLoginModal));
  if (closeProjectBtn) closeProjectBtn.addEventListener("click", () => closeModal(projectModal));
  if (closeConfigBtn) closeConfigBtn.addEventListener("click", () => closeModal(configModal));

  // Dismiss modals clicking off content boundaries
  [adminLoginModal, projectModal, configModal].forEach(modal => {
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
    }
  });

  /* ==========================================================================
     6. ADMINISTRATIVE FORM HANDLERS
     ========================================================================== */

  // Admin access login triggers
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const loginMethod = document.querySelector('input[name="login-method"]:checked').value;
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Validating Authorization... <i data-lucide="loader" class="animate-spin"></i>';
      lucide.createIcons();

      try {
        if (loginMethod === "firebase") {
          if (!window.portfolioStore.isFirebaseInitialized || !window.portfolioStore.auth) {
            throw new Error("Cloud sync offline. Configure database connection values first.");
          }
          const email = document.getElementById("admin-email").value.trim();
          const password = document.getElementById("admin-password").value;
          await window.portfolioStore.auth.signInWithEmailAndPassword(email, password);
        } else {
          const passcode = document.getElementById("admin-passcode").value;
          if (passcode === "admin123") {
            sessionStorage.setItem("admin_session", "active");
            setAdminState(true);
          } else {
            throw new Error("Invalid engineering passcode credential.");
          }
        }
        
        showToast("Authorization established. Welcome to workspace panel.");
        closeModal(adminLoginModal);
      } catch (err) {
        showToast(err.message, true);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Login As Administrator <i data-lucide="log-in"></i>';
        lucide.createIcons();
      }
    });
  }

  // Admin exit / session termination
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      if (window.portfolioStore.isFirebaseInitialized && window.portfolioStore.auth) {
        await window.portfolioStore.auth.signOut();
      }
      sessionStorage.removeItem("admin_session");
      setAdminState(false);
      showToast("Workspace authorization terminated.");
    });
  }

  // Saves project (ADD or EDIT depending on editingProjectId)
  if (projectForm) {
    projectForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const submitBtn = projectForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Synchronizing configuration... <i data-lucide="loader" class="animate-spin"></i>';
      lucide.createIcons();

      const title = document.getElementById("proj-title").value.trim();
      const description = document.getElementById("proj-desc").value.trim();
      const tagsString = document.getElementById("proj-tags").value.trim();
      const githubLink = document.getElementById("proj-github").value.trim();
      const liveLink = document.getElementById("proj-live").value.trim();
      const imageUrl = document.getElementById("proj-image").value.trim();
      const gradientIndex = parseInt(document.getElementById("proj-gradient").value, 10);

      const tags = tagsString.split(",")
        .map(t => t.trim())
        .filter(t => t.length > 0);

      try {
        await window.portfolioStore.saveProject({
          title,
          description,
          tags,
          githubLink,
          liveLink,
          imageUrl,
          gradientIndex
        }, state.editingProjectId);

        showToast(state.editingProjectId ? "Project specifications updated!" : "New project record saved successfully!");
        closeModal(projectModal);
      } catch (err) {
        showToast("Failed to compile records: " + err.message, true);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Save Project Configuration <i data-lucide="check-square"></i>';
        lucide.createIcons();
      }
    });
  }

  // Toggle admin access modalities UI
  const loginMethods = document.querySelectorAll('input[name="login-method"]');
  loginMethods.forEach(method => {
    method.addEventListener("change", (e) => {
      const isFirebase = e.target.value === "firebase";
      document.getElementById("firebase-login-fields").style.display = isFirebase ? "block" : "none";
      document.getElementById("passcode-login-fields").style.display = isFirebase ? "none" : "block";
      
      document.getElementById("admin-email").required = isFirebase;
      document.getElementById("admin-password").required = isFirebase;
      document.getElementById("admin-passcode").required = !isFirebase;
    });
  });

  /* ==========================================================================
     7. TELEMETRY DATABASE CREDENTIALS FORMS
     ========================================================================== */

  function prefillConfigForm() {
    const savedConfig = localStorage.getItem("portfolio_firebase_config");
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        document.getElementById("cfg-apiKey").value = config.apiKey || "";
        document.getElementById("cfg-authDomain").value = config.authDomain || "";
        document.getElementById("cfg-projectId").value = config.projectId || "";
        document.getElementById("cfg-storageBucket").value = config.storageBucket || "";
        document.getElementById("cfg-messagingSenderId").value = config.messagingSenderId || "";
        document.getElementById("cfg-appId").value = config.appId || "";
      } catch (err) {
        console.error(err);
      }
    }
  }

  if (configForm) {
    configForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const config = {
        apiKey: document.getElementById("cfg-apiKey").value.trim(),
        authDomain: document.getElementById("cfg-authDomain").value.trim(),
        projectId: document.getElementById("cfg-projectId").value.trim(),
        storageBucket: document.getElementById("cfg-storageBucket").value.trim(),
        messagingSenderId: document.getElementById("cfg-messagingSenderId").value.trim(),
        appId: document.getElementById("cfg-appId").value.trim(),
      };

      try {
        window.portfolioStore.saveFirebaseConfig(config);
        showToast("Firebase cloud connection established successfully!");
        closeModal(configModal);
        
        // Hot-reload dynamic streams
        init();
      } catch (err) {
        showToast(err.message, true);
      }
    });
  }

  if (clearConfigBtn) {
    clearConfigBtn.addEventListener("click", () => {
      if (confirm("Disconnect database connection and revert to local browser fallback storage?")) {
        window.portfolioStore.clearFirebaseConfig();
        showToast("Database decoupled. Returned to Local Storage.");
        closeModal(configModal);
        init();
      }
    });
  }

  /* ==========================================================================
     8. CONTACT TRANSMISSION DISPATCHER
     ========================================================================== */

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const submitBtn = document.getElementById("contact-submit-btn");
      const originalHtml = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Dispatching Signals... <i data-lucide="loader" class="animate-spin"></i>';
      lucide.createIcons();
      
      const name = document.getElementById("contact-name").value.trim();
      const email = document.getElementById("contact-email").value.trim();
      const message = document.getElementById("contact-message").value.trim();
      
      try {
        await window.portfolioStore.submitContactMessage({ name, email, message });
        showToast("Transmission complete! Your message has been routed.");
        contactForm.reset();
      } catch (err) {
        showToast("Transmission collision: " + err.message, true);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHtml;
        lucide.createIcons();
      }
    });
  }

  /* ==========================================================================
     9. HELPER PROCEDURES
     ========================================================================== */

  // Cybernetic toast notification constructor
  function showToast(message, isError = false) {
    const existing = document.querySelector(".toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = `toast ${isError ? "toast-error" : "toast-success"}`;
    
    // Choose beautiful status indicators
    const statusIcon = isError ? "alert-triangle" : "check-circle-2";
    toast.innerHTML = `<i data-lucide="${statusIcon}"></i> <span>${message}</span>`;
    
    document.body.appendChild(toast);
    lucide.createIcons();
    
    setTimeout(() => toast.classList.add("toast-visible"), 10);
    
    setTimeout(() => {
      toast.classList.remove("toast-visible");
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  }

  // Initialize Portfolio controllers
  init();
});
