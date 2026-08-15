# Voice inbox

Drop a markdown file here (or let the GitHub Action do it) when Josh speaks from iPhone and the pinned agent is busy.

The daily agent should:

1. Read every `*.md` file in this folder except this README
2. Store lasting facts in `../facts.md` / `../PROFILE.md`
3. Copy a summary into today's journal
4. Delete the processed inbox file
