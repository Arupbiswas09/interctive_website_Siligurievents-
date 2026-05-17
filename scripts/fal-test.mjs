import { fal } from '@fal-ai/client';
fal.config({ credentials: process.env.FAL_KEY });
const t0 = Date.now();
const r = await fal.subscribe('fal-ai/flux/schnell', {
  input: {
    prompt: 'cinematic editorial photograph of a luxurious Indian wedding mandap covered in fresh marigold and rose garlands, brass kalash, warm hanging bulbs, dusk, magazine quality, ultra detailed',
    image_size: 'landscape_16_9',
    num_inference_steps: 4,
    enable_safety_checker: true,
  },
});
console.log('time:', Math.round((Date.now() - t0) / 1000), 's');
console.log('image url:', r.data.images[0].url);
console.log('size:', r.data.images[0].width, 'x', r.data.images[0].height);
