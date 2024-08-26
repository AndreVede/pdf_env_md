# Markdown To PDF Environment

When you want to edit your PDF in Markdown.

## Write

Create a directory to the root of the project which has the name of the env variable **markdownsDir** (in _.env.defaults_).

Write your markdowns inside and when you want to build output, `bun install` and `bun start`.

If you get an error from puppeteer, consider that:

- You should have a connection to the Internet.
- Also, run `bun x puppeteer browsers install chrome` to install chrome for puppeteer.
