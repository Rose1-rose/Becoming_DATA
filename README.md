# BECOMING DATA · Lab

An English-language p5.js art game with a low-resolution, early-PC-game interface.

## Play

Open index.html directly, or download and extract BECOMING_DATA_demo.zip. For camera access, serve the folder on localhost or use the HTTPS GitHub Pages site. Libraries are bundled locally; no CDN is required.

- Click the floor to walk. Click a computer itself, a floating machine label or a bottom thumbnail to select an experiment. Sort starts at 0 on the initial visit and after Reset; other machines open at preset strengths. Selecting a machine plays a preview sweep. The Preview/Applied label identifies the state.
- Move the slider to preview an experiment on both the image and the walking avatar.
- Press **Apply to me** to commit. The processed image becomes the next machine's input, and the avatar keeps its geometric/material transformation while moving.
- Applied transformations accumulate, up to eight retained body operations. Walking after an application leaves temporary data fragments behind.
- Applying to video commits the currently processed frame as a still image and stops the video input.
- **Original** compares the current input with the image effect. It does not undo committed changes to the body.
- **Keep** adds a PNG to the current session collection, up to eight fragments, and pins a head-shaped crop to the Visitors Board. Repeated Keeps update the same visitor. **Next visitor** starts a fresh session while retaining previous heads. Open Collection and click an image or Download to save it.
- Each collected image has a Print button. Printing now produces one complete image per page, without titles, numbers, captions, borders or footers. The image uses contain sizing to preserve the entire output; paper space depends on the selected paper aspect ratio. The image-only print view replaces the former contact-sheet design. The print view opens the browser print dialog, where a physical printer or Save as PDF can be selected. Allow pop-ups if the print view is blocked. Printing does not upload images.
- The upper-left buttons capture a camera image, import an image/video, or open Avatar settings.
- Avatar settings includes Female, Male and Non-binary profiles, three appearance palettes, and a live close-up preview. Gender changes shape and hair without replacing a photo or clearing committed transformations.
- Face fit adjusts photo crop position and zoom. The photograph maps onto a curved head surface with blended edges, not a floating rectangular plane. This is an approximate texture fit, not a 3D facial scan.
- The bottom-left controls pause animation, change the avatar, reset, and turn the room.
- Drag the preview title bar to move the window. Minimize it to see more of the room.
- Materials includes Stone, Flow, Mosh, and an extra Strata variant.
- The camera is closer and gently follows the avatar. Apply plays a short machine-to-body scan, with a different particle treatment for each experiment. Pausing freezes the scan; reduced-motion preferences skip it.

The top bar contains sound, help, a labeled Board toggle, and fullscreen. The in-game board starts hidden so the game uses the full width. Open it with Board and close it with Board again or its X button. Keeping a head does not open the board. Hiding the board never removes saved heads. This optional digital board is separate from the physical exhibition board for printed heads. Sound starts muted; click the top music-note button to enable the original synthesized sound pack. Help includes a volume slider. Button hover/click, footsteps, seven machine signatures, processing, collection, capture, file loading and printing have different sounds. Muting cancels scheduled voices, Pause stops active sounds and footsteps, and hidden tabs suspend audio. Reduced-motion preferences start the animation paused.

Changing the avatar or importing/capturing a new source starts a new body. Reset clears the current input, body transformations, video, and session fragments, and starts a new visitor. It does not clear the Visitors Board. This is an interactive art scene; movement uses direct targets rather than collision-aware pathfinding.

## Movement and room view

The room uses the original close scale and fills the viewport, with a smooth camera that keeps the avatar centred and full-size interface controls. Movement runs on elapsed time with eased acceleration and stopping, at a target of 30 rendered frames per second. Static room geometry and depth/colour buffers are cached whenever the camera is stationary. Experiment timing remains independent of render frame rate.

## Concept

The walking figure is the subject being transformed, not a separate decorative player. Image processing affects its face texture, body geometry, or material. Apply makes that change persist and feeds the resulting image into the next experiment. The subject then carries its altered state through the room, leaving transient data traces.

The image algorithms operate on pixel matrices. The body's bands, displacement, quantization, dissolution and materials are visual interpretations of those operations, not mathematical SVD or FFT performed directly on a 3D mesh.

## Three-minute demonstration

1. Walk and choose SVD. Preview the sliced/quantized body and reconstructed image.
2. Apply, then walk to another machine. The previous change persists.
3. Choose Sort or Bits, adjust, and Apply again. Compare the accumulated body with its first version.
4. Import a short video for Flow or Mosh. Apply freezes the current processed video frame into the next copy.
5. Try Stone or Strata, keep fragments, and compare them in Collection.
6. Keep the copy to pin its head. Choose Next visitor and repeat to build the local exhibition board. Click a pinned head to print its head-shaped crop or its full processed image. The Help panel contains technical details.

## Image experiments

- **SVD:** Jacobi eigendecomposition of A-transpose times A, reconstructing a 32 by 32 grayscale image from 1 to 32 components.
- **FFT:** two-dimensional radix-2 FFT on a 64 by 64 grayscale image, radial high-frequency truncation, then inverse transformation.
- **Sort:** sort contiguous pixel runs above a brightness threshold.
- **Bits:** extract one selected binary bit, 0 through 7, from each RGB channel.
- **Mosh:** block displacement and temporal feedback approximate datamoshing aesthetics; this does not modify video codecs or I/P frames.
- **Flow:** Horn-Schunck brightness optical flow on downsampled video drives particles. Static images use a tangent gradient field instead.
- **Stone:** source brightness, edges, noise and procedural cracks generate a sandstone interpretation.
- **Strata:** animated coordinate displacement and color bands create a geological reinterpretation of the input.

Processing is intentionally downsampled for the low-image aesthetic and live performance.

## Rendering and privacy

p5.js 1.11.11 drives the rendering loop. Room, furniture, CRTs, plants and characters are procedural 3D polygon meshes. Custom orthographic projection, lighting, depth buffering and texture mapping render the room at 672 by 392 with cached static geometry, then composite the avatar and screen textures at 960 by 560. The larger avatar receives less grain, and the main canvas uses smooth browser scaling. Interface textures and effect thumbnails retain their retro pixel treatment. No reference-game assets are included.

All image processing is local. Unsaved inputs, camera streams and the current eight-fragment collection stay in page memory. Only copies explicitly kept for the Visitors Board are written to this browser’s localStorage: a head-shaped PNG crop, its full output for printing, an anonymous visitor number, effect name and local timestamp. Nothing is uploaded. The board is local to this browser/profile, not a shared cross-device visitor database. It supports up to 64 visitor heads; storage restrictions or quota errors fall back to session-only storage with a visible message.

Click a pinned head to print or remove it. View board includes Clear board, which removes the saved heads from this browser after confirmation. Reset and Next visitor retain the board. Other tabs on the same origin update via storage events. Head crops use a shaped mask and manual Face fit, not automatic person segmentation.

Camera access requires permission and usually HTTPS or localhost. The camera dialog includes Retry, browser/OS permission help, and technical diagnostics. Open camera-check.html to test the camera without the game renderer. Page-policy blocks, browser denial, system denial, missing cameras and busy devices are reported separately. Video codecs must be supported by the browser; H.264 MP4 or WebM are recommended. Camera tracks stop after capture, dismissal, or page exit.

## Deployment and files

This repository is ready for GitHub Pages from the main branch and repository root. No build step is needed. To run it locally with camera access, run `python3 -m http.server 8000` in this folder and open `http://localhost:8000`.

Visitor heads stay in the browser storage of the site origin where they were kept. GitHub Pages and the previous hosted demo have separate local boards. No visitor photos or browser-stored heads are included in this repository.

- index.html / style.css: game interface.
- app.js: p5 lifecycle, input, controls, chained processing and collection.
- world.js: mesh scene, software rasterizer, follow camera, body transformations, processing sweeps and movement traces.
- sound.js: original Web Audio synthesis, voice limits, volume, mute, footsteps and experiment sounds.
- print.js / print.css: local image-only print views, one complete image per page.
- board.js: local visitor-copy storage and transparent head crops.
- assets/: locally generated low-resolution plastic textures for buttons, panels and recessed frames.
- effects.js: image algorithms.
- vendor/p5.min.js: bundled p5.js, retaining the original license notice.

## Validation limits

Syntax, FFT roundtrip, full-rank SVD reconstruction, bit masks, zero-motion flow, all seven experiments, slider endpoints, collection, materials, Apply, camera fallback, reset, body-state persistence, processing progression/completion, animation pause, reduced-motion behavior, and clearing processing state were checked. Independent rendering checked meshes and transformations. The managed environment did not expose the Sites-required browser-control tool; full-page browser layout, physical camera access and real video decoding remain unverified by the agent. Curved face UV bounds, all three profiles, preservation of imported input and committed changes, face-fit controls and their reset were checked. Offline audio rendering verified all seven machine treatments plus collection, shutter and printer cues produce finite non-clipping output; mute, pause and volume gating were checked. Print view content, single/all controls, image-only pages and popup-block handling were checked. Local persistence/reload, one head per visitor, Next visitor, removal/clear, storage fallback, transparent crop, preview presets, direct machine clicks and zero-strength identity behavior were checked. Actual speaker listening and physical printer output have not been verified here.

## Third-party notices

p5.js 1.11.11 is distributed under the GNU LGPL 2.1. See [vendor/p5-LICENSE.txt](vendor/p5-LICENSE.txt). No project-wide license has been selected for the original artwork and application code.
