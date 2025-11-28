


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
  isModalOpen: false,       // new plan modal
  newPlanName: '',
  newPlanYear: '4th Year',
  isSaveModalOpen: false,   // save-success popup


  isDeleteModalOpen: false,
  deletePlanId: null
}

const termLabels = {
  fall: 'Fall',
  winter: 'Winter',
  spring: 'Spring',
  summer: 'Summer'
}

// Used to track what we're dragging
let dragContext = null

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
  const courses =
    state.plans.find((plan) => plan.id === state.activePlanId)?.terms?.[term] || []
  if (!courses.length) return '<p class="empty-state">Add course</p>'
  return courses
    .map(
      (course, index) => `
        <div
          class="planner-course-row"
          draggable="true"
          data-term="${term}"
          data-index="${index}"
        >
          <button type="button" class="course-handle" aria-label="Drag course">☰</button>
          <span class="planner-course-label">${escapeHtml(course)}</span>
          <button
            type="button"
            class="course-delete"
            data-term="${term}"
            data-index="${index}"
            aria-label="Remove course"
          >
            ✕
          </button>
        </div>`
    )
    .join('')
}

const render = () => {
  if (!root || !state.studentProfile || !state.plans.length) return
  const activePlan =
    state.plans.find((plan) => plan.id === state.activePlanId) || state.plans[0]

  const plannerTermsHtml = Object.keys(termLabels)
    .map((term) => {
      const listHtml = renderCourseList(term)
      return `
        <div class="planner-term-card">
          <div class="planner-term-card__header">
            <h3>${termLabels[term]}</h3>
          </div>
          <div class="planner-term-card__body" data-term="${term}">
            ${listHtml}
          </div>
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
        <div class="plan-list__row">
          <button
            type="button"
            class="plan-list__item ${plan.id === activePlan.id ? 'is-active' : ''}"
            data-plan-id="${escapeHtml(plan.id)}"
          >
            ${escapeHtml(plan.name)}
          </button>
          <button
            type="button"
            class="plan-delete"
            data-plan-id="${escapeHtml(plan.id)}"
            aria-label="Delete plan"
          >
            🗑
          </button>
        </div>`
    )
    .join('')

  const remainingCoursesHtml =
    (activePlan.remainingCourses || [])
      .map((course) => {
        const chipClass = course.toLowerCase().includes('elective')
          ? 'chip-soft'
          : 'chip-issue'
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
                <option value="1st Year" ${
                  state.newPlanYear === '1st Year' ? 'selected' : ''
                }>1st Year</option>
                <option value="2nd Year" ${
                  state.newPlanYear === '2nd Year' ? 'selected' : ''
                }>2nd Year</option>
                <option value="3rd Year" ${
                  state.newPlanYear === '3rd Year' ? 'selected' : ''
                }>3rd Year</option>
                <option value="4th Year" ${
                  state.newPlanYear === '4th Year' ? 'selected' : ''
                }>4th Year</option>
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

  const saveModalHtml = state.isSaveModalOpen
    ? `
      <div class="save-success-backdrop">
        <div class="save-success-card">
          <h3>Plan Saved</h3>
          <p>Your degree plan has been saved successfully.</p>
          <button type="button" class="save-success-button save-modal-close">OK</button>
        </div>
      </div>`
    : ''

  const deleteModalHtml = state.isDeleteModalOpen
    ? `
      <div class="modal-backdrop delete-modal-backdrop">
        <div class="modal-card">
          <h3>Delete Plan</h3>
          <p>Are you sure you want to delete this plan?</p>
          <div class="modal-actions">
            <button type="button" class="danger-button delete-confirm">Yes, delete</button>
            <button type="button" class="ghost-button delete-cancel">Cancel</button>
          </div>
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
        </header>
        <div class="planner-page__content">
          <div class="planner-column">
            <div class="planner-terms">
              ${plannerTermsHtml}
            </div>
          </div>
          <aside class="planner-sidebar">
            <div class="plan-list-card">
              <button type="button" class="ghost-button new-plan-trigger">+ New Plan</button>
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
              <p>Plan created by ${escapeHtml(
                state.studentProfile.name.split(' ')[0]
              )}</p>
              <button type="button" class="primary-button save-plan-button">Save Plan</button>
            </div>
          </aside>
        </div>
      </div>
    </div>
    ${modalHtml}
    ${saveModalHtml}
    ${deleteModalHtml}
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

  // 🔴 delete icon on each plan
  document.querySelectorAll('.plan-delete').forEach((button) => {
    button.addEventListener('click', () => {
      const planId = button.dataset.planId
      if (!planId) return
      state.deletePlanId = planId
      state.isDeleteModalOpen = true
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

  const saveButton = document.querySelector('.save-plan-button')
  if (saveButton) {
    saveButton.addEventListener('click', handleSavePlan)
  }

  // New plan modal events
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

    const backdrop = document.querySelector('.modal-backdrop')
    if (backdrop) {
      backdrop.addEventListener('click', (event) => {
        if (event.target === backdrop) {
          state.isModalOpen = false
          render()
        }
      })
    }
  }

  // Save success modal events
  if (state.isSaveModalOpen) {
    const saveModalClose = document.querySelector('.save-modal-close')
    if (saveModalClose) {
      saveModalClose.addEventListener('click', () => {
        state.isSaveModalOpen = false
        render()
      })
    }

    const backdrop = document.querySelector('.save-success-backdrop')
    if (backdrop) {
      backdrop.addEventListener('click', (event) => {
        if (event.target === backdrop) {
          state.isSaveModalOpen = false
          render()
        }
      })
    }
  }

  // 🔴 Delete plan modal events
  if (state.isDeleteModalOpen) {
    const confirmButton = document.querySelector('.delete-confirm')
    const cancelButton = document.querySelector('.delete-cancel')
    const backdrop = document.querySelector('.delete-modal-backdrop')

    if (confirmButton) {
      confirmButton.addEventListener('click', handleDeletePlan)
    }

    if (cancelButton) {
      cancelButton.addEventListener('click', () => {
        state.isDeleteModalOpen = false
        state.deletePlanId = null
        render()
      })
    }

    if (backdrop) {
      backdrop.addEventListener('click', (event) => {
        if (event.target === backdrop) {
          state.isDeleteModalOpen = false
          state.deletePlanId = null
          render()
        }
      })
    }
  }

  // ---------- Drag & Drop between terms ----------

  // When a course starts being dragged
  document.querySelectorAll('.planner-course-row').forEach((row) => {
    row.addEventListener('dragstart', (event) => {
      const term = row.dataset.term
      const index = Number(row.dataset.index)
      dragContext = { term, index }

      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move'
        event.dataTransfer.setData('text/plain', `${term}:${index}`)
      }
    })

    row.addEventListener('dragend', () => {
      dragContext = null
      document
        .querySelectorAll('.planner-term-card__body')
        .forEach((body) => body.classList.remove('is-drag-over'))
    })
  })

  // Make term containers droppable
  document.querySelectorAll('.planner-term-card__body').forEach((body) => {
    body.addEventListener('dragover', (event) => {
      event.preventDefault() // allow drop
      body.classList.add('is-drag-over')
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move'
      }
    })

    body.addEventListener('dragleave', () => {
      body.classList.remove('is-drag-over')
    })

    body.addEventListener('drop', (event) => {
      event.preventDefault()
      body.classList.remove('is-drag-over')
      if (!dragContext) return

      const toTerm = body.dataset.term
      const fromTerm = dragContext.term
      const fromIndex = dragContext.index

      if (!toTerm || fromTerm == null || fromIndex == null) return

      moveCourse(fromTerm, fromIndex, toTerm)
      dragContext = null
    })
  })
}

// Move a course from one term to another
const moveCourse = (fromTerm, fromIndex, toTerm) => {
  if (!fromTerm || !toTerm || !Number.isFinite(fromIndex)) return

  state.plans = state.plans.map((plan) => {
    if (plan.id !== state.activePlanId) return plan

    const fromList = [...(plan.terms?.[fromTerm] || [])]
    const [movedCourse] = fromList.splice(fromIndex, 1)
    if (!movedCourse) return plan

    const toList = [...(plan.terms?.[toTerm] || [])]
    toList.push(movedCourse)

    return {
      ...plan,
      terms: {
        ...plan.terms,
        [fromTerm]: fromList,
        [toTerm]: toList
      }
    }
  })

  render()
}

// Save to localStorage + open success popup
const handleSavePlan = () => {
  try {
    const payload = {
      studentProfile: state.studentProfile,
      courseCatalog: state.courseCatalog,
      plans: state.plans,
      activePlanId: state.activePlanId
    }
    localStorage.setItem('degreePlannerState', JSON.stringify(payload))
  } catch (e) {
    console.error(e)
    // still show popup, but you could change text if you want error-specific
  }

  state.isSaveModalOpen = true
  render()
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

// 🔴 Delete plan handler
const handleDeletePlan = () => {
  const idToDelete = state.deletePlanId
  if (!idToDelete) {
    state.isDeleteModalOpen = false
    render()
    return
  }

  state.plans = state.plans.filter((plan) => plan.id !== idToDelete)

  if (!state.plans.length) {
    state.activePlanId = null
  } else if (state.activePlanId === idToDelete) {
    state.activePlanId = state.plans[0].id
  }

  state.isDeleteModalOpen = false
  state.deletePlanId = null

  // Optional: also save right away
  try {
    const payload = {
      studentProfile: state.studentProfile,
      courseCatalog: state.courseCatalog,
      plans: state.plans,
      activePlanId: state.activePlanId
    }
    localStorage.setItem('degreePlannerState', JSON.stringify(payload))
  } catch (e) {
    console.error(e)
  }

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
    // Try to load saved state first
    const saved = localStorage.getItem('degreePlannerState')
    if (saved) {
      const parsed = JSON.parse(saved)
      state.studentProfile = parsed.studentProfile || null
      state.courseCatalog = parsed.courseCatalog || {}
      state.plans = parsed.plans || []
      state.activePlanId = parsed.activePlanId || state.plans[0]?.id
      if (state.studentProfile && state.plans.length) {
        render()
        return
      }
    }

    // Fallback to fetching from program.json
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
