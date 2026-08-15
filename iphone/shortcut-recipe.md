# Talk to the same Cursor agent from iPhone

You already have the Cursor iOS app (most of your past Jarvis agents were started from mobile). The missing piece is **reopening this agent** instead of tapping + for a new one, and **saving notes in git**.

Pinned agent: [Iphone cursor agent](https://cursor.com/agents/bc-552ac9dc-5afe-44f5-bf2b-9ee0d966172e)

## Everyday (voice in the Cursor app)

1. Install [Cursor for iOS](https://cursor.com/blog/ios-mobile-app) if it is not already on the phone.
2. Open **Agents**.
3. Open **Iphone cursor agent** — do not create a new agent.
4. Tap the mic, speak, send.
5. Add that conversation to your iPhone Home Screen (Share → Add to Home Screen) so it is one tap every day.

The agent writes lasting facts into `memory/` in this repo so the data survives overnight even if the cloud VM sleeps.

## Hands-free Siri: “Hey Siri, talk to Jarvis”

This sends a follow-up to the **same** agent via the Cloud Agents API.

1. Create an API key at [cursor.com/dashboard/api](https://cursor.com/dashboard/api).
2. On iPhone open **Shortcuts** → New Shortcut → rename it `Talk to Jarvis`.
3. Add **Dictate Text**. Turn off stop after pause if you want longer notes.
4. Add **Get Contents of URL**:
   - URL: `https://api.cursor.com/v1/agents/bc-552ac9dc-5afe-44f5-bf2b-9ee0d966172e/runs`
   - Method: POST
   - Headers: `Authorization` = `Bearer YOUR_API_KEY` and `Content-Type` = `application/json`
   - Request body (JSON):

```json
{
  "prompt": {
    "text": "DICTATED_TEXT\n\nSave anything lasting in memory/ and commit it. I am talking from iPhone."
  }
}
```

Replace `DICTATED_TEXT` with the Dictate Text result (Shortcuts: insert the Magic Variable).

5. Add **Open URLs** → `https://cursor.com/agents/bc-552ac9dc-5afe-44f5-bf2b-9ee0d966172e`
6. Add to Siri with phrase **talk to Jarvis**.

If the request returns 409, the agent is still working. Wait and run the shortcut again.

## Home Screen talk page

`iphone/talk.html` is a phone-sized voice pad. After this branch is on GitHub:

1. Open the file on your iPhone (GitHub → `iphone/talk.html` → view, or GitHub Pages if you enable it).
2. Share → **Add to Home Screen**.
3. Speak, then **Open same agent** (or **Send to same agent** if you paste a Cursor API key — it stays on the phone).

Safari is required for the microphone.

## If this agent ever dies

A new cloud agent can take over because memory is in git. Tell it:

> You are Josh's daily iPhone Jarvis. Read AGENTS.md and memory/. Update memory/agent.json with your id.

Then change the Shortcut URL to the new `bc-…` id.
