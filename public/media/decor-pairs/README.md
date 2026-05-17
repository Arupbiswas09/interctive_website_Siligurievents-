# Decor pair placeholders

Replace the following with Gemini-rendered AVIF pairs (see `docs/09-IMAGE-PROMPTS.md §M`):

```
mandap-01-day.avif   mandap-01-night.avif
stage-01-day.avif    stage-01-night.avif
haldi-01-day.avif    haldi-01-night.avif
bday-01-day.avif     bday-01-night.avif
```

Use Gemini image-to-image: render DAY first, then feed it back with the NIGHT prompt locked to the same composition. See spec §M.
