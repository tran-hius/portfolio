Design and build a premium, modern developer portfolio website with Next.js, TypeScript, Tailwind CSS, shadcn/ui, Lucide icons, and Three.js / React Three Fiber.

CORE DESIGN CONCEPT:
Dark editorial + cinematic + futuristic developer portfolio.

The website should feel like a high-end developer portfolio created by an experienced engineer, not a generic AI-generated template.

VISUAL STYLE:
- Deep black / charcoal background
- White and muted-gray typography
- One sophisticated accent color
- Strong typography hierarchy
- Large editorial headings
- Generous whitespace
- Thin subtle borders
- Minimal glassmorphism
- Soft lighting
- Subtle gradients only where necessary
- Avoid excessive rounded cards
- Avoid excessive neon
- Avoid cyberpunk aesthetics
- Avoid looking like a SaaS dashboard

THREE.JS / 3D EXPERIENCE:
Use Three.js through React Three Fiber.

The 3D scene should be primarily used in the Hero section.

Create a sophisticated interactive 3D element:
- Abstract geometric structure / particle field / wireframe object
- Slowly rotating
- Reacts subtly to mouse movement
- Subtle depth and lighting
- Dark, elegant appearance
- Smooth animation
- Low visual noise
- Should complement the typography rather than compete with it

The 3D scene must:
- Be performant
- Lazy-load where appropriate
- Support responsive layouts
- Respect prefers-reduced-motion
- Have a fallback for devices that cannot render WebGL
- Never block the main content
- Never make the website feel like a Three.js experiment

HERO:
Create a visually striking hero section.

Left side:
- Large name
- "Full-Stack Developer" headline
- Short professional introduction
- View Projects CTA
- Contact CTA
- GitHub / LinkedIn links

Right side:
- Interactive Three.js scene

The hero should immediately communicate:
"experienced developer who builds serious software."

ABOUT:
- Short introduction
- Developer statistics
- Years of experience
- Number of projects
- Technologies

SKILLS:
Organize skills into:
- Frontend
- Backend
- Database
- DevOps
- Tools

Use subtle interactive animations rather than generic progress bars.

PROJECTS:
Create a premium Featured Projects section.

Each project should contain:
- Large visual/thumbnail
- Project title
- Description
- Technologies
- GitHub
- Live demo
- Project category

Make featured projects visually dominant.

Use asymmetric layouts instead of identical cards for every project.

EXPERIENCE:
Use a clean vertical timeline.

Include:
- Company
- Position
- Date
- Description
- Technologies

EDUCATION:
Elegant timeline or editorial layout.

CERTIFICATES / ACHIEVEMENTS:
Compact premium cards with subtle hover interactions.

CONTACT:
Strong final CTA.

Example:
"Have an idea worth building?"

Include:
- Email
- GitHub
- LinkedIn
- Contact button

NAVIGATION:
- Sticky navigation
- Transparent at top
- Subtle blur/background on scroll
- Active section indicator
- Smooth scrolling

ANIMATIONS:
Use Framer Motion where appropriate.

Animations should be:
- subtle
- fast
- purposeful
- smooth

Examples:
- Hero text reveal
- Section reveal on scroll
- Project image movement
- Card hover
- Button micro-interactions
- Three.js mouse interaction

Do NOT over-animate the page.

RESPONSIVE:
- Mobile-first
- Excellent desktop experience
- Tablet support
- Mobile navigation
- Three.js scene adapts or simplifies on mobile
- No horizontal overflow

ACCESSIBILITY:
- Semantic HTML
- Keyboard navigation
- Proper contrast
- ARIA labels where necessary
- prefers-reduced-motion support

PERFORMANCE:
- Optimize Three.js rendering
- Avoid unnecessary re-renders
- Use Suspense and lazy loading
- Limit particle count
- Dispose WebGL resources correctly
- Optimize images
- Avoid loading heavy assets before needed

COMPONENT ARCHITECTURE:
Create reusable components:

Navbar
Hero
About
Stats
Skills
Projects
ProjectCard
Experience
Education
Certificates
Achievements
Contact
Footer
ThreeScene

Keep the code modular and production-ready.

IMPORTANT:
Do not make the design look like:
- an admin dashboard
- a SaaS landing page
- a generic Tailwind template
- a cyberpunk website
- an excessive glassmorphism showcase
- a Three.js demo

The 3D experience is a supporting visual element.

Typography, spacing, composition and content hierarchy are more important than visual effects.

The final result should feel:
premium
technical
minimal
cinematic
confident
modern
professional.