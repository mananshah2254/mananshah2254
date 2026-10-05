<div align="center">

<img src="banner.svg" alt="Manan Shah — AI Engineer at PayPal, San Francisco" width="100%" />

<br/>

<a href="https://mananshah2254.github.io/"><img src="https://img.shields.io/badge/Portfolio-ffab70?style=for-the-badge&logo=safari&logoColor=0a0b16" alt="Portfolio" /></a> <a href="https://www.linkedin.com/in/mananshah2254/"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a> <a href="mailto:mananshah03691@gmail.com"><img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" /></a> <a href="https://mananshah2254.github.io/assets/Manan_Shah_Resume.pdf"><img src="https://img.shields.io/badge/R%C3%A9sum%C3%A9-1b1430?style=for-the-badge&logo=readdotcv&logoColor=ffab70" alt="Résumé" /></a>

</div>

---

## `whoami`

```yaml
name:       Manan Shah
role:       AI Engineer @ PayPal
based:      San Francisco, CA  ·  open to relocate
focus:      [ RAG, agentic workflows, embeddings, semantic search ]
stack:      [ Python, FastAPI, Amazon Bedrock, Pinecone, Kafka, Kubernetes ]
background: 3+ yrs across fintech and enterprise insurance
education:  MS Computer Science, Illinois Institute of Technology, 2025
shipping:   3 products live on the internet, built and launched solo
```

At PayPal I build the LLM services that help support teams reason about merchant
disputes: retrieval over years of resolved cases, grounded generation on top of it,
and the unglamorous pipeline work that makes both trustworthy. Nights and weekends
I ship my own products end to end, from the first prototype to the Chrome Web Store
listing and the DNS record.

---

## Shipped

Things that are live, that strangers use, and that I maintain.

| | What it is | Links |
|:--|:--|:--|
| **TrailMail** | Chrome extension that predicts work emails from public company patterns and sends personalized outreach through Gmail. Entirely client side, send-only OAuth scope, open and click tracking, no server ever holding your data. | [site](https://trailmails.com) · [web store](https://chromewebstore.google.com/detail/bgmdpfdhgaignpljdpkmneeggbiolkce) · [code](https://github.com/mananshah2254/trailmail) |
| **DialDo** | Gives your Mac a phone number. Call a Twilio line and a local-first voice agent finds files, summarizes PDFs, writes documents and sends email. Plugin-based tool registry, signed and notarized. | [site](https://dialdo.com) · [downloads](https://github.com/mananshah2254/dialdo-downloads) |
| **GitPixelPush** | Draw pixel art on your GitHub contribution graph. A browser-side engine that writes dated commits through the Git Data API: no clone, no server, and your token never leaves the page. | [site](https://gitpixelpush.com) · [code](https://github.com/mananshah2254/gitpixelpush) |
| **OutreachOS** | Multi-step LinkedIn cadence engine: visit, connect, message, follow up, sequenced with delays and daily caps. Drives the Voyager API directly rather than clicking the DOM, which is the only approach that survives a redesign. | [code](https://github.com/mananshah2254/OutreachOS) |

<details>
<summary><b>Also on the workbench</b></summary>

<br/>

| | What it is |
|:--|:--|
| [**Relay for iOS**](https://github.com/mananshah2254/relay-ios) | Referral outreach as a native Swift app. The desktop engine runs two lanes: email goes out up front while the LinkedIn crawl finishes in the background, so the slow lane never blocks the fast one. |
| [**pixel-canvas**](https://github.com/mananshah2254/pixel-canvas) | My contribution graph, used as a canvas. Backdated empty commits, drawn with GitPixelPush. Yes, the graph below is on purpose. |
| **Email Research Engine** | The inference backend under TrailMail. Resolves a company name to its real domain, mines public pages for example addresses, infers the organization's address pattern and scores its own confidence. One paid lookup per company, never per person. |
| **Agentic Voice System** | Production-grade POC for an enterprise prospect: LLM reasoning, webhooks and CRM-style data handoffs, with conversation logic that survives multi-step tasks. The pattern underneath it became DialDo. |

</details>

---

## The stack

|  |  |
|:--|:--|
| **Languages** | ![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white) ![Java](https://img.shields.io/badge/Java%2017-ED8B00?style=flat-square&logo=openjdk&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) ![SQL](https://img.shields.io/badge/SQL-4479A1?style=flat-square&logo=postgresql&logoColor=white) |
| **GenAI / LLM** | ![RAG](https://img.shields.io/badge/RAG-ffab70?style=flat-square&logoColor=black) ![Agents](https://img.shields.io/badge/AI%20Agents-ffab70?style=flat-square) ![Tool Calling](https://img.shields.io/badge/Tool%20Calling-ffab70?style=flat-square) ![MCP](https://img.shields.io/badge/MCP-ffab70?style=flat-square) ![Embeddings](https://img.shields.io/badge/Embeddings-ffab70?style=flat-square) ![Semantic Search](https://img.shields.io/badge/Semantic%20Search-ffab70?style=flat-square) ![Prompt Engineering](https://img.shields.io/badge/Prompt%20Engineering-ffab70?style=flat-square) |
| **Frameworks** | ![LangChain](https://img.shields.io/badge/LangChain-1C3C3C?style=flat-square&logo=langchain&logoColor=white) ![LangGraph](https://img.shields.io/badge/LangGraph-1C3C3C?style=flat-square) ![Bedrock](https://img.shields.io/badge/Amazon%20Bedrock-232F3E?style=flat-square&logo=amazonaws&logoColor=white) ![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=flat-square&logo=openai&logoColor=white) ![Claude](https://img.shields.io/badge/Anthropic%20Claude-D97757?style=flat-square&logo=anthropic&logoColor=white) ![Hugging Face](https://img.shields.io/badge/Hugging%20Face-FFD21E?style=flat-square&logo=huggingface&logoColor=black) |
| **Data / Vector** | ![Pinecone](https://img.shields.io/badge/Pinecone-000000?style=flat-square&logo=pinecone&logoColor=white) ![ChromaDB](https://img.shields.io/badge/ChromaDB-FF6B6B?style=flat-square) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white) ![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white) |
| **Backend** | ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=flat-square&logo=springboot&logoColor=white) ![Kafka](https://img.shields.io/badge/Apache%20Kafka-231F20?style=flat-square&logo=apachekafka&logoColor=white) ![REST](https://img.shields.io/badge/REST%20APIs-005571?style=flat-square) ![Microservices](https://img.shields.io/badge/Microservices-005571?style=flat-square) |
| **Cloud / MLOps** | ![AWS](https://img.shields.io/badge/AWS-232F3E?style=flat-square&logo=amazonwebservices&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white) ![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=flat-square&logo=kubernetes&logoColor=white) ![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white) ![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=flat-square&logo=cloudflare&logoColor=white) |

---

## Where I have been

| | | |
|:--|:--|:--|
| **PayPal** | Software Engineer, AI and LLM platform | Apr 2025 — present |
| **Duck Creek Technologies** | Software Engineer, enterprise insurance platforms | Mar 2021 — Jul 2023 |
| **Illinois Institute of Technology** | MS, Computer Science | Aug 2023 — May 2025 |

---

<div align="center">

<img height="170" src="https://github-readme-stats.vercel.app/api?username=mananshah2254&show_icons=true&hide=stars,issues,contribs&hide_rank=true&hide_border=true&count_private=true&include_all_commits=true&bg_color=0a0b16&title_color=ffab70&icon_color=ffab70&text_color=dcd8d0" alt="GitHub stats" />

<br/><br/>

<i>Ambiguous problem in, working system out.</i>

<br/>

<a href="https://mananshah2254.github.io/">mananshah2254.github.io</a>

</div>
