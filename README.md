# Make Cuts Game

An interactive, web-based, frontend-only, two-player game based on paper-cutting logic.

## Links

- **GitHub Repository**: [https://github.com/architjain2/make-cuts-game](https://github.com/architjain2/make-cuts-game)

## Tech Stack

- React 19
- Vite
- Tailwind CSS

## Rules

- You and your opponent are playing a game with a rectangular sheet of paper, divided into a grid of unit squares.
- Players take turns cutting the paper along grid lines, either horizontally or vertically.
- A cut represents a **single continuous movement of a blade** that must start at a paper edge and end at a paper edge.
- You can slice through a single paper piece, or slice through multiple pieces simultaneously in one stroke!
- **Interaction**: Click a single grid segment to automatically slice that entire piece, or **click and drag (swipe)** across multiple segments to slice multiple pieces in one continuous stroke.
- Every cut MUST successfully divide at least one uncut section (connected component) into two. Cutting purely empty air or through completely separated pieces is invalid.
- The game ends when all parts of the paper are 1x1 blocks.
- The player unable to make a valid cut loses (Normal Play Convention).

## Setup Locally

1. `npm install`
2. `npm run dev`
