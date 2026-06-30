# Internal Linking Architecture

| Source | Target | Recommended anchor | Purpose | Priority |
|---|---|---|---|---|
| /services/web-design-development | /services/content-creation | a governed content system | connect copy production to the website platform | High |
| /services/web-design-development | /services/ai-automation | connect enquiries to operational workflows | show post-form automation | High |
| /services/web-design-development | /how-we-work | how discovery becomes a working website | reduce delivery uncertainty | High |
| /services/app-development | /services/ai-automation | the automation layer behind the application | connect product and orchestration | High |
| /services/app-development | /services/ai-consulting | test the product decision before build | route uncertain scope to advisory | High |
| /services/ai-voice-agents | /services/ai-receptionists | a front-desk voice use case | differentiate broad voice agents from reception | High |
| /services/ai-voice-agents | /services/ai-automation | connect calls to downstream actions | show CRM and follow-up orchestration | High |
| /services/ai-receptionists | /services/ai-voice-agents | custom voice-agent development | route broader call flows | High |
| /services/ai-receptionists | /services/dentists | reception workflows for dental practices | surface a high-fit vertical | Medium |
| /services/ai-receptionists | /services/hospitality | guest enquiry and booking workflows | surface hospitality use cases | Medium |
| /services/content-creation | /services/web-design-development | build the publishing surface | connect content to website architecture | High |
| /services/content-creation | /blog | practical AI and automation insights | move users into supporting expertise | Medium |
| /services/ai-automation | /services/ai-consulting | prioritise the right workflow first | route unclear opportunities | High |
| /services/ai-automation | /services/app-development | when the workflow needs a dedicated interface | connect automation to product UI | High |
| /services/ai-automation | /services/trades | automation for trades and home services | surface a relevant industry route | Medium |
| /services/ai-consulting | /services/ai-automation | move from roadmap to engineered automation | connect strategy to implementation | High |
| /services/ai-consulting | /pricing | how Silverstone scopes investment | answer commercial concern | High |
| /services/ai-consulting | /how-we-work | the route from audit to delivery | show operating process | High |

## Sitewide requirements

- Each service page must contain a crawlable link to `/book` using “Book a discovery call” or a page-specific natural variation that preserves the same promise.
- Add `/pricing`, `/how-we-work` and `/contact` only where they answer a live objection; do not turn every footer-adjacent block into a link farm.
- Industry links must be curated to genuine relevance. Do not list all nine verticals on every page.
- Future Insights articles should link to one primary service owner and, where genuinely useful, one secondary route.
- Use real `<a href>` links in prerendered HTML. JavaScript-only click handlers are not sufficient internal links.