# repo-checker

This is an example project to demonstrate the ability to:
* consume a given style-guide.
* consume a given repository.
* critique each code-file.
* produce a final report from an aggregate of critiques.

This project uses NextJS 14 with NodeJS 22 and TypeScript 5.

## Prerequisites

* You will need NodeJS 22 (or greater).
* You will need NPM v10 (or greater).
* You will need Docker.

## Environment Variables

You need a `.env` file with the following:

```
OPENAI_API_KEY=required
OPENAI_API_URL=optional # default to OpenAI
LLM_MODEL=optional # defaults to `o3-mini`
```

In all cases you can set `LLM_MODEL` if you want to use a different model than `o3-mini`.

### OpenAI
If you're using the normal OpenAI API then you only need to set the value of `OPENAI_API_KEY`.

### OpenRouter
[OpenRouter](https://openrouter.ai/docs/quickstart#using-the-openai-sdk) is great for switching between models.

You should set `OPENAI_API_URL=https://openrouter.ai/api/v1` and `OPENAI_API_KEY` to whatever your OpenRouter API key is.

### Ollama (or RamaLama)
Both [provide an OpenAI compatible API](https://ollama.com/blog/openai-compatibility).

You should set `OPENAI_API_URL=http://localhost:11434/v1` and `OPENAI_API_KEY=ollama`.

## Running Locally

Whether running in Docker or locally this projects supports hot-reload.

### Locally
- Set the values needed in `.env` (see above).
- Run `npm install`.
- (Optional) Install Chrome for Puppeteer `npx --yes puppeteer browsers install chrome`.
- Start it `npm run dev`
- Navigate to `http://localhost:3000`.

### In Docker
- Set the values needed in `.env` (see above).
- Run `docker compose up -d`.
- Navigate to `http://localhost:3000`.

#### Running on arm64 CPU

1. Enable Emulation with QEMU

   ```bash
   docker run --privileged --rm tonistiigi/binfmt --install all
   ```

2. Confirm QEMU is available

   ```bash
   docker buildx ls
   ```

   You should see the platforms supported by your setup, including linux/amd64.

3. Set Up Docker Desktop for Cross-Architecture Images
   If you’re using Docker Desktop on macOS:
   1. Open Docker Desktop settings.
   2. Go to General.
   3. Enable “Use Rosetta for x86_64/amd64 emulation on Apple Silicon”.
   4. Restart Docker Desktop.

## Troubleshooting

### It won't fetch the style-guide

If you switch between running in Docker and running locally, it will rely on different builds of Chrome in the `./.cache` folder, so you need to clear it and pull-down the appropriate version for your platform.

```shell
rm -rf .cache
npx --yes puppeteer browsers install chrome
```

## FAQ

### Why did you use TypeScript?

It's a verbose language, I know JavaScript gets a lot of hate but a lot of those criticisms are out-dated in the modern ecosystem. Plus, the [first-class OpenAI libraries are TypeScript, Python and .Net](https://platform.openai.com/docs/libraries) (at the time of writing)

### Why do I need a headless browser? (Puppeteer)

Because this might be run in a Docker container, I figured that I couldn't rely on local file-paths. E.g. the Docker container can't consume files from the host, unless they're in the shared volume.

### Why is NextJS used?

I'm not the biggest fan of React, but [NextJS](https://nextjs.org/docs/app/getting-started/installation) is a modern ecosystem that provides an easy client/server environment with minimal fuss.

### This looks complex... HELP!!!

No problem, let me explain:

1. This is just an extension of the boiler-plate NextJS project. See for yourself by doing `npx create-next-app@latest`.
2. There are only 14 small files beyond the boiler-plate given by NextJS.
3. All files are below 120 lines.
4. I could have provided a simpler implementation using Python, Langchain, Jupyter Notebook and streamlit - but there's way too much hidden away from the user to make it meaningful, and too much of a context-switch for the audience.