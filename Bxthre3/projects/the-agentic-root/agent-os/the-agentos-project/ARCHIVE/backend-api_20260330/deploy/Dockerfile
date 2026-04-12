FROM oven/bun:latest
WORKDIR /app
COPY fly-worker.ts ./
ENV PORT=8080
EXPOSE 8080
CMD ["bun", "run", "fly-worker.ts"]
