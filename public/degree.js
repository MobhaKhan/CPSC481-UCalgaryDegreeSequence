const root = document.getElementById('degree-root')

const state = {
  studentProfile: null,
  degreeTimeline: [],
  courseCatalog: {},
  plans: [],
  activePlanId: null,
  openYears: new Set()
}

const escapeHtml = (value = '') =>
  value
    .toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const getCatalogInfo = (code) => state.courseCatalog?.[code] || {}

const termLabels = {
  fall: 'Fall',
  winter: 'Winter',
  spring: 'Spring',
  summer: 'Summer'
}

const statusIcon = (status) => {
  if (status === 'complete') return '✔'
  if (status === 'issue') return '⚠'
  return '⊙'
}

const statusBadge = (token) => {
  const normalized = (token || '').toLowerCase()
  if (normalized.includes('incomplete')) return { label: 'Incomplete', icon: '⊙', variant: 'year-panel__badge--warning' }
  if (normalized.includes('complete')) return { label: 'Complete', icon: '✔', variant: 'year-panel__badge--success' }
  if (normalized.includes('issue')) return { label: 'Issue Found', icon: '⚠', variant: 'year-panel__badge--issue' }
  if (normalized.includes('planning')) return { label: 'Planning', icon: 'ℹ', variant: 'year-panel__badge--info' }
  if (normalized.includes('track') || normalized.includes('progress')) return {
    label: 'On Track',
    icon: '⊙',
    variant: 'year-panel__badge--muted'
  }
  return { label: token || 'Status', icon: '⊙', variant: 'year-panel__badge--muted' }
}

const badgesFromStatus = (status) => {
  if (!status) return []
  return status
    .split(/[,;/|・]/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => statusBadge(chunk))
}

const renderCourseBoxes = (courses) => {
  if (!courses.length) return '<p class="empty-state">No courses listed</p>'
  return `<div class="course-box-grid">
    ${courses
      .map((course) => {
        const catalog = getCatalogInfo(course.code)
        const tooltipLines = []
        if (catalog.prerequisites?.length) tooltipLines.push(`Prerequisite(s): ${catalog.prerequisites.join('; ')}`)
        if (catalog.antirequisites?.length) tooltipLines.push(`Antirequisite(s): ${catalog.antirequisites.join('; ')}`)

        return `
          <article class="course-box course-box--${course.status || 'pending'}">
            <header class="course-box__header">
              <strong>${escapeHtml(course.code)}</strong>
              <span class="course-box__status">${statusIcon(course.status)}</span>
            </header>
            <p class="course-box__desc">${escapeHtml(course.description || 'Course details')}</p>
            ${course.note ? `<p class="course-box__note">${escapeHtml(course.note)}</p>` : ''}
            ${
              tooltipLines.length
                ? `<div class="course-box__tooltip">
                    ${tooltipLines.map((line) => `<p>${escapeHtml(line)}</p>`).join('')}
                  </div>`
                : ''
            }
          </article>`
      })
      .join('')}
  </div>`
}

const renderPlanDetails = (plan) => {
  if (!plan) {
    return `
      <aside class="plan-panel">
        <header class="plan-panel__header">
          <p>Plan Details</p>
          <span>Not selected</span>
        </header>
        <div class="plan-panel__placeholder">
          <p>Select a plan to view its courses.</p>
        </div>
      </aside>`
  }
  const seasons = ['fall', 'winter', 'spring', 'summer']
  const termHtml = seasons
    .map((term) => {
      const courses = plan.terms?.[term] || []
      if (!courses.length) return ''
      return `
        <div class="plan-panel__term">
          <h4>${termLabels[term]}</h4>
          <ul>
            ${courses.map((course) => `<li>${escapeHtml(course)}</li>`).join('')}
          </ul>
        </div>`
    })
    .join('')

  const remainingHtml =
    plan.remainingCourses?.length > 0
      ? plan.remainingCourses.map((course) => `<span class="chip chip-soft">${escapeHtml(course)}</span>`).join('')
      : '<p class="empty-state">All tracked courses scheduled</p>'

  const prereqsHtml =
    plan.incompletePrereqs?.length > 0
      ? plan.incompletePrereqs.map((course) => `<li>${escapeHtml(course)}</li>`).join('')
      : '<p class="empty-state">Prerequisites satisfied</p>'

  return `
    <aside class="plan-panel">
      <header class="plan-panel__header">
        <p>Plan Details</p>
        <span>${escapeHtml(plan.year)}</span>
      </header>
      <div class="plan-panel__terms">
        ${termHtml}
      </div>
      <div class="plan-panel__summary">
        <h4>Remaining courses</h4>
        <div class="remaining-list">
          ${remainingHtml}
        </div>
      </div>
      <div class="plan-panel__summary">
        <h4>Incomplete prerequisites</h4>
        <ul class="prereq-list">
          ${prereqsHtml}
        </ul>
      </div>
    </aside>`
}

const render = () => {
  if (!state.studentProfile || !root) return
  const activePlan = state.plans.find((plan) => plan.id === state.activePlanId) || null

  const planTabsHtml = state.plans
    .map(
      (plan) => `
        <button
          type="button"
          class="plan-tab ${plan.id === activePlan?.id ? 'is-active' : ''}"
          data-plan-id="${escapeHtml(plan.id)}"
        >
          ${escapeHtml(plan.name)}
        </button>`
    )
    .join('')

  const yearPanelsHtml = state.degreeTimeline
    .map((section) => {
      const isOpen = state.openYears.has(section.id)
      const badges = badgesFromStatus(section.status)
      return `
        <article class="year-panel ${isOpen ? 'is-open' : ''}" data-year-id="${escapeHtml(section.id)}">
          <header class="year-panel__header">
            <button class="year-panel__toggle" type="button" aria-expanded="${isOpen}">
              <span class="year-panel__title">
                <span class="year-panel__arrow" aria-hidden="true"></span>
                ${escapeHtml(section.yearLabel)}
              </span>
              <span class="year-panel__meta">
                ${badges
                  .map(
                    (badge) => `
                      <span class="year-panel__badge ${badge.variant}">
                        ${badge.icon} ${escapeHtml(badge.label)}
                      </span>`
                  )
                  .join('')}
              </span>
            </button>
          </header>
          <div class="year-panel__content">
            ${section.terms
              .map(
                (term) => `
                  <div class="term-block">
                    <div class="term-block__title">${escapeHtml(term.title)}</div>
                    ${renderCourseBoxes(term.courses)}
                    ${term.note ? `<p class="term-note">${escapeHtml(term.note)}</p>` : ''}
                  </div>`
              )
              .join('')}
            ${
              section.notes && section.notes.length
                ? `<div class="year-panel__notes">
                    <p>${escapeHtml(section.notes.join(' · '))}</p>
                  </div>`
                : ''
            }
          </div>
        </article>`
    })
    .join('')

  const progressSegments = state.plans
    .map(
      (plan) => `<span class="progress-segment ${plan.id === activePlan?.id ? 'is-active' : ''}"></span>`
    )
    .join('')

  const hasPanel = Boolean(activePlan)
  root.innerHTML = `
    <div class="app-shell degree-shell ${hasPanel ? 'degree-shell--with-panel' : ''}">
      <div class="degree-panel ${hasPanel ? '' : 'degree-panel--full'}">
        <header class="degree-header">
          <div class="degree-header__left">
            <a href="planner.html" class="back-link">‹</a>
            <div>
              <p class="eyebrow">Degree Requirements</p>
              <h1>${escapeHtml(state.studentProfile.name)}</h1>
              <p class="student-program">${escapeHtml(state.studentProfile.program)}</p>
            </div>
          </div>
          <div class="degree-header__right">
            <div class="profile-stats">
              <div>
                <span>Year of Program</span>
                <strong>${escapeHtml(state.studentProfile.year)}</strong>
              </div>
              <div>
                <span>Credits Left</span>
                <strong>${escapeHtml(state.studentProfile.creditsLeft)}</strong>
              </div>
            </div>
            <a class="planner-button" href="planner.html">Planner</a>
          </div>
        </header>
        <div class="status-legend">
          <div class="status-chip status-complete">
            <span>✔</span>
            <div>
              <strong>Complete</strong>
              <p>Course finished</p>
            </div>
          </div>
          <div class="status-chip status-pending">
            <span>◯</span>
            <div>
              <strong>Incomplete</strong>
              <p>Not yet scheduled</p>
            </div>
          </div>
          <div class="status-chip status-issue">
            <span>!</span>
            <div>
              <strong>Issue Found</strong>
              <p>Needs attention</p>
            </div>
          </div>
        </div>
        <section class="plans-row">
          <div>
            <p class="section-title">Plans Made</p>
            <div class="plan-tabs">
              ${planTabsHtml}
            </div>
          </div>
          <div class="plan-progress">
            ${progressSegments}
          </div>
        </section>
        <section class="year-panel-grid">
          ${yearPanelsHtml}
        </section>
      </div>
      ${hasPanel ? renderPlanDetails(activePlan) : ''}
    </div>
  `

  attachEvents()
}

const attachEvents = () => {
  document.querySelectorAll('.plan-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      state.activePlanId = tab.dataset.planId
      render()
    })
  })

  document.querySelectorAll('.year-panel__toggle').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const panel = toggle.closest('.year-panel')
      if (!panel) return
      const yearId = panel.dataset.yearId
      if (!yearId) return
      if (state.openYears.has(yearId)) {
        state.openYears.delete(yearId)
      } else {
        state.openYears.add(yearId)
      }
      render()
    })
  })
}

const init = async () => {
  try {
    const response = await fetch('data/program.json')
    if (!response.ok) throw new Error('Failed to load data')
    const data = await response.json()
    state.studentProfile = data.studentProfile
    state.degreeTimeline = data.degreeTimeline || []
    state.courseCatalog = data.courseCatalog || {}
    state.plans = data.plannerTemplates || []
    render()
  } catch (error) {
    if (root) {
      root.innerHTML = '<p class="error">Unable to load degree requirements.</p>'
    }
    console.error(error)
  }
}

init()
