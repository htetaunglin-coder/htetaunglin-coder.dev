# Research: Readable Code and Useful Comments

Primary-source research for the repository's agent guidance. Verified on 2026-08-01. This is the longer rationale; the rule in `AGENTS.md` and `CLAUDE.md` should remain a single concise bullet.

## Answer up front

Prefer code that explains itself through precise domain names and straightforward structure. If a reader cannot understand the implementation, improve the code before reaching for a comment. Google gives this exact review sequence: clarify the code first; only when the code cannot be clarified should a comment explain why it exists. [Google Engineering Practices](https://google.github.io/eng-practices/review/developer/handling-comments.html#code)

Comments still have a distinct job: preserve context that code cannot state clearly. LLVM recommends documenting what code is trying to do and why rather than narrating its mechanics, while the Linux kernel guide allows concise notes for warnings or non-obvious choices and recommends function-level purpose and rationale. [LLVM Coding Standards](https://llvm.org/docs/CodingStandards.html#commenting) · [Linux kernel coding style](https://docs.kernel.org/process/coding-style.html#commenting)

## What the agent rule should enforce

1. **Make readability a code-design responsibility.** Descriptive names should match the semantic role of the thing they name; LLVM explicitly recommends descriptive function and argument names to remove the need for documentation comments where possible. [LLVM naming guidance](https://llvm.org/docs/CodingStandards.html#name-types-functions-variables-and-enumerators-properly) · [LLVM documentation-comment guidance](https://llvm.org/docs/CodingStandards.html#doxygen-use-in-documentation-comments)
2. **Do not narrate visible mechanics.** The Linux kernel guide says code should make its operation obvious instead of explaining how it works in comments. PEP 8 likewise calls obvious inline comments distracting. [Linux kernel coding style](https://docs.kernel.org/process/coding-style.html#commenting) · [PEP 8 inline comments](https://peps.python.org/pep-0008/#inline-comments)
3. **Comment information the code cannot encode.** Useful examples are rationale, constraints, invariants, tradeoffs, workarounds, warnings, and surprising behavior. This is the practical application of LLVM's “what and why, not micro-level how,” the kernel's advice to record purpose, reasons, and warnings, and Google's guidance to explain why after code clarification is exhausted. [LLVM Coding Standards](https://llvm.org/docs/CodingStandards.html#commenting) · [Linux kernel coding style](https://docs.kernel.org/process/coding-style.html#commenting) · [Google Engineering Practices](https://google.github.io/eng-practices/review/developer/handling-comments.html#code)
4. **Keep contract documentation, but remove boilerplate.** Public API documentation can communicate purpose, behavior, and usage that a signature does not. Both LLVM and the kernel explicitly reject comments that merely restate names or signatures. [LLVM documentation-comment guidance](https://llvm.org/docs/CodingStandards.html#doxygen-use-in-documentation-comments) · [Linux kernel coding style](https://docs.kernel.org/process/coding-style.html#commenting)
5. **Treat stale comments as defects.** PEP 8 warns that a comment contradicting the code is worse than no comment and makes keeping comments current a priority. [PEP 8 comments](https://peps.python.org/pep-0008/#comments)

## Recommended wording

Replace the current comment rule rather than adding more bullets:

> **must:** prefer readable, self-documenting code—clear domain names and straightforward structure—over comments that narrate mechanics. When code is unclear, improve it first; use comments for context the code cannot express clearly, such as rationale, constraints, invariants, tradeoffs, workarounds, or surprising behavior. Do not restate the next line or signature, and keep comments current.

This wording preserves the repository's existing intent, avoids a blanket “never comment” rule, and does not require another permanent instruction document. This research note is sufficient background for future revisions.
