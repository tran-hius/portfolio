ANIMATION & INTERACTION SYSTEM

Add a sophisticated animation system to the portfolio.

The animation style should feel:
- Cinematic
- Smooth
- Premium
- Subtle
- Technical
- Intentional

The animations must enhance the user experience rather than distract from the content.

GENERAL RULES:
- Never animate everything at once.
- Avoid excessive bouncing, spinning, scaling, or flashy effects.
- Avoid generic template animations.
- Keep transitions smooth and short.
- Prioritize perceived performance.
- Use animation to establish hierarchy and guide the user's attention.

PAGE LOAD:

Create a cinematic initial page reveal.

Sequence:
1. Background appears first.
2. Navigation fades/slides into place.
3. Hero typography reveals progressively.
4. Supporting text appears slightly after the heading.
5. CTA buttons appear last.
6. Three.js scene gradually fades in.

Use subtle staggered animations rather than all elements appearing simultaneously.

HERO ANIMATION:

Hero heading:
- Reveal line by line or word by word.
- Slight upward movement combined with opacity.
- Smooth easing.

Subtitle:
- Fade and slide upward after the heading.

CTA:
- Slight delayed reveal.
- Subtle hover interaction.
- Button should feel responsive but not flashy.

Three.js:
- Slowly animate on its own.
- React subtly to mouse movement.
- Add gentle parallax based on cursor position.
- Avoid aggressive camera movement.
- Use smooth interpolation instead of instant movement.

SCROLL ANIMATIONS:

Every major section should reveal naturally when entering the viewport.

Use:
- opacity
- translateY
- subtle scale
- staggered children

Example:

Section heading
    ↓
Description
    ↓
Content

Each should appear with a small delay.

Do NOT animate sections from extreme distances.

PROJECT ANIMATIONS:

Project cards should have sophisticated interactions.

On hover:
- Slight upward movement
- Image subtly scales
- Overlay appears smoothly
- Technology badges transition subtly
- Arrow/icon moves slightly

Use different visual treatment for featured projects.

Featured project images may have:
- subtle parallax
- slow zoom
- masked reveal

Do not make cards bounce.

SKILLS ANIMATION:

Skill items should appear with a subtle stagger.

On hover:
- Small translation
- Slight border/lighting change
- Icon reacts subtly

Avoid progress bars unless they represent real measurable data.

EXPERIENCE TIMELINE:

Animate the timeline progressively as the user scrolls.

Suggested behavior:
- Timeline line gradually reveals
- Experience entries fade in one by one
- Timeline markers activate when their entry enters the viewport

Keep the animation subtle.

NAVIGATION:

At the top:
- Transparent navigation
- Minimal background

When scrolling:
- Smoothly transition into a slightly blurred / translucent background
- Add subtle border
- Maintain the same height

Active navigation item:
- Small animated indicator
- Smooth transition between sections

MICRO INTERACTIONS:

Buttons:
- Smooth hover transition
- Slight movement
- Subtle icon movement

Links:
- Animated underline or opacity transition

Icons:
- Small purposeful movement
- Never excessive spinning

Cards:
- Subtle lift
- Subtle shadow/light change

CURSOR INTERACTION:

Desktop only.

Create subtle cursor-based interactions:
- Hero elements react slightly to cursor position.
- Three.js scene responds to cursor.
- Selected elements can have subtle magnetic movement.

Do NOT create a huge custom cursor that reduces usability.

PAGE TRANSITIONS:

If the application uses multiple pages:

Use smooth page transitions:
- fade
- slight vertical movement
- consistent timing

Do not use dramatic page wipes unless they clearly fit the design.

THREE.JS ANIMATION:

The Three.js scene should have layered motion:

Layer 1:
Very slow autonomous rotation.

Layer 2:
Subtle particle movement.

Layer 3:
Mouse-based parallax.

Layer 4:
Small lighting/camera response.

All movement should use interpolation and damping.

Avoid:
- rapid rotation
- excessive particles
- heavy post-processing
- constant camera movement

PERFORMANCE:

Animation must be optimized.

Requirements:
- Use requestAnimationFrame efficiently.
- Avoid unnecessary React state updates inside animation loops.
- Prefer refs for continuous animation values.
- Use Framer Motion for DOM animations.
- Use React Three Fiber's animation mechanisms for 3D.
- Reduce animation complexity on mobile.
- Reduce or disable heavy effects on low-powered devices.
- Support prefers-reduced-motion.

REDUCED MOTION:

When prefers-reduced-motion is enabled:
- Disable large movement animations.
- Disable aggressive parallax.
- Reduce Three.js motion.
- Keep simple opacity transitions.
- Preserve usability and content hierarchy.

TIMING:

Use consistent animation timing.

Fast interactions:
~150–250ms

Normal UI transitions:
~250–400ms

Section reveals:
~400–700ms

Hero entrance:
~600–1200ms

Avoid unnecessarily long animations.

EASING:

Prefer smooth easing such as:
- easeOut
- easeInOut
- cubic-bezier based easing

Avoid excessive elastic/bounce easing.

FINAL PRINCIPLE:

The user should notice that the website feels smooth and alive,
but should not constantly notice the animations themselves.

Animation should communicate:
quality
depth
hierarchy
responsiveness
technical sophistication

rather than:
"look how many animations this website has."