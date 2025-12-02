# Program Sequence Guide - Degree Planner System

**Authors:** 

Nebila Wako, 
Mobha Khan,
Sagesse Ariyanto, 
Fernando Tomasi, and 
Danny Picazo 


This repository hosts a comprehensive degree planning system for the University of Calgary. The system allows students to view their degree requirements, track course completion status, and create interactive course plans. The UI uses JavaScript, CSS, and a JSON data file.

---

## How to Start the System

### Prerequisites
- Node.js (version 14 or higher recommended)
- npm (Node Package Manager)

### Installation and Startup Instructions

1. **Install dependencies** (the server uses Node's built-in APIs):
   ```bash
   npm install
   ```

2. **Start the server**:
   ```bash
   npm start
   ```

3. **Access the application**:
   - Open your web browser
   - Navigate to `http://localhost:3000`
   - The server will serve the application on port 3000 by default

4. **Stop the server**:
   - Press `Ctrl + C` in the terminal where the server is running

---

## System Overview

The system consists of three main pages:

1. **Advisor Page** (`advisor.html`) - Entry point for student authentication
2. **Degree Requirements Page** (`index.html`) - Displays degree timeline and course status
3. **Planner Page** (`planner.html`) - Interactive course planning interface

---

## What Cases/Functions Were Implemented

### 1. Admin Authentication System
- **UCID-based login**: Admin enter students UCID to access the system on their behalf.
- **Validation**: System validates student credentials (currently accepts UCID: `30203755`)
- **Error handling**: Displays error messages for invalid credentials

### 2. Degree Requirements Visualization
- **Year-based organization**: Courses organized by academic year (1st Year, 2nd Year, etc.)
- **Expandable year panels**: Click to expand/collapse each year's course details
- **Term-based display**: Courses shown by term (Fall, Winter, Spring, Summer)
- **Course status tracking**: Visual indicators for:
  - ✔ Complete (course finished)
  - ◯ Incomplete (not yet scheduled)
  - ⚠ Issue Found (needs attention)
- **Status badges**: Year-level status indicators (Complete, Incomplete, Issue Found)
- **Prerequisite/antirequisite tooltips**: Hover over courses to see prerequisite and antirequisite information

### 3. Plan Management System
- **Multiple plan support**: Create and manage multiple degree plans
- **Plan tabs**: Switch between different plans (e.g., "1st Year (Academic Year 1)", "2nd Year (Academic Year 2)")
- **Plan details panel**: Side panel showing:
  - Courses scheduled by term
  - Remaining courses to be scheduled
  - Incomplete prerequisites with warnings
- **Plan creation**: Create new plans with custom names and year selection
- **Plan deletion**: Delete unwanted plans with confirmation modal
- **Plan persistence**: Save plans to browser localStorage

### 4. Interactive Course Planner
- **Term-based course input**: Add courses to Fall, Winter, Spring, or Summer terms
- **Course autocomplete**: Real-time autocomplete suggestions as you type course codes or descriptions
- **Drag and drop**: Move courses between terms by dragging course rows
- **Course removal**: Delete courses from terms with the ✕ button
- **Course catalog integration**: Full course catalog with descriptions, prerequisites, and antirequisites

### 5. Prerequisite Tracking
- **Prerequisite warnings**: System tracks and displays incomplete prerequisites
- **Prerequisite hints**: Shows prerequisite information when adding courses
- **Visual indicators**: Highlights courses with prerequisite issues

### 6. Remaining Courses Tracking
- **Automatic tracking**: System tracks which required courses haven't been scheduled
- **Visual distinction**: Different styling for elective courses vs. required courses
- **Empty state handling**: Shows "All tracked courses are scheduled" when complete

### 7. Data Persistence
- **localStorage integration**: Plans are saved to browser's localStorage
- **State restoration**: System loads saved plans on page refresh
- **Fallback to JSON**: If no saved state exists, loads from `program.json`

### 8. Navigation and User Experience
- **Back navigation**: Back arrows to navigate between pages
- **Modal dialogs**: 
  - New plan creation modal
  - Save success confirmation modal
  - Delete plan confirmation modal
- **Responsive design**: Clean, modern UI with proper spacing and visual hierarchy

---

## What Data Should Be Entered at Which Times

### Initial Access (Advisor Page)

**When:** First time accessing the system

**Data to Enter:**
1. **UCID**: Enter your University of Calgary ID number
   - Example: `30203755`
   - Format: 8-digit number
2. **Year**: Enter your current year in the program (optional field)
   - Example: `4`
   - Format: Number (1-4)
3. **Program**: Select your program from dropdown (optional field)
   - Options: Computer Science, Software Engineering, Data Science, Other

**Action:** Click the "Submit" button

**Expected Result:** 
- If UCID is valid (`30203755`), redirects to Degree Requirements page
- If invalid, shows error message: "Student not found. Please check details and try again."

---

### Viewing Degree Requirements (Degree Requirements Page)

**When:** After successful login

**Data Entry:** None required - page displays automatically

**Actions Available:**
1. **Click year panels** to expand/collapse course details
2. **Click plan tabs** (e.g., "1st Year (Academic Year 1)") to view different plans
3. **Click "Planner" button** in top-right to navigate to planner page
4. **Click back arrow (←)** to return to advisor page

**What You'll See:**
- Student name and program information
- Year of program and credits left
- Status legend (Complete, Incomplete, Issue Found)
- Plan tabs showing available plans
- Expandable year panels with courses organized by term
- Plan details panel (when a plan is selected) showing:
  - Courses by term
  - Remaining courses
  - Incomplete prerequisites

---

### Creating a New Plan (Planner Page)

**When:** On the Planner page, when you want to create a new degree plan

**Steps:**
1. **Click the "+ New Plan" button** in the sidebar
2. **Select year** from dropdown:
   - Options: "1st Year", "2nd Year", "3rd Year", "4th Year"
   - Default: "4th Year"
3. **Enter plan name** in text field:
   - Example: `4 course load`
   - Example: `Fall 2024 Plan`
   - Placeholder suggests: "4 course load"
4. **Click "Submit" button** or press Enter

**Expected Result:**
- Modal closes
- New plan appears in the Plans list
- New plan becomes the active plan
- You can now add courses to this plan

---

### Adding Courses to a Plan (Planner Page)

**When:** On the Planner page with an active plan selected

**Data Entry Process:**

1. **Select a term** (Fall, Winter, Spring, or Summer)

2. **Type course code or description** in the input field:
   - Start typing: `CPSC 231` or `Introduction to Computer Science`
   - **Autocomplete will appear** showing matching courses
   - Format examples:
     - `CPSC 231 - Introduction to Computer Science for Computer Science Majors I`
     - `MATH 211 - Linear Methods I`
     - `PHIL 279 - Logic I`

3. **Select from autocomplete** OR **type full course name** and click "Add"

4. **Click "Add" button** next to the input field

**Expected Result:**
- Course appears in the term's course list
- Input field clears
- Course can now be dragged to other terms
- Remaining courses list updates automatically

**Example Walkthrough:**
- Click on "Fall" term card
- Type: `CPSC 231`
- Autocomplete shows: "CPSC 231 - Introduction to Computer Science for Computer Science Majors I"
- Click on the autocomplete option OR click "Add" button
- Course "CPSC 231 - Introduction to Computer Science for Computer Science Majors I" appears in Fall term

---

### Moving Courses Between Terms (Planner Page)

**When:** You want to reorganize courses across different terms

**Steps:**
1. **Locate the course** you want to move (e.g., in Fall term)
2. **Click and hold** the drag handle (☰) on the left side of the course row
3. **Drag the course** to the target term's card (e.g., drag from Fall to Winter)
4. **Release the mouse** when over the target term's body area

**Expected Result:**
- Course is removed from original term
- Course appears in new term
- Visual feedback during drag (highlighted drop zones)

**Example:**
- Drag "CPSC 231" from Fall term to Winter term
- Course moves from Fall list to Winter list

---

### Removing Courses from a Plan (Planner Page)

**When:** You want to remove a course from a term

**Steps:**
1. **Locate the course** in the term's course list
2. **Click the ✕ button** on the right side of the course row

**Expected Result:**
- Course is immediately removed from the term
- Remaining courses list updates if applicable

---

### Switching Between Plans (Planner Page)

**When:** You want to view or edit a different plan

**Steps:**
1. **Look at the "Plans" section** in the sidebar
2. **Click on a plan name** (e.g., "1st Year (Academic Year 1)")

**Expected Result:**
- Selected plan becomes active (highlighted)
- Course lists update to show courses for that plan
- Remaining courses and prerequisites update for that plan

---

### Deleting a Plan (Planner Page)

**When:** You want to remove a plan permanently

**Steps:**
1. **Locate the plan** in the Plans list
2. **Click the 🗑 (trash) icon** next to the plan name
3. **Confirmation modal appears**
4. **Click "Yes, delete"** to confirm OR **Click "Cancel"** to abort

**Expected Result:**
- If confirmed: Plan is deleted, system switches to another plan if available
- If cancelled: Modal closes, plan remains

---

### Saving a Plan (Planner Page)

**When:** You want to persist your changes to browser storage

**Steps:**
1. **Make any changes** to your plan (add courses, move courses, etc.)
2. **Scroll to bottom of sidebar**
3. **Click "Save Plan" button**

**Expected Result:**
- Success modal appears: "Plan Saved - Your degree plan has been saved successfully."
- Click "OK" to close modal
- Plan is saved to browser's localStorage
- Changes persist when you refresh the page

---

## Exact Walkthrough: Complete User Journey

### Scenario: New User Creating Their First Plan

**Step 1: Access the System**
- Open browser to `http://localhost:3000`
- You are on the Advisor page (`advisor.html`)

**Step 2: Login**
- In the "UCID" field, type: `30203755`
- Leave "Year" field empty (optional)
- Leave "Program" dropdown as "Computer Science" (optional)
- Click the "Submit" button
- **Result:** Redirected to Degree Requirements page (`index.html`)

**Step 3: Explore Degree Requirements**
- You see your name "Mariam K." and program "Bachelor of Science · Computer Science"
- You see "Year of Program: 4" and "Credits Left: 21"
- **Click on "1st Year Program Courses"** panel to expand it
- You see courses organized by Fall and Winter terms
- **Click on a plan tab** (e.g., "4th Year (Academic Year 4)") if available
- Plan details panel appears on the right showing courses by term
- **Click the "Planner" button** in the top-right corner
- **Result:** Navigated to Planner page (`planner.html`)

**Step 4: Create a New Plan**
- In the sidebar, **click the "+ New Plan" button**
- Modal appears
- **Select "4th Year"** from the "What year are you planning for?" dropdown
- **Type** `My 4th Year Plan` in the "Name Your Plan:" field
- **Click "Submit"** button
- **Result:** Modal closes, new plan "My 4th Year Plan" appears in Plans list and is active

**Step 5: Add Courses to Fall Term**
- Look at the "Fall" term card
- **Click in the input field** at the bottom of the Fall card
- **Type:** `CPSC 481`
- Autocomplete dropdown appears showing: "CPSC 481 - Human-Computer Interaction I"
- **Click on the autocomplete option**
- **Result:** Course is immediately added to Fall term list

**Step 6: Add More Courses**
- In the same Fall input field, **type:** `CPSC 457`
- Autocomplete shows: "CPSC 457 - Principles of Operating Systems"
- **Click the autocomplete option** OR **click "Add" button**
- **Result:** Course added to Fall term

**Step 7: Add Course to Winter Term**
- **Click in the Winter term input field**
- **Type:** `CPSC 441`
- Autocomplete shows: "CPSC 441 - Computer Networks"
- **Click the autocomplete option**
- **Result:** Course added to Winter term

**Step 8: Move a Course**
- In Fall term, find "CPSC 457"
- **Click and hold the ☰ (drag handle)** on the left of "CPSC 457"
- **Drag it** to the Winter term card
- **Release** when over Winter term's body area
- **Result:** "CPSC 457" moves from Fall to Winter

**Step 9: Remove a Course**
- In Winter term, find "CPSC 457"
- **Click the ✕ button** on the right side of that course row
- **Result:** Course is removed from Winter term

**Step 10: Save the Plan**
- **Scroll down** in the sidebar
- **Click the "Save Plan" button** at the bottom
- **Result:** Success modal appears
- **Click "OK"** to close modal
- Plan is saved to localStorage

**Step 11: Verify Persistence**
- **Refresh the browser page** (F5 or Cmd+R)
- **Result:** Your plan "My 4th Year Plan" loads with all courses intact

**Step 12: Delete a Plan (Optional)**
- In the Plans list, find a plan you want to delete
- **Click the 🗑 icon** next to the plan name
- Confirmation modal appears
- **Click "Yes, delete"**
- **Result:** Plan is deleted, system switches to another plan

---

## Technical Details

### File Structure
- `server.js` - Node.js HTTP server
- `public/index.html` - Degree Requirements page
- `public/degree.js` - Degree Requirements page logic
- `public/planner.html` - Planner page
- `public/planner.js` - Planner page logic
- `public/advisor.html` - Advisor/Login page
- `public/advisor.js` - Advisor page logic (minimal, mostly inline)
- `public/styles.css` - All styling
- `public/data/program.json` - Course catalog, student profile, degree timeline, and plan templates

### Data Flow
1. System loads `program.json` on initialization
2. User interactions update in-memory state
3. Plans can be saved to `localStorage`
4. On page load, system checks `localStorage` first, then falls back to `program.json`

### Browser Compatibility
- Modern browsers with ES6+ support
- localStorage support required for plan persistence
- Drag and drop API support required for course movement

---

## Notes for Evaluators

- **Best Features to Test:**
  1. **Course Autocomplete**: Type partial course codes to see real-time suggestions
  2. **Drag and Drop**: Move courses between terms smoothly
  3. **Plan Management**: Create multiple plans, switch between them, delete them
  4. **Prerequisite Tracking**: Check the "Incomplete prerequisites" section to see prerequisite warnings
  5. **State Persistence**: Save a plan, refresh the page, verify it loads correctly
  6. **Year Panel Expansion**: Click year panels on Degree Requirements page to see detailed course breakdowns
  7. **Plan Details Panel**: Select different plans to see how the side panel updates with term-specific courses

- **Test Data:**
  - Valid UCID: `30203755`
  - Sample courses to add: `CPSC 481`, `CPSC 457`, `CPSC 441`, `CPSC 413`, `MATH 211`
  - Try creating plans for different years (1st, 2nd, 3rd, 4th)

- **Known Limitations:**
  - Only one UCID is currently accepted for login (`30203755`)
  - Plans are saved to browser localStorage (not persistent across different browsers/devices)
  - Course validation is basic (no enforcement of prerequisite chains during planning)

---

## Support

For issues or questions, please refer to the code comments in the JavaScript files or check the browser console for error messages.
