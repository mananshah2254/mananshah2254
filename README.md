<div align="center">

<img src="assets/banner.svg" alt="Manan Shah — AI Engineer at PayPal, San Francisco" width="100%" />

<br/>

<a href="https://mananshah2254.github.io/"><img src="https://img.shields.io/badge/Portfolio-ffab70?style=for-the-badge&logo=safari&logoColor=0a0b16" alt="Portfolio" /></a>
<a href="https://www.linkedin.com/in/mananshah2254/"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>
<a href="mailto:mananshah03691@gmail.com"><img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" /></a>
<a href="https://mananshah2254.github.io/assets/Manan_Shah_Resume.pdf"><img src="https://img.shields.io/badge/R%C3%A9sum%C3%A9-1b1430?style=for-the-badge&logo=readdotcv&logoColor=ffab70" alt="Résumé" /></a>

<br/><br/>

<img src="assets/terminal.svg" alt="whoami: Manan Shah, AI Engineer at PayPal. Focus: RAG, agentic workflows, embeddings, semantic search." width="100%" />

</div>

At PayPal I build the LLM services that help support teams reason about merchant
disputes: retrieval over years of resolved cases, grounded generation on top of it,
and the unglamorous pipeline work that makes both trustworthy. Nights and weekends
I ship my own products end to end, from the first prototype to the signed installer,
the store listing and the DNS record.

<img src="assets/divider.svg" width="100%" alt="" />

## Shipped

Things that are live, that strangers use, and that I maintain. Every card links to the product.

<div align="center">

<a href="https://dialdo.com"><img src="assets/card-dialdo.svg" width="49%" alt="DialDo — gives your Mac a phone number" /></a>
<a href="https://reporun.app"><img src="assets/card-reporun.svg" width="49%" alt="Repo Run — know what a repo needs before you run it" /></a>
<a href="https://trailmails.com"><img src="assets/card-trailmail.svg" width="49%" alt="TrailMail — work-email prediction and Gmail outreach" /></a>
<a href="https://gitpixelpush.com"><img src="assets/card-gitpixelpush.svg" width="49%" alt="GitPixelPush — pixel art on your contribution graph" /></a>
<a href="https://github.com/mananshah2254/OutreachOS"><img src="assets/card-outreachos.svg" width="49%" alt="OutreachOS — multi-step LinkedIn cadences" /></a>
<a href="https://github.com/mananshah2254/relay-ios"><img src="assets/card-relay.svg" width="49%" alt="Relay for iOS — referral outreach from the share sheet" /></a>

</div>

<details>
<summary><b>Links, downloads and source</b></summary>

<br/>

| Product | What makes it interesting | Links |
|:--|:--|:--|
| **DialDo** | Twilio line → managed gateway → outbound WebSocket to your Mac. Provider keys never touch the device; caller allowlist, scrypt-hashed spoken PIN, risk-labeled tools that confirm side effects out loud. Signed and notarized. | [site](https://dialdo.com) · [source](https://github.com/mananshah2254/dialdo) · [downloads](https://github.com/mananshah2254/dialdo-downloads/releases/latest) |
| **Repo Run** | Parses manifests across ecosystems, diffs required runtimes against the machine, and shows an explicit command plan before installing anything. Developer ID signed and notarized for Apple silicon and Intel; Windows preview. | [site](https://reporun.app) · [source](https://github.com/mananshah2254/repo-run) · [downloads](https://github.com/mananshah2254/repo-run-downloads/releases) |
| **TrailMail** | Resolves company → domain → address pattern with a self-scored confidence, then sends through Gmail with a send-only scope. No server ever holds your data. | [site](https://trailmails.com) · [web store](https://chromewebstore.google.com/detail/bgmdpfdhgaignpljdpkmneeggbiolkce) · [source](https://github.com/mananshah2254/trailmail) |
| **GitPixelPush** | A browser-side engine that writes dated commits through the Git Data API. One ~100 line Cloudflare Worker for OAuth, nothing stored anywhere. | [site](https://gitpixelpush.com) · [source](https://github.com/mananshah2254/gitpixelpush) |
| **OutreachOS** | Drives the Voyager API directly rather than clicking the DOM, the only approach that survives a redesign. Per-action caps, warm-up, working hours and jitter. | [source](https://github.com/mananshah2254/OutreachOS) |
| **Relay for iOS** | SwiftUI app with a Share Extension and a dependency-free Node service. Two lanes: email goes out up front while the slow lookup finishes in the background. | [source](https://github.com/mananshah2254/relay-ios) |

</details>

<details>
<summary><b>Also on the workbench</b></summary>

<br/>

| | What it is |
|:--|:--|
| **Email Research Engine** | The inference backend under TrailMail. Resolves a company name to its real domain, mines public pages for example addresses, infers the organization's address pattern and scores its own confidence. One paid lookup per company, never per person. |
| **Agentic Voice System** | Production-grade POC for an enterprise prospect: LLM reasoning, webhooks and CRM-style data handoffs, with conversation logic that survives multi-step tasks. The pattern underneath it became DialDo. |
| [**pixel-canvas**](https://github.com/mananshah2254/pixel-canvas) | My contribution graph, used as a canvas. Backdated empty commits, drawn with GitPixelPush. Yes, the graph below is on purpose. |

</details>

<img src="assets/divider.svg" width="100%" alt="" />

## Live from the workbench

<div align="center">

<img src="assets/activity.svg" width="49%" alt="Shipping log: the latest commit on each recently active repository" />
<img src="assets/languages.svg" width="49%" alt="Languages across repositories active since 2025" />

<sub>Regenerated daily by a GitHub Action in this repo. No third-party stats service, nothing to rate-limit or go down.</sub>

</div>

<img src="assets/divider.svg" width="100%" alt="" />

## The stack

<div align="center">

<img src="https://skillicons.dev/icons?i=py,java,ts,js,swift,fastapi,spring,nodejs,react,electron&perline=10" alt="Python, Java, TypeScript, JavaScript, Swift, FastAPI, Spring, Node.js, React, Electron" />
<br/>
<img src="https://skillicons.dev/icons?i=aws,kafka,docker,kubernetes,cloudflare,postgres,mongodb,redis,supabase,githubactions&perline=10" alt="AWS, Kafka, Docker, Kubernetes, Cloudflare, PostgreSQL, MongoDB, Redis, Supabase, GitHub Actions" />

<br/><br/>

![RAG](https://img.shields.io/badge/RAG-ffab70?style=flat-square)
![Agents](https://img.shields.io/badge/AI%20Agents-ffab70?style=flat-square)
![Tool Calling](https://img.shields.io/badge/Tool%20Calling-ffab70?style=flat-square)
![MCP](https://img.shields.io/badge/MCP-ffab70?style=flat-square)
![Embeddings](https://img.shields.io/badge/Embeddings-ffab70?style=flat-square)
![Semantic Search](https://img.shields.io/badge/Semantic%20Search-ffab70?style=flat-square)
![Bedrock](https://img.shields.io/badge/Amazon%20Bedrock-232F3E?style=flat-square&logo=amazonwebservices&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-1C3C3C?style=flat-square&logo=langchain&logoColor=white)
![LangGraph](https://img.shields.io/badge/LangGraph-1C3C3C?style=flat-square)
![Pinecone](https://img.shields.io/badge/Pinecone-000000?style=flat-square&logo=pinecone&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=flat-square&logo=openai&logoColor=white)
![Claude](https://img.shields.io/badge/Anthropic%20Claude-D97757?style=flat-square&logo=anthropic&logoColor=white)
![Hugging Face](https://img.shields.io/badge/Hugging%20Face-FFD21E?style=flat-square&logo=huggingface&logoColor=black)

</div>

<img src="assets/divider.svg" width="100%" alt="" />

## Where I have been

<img src="assets/timeline.svg" width="100%" alt="Duck Creek Technologies 2021–2023 · MS Computer Science, Illinois Tech 2023–2025 · PayPal AI and LLM platform since April 2025" />

<details>
<summary>Text version</summary>

| | | |
|:--|:--|:--|
| **PayPal** | Software Engineer, AI and LLM platform | Apr 2025 — present |
| **Illinois Institute of Technology** | MS, Computer Science | Aug 2023 — May 2025 |
| **Duck Creek Technologies** | Software Engineer, enterprise insurance platforms | Mar 2021 — Jul 2023 |

</details>

<img src="assets/divider.svg" width="100%" alt="" />

## The graph, eaten

<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/mananshah2254/mananshah2254/output/snake-dark.svg" />
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/mananshah2254/mananshah2254/output/snake-light.svg" />
  <img alt="A snake eating the contribution graph" src="https://raw.githubusercontent.com/mananshah2254/mananshah2254/output/snake-dark.svg" width="100%" />
</picture>

<sub>The pixel art on my graph was painted with GitPixelPush. This snake, redrawn daily, eats it.</sub>

<br/><br/>

<img src="assets/footer.svg" width="100%" alt="Thanks for stopping by" />

<i>Ambiguous problem in, working system out.</i> · <a href="https://mananshah2254.github.io/">mananshah2254.github.io</a>

</div>
