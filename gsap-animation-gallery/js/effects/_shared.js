const V = "3.13.0";

export const CDN = `<script src="https://cdn.jsdelivr.net/npm/gsap@${V}/dist/gsap.min.js"><\/script>`;

export const CDN_ST = `<script src="https://cdn.jsdelivr.net/npm/gsap@${V}/dist/gsap.min.js"><\/script>
<script src="https://cdn.jsdelivr.net/npm/gsap@${V}/dist/ScrollTrigger.min.js"><\/script>`;

export const CDN_DRAG = `<script src="https://cdn.jsdelivr.net/npm/gsap@${V}/dist/gsap.min.js"><\/script>
<script src="https://cdn.jsdelivr.net/npm/gsap@${V}/dist/Draggable.min.js"><\/script>`;

export const repeat = (n, fn) => Array.from({ length: n }, (_, i) => fn(i)).join("");
