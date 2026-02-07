# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Staying Ahead — AI Community Landing Page

## Overview
Minimalist landing page for "Staying Ahead" to capture leads and redirect to WhatsApp groups.
Standalone project. Dark premium theme.

## Tech Stack
- Next.js 14+ (App Router) with TypeScript
- Tailwind CSS for styling
- Supabase for database (PostgreSQL)
- Deployed on Vercel (standalone)

## Brand Identity (Staying Ahead — "Light in the Darkness")
- Background: #0A0A0A (Void Black)
- Accent/CTA: #C4F249 (Radioactive Lime)
- Cards/Sections: #1A1A1A (Deep Slate)
- Text Primary: #FFFFFF
- Text Secondary: #888888
- Headings: Playfair Display (serif) — from Google Fonts
- Body/UI: Inter (sans-serif) — from Google Fonts
- CTAs: Pill-shaped buttons, lime bg (#C4F249), black text, rounded-full
- Secondary buttons: border white, transparent bg, rounded-full
- Cards: bg-[#1A1A1A] border border-gray-800 rounded-lg, green glow on hover
- Copywriting tone: Urgent, empowering, direct. Short punchy sentences.
- Brand name: "Staying Ahead" — always use this exact name, never abbreviate.

## Design Rules
- Mobile-first responsive (375px → 768px → 1440px)
- Minimalist. Clean. Lots of whitespace. No clutter.
- Single page — minimal sticky navbar with CTA, no footer links
- Inspired by figuringoutai.co (minimal WhatsApp community page)
- Noise/grain texture on background is a nice touch
- Thin-line icons in white or green where needed

## Redirect Logic
- Student → Student WhatsApp Channel (one link for all)
- Working Professional / Founder / Others + India → India Community
- Working Professional / Founder / Others + Non-India → International Community
- WhatsApp links are in src/config/whatsapp-groups.ts (placeholders for now)

## Common Commands
- npm run dev — start dev server
- npm run build — check for errors before committing
- npx supabase — Supabase CLI commands

## Key Rules
- Brand name is "Staying Ahead". Do NOT mention Outskill, GrowthSchool, or any other brand anywhere — not in code, comments, meta tags, or UI.
- Avoid over-engineering. Only build what's directly needed.
- Keep solutions simple and focused. No extra files or abstractions.
- Run npm run build before committing to check for errors.
- Use server actions or API routes for form submission.
- All WhatsApp links are placeholders for now (will be swapped later).
- Do not create unnecessary wrapper components. Keep the component tree shallow.
