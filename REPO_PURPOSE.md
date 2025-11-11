# **Using Claude Code to Develop a Flashcard App – CDA Overview (AI Capstone, launching Summer 2026\)**

## **What We’re Teaching**

In the AI Capstone course, one of the lessons will train students to use **Claude Code in VS Code**. They’ll work inside a starter repository, learn how to prompt the coding assistant, and manage AI-generated code changes in a dedicated branch. This lesson is meant to demonstrate how AI coding assistants can accelerate understanding, debugging, and feature development.

## **Your Role**

I’d like your help developing the **flashcarding app** that students will use to get started. It would also be good for you to try out Claude Code to build some extensions—or implement them manually—to see what’s feasible. The project should be scoped to a **1–2 week homework exercise**, with the main focus on:

* (a) Learning how to integrate Claude Code into VS Code.  
* (b) Using Claude Code to explain a new codebase and add features students specify.  
* (c) Instilling good practices like keeping AI-generated code in a separate Git branch and designing tests/using continuous integration to run them.

We’re going to provide students with an initial repository for a simple **flashcarding app**. Their task will be to expand its functionality with Claude Code, fleshing it out into a richer system. I was inspired by a [YouTube tutorial from Net Ninja](https://www.youtube.com/watch?v=SUysp3sJHbA&list=PL4cUxeGkcC9g4YJeBqChhFJwKQ9TRiivY), where he demonstrates Claude Code using a blogging platform as the starter app. For our course, I’d like the starter app to be more education-focused. The flashcard system ties directly to the *Learn With Martian* project that I previously developed with Penn students ([paper link](https://www.cis.upenn.edu/~ccb/publications/learn-with-martian.pdf)). In that project, we showed that AI-generated flashcards improved exam performance and student engagement. Here, we want students to both understand the concept and practice extending it with modern AI coding tools.

## **Why Learn Might Be a Running Example**

The Learn app has many features that make it a strong candidate for a multi‑week running example. It can be used to teach students how to call APIs from providers like OpenAI or Anthropic, as well as how to run models locally with Ollama. It also highlights document preprocessing tasks such as handling PDFs of lecture notes, slides, or textbook materials. In later weeks, we could extend the project with lessons that introduce more sophisticated AI agent frameworks like **DSpy**, **LangChain**, or **Kani**.

## **System Overview**

* **Content Ingestion**: PDFs, slides, and notes are chunked into text.  
* **Question Generation**: LLMs (Llama, Mistral, Qwen, Phi) create multiple-choice, cloze, short-answer, and coding questions.  
* **Curation**: Instructors approve, edit, and release curated questions as decks.  
* **Decks**: Bundled study sets that adapt to student performance via spaced repetition.  
* **Extensions**: Supports freeform LLM-graded answers and interactive flashcards (e.g., visual algorithm steps).  
* **Analytics**: Uses Item Response Theory (IRT) to monitor question quality and student mastery.

## **Potential Milestones**

* **M0**: Ingestion, basic generation, curation stub, spaced repetition.  
* **M1**: Quality filters, style enforcement, versioning.  
* **M2**: Analytics (IRT dashboards, LMS integration).  
* **M3**: Extensions (variants, coding prompts, multilingual decks, A/B testing).

# **AI Capstone Flashcard App — Technical Specification (Draft)**

## **1\. Purpose**

This document specifies the design for a flashcard application that will serve as the foundation for one of the **AI Capstone (Summer 2026\)** lessons. The app is intended both as a teaching tool for students learning to use Claude Code in VS Code, and as a scaffold for exploring educational use cases of LLMs.

---

## **2\. Goals**

* Provide students with a starter repository containing a minimal flashcard app.  
* Train students to:  
  1. Integrate Claude Code into VS Code.  
  2. Use Claude Code to explain unfamiliar codebases.  
  3. Add features by prompting the AI assistant.  
  4. Follow good practices (separate Git branch for AI code, automated testing, CI).  
* Keep the scope to a 1–2 week assignment.  
* Allow future lessons to extend this app with advanced AI integrations.

---

## **3\. Architecture Overview**

* **Frontend:** Simple web UI (React or lightweight framework) for displaying flashcards, scheduling reviews, and capturing responses.  
* **Backend:** Node.js/Express or Python/FastAPI service for deck management, user data, and question serving.  
* **Database:** SQLite or Postgres (depending on scale) for flashcards, decks, responses, and analytics.  
* **Testing:** Unit tests and CI pipeline (GitHub Actions).

---

## **4\. Core Features (MVP)**

1. **Deck Management**: Create, edit, and organize decks of flashcards.  
2. **Flashcard Delivery**: Present questions with answer reveal.  
3. **Spaced Repetition**: Implement SM-2 or simplified algorithm.  
4. **User Tracking**: Store correctness and timestamps.

---

## **5\. Stretch Features (Future Lessons)**

* **LLM-Generated Questions**: Use APIs (OpenAI, Anthropic) or local models (Ollama) to generate new cards.  
* **Document Preprocessing**: Parse PDFs, lecture slides, or textbook excerpts into candidate questions.  
* **Interactive Cards**: Algorithm animations, clickable graph traversals.  
* **Freeform Grading**: LLM evaluates open-ended responses.  
* **Agent Frameworks**: Integrations with DSpy, LangChain, or Kani for more complex workflows.

---

## **6\. Development Plan**

* **M0 (Setup)**: Starter repo with barebones flashcard CRUD \+ UI.  
* **M1 (Assignment Focus)**: Students add spaced repetition \+ user tracking with Claude Code assistance.  
* **M2 (Optional Extensions)**: LLM-generated questions, preprocessing pipeline.  
* **M3 (Advanced)**: Introduce agent frameworks and interactive features.

---

## **7\. Deliverables for CDAs**

* Starter repository with flashcard MVP.  
* Documentation on how to integrate Claude Code with VS Code.  
* Example Git workflow with separate branch for AI-generated changes.  
* Unit test suite \+ CI pipeline.  
* Stretch goal: Prototype scripts for PDF ingestion and LLM-based question generation.

---

## **8\. References**

* *Learn With Martian* paper: https://www.cis.upenn.edu/\~ccb/publications/learn-with-martian.pdf  
* Net Ninja Claude Code tutorial: https://www.youtube.com/watch?v=SUysp3sJHbA\&list=PL4cUxeGkcC9g4YJeBqChhFJwKQ9TRiivY
