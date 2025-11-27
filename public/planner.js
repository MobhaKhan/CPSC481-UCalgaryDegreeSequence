const root = document.getElementById('planner-root')

const state = {
  studentProfile: null,
  courseCatalog: {},
  plans: [],
  activePlanId: null,
  termInputs: {
    fall: '',
    winter: '',
    spring: '',
    summer: ''
  },
  isModalOpen: false,
  newPlanName: '',
  newPlanYear: '4th Year'
}

const termLabels = {
  fall: 'Fall',
  winter: 'Winter',
  spring: 'Spring',
  summer: 'Summer'
}

const escapeHtml = (value = '') =>
  value
    .toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const courseHint = (name = '') => {
  const code = name.split(' - ')[0].trim().toUpperCase()
  const data = state.courseCatalog?.[code]
  if (!data || !data.prerequisites?.length) return ''
  return `Prerequisite: ${data.prerequisites.join('; ')}`
}

const renderCourseList = (term) => {
  const courses = state.plans.find((plan) => plan.id === state.activePlanId)?.terms?.[term] || []
  if (!courses.length) return '<p class="empty-state">Add course</p>'
  return courses
    .map(
      (course, index) => `
        <div class="planner-course-row" draggable="true">
          <button type="button" class="course-handle" aria-label="Drag course">☰</button>
          <span class="planner-course-label">${escapeHtml(course)}</span>
          <button type="button" class="course-delete" data-term="${term}" data-index="${index}" aria-label="Remove course">✕</button>
        </div>`
    )
    .join('')
}

const render = () => {
  if (!root || !state.studentProfile || !state.plans.length) return
  const activePlan = state.plans.find((plan) => plan.id === state.activePlanId) || state.plans[0]

  const plannerTermsHtml = Object.keys(termLabels)
      .map((term) => {
        const listHtml = renderCourseList(term)
      return `
        <div class="planner-term-card">
          <div class="planner-term-card__header"><h3>${termLabels[term]}</h3></div>
          <div class="planner-term-card__body">${listHtml}</div>
          <div class="planner-term-card__footer">
            <input
              data-term="${term}"
              class="term-input"
              type="text"
              placeholder="Add Course Name"
              value="${escapeHtml(state.termInputs[term] || '')}"
            />
            <button type="button" class="term-add-button" data-term="${term}">Add</button>
          </div>
        </div>`
    })
    .join('')

  const planListHtml = state.plans
    .map(
      (plan) => `
        <button
          type="button"
          class="plan-list__item ${plan.id === activePlan.id ? 'is-active' : ''}"
          data-plan-id="${escapeHtml(plan.id)}"
        >
          ${escapeHtml(plan.name)}
        </button>`
    )
    .join('')

  const remainingCoursesHtml = (activePlan.remainingCourses || [])
    .map((course) => {
      const chipClass = course.toLowerCase().includes('elective') ? 'chip-soft' : 'chip-issue'
      return `<span class="chip ${chipClass}">${escapeHtml(course)}</span>`
    })
    .join('') || '<p class="empty-state">All tracked courses are scheduled</p>'

  const prereqHtml = (activePlan.incompletePrereqs || []).length
    ? `<ul class="prereq-list">${activePlan.incompletePrereqs
        .map(
          (course) => `
            <li>
              <strong>${escapeHtml(course)}</strong>
              ${courseHint(course) ? `<p>${escapeHtml(courseHint(course))}</p>` : ''}
            </li>`
        )
        .join('')}</ul>`
    : '<p class="empty-state">Prerequisites satisfied</p>'

  const modalHtml = state.isModalOpen
    ? `
      <div class="modal-backdrop">
        <div class="modal-card">
          <button type="button" class="modal-close">×</button>
          <h3>Degree Planner</h3>
          <form class="modal-form">
            <label>
              What year are you planning for?
              <select id="planYear">
                <option value="1st Year" ${state.newPlanYear === '1st Year' ? 'selected' : ''}>1st Year</option>
                <option value="2nd Year" ${state.newPlanYear === '2nd Year' ? 'selected' : ''}>2nd Year</option>
                <option value="3rd Year" ${state.newPlanYear === '3rd Year' ? 'selected' : ''}>3rd Year</option>
                <option value="4th Year" ${state.newPlanYear === '4th Year' ? 'selected' : ''}>4th Year</option>
              </select>
            </label>
            <label>
              Name Your Plan:
              <input
                id="planName"
                type="text"
                placeholder="4 course load"
                value="${escapeHtml(state.newPlanName)}"
              />
            </label>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>`
    : ''

  root.innerHTML = `
    <div class="app-shell planner-shell">
      <div class="planner-page">
        <header class="planner-header">
          <div class="planner-header__title">
            <a class="back-link" href="index.html">←</a>
            <div>
              <p class="eyebrow">Degree Planner</p>
              <h1>${escapeHtml(state.studentProfile.name)}</h1>
            </div>
          </div>
          <button type="button" class="ghost-button new-plan-trigger">+ New Plan</button>
        </header>
        <div class="planner-page__content">
          <div class="planner-column">
            <div class="planner-terms">
              ${plannerTermsHtml}
            </div>
          </div>
          <aside class="planner-sidebar">
            <div class="plan-list-card">
              <div class="plan-list-card__header">
                <h4>Plans</h4>
              </div>
              <div class="plan-list">
                ${planListHtml}
              </div>
            </div>
            <div class="plan-summary__card">
              <h4>Remaining ${escapeHtml(activePlan.year)} courses</h4>
              <div class="remaining-list">
                ${remainingCoursesHtml}
              </div>
            </div>
            <div class="plan-summary__card">
              <h4>Incomplete prerequisites</h4>
              ${prereqHtml}
            </div>
            <div class="plan-footer">
              <p>Plan created by ${escapeHtml(state.studentProfile.name.split(' ')[0])}</p>
              <button type="button" class="primary-button">Save Plan</button>
            </div>
          </aside>
        </div>
      </div>
    </div>
    ${modalHtml}
  `

  attachEvents()
}

const attachEvents = () => {
  document.querySelectorAll('.term-input').forEach((input) => {
    input.addEventListener('input', (event) => {
      const term = input.dataset.term
      if (!term) return
      state.termInputs[term] = event.target.value
    })
  })

  document.querySelectorAll('.term-add-button').forEach((button) => {
    button.addEventListener('click', () => {
      const term = button.dataset.term
      if (term) handleAddCourse(term)
    })
  })

  document.querySelectorAll('.course-delete').forEach((button) => {
    button.addEventListener('click', () => {
      const term = button.dataset.term
      const index = Number(button.dataset.index)
      if (term && Number.isFinite(index)) handleRemoveCourse(term, index)
    })
  })

  document.querySelectorAll('.plan-list__item').forEach((item) => {
    item.addEventListener('click', () => {
      state.activePlanId = item.dataset.planId
      render()
    })
  })

  const newPlanButton = document.querySelector('.new-plan-trigger')
  if (newPlanButton) {
    newPlanButton.addEventListener('click', () => {
      state.isModalOpen = true
      render()
    })
  }

  if (state.isModalOpen) {
    const closeButton = document.querySelector('.modal-close')
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        state.isModalOpen = false
        render()
      })
    }

    const planNameInput = document.getElementById('planName')
    if (planNameInput) {
      planNameInput.addEventListener('input', (event) => {
        state.newPlanName = event.target.value
      })
    }

    const planYearSelect = document.getElementById('planYear')
    if (planYearSelect) {
      planYearSelect.addEventListener('change', (event) => {
        state.newPlanYear = event.target.value
      })
    }

    const form = document.querySelector('.modal-form')
    if (form) {
      form.addEventListener('submit', handleCreatePlan)
    }
  }
}

const handleAddCourse = (term) => {
  const value = (state.termInputs[term] || '').trim()
  if (!value) return
  state.plans = state.plans.map((plan) => {
    if (plan.id !== state.activePlanId) return plan
    return {
      ...plan,
      terms: {
        ...plan.terms,
        [term]: [...(plan.terms?.[term] || []), value]
      }
    }
  })
  state.termInputs = { ...state.termInputs, [term]: '' }
  render()
}

const handleRemoveCourse = (term, index) => {
  state.plans = state.plans.map((plan) => {
    if (plan.id !== state.activePlanId) return plan
    const items = plan.terms?.[term] || []
    return {
      ...plan,
      terms: {
        ...plan.terms,
        [term]: items.filter((_, idx) => idx !== index)
      }
    }
  })
  render()
}

const handleCreatePlan = (event) => {
  event.preventDefault()
  const nameValue = state.newPlanName.trim() || `${state.newPlanYear} plan`
  const newPlan = {
    id: `plan-${Date.now()}`,
    name: nameValue,
    year: state.newPlanYear,
    terms: {
      fall: [],
      winter: [],
      spring: [],
      summer: []
    },
    remainingCourses: [],
    incompletePrereqs: []
  }
  state.plans = [...state.plans, newPlan]
  state.activePlanId = newPlan.id
  state.newPlanName = ''
  state.isModalOpen = false
  render()
}

const init = async () => {
  try {
    const response = await fetch('data/program.json')
    if (!response.ok) throw new Error('Failed to load data')
    const data = await response.json()
    state.studentProfile = data.studentProfile
    state.courseCatalog = data.courseCatalog || {}
    state.plans = data.plannerTemplates || []
    state.activePlanId = state.plans[0]?.id
    render()
  } catch (error) {
    if (root) {
      root.innerHTML = '<p class="error">Unable to load planner.</p>'
    }
    console.error(error)
  }
}

init()
