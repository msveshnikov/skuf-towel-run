class SpriteProcessor {
    constructor() {
        this.frames = [];
        this.originalWidth = 1024;
        this.originalHeight = 559;
        this.frameCount = 4;
        this.frameWidth = this.originalWidth / this.frameCount; // 256
        this.frameHeight = this.originalHeight; // 559
    }

    /**
     * Loads the sprite sheet and processes it.
     * @param {string} src Path to the image
     * @returns {Promise<HTMLCanvasElement[]>} Array of transparent cropped frame canvases
     */
    async loadAndProcess(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                try {
                    const processedFrames = this.processImage(img);
                    resolve(processedFrames);
                } catch (err) {
                    reject(err);
                }
            };
            img.onerror = (e) => reject(new Error("Failed to load sprite sheet: " + src));
            img.src = src;
        });
    }

    /**
     * Keys out the background, crops padding, and slices frames.
     * @param {HTMLImageElement} img 
     * @returns {HTMLCanvasElement[]}
     */
    processImage(img) {
        // Create an offscreen canvas for background removal
        const canvas = document.createElement("canvas");
        canvas.width = this.originalWidth;
        canvas.height = this.originalHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, this.originalWidth, this.originalHeight);
        const data = imgData.data;

        // Detect background color from top-left pixel (0,0)
        const bgR = data[0];
        const bgG = data[1];
        const bgB = data[2];
        
        // Key out background color (beige) with a tolerance threshold for JPEG artifacts
        const tolerance = 25; 
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // Calculate Euclidean distance in RGB space
            const dist = Math.sqrt(
                Math.pow(r - bgR, 2) +
                Math.pow(g - bgG, 2) +
                Math.pow(b - bgB, 2)
            );

            if (dist < tolerance) {
                data[i + 3] = 0; // Make transparent
            }
        }
        ctx.putImageData(imgData, 0, 0);

        // Slice into 4 frames and crop each frame
        const slicedFrames = [];
        for (let f = 0; f < this.frameCount; f++) {
            const frameCanvas = document.createElement("canvas");
            frameCanvas.width = this.frameWidth;
            frameCanvas.height = this.frameHeight;
            const frameCtx = frameCanvas.getContext("2d");

            // Copy frame from main canvas
            frameCtx.drawImage(
                canvas,
                f * this.frameWidth, 0, this.frameWidth, this.frameHeight,
                0, 0, this.frameWidth, this.frameHeight
            );

            // Crop the frame to tightest bounding box
            const cropped = this.cropCanvas(frameCanvas);
            slicedFrames.push(cropped);
        }

        this.frames = slicedFrames;
        return slicedFrames;
    }

    /**
     * Crops a canvas to its non-transparent bounding box.
     * @param {HTMLCanvasElement} canvas 
     * @returns {HTMLCanvasElement}
     */
    cropCanvas(canvas) {
        const ctx = canvas.getContext("2d");
        const w = canvas.width;
        const h = canvas.height;
        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;

        let minX = w, maxX = 0, minY = h, maxY = 0;
        let hasContent = false;

        // Scan pixels for bounding box
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const alpha = data[(y * w + x) * 4 + 3];
                if (alpha > 0) {
                    hasContent = true;
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                }
            }
        }

        // If frame is empty, return original
        if (!hasContent) {
            return canvas;
        }

        // Add 2px padding to avoid pixel filtering cutoff
        minX = Math.max(0, minX - 2);
        minY = Math.max(0, minY - 2);
        maxX = Math.min(w - 1, maxX + 2);
        maxY = Math.min(h - 1, maxY + 2);

        const cropW = maxX - minX + 1;
        const cropH = maxY - minY + 1;

        const croppedCanvas = document.createElement("canvas");
        croppedCanvas.width = cropW;
        croppedCanvas.height = cropH;
        const croppedCtx = croppedCanvas.getContext("2d");

        croppedCtx.drawImage(
            canvas,
            minX, minY, cropW, cropH,
            0, 0, cropW, cropH
        );

        // Store offsets on the canvas object for offset-aware rendering
        croppedCanvas.offsetX = minX;
        croppedCanvas.offsetY = minY;
        croppedCanvas.originalWidth = w;
        croppedCanvas.originalHeight = h;

        return croppedCanvas;
    }
}
window.SpriteProcessor = SpriteProcessor;
