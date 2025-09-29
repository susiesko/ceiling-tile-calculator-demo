# Overview

This is the backlog for the ceiling tile calculator project. The backlog is divided into two sections: completed tasks
and tasks that still need to be done.

Only do one task at a time. A task includes the top level and it's child tasks (the indented tasks below it).

Each time you finish a task from the "backlog" section, move it to bottom of the "completed" section and mark it with
an "x".

# BACKLOG

# COMPLETED

- [x] Put calculator in an accordion-esque layout where each step is in its own collapsable section. The accordion
      should be to the left of the canvas. Only one step at a time can be active, and opening another step should close the
      current step.
  - [x] Step 1: Choose room shape.
  - [x] Step 2: Choose tile size.
  - [x] Step 3: If tile size is 2x4, choose tile orientation.
  - [x] Step 4: Adjust wall lengths.
- [x] Do a code cleanup:
  - [x] Refactor any code that is messy or hard to read.
    - [x] Extract logic into other files if necessary.
  - [x] Remove any unused code or comments.
  - [x] Ensure that the code follows best practices and is well-organized.
  - [x] Remove console.logs.
- [x] Add a favicon
- [x] We only need feet/inches as a unit of measurement; get rid of meters
- [x] Remove the concept of a border.
- [x] Remove the concept of cutouts.
- [x] Remove the exporting of files.
- [x] You should not be able to zoom the canvas in and out. The content of the canvas should be at 100% zoom.
- [x] No button should display when the canvas is focused. You should just be able to click on the labels and edit them.
- [x] Add deployment configuration for GitHub pages.
  - [x] It should only deploy the main branch and should trigger when the main branch updates.
- [x] When you click and drag a wall length label, it should move the wall, resizing the adjacent walls.
  - [x] The labels should "activate" or change colors when clicked.
  - [x] If the wall is vertical, it should only move horizontally (left to right).
  - [x] If the wall is horizontal, it should only move vertically (up and down).
- [x] The tile size buttons (2 x 2 and 2 x 4) should be represented with clickable images or svg squares/rectangles
      instead of buttons.
- [x] Update the tile orientation section.
  - [x] The tile orientation config section should only display if 2 x 4 is selected.
  - [x] The tile orientation (vertical or horizontal) for 2 x 4 tiles should also be represented with images.
  - [x] The grid should rotate with the selected tile orientation.
- [x] Update the wall length inputs.
  - [x] For each wall, there should be a feet input and an inches input.
- [x] Add CSS styling to the ceiling tile calculator.
  - [x] Use tailwind.
- [x] The walls should be labeled alphabetically, starting with A in the top left corner and going clockwise.
- [x] BUG: The A and F wall on the L shape do not move when their labels are dragged.
- [x] Updating the feet and inches textboxes should update the wall labels on the canvas.
  - [x] The walls should adjust as soon as the user has stopped typing for 1 sec.
- [x] BUG: The textboxes for the E and F walls of the L shaped room are missing.
- [x] The tile grid should be lined up with the grid on the canvas. The grid and tiles should be fixed to the canvas at
      all times.
- [x] Some cleanup
  - [x] Get rid of price input.
  - [x] Get rid of area information.
  - [x] Get rid of scale text.
- [x] ENHANCEMENT: The L shaped room SVG on the button in Step 1 to be a bit bigger and look cleaner. It should
      also be oriented to look like an L rather than be upside down.
- [x] Walls should each be stored as an object with properties instead of just an array of numbers.
  - [x] Each wall should have a name (A, B, C, etc.), length in inches, and orientation (horizontal or vertical).
  - [x] The walls should be labeled alphabetically, starting with A in the top left corner and going clockwise.
  - [x] The wall objects should be stored in an array in the global state.
- [x] BUG: Even though the inches textboxes should increment by 0.5 inches, the walls don't have to move by 0.5 inches
      when being dragged.
  - [x] The walls should move at the same rate as the mouse cursor.
  - [x] The mouse cursor must be hovering the label to start dragging the wall, but moving the mouse cursor off the
        the label won't stop the wall from moving until the mouse button is released.
- [x] ENHANCEMENT: Add a tile picker step.
  - [x] The "choose tile" step is its own step and should be the sixth step. Only show the tiles that match the size.
  - [x] Available tiles should be stored in a JSON file.
  - [x] Each tile should have a name, dimensions (width and height in inches),
  - [x] and an image URL, which points to the images in public/tiles.
  - [x] Only use what's currently in the public/tiles folder.
- [x] Choosing a tile should fill the room with that tile.
  - [x] Use clipping to ensure tiles only appear within room boundaries.
- [x] Refactor/Enhance steps
  - [x] Make sure the steps are in the right order and numbered correctly.  Currently, we skip step 4.
  - [x] When 2x4 is selected, hide the Choose tile orientation completely, and number the steps accordingly.
    - 2x2 should have 4 steps. (adjust wall lengths is step 3)
    - 2x4 should have 5 steps. (adjust wall lengths is step 4)
  - [x] Add a back button and next step button to each step, where appropriate.
    - The back button should go to the previous step, and the next step button should go to the next step.
    - The back button should not show on the first step. The next step button should not show on the last step.
  - [x] The step that is currently active should be highlighted in some way.
