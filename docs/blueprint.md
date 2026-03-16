# **App Name**: Provincial Intelligent Safety

## Core Features:

- Real-time Incident Monitoring Dashboard: A comprehensive, map-centric dashboard displaying active SOS triggers, AI-detected threats, and ongoing incidents with their status and location in real time. Features filterable views for administrators to prioritize responses.
- Emergency Response Coordination Portal: Provide administrators with the ability to dispatch specific emergency services (police, ambulance, fire, security) to incident locations and to automatically notify designated family members through Firebase messaging and in-app alerts.
- Incident Video Evidence Review: Allow playback and review of 20-second video evidence clips, uploaded by the mobile app's dual-camera system to Firebase Storage, directly associated with specific incident reports.
- Localized Incident Alerts Map: Display relevant incidents on a map, tailored to an administrator's operational zone or queried location using Firestore and geohash capabilities, showing only incidents within a configurable radius.
- AI-Driven Risk & Threat Analysis Overview: Provide a centralized overview of AI (YOLOv8, YAMNet) detection reports from mobile units, display aggregated predictive safety scores, and highlight advisory messages for administrative review and action.
- User & Guardian Network Management: A secure interface for managing citizen accounts, family contact lists, and overseeing the network of volunteer guardians, including their availability and assistance requests.
- POPIA Compliance & Data Control: Administrative controls to manage data retention policies, monitor location sharing consent, and define camera recording protocols to ensure adherence to privacy regulations like POPIA.

## Style Guidelines:

- Color scheme: Dark. Emphasizes security and calm while allowing glowing elements to stand out. Inspired by 'calm green glow' and the overall 'safety' theme.
- Primary color: #60E672 (HSL: 140, 60%, 70%). A vibrant yet deep green, representing life, growth, and safety, chosen for its luminosity against a dark background.
- Background color: #1D241D (HSL: 140, 15%, 12%). A desaturated, very dark green-grey that provides a tranquil, understated base, harmonizing with the primary green.
- Accent color: #ADE842 (HSL: 110, 80%, 65%). A bright, lime-green hue, analogous to the primary color, offering high contrast and used for key interactive elements and highlights to evoke energy and immediate attention.
- Headline font: 'Space Grotesk' (sans-serif) for its modern, techy, and bold presence, aligning with the app's intelligent and futuristic feel.
- Body font: 'Inter' (sans-serif) for its high readability, objective clarity, and clean aesthetic, perfect for conveying critical information without visual noise.
- Use minimalist, system-style outline icons. These should maintain clarity against the glassmorphic cards and complement the overall sleek, calm aesthetic without adding visual clutter. Consistent green glow indicators for active states should be applied.
- The layout should feature a grid-based, spacious design, leveraging 'glassmorphic UI cards' with their rgba(10,15,10,0.65) background, 2px soft grey border, 24px radius, and subtle inner glow on hover/active states. A blurred golden-hour Limpopo landscape should serve as a consistent background, creating depth and a premium feel.
- Implement 'soft spring animations' for state transitions, 'scale pulse' effects for active elements, and 'subtle ripple' feedback on clicks. Utilize CSS transitions and modern React animation libraries for smooth and reassuring interactions across the web dashboard, complementing the 'calm green breathing glow animation' described for mobile UI elements.