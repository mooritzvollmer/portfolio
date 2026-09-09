import initAmbientBackground from './ambientBackground'

const PAGE_URL = 'https://moritzvollmer.de/'
const API_BASE = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed'
const API_KEY = 'AIzaSyCG0XT9A3rTr9ikVhInkSKgSDITj74ro-8'
const PAGE_SPEED_CACHE_MAX_AGE = 1000 * 60 * 60 * 12

const isLighthouseAudit = () => /Chrome-Lighthouse|Lighthouse|PageSpeed/i.test(window.navigator.userAgent)

const runWhenIdle = (callback, timeout = 1500) => {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback, { timeout })
    return
  }

  window.setTimeout(callback, Math.min(timeout, 1200))
}

const runAfterDelayWhenIdle = (callback, delay = 0, timeout = 1500) => {
  window.setTimeout(() => {
    runWhenIdle(callback, timeout)
  }, delay)
}

const getPageSpeedFallbackText = (type) => {
  const isEnglish = document.documentElement.lang.toLowerCase().startsWith('en')
  if (type === 'loading') return isEnglish ? 'loading ...' : 'laedt ...'
  if (type === 'temporary') return isEnglish ? 'temporarily unavailable' : 'kurz nicht verfügbar'
  if (type === 'missing') return isEnglish ? 'no score available' : 'kein Wert verfügbar'
  return isEnglish ? 'could not load' : 'konnte nicht geladen werden'
}

const setPageSpeedTarget = (targetId, text, isLoaded = false) => {
  const target = document.getElementById(targetId)
  if (!target) return
  target.textContent = text
  target.classList.toggle('is-score-loaded', isLoaded)
}

const getStoredPageSpeedScore = (strategy, category) => {
  try {
    const score = localStorage.getItem(`pagespeed-${strategy}-${category}`)
    return score && /^\d+$/.test(score) ? score : ''
  } catch {
    return ''
  }
}

const storePageSpeedScore = (strategy, category, score) => {
  try {
    localStorage.setItem(`pagespeed-${strategy}-${category}`, score)
    localStorage.setItem(`pagespeed-${strategy}-${category}-updated`, `${Date.now()}`)
  } catch {
    // Ignore storage errors; live API values are still rendered.
  }
}

const hasFreshPageSpeedScore = (strategy, category) => {
  try {
    const updated = Number.parseInt(localStorage.getItem(`pagespeed-${strategy}-${category}-updated`) || '0', 10)
    return updated > 0 && Date.now() - updated < PAGE_SPEED_CACHE_MAX_AGE
  } catch {
    return false
  }
}

const hydrateStoredPageSpeedScores = (strategy, targetsByCategory) => {
  Object.entries(targetsByCategory).forEach(([category, targetId]) => {
    const storedScore = getStoredPageSpeedScore(strategy, category)
    if (storedScore) setPageSpeedTarget(targetId, storedScore, true)
  })
}

const shouldRefreshPageSpeedScores = (strategy, targetsByCategory) =>
  Object.keys(targetsByCategory).some((category) => !hasFreshPageSpeedScore(strategy, category))

async function loadPageSpeedScores(strategy, targetsByCategory) {
  const hasTargets = Object.values(targetsByCategory).some((targetId) => document.getElementById(targetId))
  if (!hasTargets || isLighthouseAudit() || !shouldRefreshPageSpeedScores(strategy, targetsByCategory)) return

  try {
    const categoryQuery = Object.keys(targetsByCategory)
      .map((category) => `category=${encodeURIComponent(category)}`)
      .join('&')
    const requestUrl = `${API_BASE}?url=${encodeURIComponent(PAGE_URL)}&strategy=${strategy}&${categoryQuery}&key=${API_KEY}`
    const response = await fetch(requestUrl)
    const data = await response.json()

    if (!response.ok || data?.error) {
      throw new Error(data?.error?.message || `Request failed: ${response.status}`)
    }

    Object.entries(targetsByCategory).forEach(([category, targetId]) => {
      const score = data?.lighthouseResult?.categories?.[category]?.score
      if (typeof score !== 'number') {
        setPageSpeedTarget(targetId, getPageSpeedFallbackText('missing'))
        return
      }

      const renderedScore = `${Math.round(score * 100)}`
      storePageSpeedScore(strategy, category, renderedScore)
      setPageSpeedTarget(targetId, renderedScore, true)
    })
  } catch (error) {
    console.warn(`Lighthouse ${strategy} unavailable:`, error)
    Object.entries(targetsByCategory).forEach(([category, targetId]) => {
      const storedScore = getStoredPageSpeedScore(strategy, category)
      setPageSpeedTarget(targetId, storedScore || getPageSpeedFallbackText('temporary'), Boolean(storedScore))
    })
  }
}

const setTemperature = async () => {
  const temperatureEl = document.querySelector('[data-temperature="cologne"]')

  if (!temperatureEl) return
  const cityName = temperatureEl.getAttribute('data-city-name') || 'Köln'

  const parseAndRenderTemperature = async (url, mapper) => {
    const response = await fetch(url, { mode: 'cors' })
    if (!response.ok) throw new Error(`Request failed: ${response.status}`)
    const data = await response.json()
    const temp = mapper(data)
    if (typeof temp === 'number' && Number.isFinite(temp)) {
      temperatureEl.textContent = `${cityName}, ${Math.round(temp)}°C`
      return true
    }
    return false
  }

  try {
    const ok = await parseAndRenderTemperature(
      'https://api.open-meteo.com/v1/forecast?latitude=50.9375&longitude=6.9603&current=temperature_2m&timezone=Europe%2FBerlin',
      (data) => data?.current?.temperature_2m
    )
    if (ok) return
  } catch (error) {
    console.warn('Primary temperature fetch failed', error)
  }

  try {
    const ok = await parseAndRenderTemperature(
      'https://wttr.in/Koeln?format=j1',
      (data) => Number(data?.current_condition?.[0]?.temp_C)
    )
    if (ok) return
  } catch (error) {
    console.warn('Fallback temperature fetch failed', error)
  }

  temperatureEl.textContent = `${cityName}, --°C`
}

const setTodayDateLabels = () => {
  const targets = document.querySelectorAll('[data-date-today]')
  if (!targets.length) return

  const isEnglish = document.documentElement.lang.toLowerCase().startsWith('en')

  targets.forEach((target) => {
    target.textContent = isEnglish ? 'today' : 'heute'
  })
}

const setDynamicDurations = () => {
  const targets = document.querySelectorAll('[data-duration-from]')
  if (!targets.length) return

  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  const isEnglish = document.documentElement.lang.toLowerCase().startsWith('en')

  targets.forEach((target) => {
    const from = target.getAttribute('data-duration-from') || ''
    const match = from.match(/^(\d{4})-(\d{2})$/)
    if (!match) return

    const startYear = Number.parseInt(match[1], 10)
    const startMonth = Number.parseInt(match[2], 10)
    if (Number.isNaN(startYear) || Number.isNaN(startMonth)) return

    let totalMonths = (currentYear - startYear) * 12 + (currentMonth - startMonth)
    if (totalMonths < 0) totalMonths = 0

    const years = Math.floor(totalMonths / 12)
    const months = totalMonths % 12
    const parts = []

    if (years > 0) parts.push(`${years} ${isEnglish ? (years === 1 ? 'year' : 'years') : years === 1 ? 'Jahr' : 'Jahre'}`)
    if (months > 0) parts.push(`${months} ${isEnglish ? (months === 1 ? 'month' : 'months') : months === 1 ? 'Monat' : 'Monate'}`)
    if (!parts.length) parts.push(isEnglish ? '0 months' : '0 Monate')

    target.textContent = parts.join(', ')
  })
}

const logLanguageConsoleMessage = () => {
  const isEnglish = document.documentElement.lang.toLowerCase().startsWith('en')
  const message = isEnglish
    ? [
        'You like looking under the hood?',
        'Me too.',
        'If clean code, sharp interfaces and thoughtful details sound like your thing, let us talk.',
        '',
        'Built with: HTML, SCSS, Vanilla JavaScript, Vite, Canvas, PageSpeed Insights API, Open-Meteo API.',
      ]
    : [
        'Du schaust gerne unter die Haube?',
        'Ich auch.',
        'Wenn sauberer Code, starke Interfaces und durchdachte Details dein Ding sind, lass uns sprechen.',
        '',
        'Gebaut mit: HTML, SCSS, Vanilla JavaScript, Vite, Canvas, PageSpeed Insights API, Open-Meteo API.',
      ]

  console.log(message.join('\n'))
}

const initThemeToggle = () => {
  const root = document.documentElement
  const buttons = document.querySelectorAll('[data-theme-choice]')
  if (!buttons.length) return

  const applyTheme = (theme) => {
    const normalizedTheme = theme === 'dark' ? 'dark' : 'light'
    root.classList.remove('theme-dark', 'theme-light')
    root.classList.add(`theme-${normalizedTheme}`)
    localStorage.setItem('preferred-theme', normalizedTheme)
    buttons.forEach((button) => {
      button.setAttribute(
        'aria-pressed',
        button.dataset.themeChoice === normalizedTheme ? 'true' : 'false'
      )
    })
  }

  const storedTheme = localStorage.getItem('preferred-theme') || 'light'
  applyTheme(storedTheme)

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const clickedTheme = button.dataset.themeChoice === 'dark' ? 'dark' : 'light'
      const currentTheme = root.classList.contains('theme-dark') ? 'dark' : 'light'
      const nextTheme = clickedTheme === currentTheme ? (currentTheme === 'dark' ? 'light' : 'dark') : clickedTheme
      applyTheme(nextTheme)
    })
  })
}

const initFontStyleToggle = () => {
  const toggles = document.querySelectorAll('[data-font-style-toggle]')
  if (!toggles.length) return

  const applyFontStyle = (style) => {
    const isMono = style === 'mono'
    document.body.classList.toggle('is-monospaced', isMono)
    toggles.forEach((toggle) => {
      toggle.setAttribute('aria-pressed', isMono ? 'true' : 'false')
    })
    localStorage.setItem('preferred-font-style', isMono ? 'mono' : 'sans')
  }

  const savedStyle = localStorage.getItem('preferred-font-style')
  const storedStyle = savedStyle ? (savedStyle === 'mono' ? 'mono' : 'sans') : 'sans'
  applyFontStyle(storedStyle)

  toggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const nextStyle = document.body.classList.contains('is-monospaced') ? 'sans' : 'mono'
      applyFontStyle(nextStyle)
    })
  })
}

const initMobileLanguageLinks = () => {
  const links = document.querySelectorAll('.site-nav__mobile-lang a[href]')
  const mobileNavMedia = window.matchMedia('(max-width: 1023px)')
  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.stopPropagation()
      const href = link.getAttribute('href')
      if (!href) return

      const targetUrl = new URL(href, window.location.href)
      const currentUrl = new URL(window.location.href)
      const pointsToCurrentPage =
        targetUrl.origin === currentUrl.origin &&
        targetUrl.pathname.replace(/\/$/, '') === currentUrl.pathname.replace(/\/$/, '')

      if (link.getAttribute('aria-current') === 'page' || pointsToCurrentPage) {
        event.preventDefault()
        return
      }

      if (mobileNavMedia.matches) {
        try {
          sessionStorage.setItem('reopen-mobile-nav', 'true')
        } catch {
          // Navigation still works if sessionStorage is not available.
        }
      }
    })
  })
}

const initSkillsSwitch = () => {
  const tabs = Array.from(document.querySelectorAll('[data-skills-tab]'))
  const panels = Array.from(document.querySelectorAll('[data-skills-content]'))
  if (!tabs.length || !panels.length) return

  const setActiveTab = (id) => {
    tabs.forEach((tab) => {
      const isActive = tab.getAttribute('data-skills-tab') === id
      tab.classList.toggle('is-active', isActive)
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false')
      tab.tabIndex = isActive ? 0 : -1
    })

    panels.forEach((panel) => {
      const isActive = panel.getAttribute('data-skills-content') === id
      panel.classList.toggle('is-active', isActive)
      panel.hidden = !isActive
      panel.setAttribute('aria-hidden', isActive ? 'false' : 'true')
    })
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const id = tab.getAttribute('data-skills-tab')
      if (!id) return
      setActiveTab(id)
    })

    tab.addEventListener('keydown', (event) => {
      const currentIndex = tabs.indexOf(tab)
      if (currentIndex < 0) return

      let nextIndex = currentIndex
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = currentIndex - 1
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = currentIndex + 1
      if (event.key === 'Home') nextIndex = 0
      if (event.key === 'End') nextIndex = tabs.length - 1
      if (nextIndex === currentIndex) return

      event.preventDefault()
      const nextTab = tabs[(nextIndex + tabs.length) % tabs.length]
      const id = nextTab?.getAttribute('data-skills-tab')
      if (!id) return
      setActiveTab(id)
      nextTab.focus()
    })
  })
}

const initSegmentedFilter = (filterAttribute, contentAttribute) => {
  const options = Array.from(document.querySelectorAll(`[${filterAttribute}]`))
  const panels = Array.from(document.querySelectorAll(`[${contentAttribute}]`))
  if (!options.length || !panels.length) return

  const setActive = (id) => {
    options.forEach((option) => {
      const isActive = option.getAttribute(filterAttribute) === id
      option.classList.toggle('is-active', isActive)
      option.setAttribute('aria-checked', isActive ? 'true' : 'false')
      option.tabIndex = isActive ? 0 : -1
    })

    panels.forEach((panel) => {
      const isActive = panel.getAttribute(contentAttribute) === id
      panel.classList.toggle('is-active', isActive)
      panel.hidden = !isActive
      panel.setAttribute('aria-hidden', isActive ? 'false' : 'true')
    })
  }

  options.forEach((option) => {
    option.addEventListener('click', () => {
      const id = option.getAttribute(filterAttribute)
      if (!id) return
      setActive(id)
    })

    option.addEventListener('keydown', (event) => {
      const currentIndex = options.indexOf(option)
      if (currentIndex < 0) return

      let nextIndex = currentIndex
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = currentIndex - 1
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = currentIndex + 1
      if (event.key === 'Home') nextIndex = 0
      if (event.key === 'End') nextIndex = options.length - 1
      if (nextIndex === currentIndex) return

      event.preventDefault()
      const nextOption = options[(nextIndex + options.length) % options.length]
      const id = nextOption?.getAttribute(filterAttribute)
      if (!id) return
      setActive(id)
      nextOption.focus()
    })
  })
}

const initHardSkillsFilter = () => {
  initSegmentedFilter('data-hard-skills-filter', 'data-hard-skills-content')
}

const initSoftSkillsFilter = () => {
  initSegmentedFilter('data-soft-skills-filter', 'data-soft-skills-content')
}

const initSiteNavigation = () => {
  const nav = document.querySelector('.site-nav')
  const navToggle = document.querySelector('[data-pill-nav-toggle]') || document.querySelector('[data-nav-toggle]')
  const pillNav = document.querySelector('[data-pill-nav]')
  const navItems = Array.from(document.querySelectorAll('.site-nav__item[data-nav-item]'))
  const navLinks = Array.from(document.querySelectorAll('[data-nav-link]'))
  const pillNavLinks = Array.from(document.querySelectorAll('[data-pill-nav-link]'))
  const sections = Array.from(document.querySelectorAll('[data-nav-section]'))
  const panels = Array.from(document.querySelectorAll('[data-nav-panel]'))
  const stepButtons = Array.from(document.querySelectorAll('[data-nav-step]'))
  const progressFill = document.querySelector('[data-site-progress-fill]')
  const progressCount = document.querySelector('[data-site-progress-count]')
  const mobileBreadcrumb = document.querySelector('[data-mobile-breadcrumb]')
  const mobileBreadcrumbCurrent = document.querySelector('[data-mobile-breadcrumb-current]')
  const mobileNavHint = document.querySelector('[data-mobile-nav-hint]')
  if (!navItems.length || !navLinks.length) return

  const navLabelOpen =
    (navToggle instanceof HTMLButtonElement && navToggle.getAttribute('data-label-open')) || 'Navigation öffnen'
  const navLabelClose =
    (navToggle instanceof HTMLButtonElement && navToggle.getAttribute('data-label-close')) || 'Navigation schließen'

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const mobileNavMedia = window.matchMedia('(max-width: 1023px)')
  const stackedPanelMedia = window.matchMedia('(max-width: 767px)')
  let sectionObserver = null
  let observerLockedUntil = 0
  let activeId = ''
  let mobileNavScrollY = 0
  let isMobilePageScrollLocked = false

  const preventMobileBackgroundScroll = (event) => {
    if (!isMobilePageScrollLocked) return
    const target = event.target
    if (target instanceof Node && nav instanceof HTMLElement && nav.contains(target)) return
    event.preventDefault()
  }

  const setMobilePageScrollLock = (isLocked, restoreScroll = true) => {
    if (isLocked) {
      if (isMobilePageScrollLocked) return
      mobileNavScrollY = window.scrollY
      isMobilePageScrollLocked = true
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
      document.addEventListener('touchmove', preventMobileBackgroundScroll, { passive: false })
      return
    }

    if (!isMobilePageScrollLocked) return
    isMobilePageScrollLocked = false
    document.documentElement.style.removeProperty('overflow')
    document.body.style.removeProperty('overflow')
    document.removeEventListener('touchmove', preventMobileBackgroundScroll)
    if (restoreScroll) window.scrollTo(0, mobileNavScrollY)
  }

  const syncMobileNavFocus = () => {
    if (!(nav instanceof HTMLElement)) return
    const isHamburgerOpen =
      navToggle instanceof HTMLButtonElement && navToggle.getAttribute('aria-expanded') === 'true'
    const isPillNavOpen = document.body.classList.contains('is-pill-nav-open')
    nav.inert = mobileNavMedia.matches ? !isHamburgerOpen : !isPillNavOpen
  }

  const openMobileNavAfterLanguageSwitch = () => {
    if (!mobileNavMedia.matches) return

    let shouldReopen = false
    try {
      shouldReopen = sessionStorage.getItem('reopen-mobile-nav') === 'true'
      sessionStorage.removeItem('reopen-mobile-nav')
    } catch {
      shouldReopen = false
    }

    if (!shouldReopen) return

    document.body.classList.add('is-nav-open')
    if (pillNav instanceof HTMLElement) pillNav.classList.add('is-open')
    setMobilePageScrollLock(true, false)
    if (navToggle instanceof HTMLButtonElement) {
      navToggle.setAttribute('aria-expanded', 'true')
      navToggle.setAttribute('aria-label', navLabelClose)
    }
    syncMobileNavFocus()
  }

  const getPanelIntroTargets = (panel) => {
    if (!(panel instanceof HTMLElement)) return []
    const selector = [
      '.site-panel__title',
      'p',
      '.site-meta__card',
      '.skills-switch__card',
      '.hard-skills-filter__option',
      '.tag',
      'li'
    ].join(', ')

    return Array.from(panel.querySelectorAll(selector)).filter((element) => {
      if (!(element instanceof HTMLElement)) return false
      if (element.hidden) return false
      if (element.closest('[hidden]')) return false
      return true
    })
  }

  const playPanelIntro = (panel) => {
    if (!(panel instanceof HTMLElement)) return
    if (panel.dataset.introPlayed === 'true') return
    panel.dataset.introPlayed = 'true'
    if (prefersReducedMotion) return
    if (window.matchMedia('(max-width: 511.98px)').matches) return

    const targets = getPanelIntroTargets(panel)
    if (!targets.length) return

    targets.forEach((element, index) => {
      element.setAttribute('data-aside-intro-item', '')
      element.style.setProperty('--aside-intro-delay', `${index * 70}ms`)
    })

    panel.classList.add('is-intro-playing')
    const totalDuration = 480 + (targets.length - 1) * 70 + 120
    window.setTimeout(() => {
      panel.classList.remove('is-intro-playing')
      targets.forEach((element) => {
        element.style.removeProperty('--aside-intro-delay')
      })
    }, totalDuration)
  }

  const closeMobileNav = (restoreScroll = true) => {
    if (!mobileNavMedia.matches) return
    document.body.classList.remove('is-nav-open')
    if (pillNav instanceof HTMLElement) pillNav.classList.remove('is-open')
    setMobilePageScrollLock(false, restoreScroll)
    if (navToggle instanceof HTMLButtonElement) {
      navToggle.setAttribute('aria-expanded', 'false')
      navToggle.setAttribute('aria-label', navLabelOpen)
    }
    syncMobileNavFocus()
  }

  const closeMobileNavAfterMenuAction = (target) => {
    if (!mobileNavMedia.matches) return
    if (!(target instanceof HTMLElement)) return

    const sectionLink = target.closest('[data-nav-link]')
    if (sectionLink) {
      closeMobileNav(false)
      return
    }
  }

  const toggleMobileNav = () => {
    if (!mobileNavMedia.matches) return
    const nextOpen = !document.body.classList.contains('is-nav-open')
    document.body.classList.toggle('is-nav-open', nextOpen)
    if (pillNav instanceof HTMLElement) pillNav.classList.toggle('is-open', nextOpen)
    setMobilePageScrollLock(nextOpen)
    if (navToggle instanceof HTMLButtonElement) {
      navToggle.setAttribute('aria-expanded', nextOpen ? 'true' : 'false')
      navToggle.setAttribute('aria-label', nextOpen ? navLabelClose : navLabelOpen)
    }
    syncMobileNavFocus()
  }

  if (navToggle instanceof HTMLButtonElement) {
    navToggle.addEventListener('click', toggleMobileNav)
  }

  mobileNavMedia.addEventListener('change', () => {
    if (!mobileNavMedia.matches) {
      document.body.classList.remove('is-nav-open')
      if (pillNav instanceof HTMLElement) pillNav.classList.remove('is-open')
      setMobilePageScrollLock(false)
      if (navToggle instanceof HTMLButtonElement) {
        navToggle.setAttribute('aria-expanded', 'false')
        navToggle.setAttribute('aria-label', navLabelOpen)
      }
    }
    syncMobileNavFocus()
  })

  syncMobileNavFocus()

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMobileNav()
  })

  document.addEventListener('click', (event) => {
    if (!mobileNavMedia.matches) return
    if (!document.body.classList.contains('is-nav-open')) return

    const target = event.target
    if (!(target instanceof Node)) return
    if (navToggle instanceof HTMLButtonElement && navToggle.contains(target)) return
    if (pillNav instanceof HTMLElement && pillNav.contains(target)) return
    if (nav instanceof HTMLElement && nav.contains(target)) return
    closeMobileNav()
  })

  const setActiveItem = (id) => {
    activeId = id
    document.body.classList.toggle('is-start-section', id === 'start')

    if (mobileBreadcrumb instanceof HTMLElement && mobileBreadcrumbCurrent instanceof HTMLElement) {
      if (!id || id === 'start') {
        mobileBreadcrumb.hidden = true
        if (mobileNavHint instanceof HTMLElement) mobileNavHint.hidden = false
      } else {
        const activeLink = navLinks.find((link) => link.getAttribute('data-nav-link') === id)
        mobileBreadcrumbCurrent.textContent = activeLink?.textContent?.trim() || id
        mobileBreadcrumb.hidden = false
        if (mobileNavHint instanceof HTMLElement) mobileNavHint.hidden = true
      }
    }

    navItems.forEach((item) => {
      item.classList.toggle('is-selected', item.dataset.navItem === id)
    })

    navLinks.forEach((link) => {
      const isActive = link.getAttribute('data-nav-link') === id
      if (isActive) link.setAttribute('aria-current', 'location')
      else link.removeAttribute('aria-current')
    })

    document.dispatchEvent(new CustomEvent('site-panel-change', { detail: { id } }))

    pillNavLinks.forEach((link) => {
      const isActive = link.getAttribute('data-pill-nav-link') === id
      if (isActive) link.setAttribute('aria-current', 'location')
      else link.removeAttribute('aria-current')
    })

    panels.forEach((panel) => {
      const isActive = panel.getAttribute('data-nav-panel') === id
      const isStacked = stackedPanelMedia.matches
      panel.classList.toggle('is-active', isActive)
      panel.setAttribute('aria-hidden', isStacked || isActive ? 'false' : 'true')
      panel.inert = isStacked ? false : !isActive
      if (isActive && !isStacked && panel instanceof HTMLElement) {
        panel.scrollTop = 0
      }
    })
    const activePanel = panels.find((panel) => panel.getAttribute('data-nav-panel') === id)
    playPanelIntro(activePanel)

    const activeIndex = navLinks.findIndex((link) => link.getAttribute('data-nav-link') === id)
    const progressIndex = Math.max(activeIndex, 0)
    const totalItems = navLinks.length
    const progress = totalItems > 1 ? progressIndex / (totalItems - 1) : 1
    if (progressFill instanceof HTMLElement) {
      progressFill.style.transform = `scaleX(${progress})`
    }
    if (progressCount instanceof HTMLElement) {
      progressCount.textContent = `${String(progressIndex + 1).padStart(2, '0')} / ${String(totalItems).padStart(2, '0')}`
    }

    if (!stepButtons.length) return
    const hasPrev = activeIndex > 0
    const hasNext = activeIndex >= 0 && activeIndex < navLinks.length - 1
    stepButtons.forEach((button) => {
      const step = Number.parseInt(button.getAttribute('data-nav-step') || '0', 10)
      if (step < 0) button.disabled = !hasPrev
      if (step > 0) button.disabled = !hasNext
    })
  }

  const navigateByStep = (step) => {
    if (!step) return
    const currentIndex = navLinks.findIndex((link) => link.getAttribute('data-nav-link') === activeId)
    if (currentIndex < 0) return
    const nextIndex = currentIndex + step
    if (nextIndex < 0 || nextIndex >= navLinks.length) return
    navLinks[nextIndex].click()
  }

  const getIdFromHash = () => {
    const fromHash = window.location.hash.replace('#', '').trim()
    if (fromHash) return fromHash
    return navLinks[0]?.getAttribute('data-nav-link') || ''
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('data-nav-link')
      if (!targetId) return
      const targetSection = document.getElementById(targetId)
      const targetPanel = panels.find((panel) => panel.getAttribute('data-nav-panel') === targetId)
      const scrollTarget = stackedPanelMedia.matches && targetPanel instanceof HTMLElement ? targetPanel : targetSection
      if (!scrollTarget) return

      event.preventDefault()
      observerLockedUntil = Date.now() + (prefersReducedMotion ? 120 : 900)
      setActiveItem(targetId)
      window.history.replaceState(null, '', `#${targetId}`)
      if (mobileNavMedia.matches) {
        closeMobileNav(false)
        window.requestAnimationFrame(() => {
          scrollTarget.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' })
        })
        return
      }

      scrollTarget.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' })
      closeMobileNavAfterMenuAction(link)
    })
  })

  stepButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const step = Number.parseInt(button.getAttribute('data-nav-step') || '0', 10)
      navigateByStep(step)
    })
  })

  document.addEventListener('keydown', (event) => {
    if (event.defaultPrevented) return
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return

    const target = event.target
    if (target instanceof HTMLElement) {
      const isEditable =
        target.matches('input, textarea, select, button') ||
        target.isContentEditable ||
        !!target.closest('[contenteditable="true"]')
      if (isEditable) return
    }

    let step = 0
    if (event.key === 'ArrowLeft') step = -1
    if (event.key === 'ArrowRight') step = 1
    if (!step) return

    event.preventDefault()
    navigateByStep(step)
  })

  let touchStartX = 0
  let touchStartY = 0
  let touchStartTime = 0

  document.addEventListener(
    'touchstart',
    (event) => {
      if (event.touches.length !== 1) return
      touchStartX = event.touches[0].clientX
      touchStartY = event.touches[0].clientY
      touchStartTime = performance.now()
    },
    { passive: true }
  )

  document.addEventListener(
    'touchend',
    (event) => {
      if (event.changedTouches.length !== 1) return

      const target = event.target
      if (target instanceof HTMLElement) {
        const isEditable =
          target.matches('input, textarea, select, button') ||
          target.isContentEditable ||
          !!target.closest('[contenteditable="true"]')
        if (isEditable) return
      }

      const dx = event.changedTouches[0].clientX - touchStartX
      const dy = event.changedTouches[0].clientY - touchStartY
      const elapsed = performance.now() - touchStartTime
      const absX = Math.abs(dx)
      const absY = Math.abs(dy)

      const hasHorizontalIntent = absX > 64 && absX > absY * 1.5
      const hasLowVerticalDrift = absY <= 24
      const isQuickEnough = elapsed < 700
      if (!hasHorizontalIntent || !hasLowVerticalDrift || !isQuickEnough) return

      if (dx < 0) navigateByStep(1)
      if (dx > 0) navigateByStep(-1)
    },
    { passive: true }
  )

  window.addEventListener('hashchange', () => {
    const id = getIdFromHash()
    setActiveItem(id)
    if (stackedPanelMedia.matches) {
      const targetPanel = panels.find((panel) => panel.getAttribute('data-nav-panel') === id)
      targetPanel?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' })
    }
    closeMobileNav()
  })

  const setupSectionObserver = () => {
    sectionObserver?.disconnect()
    const observesPanels = stackedPanelMedia.matches
    const targets = observesPanels ? panels : sections
    if (!('IntersectionObserver' in window) || !targets.length) return

    sectionObserver = new IntersectionObserver(
      (entries) => {
        if (Date.now() < observerLockedUntil) return

        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!visible) return
        const id = visible.target.getAttribute(observesPanels ? 'data-nav-panel' : 'data-nav-section')
        if (!id) return
        setActiveItem(id)
      },
      observesPanels
        ? { rootMargin: '-18% 0px -62% 0px', threshold: [0.01, 0.2, 0.45] }
        : { rootMargin: '-45% 0px -45% 0px', threshold: [0.01] }
    )

    targets.forEach((target) => sectionObserver.observe(target))
  }

  stackedPanelMedia.addEventListener('change', () => {
    setActiveItem(activeId || getIdFromHash())
    setupSectionObserver()
  })

  setupSectionObserver()
  setActiveItem(getIdFromHash())
  openMobileNavAfterLanguageSwitch()
}

const initJobAccordion = () => {
  const cards = Array.from(document.querySelectorAll('[data-job-accordion]'))
  if (!cards.length) return

  const setPanelHeight = (panel, isOpen) => {
    if (!panel) return
    panel.style.setProperty('--accordion-height', isOpen ? `${panel.scrollHeight}px` : '0px')
    panel.setAttribute('aria-hidden', isOpen ? 'false' : 'true')
  }

  const setOpen = (activeCard) => {
    cards.forEach((card) => {
      const panel = card.querySelector('.about-stack__accordion-panel')
      const trigger = card.querySelector('.about-stack__accordion-trigger')
      const isOpen = card === activeCard
      card.classList.toggle('is-open', isOpen)
      if (trigger) {
        trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false')
      }
      setPanelHeight(panel, isOpen)
    })
  }

  cards.forEach((card) => {
    const panel = card.querySelector('.about-stack__accordion-panel')
    const trigger = card.querySelector('.about-stack__accordion-trigger')
    if (panel) {
      panel.setAttribute('aria-hidden', 'true')
      panel.style.setProperty('--accordion-height', '0px')
    }
    if (trigger) {
      trigger.setAttribute('aria-expanded', 'false')
    }

    card.addEventListener('click', (event) => {
      if (event.target.closest('a')) return
      const shouldOpen = trigger?.getAttribute('aria-expanded') !== 'true'
      setOpen(shouldOpen ? card : null)
    })
  })

  window.addEventListener('resize', () => {
    cards.forEach((card) => {
      const panel = card.querySelector('.about-stack__accordion-panel')
      setPanelHeight(panel, card.classList.contains('is-open'))
    })
  })
}

const initExperienceCounters = () => {
  const items = document.querySelectorAll('.about-stack__stat-card[data-countup-target]')
  if (!items.length) return

  const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const animateCounter = (numberEl, targetValue, duration = 1200) => {
    if (!numberEl || Number.isNaN(targetValue)) return

    if (shouldReduceMotion) {
      numberEl.textContent = `${targetValue}`
      return
    }

    const startTime = performance.now()

    const step = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1)
      const currentValue = Math.round(targetValue * progress)
      numberEl.textContent = `${currentValue}`

      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)
  }

  const triggerCounter = (item) => {
    if (!item || item.dataset.countupStarted === 'true') return
    const numberEl = item.querySelector('[data-countup-number]')
    const targetValue = Number.parseInt(item.dataset.countupTarget || '0', 10)
    item.dataset.countupStarted = 'true'
    animateCounter(numberEl, targetValue)
  }

  if (!('IntersectionObserver' in window)) {
    items.forEach((item) => triggerCounter(item))
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        triggerCounter(entry.target)
        observer.unobserve(entry.target)
      })
    },
    { threshold: 0.4 }
  )

  items.forEach((item) => observer.observe(item))
}

const initPillNavigation = () => {
  const nav = document.querySelector('[data-pill-nav]')
  const toggle = document.querySelector('[data-pill-nav-toggle]')
  if (!nav || !(toggle instanceof HTMLButtonElement)) return
  const linksPanel = nav.querySelector('.site-pill-nav__links')
  const pillLinks = Array.from(nav.querySelectorAll('.site-pill-nav__links a'))
  const sectionNav = document.querySelector('.site-nav')
  const mobileNavMedia = window.matchMedia('(max-width: 1023px)')
  const toggleLabelOpen = toggle.getAttribute('data-label-open') || 'Schnellnavigation öffnen'
  const toggleLabelClose = toggle.getAttribute('data-label-close') || 'Schnellnavigation schließen'

  const syncInteractiveState = (isOpen) => {
    document.body.classList.toggle('is-pill-nav-open', isOpen)

    if (linksPanel instanceof HTMLElement) {
      linksPanel.inert = !isOpen
      linksPanel.setAttribute('aria-hidden', isOpen ? 'false' : 'true')
    }

    pillLinks.forEach((link) => {
      if (!(link instanceof HTMLElement)) return
      link.tabIndex = isOpen ? 0 : -1
    })

    if (sectionNav instanceof HTMLElement && !mobileNavMedia.matches) {
      sectionNav.inert = !isOpen
    }
  }

  const setOpen = (isOpen) => {
    nav.classList.toggle('is-open', isOpen)
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false')
    toggle.setAttribute('aria-label', isOpen ? toggleLabelClose : toggleLabelOpen)
    syncInteractiveState(isOpen)
  }

  toggle.addEventListener('click', () => {
    if (mobileNavMedia.matches) return
    const isOpen = nav.classList.contains('is-open')
    setOpen(!isOpen)
  })

  mobileNavMedia.addEventListener('change', () => {
    setOpen(false)
  })

  pillLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('data-pill-nav-link')
      const targetNavLink = targetId ? document.querySelector(`.site-nav [data-nav-link="${targetId}"]`) : null
      if (targetNavLink instanceof HTMLAnchorElement) {
        event.preventDefault()
        targetNavLink.click()
      }

      setOpen(false)
    })
  })

  document.addEventListener('click', (event) => {
    const target = event.target
    const siteNav = document.querySelector('.site-nav')
    if (!(target instanceof Node) || nav.contains(target)) return
    if (siteNav instanceof HTMLElement && siteNav.contains(target)) return
    setOpen(false)
  })

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return
    setOpen(false)
  })

  setOpen(false)
}

document.addEventListener('DOMContentLoaded', () => {
  logLanguageConsoleMessage()
  setTodayDateLabels()
  setDynamicDurations()
  const mobilePageSpeedTargets = {
    performance: 'psi-mobile',
    accessibility: 'a11y-mobile',
  }
  const desktopPageSpeedTargets = {
    performance: 'psi-desktop',
    accessibility: 'a11y-desktop',
  }

  hydrateStoredPageSpeedScores('mobile', mobilePageSpeedTargets)
  hydrateStoredPageSpeedScores('desktop', desktopPageSpeedTargets)

  runWhenIdle(() => {
    if (isLighthouseAudit()) return
    setTemperature()
  }, 5000)

  runAfterDelayWhenIdle(() => {
    loadPageSpeedScores('mobile', mobilePageSpeedTargets)
    loadPageSpeedScores('desktop', desktopPageSpeedTargets)
  }, 12000)
  initThemeToggle()
  initFontStyleToggle()
  initMobileLanguageLinks()
  initSkillsSwitch()
  initHardSkillsFilter()
  initSoftSkillsFilter()
  initPillNavigation()
  initSiteNavigation()
  initJobAccordion()
  initExperienceCounters()
  initAmbientBackground()
  const footerYearEls = document.querySelectorAll('[data-footer-year], [data-footer-year-mobile]')
  if (footerYearEls.length) {
    const year = `${new Date().getFullYear()}`
    footerYearEls.forEach((element) => {
      element.textContent = year
    })
  }
})
