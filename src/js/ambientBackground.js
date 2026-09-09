const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

const smoothstep = (edge0, edge1, x) => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}

const fract = (value) => value - Math.floor(value)

const hash2 = (x, y) => {
  const dot = x * 127.1 + y * 311.7
  return fract(Math.sin(dot) * 43758.5453123)
}

const valueNoise = (x, y) => {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const xf = x - xi
  const yf = y - yi

  const a = hash2(xi, yi)
  const b = hash2(xi + 1, yi)
  const c = hash2(xi, yi + 1)
  const d = hash2(xi + 1, yi + 1)

  const ux = xf * xf * (3 - 2 * xf)
  const uy = yf * yf * (3 - 2 * yf)

  const ab = a + (b - a) * ux
  const cd = c + (d - c) * ux
  return ab + (cd - ab) * uy
}

const fbm = (x, y) => {
  let total = 0
  let amplitude = 0.55
  let frequency = 1
  let norm = 0

  for (let i = 0; i < 4; i++) {
    total += amplitude * valueNoise(x * frequency, y * frequency)
    norm += amplitude
    frequency *= 2
    amplitude *= 0.5
  }

  return total / norm
}

const createGrainTile = (size = 128) => {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d', { alpha: true })

  if (!ctx) return canvas

  const imageData = ctx.createImageData(size, size)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    const n = Math.floor(Math.random() * 256)
    data[i] = n
    data[i + 1] = n
    data[i + 2] = n
    data[i + 3] = 20
  }

  ctx.putImageData(imageData, 0, 0)
  return canvas
}

const getThemeColors = () => {
  const isDark = document.documentElement.classList.contains('theme-dark')

  if (isDark) {
    return {
      background: [41, 44, 55],
      blobDark: [41, 44, 55],
      blobLight: [128, 128, 128],
      blobAlpha: 255
    }
  }

  return {
    background: [244, 247, 255],
    blobDark: [255, 79, 163],
    blobLight: [0, 194, 255],
    blobAlpha: 112
  }
}

const isMonospacedStyle = () => document.body.classList.contains('is-monospaced')

const initAmbientBackground = () => {
  const canvas = document.querySelector('[data-ambient-canvas]')
  if (!(canvas instanceof HTMLCanvasElement)) return

  const context = canvas.getContext('2d', { alpha: true, desynchronized: true })
  if (!context) return

  const buffer = document.createElement('canvas')
  const bufferCtx = buffer.getContext('2d', { alpha: true })
  if (!bufferCtx) return

  const grain = createGrainTile(128)
  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    document.documentElement.classList.contains('a11y-reduce-motion')
  const animatedCanvasMedia = window.matchMedia('(min-width: 768px) and (pointer: fine)')
  const compactCanvasMedia = window.matchMedia('(max-width: 511.98px)')

  let frameId = null
  let width = 0
  let height = 0
  let renderWidth = 0
  let renderHeight = 0
  let lastTick = 0
  const reduceMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)')

  const render = (timeMs) => {
    const time = timeMs * 0.001
    const animationTime = time * 0.625
    const colors = getThemeColors()
    const monospacedStyle = isMonospacedStyle()

    const pixelData = bufferCtx.createImageData(renderWidth, renderHeight)
    const data = pixelData.data

    const cx = 0.28 + Math.sin(animationTime * 0.4) * 0.06
    const cy = 0.7 + Math.cos(animationTime * 0.36) * 0.05
    const radius = 0.58

    const dark = colors.blobDark
    const light = colors.blobLight

    let index = 0
    for (let y = 0; y < renderHeight; y++) {
      const nyRaw = y / renderHeight
      for (let x = 0; x < renderWidth; x++) {
        const nxRaw = x / renderWidth
        const pixelSteps = 54
        const nx = monospacedStyle ? Math.floor(nxRaw * pixelSteps) / pixelSteps : nxRaw
        const ny = monospacedStyle ? Math.floor(nyRaw * pixelSteps) / pixelSteps : nyRaw

        const dx = nx - cx
        const dy = ny - cy
        const dist = Math.sqrt(dx * dx + dy * dy)
        const mask = 1 - smoothstep(radius * 0.35, radius, dist)

        if (mask <= 0) {
          data[index + 3] = 0
          index += 4
          continue
        }

        const warpX = nx * 3.3 + Math.sin((ny + animationTime * 0.34) * 8.4) * 0.16
        const warpY = ny * 3.3 + Math.cos((nx - animationTime * 0.28) * 7.2) * 0.16
        const noise = fbm(warpX + animationTime * 0.32, warpY - animationTime * 0.26)
        const shaped = Math.pow(noise, 2.1)
        const mixFactor = clamp(shaped + (1 - mask) * 0.22, 0, 1)

        data[index] = dark[0] + (light[0] - dark[0]) * mixFactor
        data[index + 1] = dark[1] + (light[1] - dark[1]) * mixFactor
        data[index + 2] = dark[2] + (light[2] - dark[2]) * mixFactor
        data[index + 3] = Math.floor(mask * colors.blobAlpha)
        index += 4
      }
    }

    bufferCtx.putImageData(pixelData, 0, 0)

    context.clearRect(0, 0, width, height)
    if (!compactCanvasMedia.matches) {
      context.fillStyle = `rgb(${colors.background[0]} ${colors.background[1]} ${colors.background[2]})`
      context.fillRect(0, 0, width, height)
    }

    context.globalCompositeOperation = 'source-over'
    context.imageSmoothingEnabled = !monospacedStyle
    context.drawImage(buffer, 0, 0, width, height)

    context.globalAlpha = 0.42
    context.globalCompositeOperation = 'soft-light'
    context.drawImage(
      grain,
      -((animationTime * 38) % 128),
      -((animationTime * 30) % 128),
      width + 128,
      height + 128
    )
    context.globalAlpha = 0.26
    context.globalCompositeOperation = 'overlay'
    context.drawImage(
      grain,
      ((animationTime * 25) % 128) - 128,
      ((animationTime * 15) % 128) - 128,
      width + 128,
      height + 128
    )

    context.globalAlpha = 1
    context.globalCompositeOperation = 'source-over'
  }

  const resize = () => {
    const rect = canvas.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

    width = Math.max(1, Math.floor(rect.width))
    height = Math.max(1, Math.floor(rect.height))

    canvas.width = Math.floor(width * dpr)
    canvas.height = Math.floor(height * dpr)
    context.setTransform(dpr, 0, 0, dpr, 0, 0)

    renderWidth = clamp(Math.floor(width * 0.3), 140, 340)
    renderHeight = clamp(Math.floor(height * 0.3), 120, 280)
    buffer.width = renderWidth
    buffer.height = renderHeight
  }

  const stopLoop = () => {
    if (!frameId) return
    window.cancelAnimationFrame(frameId)
    frameId = null
  }

  const startLoop = () => {
    if (frameId || prefersReducedMotion() || !animatedCanvasMedia.matches || document.hidden) return
    frameId = window.requestAnimationFrame(loop)
  }

  const loop = (timeMs) => {
    if (prefersReducedMotion() || !animatedCanvasMedia.matches || document.hidden) {
      stopLoop()
      return
    }
    if (timeMs - lastTick > 33) {
      render(timeMs)
      lastTick = timeMs
    }
    frameId = window.requestAnimationFrame(loop)
  }

  resize()
  render(0)

  startLoop()

  let resizeTimeout = null
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimeout)
    resizeTimeout = window.setTimeout(() => {
      resize()
      render(performance.now())
    }, 120)
  })

  const themeObserver = new MutationObserver(() => {
    render(performance.now())
  })

  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })

  const styleObserver = new MutationObserver(() => {
    render(performance.now())
  })

  styleObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ['class']
  })

  const handleMotionState = () => {
    if (prefersReducedMotion() || document.hidden) {
      stopLoop()
      render(performance.now())
      return
    }

    startLoop()
  }

  reduceMotionMedia.addEventListener('change', handleMotionState)
  animatedCanvasMedia.addEventListener('change', handleMotionState)
  compactCanvasMedia.addEventListener('change', handleMotionState)
  document.addEventListener('visibilitychange', handleMotionState)

  window.addEventListener('pagehide', () => {
    stopLoop()
    reduceMotionMedia.removeEventListener('change', handleMotionState)
    animatedCanvasMedia.removeEventListener('change', handleMotionState)
    compactCanvasMedia.removeEventListener('change', handleMotionState)
    document.removeEventListener('visibilitychange', handleMotionState)
    themeObserver.disconnect()
    styleObserver.disconnect()
  })
}

export default initAmbientBackground
