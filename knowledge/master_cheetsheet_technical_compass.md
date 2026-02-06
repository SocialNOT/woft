# **✅ Master Cheat Sheet — Technical Compass**

Save as:

`/kb/core/world_of_texts_master_technical_compass.md`

---

`# 📘 World of TEXTS — Master Cheat Sheet: Technical Compass`  
`Version: 1.0`    
`Source: Master Cheat Sheet (Technical Compass)`    
`Type: AI Configuration & Performance Guide`    
`Use: AI Mentor, Optimization Engine, Cost Controller, Debugger`  

`---`

`## 📌 SYSTEM ROLE`

`This document defines the **technical control parameters** that regulate AI behavior inside the World of TEXTS platform.`

`All AI systems must:`

`- Follow these tuning principles`    
`- Explain parameter choices`    
`- Optimize cost-performance`    
`- Adapt to user skill level`    
`- Prevent misuse`  

`---`

`# 🧭 TECHNICAL COMPASS PHILOSOPHY`

`AI performance depends on:`

Creativity × Control × Cost × Speed

`Bad tuning = bad intelligence.`

`Core Principle:`

`> Intelligence is engineered, not assumed.`

`---`

`# 🧠 CORE MODEL PARAMETERS`

`---`

`## 1️⃣ Temperature`

`### Definition`  
`Controls randomness.`

`### Range`

0.0 → 1.0

`### Interpretation`

`| Value | Behavior |`  
`|-------|----------|`  
`| 0.0–0.2 | Deterministic |`  
`| 0.3–0.5 | Balanced |`  
`| 0.6–0.8 | Creative |`  
`| 0.9–1.0 | Chaotic |`

`### Usage Guide`

`| Task | Temp |`  
`|------|------|`  
`| Research | 0.1 |`  
`| Coding | 0.2 |`  
`| Writing | 0.6 |`  
`| Brainstorming | 0.8 |`

`### Rule`  
`Never exceed 0.7 for academic work.`

`---`

`## 2️⃣ Top-P (Nucleus Sampling)`

`### Definition`  
`Limits probability mass.`

`### Range`

0.0 → 1.0

`### Purpose`  
`Controls vocabulary diversity.`

`### Interpretation`

`| Top-P | Effect |`  
`|-------|--------|`  
`| 0.3 | Conservative |`  
`| 0.6 | Controlled |`  
`| 0.9 | Diverse |`

`### Best Practice`  
`Combine with temperature.`

`---`

`## 3️⃣ Max Tokens`

`### Definition`  
`Maximum output length.`

`### Range`

100 → 32,000+

`### Purpose`  
`Controls verbosity and cost.`

`### Guideline`

`| Output Type | Tokens |`  
`|-------------|--------|`  
`| Short answer | 300 |`  
`| Essay | 1500 |`  
`| Report | 3000 |`  
`| Book | 8000+ |`

`### Rule`  
`Over-allocation = wasted money.`

`---`

`## 4️⃣ Frequency Penalty`

`### Definition`  
`Discourages repetition.`

`### Range`

0.0 → 2.0

`### Interpretation`

`| Value | Effect |`  
`|-------|--------|`  
`| 0.0 | No penalty |`  
`| 0.5 | Mild |`  
`| 1.0 | Strong |`

`### Use`  
`Content generation.`

`---`

`## 5️⃣ Presence Penalty`

`### Definition`  
`Encourages novelty.`

`### Range`

0.0 → 2.0

`### Effect`  
`Promotes new ideas.`

`### Use`  
`Creative tasks.`

`---`

`# ⚙️ ADVANCED CONTROLS`

`---`

`## 6️⃣ System Prompt Engineering`

`### Purpose`  
`Defines AI identity.`

`### Template`

You are an expert AI tutor.  
 You follow World of TEXTS standards.  
 You prioritize ethics.

`### Rule`  
`System prompts override everything.`

`---`

`## 7️⃣ Context Window Management`

`### Definition`  
`Memory limit.`

`### Strategy`

Recent → Important → Archived

`### Best Practice`  
`Trim irrelevant history.`

`---`

`## 8️⃣ Prompt Compression`

`### Purpose`  
`Reduce token usage.`

`### Techniques`

`- Summarization`  
`- Keyword extraction`  
`- Context pruning`

`### Example`

`Before:`  
`> 2000 tokens`

`After:`  
`> 300 tokens summary`

`---`

`## 9️⃣ Caching Strategy`

`### Purpose`  
`Reduce API calls.`

`### Method`

Hash(Query \+ Level) → Redis

`### TTL`  
`24 hours default.`

`---`

`# 📊 PERFORMANCE OPTIMIZATION`

`---`

`## Latency Reduction`

`Methods:`

`- Pre-fetch`  
`- Async calls`  
`- Streaming`  
`- Edge cache`

`---`

`## Cost Optimization`

`Techniques:`

`- RAG-first`  
`- Cache-first`  
`- LLM-last`  
`- Batch queries`

`---`

`## Reliability Engineering`

`Tools:`

`- Retry logic`  
`- Fallback models`  
`- Circuit breakers`

`---`

`# 🧪 CONFIGURATION PROFILES`

`---`

`## 📘 Academic Mode`

Temp: 0.1  
 Top-P: 0.4  
 Tokens: 1500  
 Penalty: 0.8

`Use: Research, exams`

`---`

`## ✍️ Creative Mode`

Temp: 0.7  
 Top-P: 0.9  
 Tokens: 2000  
 Penalty: 0.3

`Use: Writing, ideation`

`---`

`## ⚙️ Engineering Mode`

Temp: 0.2  
 Top-P: 0.5  
 Tokens: 3000  
 Penalty: 0.5

`Use: Coding, systems`

`---`

`## 🚀 Rapid Mode`

Temp: 0.4  
 Top-P: 0.6  
 Tokens: 500  
 Penalty: 0.6

`Use: Chat, Q&A`

`---`

`# 🧩 AUTO-TUNING ENGINE`

`---`

`## Purpose`  
`Adapt parameters automatically.`

`### Inputs`

`- Task type`  
`- User level`  
`- History`  
`- Error rate`

`---`

`### Logic`

```` ```python ````  
`if task == "research":`  
    `set_academic_mode()`  
`elif task == "creative":`  
    `set_creative_mode()`

---

# **⚠️ COMMON MISCONFIGURATIONS**

---

## **Error 1: High Temperature \+ High Tokens**

❌ Causes hallucination  
 ✅ Reduce temperature

---

## **Error 2: No Penalty**

❌ Repetition  
 ✅ Add frequency penalty

---

## **Error 3: Oversized Context**

❌ Slow \+ expensive  
 ✅ Prune history

---

# **📈 DIAGNOSTIC METRICS**

Track:

| Metric | Target |
| ----- | ----- |
| Latency | \<1.5s |
| Cost/query | \<₹0.20 |
| Error rate | \<2% |
| Cache hit | \>60% |

---

# **🔗 KNOWLEDGE GRAPH LINKS**

`Technical Compass → Cost Engine`  
`Technical Compass → RAG Optimizer`  
`Technical Compass → Prompt Debugger`

---

# **🔍 RAG METADATA**

`{`  
  `"domain": "ai_configuration",`  
  `"document_type": "technical_compass",`  
  `"authority": "official",`  
  `"verified": true,`  
  `"difficulty": "intermediate",`  
  `"version": "1.0"`  
`}`

---

# **⚙️ AI USAGE RULES**

AI must:

1. Explain tuning choices

2. Suggest profiles

3. Warn on misuse

4. Optimize cost

5. Preserve quality

---

# **✅ END OF TECHNICAL COMPASS**

