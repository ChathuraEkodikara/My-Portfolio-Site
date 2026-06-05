/**
 * firebase-config.js
 * Manages data access and schemas for Chathura Kodikara's Portfolio in two modes:
 * 1. Firebase Cloud Mode: Connects to Firebase Firestore & Auth.
 * 2. Local Fallback Mode: Runs completely in-browser using localStorage.
 * 
 * Provides static arrays for Experience, Education, Achievements, Leadership, and Certifications,
 * and dynamic CRUD controls for Portfolio Projects and Contact Submissions.
 */

// Chathura's Academic Records
const DEFAULT_EDUCATION = [
  {
    id: "edu1",
    institution: "University of Kelaniya",
    degree: "BSc (Hons.) in Electronics and Computer Science",
    duration: "2023 - Expected 2027",
    gpa: "CGPA 3.42 / 4.00",
    description: "Focusing on embedded architectures, industrial electronics, hardware-software co-design, control systems, and automated computing principles."
  },
  {
    id: "edu2",
    institution: "Sabaragamuwa University of Sri Lanka",
    degree: "Diploma in English Language and English Literature",
    duration: "2022 - 2023",
    description: "Comprehensive coursework focusing on advanced communication, technical presentation, and literature appreciation."
  },
  {
    id: "edu3",
    institution: "Bandarawela Central College",
    degree: "GCE Advanced Level (Physical Science Stream)",
    duration: "2007 - 2020",
    description: "Specialized in Advanced Mathematics, Physics, and Chemistry. Active participant in school technology clubs and athletic societies."
  }
];

// Chathura's Professional Positions
const DEFAULT_EXPERIENCES = [
  {
    id: "exp1",
    role: "Freelance Project Manager",
    company: "ITSELF Automation",
    duration: "2025 (9 Months)",
    description: "Managed client requirements, project planning, and technical coordination for embedded-related projects. Oversaw agile task distributions, system engineering milestones, and successful delivery of customized industrial controller units.",
    tags: ["Embedded Systems", "Agile Management", "Industrial Automation", "Client Relations"]
  },
  {
    id: "exp2",
    role: "Part-time Electronic Developer",
    company: "Embed Workshop",
    duration: "2024 (3 Months)",
    description: "Assisted in multi-layer PCB design, hardware prototyping, testing, sensor calibration, troubleshooting, and micro-controller system integration activities. Successfully constructed custom breakout shields for field testing.",
    tags: ["PCB Design", "Altium Designer", "Hardware Debugging", "Prototyping"]
  }
];

// Chathura's Core Projects
const DEFAULT_PROJECTS = [
  {
    id: "proj1",
    title: "Automated Cut-Piece Numbering System - FYP",
    description: "An advanced industrial-grade automated cut-piece numbering system designed for fabric production lines. Controls real-time counting, numeric tagging, and thermal printing feedback.",
    tags: ["STM32", "Embedded C", "Industrial Sensors", "Stepper Motors", "Automation"],
    githubLink: "https://github.com/kcek2001",
    liveLink: "",
    imageUrl: "",
    gradientIndex: 0
  },
  {
    id: "proj2",
    title: "AgroPilot - Smart Agriculture IoT System",
    description: "A smart wireless IoT system utilizing localized sensor nodes (soil moisture, temperature, pH) to trigger automated precision irrigation via real-time dashboard analytics.",
    tags: ["ESP32", "IoT", "Sensors", "C++", "Firebase"],
    githubLink: "https://github.com/kcek2001",
    liveLink: "",
    imageUrl: "",
    gradientIndex: 3
  },
  {
    id: "proj3",
    title: "RoomSync - Energy Monitoring System",
    description: "A secure, smart room-level energy telemetry platform measuring active current consumption, power factor indices, and providing automated power-shedding logic.",
    tags: ["Arduino IDE", "ESP8266", "Firebase", "Current Sensors", "C++"],
    githubLink: "https://github.com/kcek2001",
    liveLink: "",
    imageUrl: "",
    gradientIndex: 1
  },
  {
    id: "proj4",
    title: "Lycan - Battle Robot",
    description: "A high-torque, combat-ready remote control robot designed for maximum structural durability and fitted with brushless spinning weaponry.",
    tags: ["Arduino", "SolidWorks", "Brushless Motors", "RF Control", "Robotics"],
    githubLink: "https://github.com/kcek2001",
    liveLink: "",
    imageUrl: "",
    gradientIndex: 2
  },
  {
    id: "proj5",
    title: "RC Airplane Project",
    description: "A custom-engineered fixed-wing RC airplane boasting custom flight stabilization firmware, real-time gyro telemetry, and dynamic elevator/aileron actuators.",
    tags: ["Avionics", "RF Telemetry", "C++", "SolidWorks", "Aerodynamics"],
    githubLink: "https://github.com/kcek2001",
    liveLink: "",
    imageUrl: "",
    gradientIndex: 4
  },
  {
    id: "proj6",
    title: "3-DOF Robotic Arm",
    description: "Precision 3 Degrees-of-Freedom robotic manipulator driven by servo actuators and controlled using inverse kinematic coordinates for autonomous sorting.",
    tags: ["STM32", "Servo Systems", "Inverse Kinematics", "C++", "Robotics"],
    githubLink: "https://github.com/kcek2001",
    liveLink: "",
    imageUrl: "",
    gradientIndex: 0
  },
  {
    id: "proj7",
    title: "Pet Robot using STM32",
    description: "An interactive, bio-inspired walking pet robot utilizing low-level STM32 registers for multi-channel servo gait planning and sensory collision responses.",
    tags: ["STM32", "Embedded C", "Altium", "Proteus", "Kinematics"],
    githubLink: "https://github.com/kcek2001",
    liveLink: "",
    imageUrl: "",
    gradientIndex: 2
  }
];

// Chathura's Career Achievements
const DEFAULT_ACHIEVEMENTS = [
  {
    id: "ach1",
    title: "UOK Robot Battles 2K24",
    role: "Champion",
    year: "2024",
    description: "Won first place in the highly competitive annual national robotic tournament representing the University of Kelaniya with our custom automated battle-bot."
  },
  {
    id: "ach2",
    title: "TechXpo 2024",
    role: "Most Popular Exhibit",
    year: "2025",
    description: "Awarded most popular display award by public and academic voting for a fully working 3-DOF robotic arm demonstration and IoT control dashboard."
  },
  {
    id: "ach3",
    title: "Master Designer 2.0",
    role: "Finalist",
    year: "2024",
    description: "Shortlisted in the top national teams for excellence in rapid industrial CAD design, electronics optimization, and structural analysis under pressure."
  },
  {
    id: "ach4",
    title: "Paramount 4.0",
    role: "Finalist",
    year: "2024",
    description: "Demonstrated custom embedded system prototypes addressing environmental automation challenges, advancing through rigorous technical evaluations."
  }
];

// Chathura's Leadership and Extracurriculars
const DEFAULT_LEADERSHIP = [
  {
    id: "lead1",
    organization: "IEEE IES Student Chapter UoK",
    role: "Vice Secretary",
    duration: "2024 - 2025",
    description: "Assisted in managing operations, organizing seminars on smart factories and industrial PLC systems, and promoting student engineering initiatives."
  },
  {
    id: "lead2",
    organization: "UOK Robot Battles",
    role: "Head of Designing",
    duration: "2025",
    description: "Spearheaded technical graphics, arena blueprints, and promotional design collateral for the university's signature robotics event."
  },
  {
    id: "lead3",
    organization: "Electronics and Computer Science Club",
    role: "Level-III Committee Member",
    duration: "2025 - 2026",
    description: "Coordinating peer training sessions, hackathons, and acting as a bridge between undergraduate students and faculty mentors."
  },
  {
    id: "lead4",
    organization: "Bandarawela Central College Football Team",
    role: "1st XI Captain",
    duration: "2018",
    description: "Led the school's varsity soccer squad through division tournaments, coordinating training programs and developing crucial team synergy."
  }
];

// Chathura's Certifications
const DEFAULT_CERTIFICATIONS = [
  {
    id: "cert1",
    title: "Advanced Robotics Course",
    provider: "Sri Lanka Institute of Robotics"
  },
  {
    id: "cert2",
    title: "PLC Programming and Industrial Automation",
    provider: "Sri Lanka Institute of Robotics"
  },
  {
    id: "cert3",
    title: "Robotics Automation and Smart Manufacturing",
    provider: "IEEE"
  },
  {
    id: "cert4",
    title: "AI/ML Engineer Stage 1",
    provider: "SLIIT"
  },
  {
    id: "cert5",
    title: "Altium PCB Design",
    provider: "Altium Education"
  },
  {
    id: "cert6",
    title: "AutoCAD and SolidWorks Basics",
    provider: "Alison"
  }
];

class PortfolioStore {
  constructor() {
    this.db = null;
    this.auth = null;
    this.isFirebaseInitialized = false;
    this.listeners = [];
    
    // Force clear any old local storage mock data caches in user's browser
    if (localStorage.getItem("portfolio_db_version") !== "2.5") {
      localStorage.removeItem("portfolio_projects");
      localStorage.removeItem("portfolio_experiences");
      localStorage.removeItem("portfolio_education");
      localStorage.removeItem("portfolio_achievements");
      localStorage.removeItem("portfolio_leadership");
      localStorage.removeItem("portfolio_certifications");
      localStorage.setItem("portfolio_db_version", "2.5");
    }
    
    this.initStore();
  }

  /**
   * Initializes the store, loading keys from localStorage if they exist.
   */
  initStore() {
    const savedConfig = localStorage.getItem("portfolio_firebase_config");
    
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        if (config && config.apiKey && config.projectId) {
          // Check for compat client SDK
          if (typeof firebase !== 'undefined' && firebase.apps) {
            if (!firebase.apps.length) {
              firebase.initializeApp(config);
            }
            this.db = firebase.firestore();
            this.auth = firebase.auth();
            this.isFirebaseInitialized = true;
            console.log("⚡ Firebase Portfolio Store connected successfully.");
            return;
          }
        }
      } catch (e) {
        console.error("⚠️ Failed to parse custom Firebase config, falling back to Local Storage:", e);
      }
    }
    
    console.log("ℹ️ Running in Local Storage Mode (Offline Database Fallback).");
    this.initializeLocalStorageDefaults();
  }

  /**
   * Seeds localStorage if clean to guarantee high-quality developer data immediately.
   */
  initializeLocalStorageDefaults() {
    if (!localStorage.getItem("portfolio_projects")) {
      localStorage.setItem("portfolio_projects", JSON.stringify(DEFAULT_PROJECTS));
    }
    if (!localStorage.getItem("portfolio_experiences")) {
      localStorage.setItem("portfolio_experiences", JSON.stringify(DEFAULT_EXPERIENCES));
    }
    if (!localStorage.getItem("portfolio_education")) {
      localStorage.setItem("portfolio_education", JSON.stringify(DEFAULT_EDUCATION));
    }
    if (!localStorage.getItem("portfolio_achievements")) {
      localStorage.setItem("portfolio_achievements", JSON.stringify(DEFAULT_ACHIEVEMENTS));
    }
    if (!localStorage.getItem("portfolio_leadership")) {
      localStorage.setItem("portfolio_leadership", JSON.stringify(DEFAULT_LEADERSHIP));
    }
    if (!localStorage.getItem("portfolio_certifications")) {
      localStorage.setItem("portfolio_certifications", JSON.stringify(DEFAULT_CERTIFICATIONS));
    }
  }

  /**
   * Subscribe to projects data updates.
   * Runs the callback immediately and triggers on any subsequent updates.
   */
  subscribeToProjects(callback) {
    if (this.isFirebaseInitialized && this.db) {
      return this.db.collection("projects")
        .orderBy("createdAt", "desc")
        .onSnapshot(
          (snapshot) => {
            const projects = [];
            snapshot.forEach((doc) => {
              projects.push({ id: doc.id, ...doc.data() });
            });
            
            // If empty in Firestore, seed it with default projects
            if (projects.length === 0) {
              this.seedFirestoreDefaults().then(() => {});
            } else {
              callback(projects);
            }
          },
          (error) => {
            console.error("Firestore database subscription error, utilizing local backup:", error);
            this.subscribeToLocalProjects(callback);
          }
        );
    } else {
      this.subscribeToLocalProjects(callback);
      return () => {}; // Dummy unsubscribe
    }
  }

  subscribeToLocalProjects(callback) {
    const emit = () => {
      const data = JSON.parse(localStorage.getItem("portfolio_projects") || "[]");
      callback(data);
    };

    this.listeners.push(emit);
    emit();

    return () => {
      this.listeners = this.listeners.filter(l => l !== emit);
    };
  }

  /**
   * Seed dynamic default projects into Firestore on first connect.
   */
  async seedFirestoreDefaults() {
    if (!this.db) return;
    try {
      const batch = this.db.batch();
      DEFAULT_PROJECTS.forEach((proj) => {
        const docRef = this.db.collection("projects").doc();
        batch.set(docRef, {
          title: proj.title,
          description: proj.description,
          tags: proj.tags,
          githubLink: proj.githubLink,
          liveLink: proj.liveLink,
          imageUrl: proj.imageUrl || "",
          gradientIndex: proj.gradientIndex,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      });
      await batch.commit();
      console.log("🛰️ Seeded Chathura's default automation projects to Firestore.");
    } catch (err) {
      console.error("Error seeding default Firestore data:", err);
    }
  }

  // Get static schemas
  getExperiences() {
    return JSON.parse(localStorage.getItem("portfolio_experiences")) || DEFAULT_EXPERIENCES;
  }

  getEducation() {
    return JSON.parse(localStorage.getItem("portfolio_education")) || DEFAULT_EDUCATION;
  }

  getAchievements() {
    return JSON.parse(localStorage.getItem("portfolio_achievements")) || DEFAULT_ACHIEVEMENTS;
  }

  getLeadership() {
    return JSON.parse(localStorage.getItem("portfolio_leadership")) || DEFAULT_LEADERSHIP;
  }

  getCertifications() {
    return JSON.parse(localStorage.getItem("portfolio_certifications")) || DEFAULT_CERTIFICATIONS;
  }

  /**
   * Save a project (Handles both ADD and EDIT / UPDATE)
   */
  async saveProject(project, projectId = null) {
    const projectPayload = {
      title: project.title || "Untitled Automation Project",
      description: project.description || "No project description provided.",
      tags: project.tags || [],
      githubLink: project.githubLink || "",
      liveLink: project.liveLink || "",
      imageUrl: project.imageUrl || "",
      gradientIndex: project.gradientIndex ?? Math.floor(Math.random() * 5),
    };

    if (this.isFirebaseInitialized && this.db) {
      try {
        if (projectId) {
          // EDIT / UPDATE EXISTING
          await this.db.collection("projects").doc(projectId).update(projectPayload);
          console.log(`✅ Project ${projectId} updated in Firestore.`);
        } else {
          // ADD NEW
          await this.db.collection("projects").add({
            ...projectPayload,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });
          console.log("✅ New project created in Firestore.");
        }
        return true;
      } catch (error) {
        console.error("Error saving to Firestore:", error);
        throw error;
      }
    } else {
      // Local storage fallback CRUD
      const projects = JSON.parse(localStorage.getItem("portfolio_projects") || "[]");
      
      if (projectId) {
        // EDIT / UPDATE EXISTING
        const index = projects.findIndex(p => p.id === projectId);
        if (index !== -1) {
          projects[index] = {
            id: projectId,
            ...projectPayload
          };
          localStorage.setItem("portfolio_projects", JSON.stringify(projects));
        } else {
          throw new Error("Project not found in local records.");
        }
      } else {
        // ADD NEW
        const localProject = {
          id: "local_" + Date.now(),
          ...projectPayload
        };
        projects.unshift(localProject);
        localStorage.setItem("portfolio_projects", JSON.stringify(projects));
      }

      // Trigger local listener stream update
      this.listeners.forEach(l => l());
      return true;
    }
  }

  /**
   * Removes a portfolio project
   */
  async deleteProject(projectId) {
    if (this.isFirebaseInitialized && this.db) {
      try {
        await this.db.collection("projects").doc(projectId).delete();
        console.log(`✅ Removed project doc ${projectId} from Firestore.`);
        return true;
      } catch (error) {
        console.error(`Error deleting Firestore project document ${projectId}:`, error);
        throw error;
      }
    } else {
      let projects = JSON.parse(localStorage.getItem("portfolio_projects") || "[]");
      projects = projects.filter(p => p.id !== projectId);
      localStorage.setItem("portfolio_projects", JSON.stringify(projects));
      
      this.listeners.forEach(l => l());
      return true;
    }
  }

  /**
   * Submit contact form message.
   * Feeds into Firestore 'contacts' collection, or lists locally on fallback.
   */
  async submitContactMessage(contact) {
    const messageData = {
      name: contact.name || "Anonymous Guest",
      email: contact.email || "",
      message: contact.message || "",
      timestamp: new Date().toISOString()
    };

    if (this.isFirebaseInitialized && this.db) {
      try {
        await this.db.collection("contacts").add(messageData);
        console.log("📬 Contact form message synced to Firestore.");
        return true;
      } catch (error) {
        console.warn("Firestore error saving contact message, falling back to local simulation:", error);
      }
    }

    // Local mode fallback logs
    const logs = JSON.parse(localStorage.getItem("portfolio_contacts") || "[]");
    logs.unshift(messageData);
    localStorage.setItem("portfolio_contacts", JSON.stringify(logs));
    console.log("📬 Contact form message saved locally.", messageData);
    return true;
  }

  /**
   * Connect to a custom Firebase Configuration
   */
  saveFirebaseConfig(config) {
    if (!config || !config.apiKey || !config.projectId) {
      throw new Error("Invalid config. An API Key and Project ID must be defined.");
    }
    localStorage.setItem("portfolio_firebase_config", JSON.stringify(config));
    this.initStore();
    return true;
  }

  /**
   * Reset database back to Local Storage mode
   */
  clearFirebaseConfig() {
    localStorage.removeItem("portfolio_firebase_config");
    this.isFirebaseInitialized = false;
    this.db = null;
    this.auth = null;
    this.initializeLocalStorageDefaults();
    console.log("🧹 Custom configurations cleared. Resumed local storage engine.");
  }
}

// Attach store globally
window.portfolioStore = new PortfolioStore();
