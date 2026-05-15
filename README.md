# Prompt Studio

生图与视频关键词完善器，使用 Next.js App Router、TypeScript 和 Tailwind CSS 构建。

## Run

```bash
npm install
npm run dev
```

Open:

- `/image`
- `/reverse`
- `/video`

## AI

Set `DEEPSEEK_API_KEY` in `.env.local` to enable `/api/analyze`.

Uploaded images on `/reverse` are only processed in the browser with Canvas. The app stores text fields and analysis results in localStorage, never the original image or base64.
