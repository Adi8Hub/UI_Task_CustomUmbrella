# Custom Umbrella — Final

This version uses the **exact Pink, Blue and Yello umbrella PNG assets and icons supplied in the assignment ZIP**.

## Requirements covered

- Vanilla HTML/CSS/JavaScript only.
- Pink, Blue and Yellow umbrella states.
- Exact supplied product assets.
- Page theme changes with the selected umbrella.
- Loading animation using the supplied loader icon.
- PNG/JPG upload.
- 5 MB maximum file size.
- Instant logo preview near the bottom of the umbrella.
- Uploaded filename shown in the upload control.
- Remove uploaded logo.
- Responsive layout.
- Data-driven theme configuration and minimal application state.

## Run

Open `index.html` directly or use a static server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Demo sample logo

`assets/STARAPPS_1.PNG` is a transparent-background sample logo reconstructed
from the StarApps logo visible in the supplied demo video. It is included so
the demonstrated upload/preview effect can be reproduced locally.

The application still starts with no logo selected; the sample is simply
available to upload using the same upload control as any customer logo.

## Color transition behavior

When a logo has been uploaded, changing umbrella color temporarily hides the
logo. The new umbrella asset is loaded first; the logo becomes visible again
only after the new image fires its `load` event. This prevents the old logo
from appearing over the transition/loading state.

## Demo-style loading transition

Color changes use a short minimum transition of 700ms. The new umbrella
asset is preloaded, but the loader remains visible for that minimum period
even when the browser has the image cached. This preserves the short loading
effect visible in the supplied demo video while still waiting for the actual
new image to be ready.
