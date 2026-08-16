LOADING / INITIALIZATION EXPERIENCE

Create a premium technology-inspired loading experience that appears when the website is first opened.

CONCEPT:
"System Initialization"

The loading screen should feel like a sophisticated developer system booting up.

VISUAL STYLE:
- Deep black / charcoal background
- Minimal white typography
- Subtle accent color
- Fine grid / technical lines
- Very subtle particles
- Soft glow
- Monospaced typography for technical information
- Clean and cinematic
- No cheesy hacker aesthetics
- No excessive neon
- No fake terminal spam
- No Matrix-style falling characters

LOADING SEQUENCE:

Phase 1 — INITIALIZATION

Display a minimal centered logo / monogram.

Example:

[ HX ]

INITIALIZING SYSTEM...

The logo should appear with a subtle opacity and scale animation.

Phase 2 — SYSTEM STATUS

Display several small technical status messages that appear progressively:

> Initializing interface...
> Loading components...
> Establishing visual system...
> Loading 3D environment...
> Preparing experience...

Each message should appear smoothly and disappear or move upward as the system progresses.

Do NOT rapidly spam text.

Phase 3 — PROGRESS

Show a sophisticated progress indicator.

Example:

SYSTEM INITIALIZATION

████████████████░░░░ 82%

The progress should animate smoothly from 0 → 100%.

Do not make the progress fake or jump randomly.

Phase 4 — THREE.JS INITIALIZATION

When the Three.js scene is ready:

> 3D ENVIRONMENT READY

The background can subtly transition from the loading environment into the main Hero scene.

Phase 5 — TRANSITION TO WEBSITE

When loading reaches 100%:

100%

SYSTEM READY

Then perform a cinematic transition:

- Loading overlay slowly moves upward or fades away.
- Main website is revealed underneath.
- Hero typography enters with a staggered animation.
- Three.js scene fades in.
- Navbar appears.
- No sudden jump.

The transition should feel like entering an interactive digital environment.

LOADING SCREEN DETAILS:

Add subtle technical details around the edges:

TOP LEFT:
SYSTEM / PORTFOLIO

TOP RIGHT:
BUILD 2026.08

BOTTOM LEFT:
INITIALIZING...

BOTTOM RIGHT:
[00–100%]

These elements should be extremely subtle.

OPTIONAL:
Add a thin animated grid in the background.

The grid should slowly shift or pulse.

Do not make the grid visually dominant.

MOUSE INTERACTION:

Desktop:
- Background particles react very subtly to cursor movement.
- Avoid large cursor effects.

Mobile:
- Disable expensive mouse-based effects.

SOUND:

Do NOT add autoplay sound.

PERFORMANCE:

The loading screen must not unnecessarily delay the website.

IMPORTANT:
The loading experience should only wait for actual critical resources.

Do not artificially keep the user on the loading screen for several seconds.

If the application loads quickly, the animation should adapt naturally.

Use a minimum visual duration of approximately 600–1000ms only if necessary to prevent an abrupt flash.

If loading takes longer:
- Continue showing meaningful progress.
- Never freeze at an arbitrary percentage.

TECHNICAL REQUIREMENTS:

Implement loading state based on actual application readiness.

Track:
- Fonts
- Critical assets
- Three.js initialization
- Initial application render

Use React state/context for loading orchestration.

The loading screen should be reusable and isolated as:

<LoadingScreen />

It should integrate with the existing animation system.

Support:
- prefers-reduced-motion
- Mobile devices
- Low-powered devices
- WebGL unavailable fallback

REDUCED MOTION:

When prefers-reduced-motion is enabled:
- Remove large movement
- Remove parallax
- Reduce particle movement
- Use simple opacity transition
- Keep the loading experience short

FINAL FEEL:

The experience should feel like:

"Initializing a sophisticated digital workspace."

Not:

"Loading a website template."

The loading animation should make the visitor curious about what is coming next while remaining fast, elegant, and professional.