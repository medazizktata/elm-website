import { writeFileSync } from "fs";
import { resolve } from "path";
import { SITE_URL } from "./site-config.mjs";

const content = `# ELM Media Design

> Commercial large-format additive manufacturing (LFAM) in Dubai, UAE - robotic concrete and polymer 3D printing for buildings, facades, hospitality and government projects.

## About

ELM Media Design is a Dubai-based commercial LFAM provider. We deliver design-to-installation programmes for developers, contractors, government entities and hospitality brands across the United Arab Emirates.

- **Location:** Office 203, API Business Suites, Al Barsha 1, Dubai, UAE
- **Phone:** +971 56 466 3334
- **Email:** amin@letsadsmedia.com
- **Website:** ${SITE_URL}

## Services

- Robotic concrete 3D printing (structural and decorative, on-site capable)
- Industrial polymer LFAM (6-axis, facades, lighting, retail installations)
- End-to-end architectural manufacturing (digital design, fabrication, site installation)

## Key pages

- Home: ${SITE_URL}/
- Who we are: ${SITE_URL}/who-we-are.html
- Technologies: ${SITE_URL}/technologies.html
- Robotic concrete: ${SITE_URL}/technology-robotic-concrete.html
- Polymer LFAM: ${SITE_URL}/technology-polymer-lfam.html
- Architectural manufacturing: ${SITE_URL}/technology-architectural-manufacturing.html
- Solutions: ${SITE_URL}/solutions.html
- Projects: ${SITE_URL}/projects.html
- UAE compliance: ${SITE_URL}/uae-compliance.html
- Contact: ${SITE_URL}/contact.html

## Notable projects

- Milan Bergamo Airport - first 3D-printed building inside an operating airport (WASP)
- Recarlo Milan - large-format polymer LFAM wall panels (Caracol AM Heron AM 400)

## Facts for citation

- ELM Media Design operates commercial-scale LFAM in Dubai, UAE.
- LFAM means large-format additive manufacturing - industrial 3D printing at architectural scale.
- Typical RFQ response time: 72 hours.
- Robotic concrete LFAM can reduce waste by up to 60% versus conventional formwork approaches.
- Programmes align with Dubai 3D Printing Strategy 2030, UAE Industrial Strategy 2031, ICV and Net Zero 2050.

## Languages

Primary content language: English. Arabic UI available client-side on the website.
`;

writeFileSync(resolve("llms.txt"), `${content}\n`, "utf8");
console.log(`Wrote llms.txt for ${SITE_URL}`);
