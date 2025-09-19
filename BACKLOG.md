# Overview

This is the backlog for the ceiling tile calculator project. The backlog is divided into two sections: completed tasks
and tasks that still need to be done.

Only do one task at a time. A task includes the top level and it's child tasks (the indented tasks below it).

Each time you finish a task from the "backlog" section, move it to the "completed" section and mark it with an "x".

# BACKLOG
* [ ] Do a code cleanup:
    * Refactor any code that is messy or hard to read.
        * Extract logic into other files if necessary.
    * Remove any unused code or comments.
    * Ensure that the code follows best practices and is well-organized.
    * Remove console.logs.
* [ ] The textboxes that update the wall labels.
* [ ] Updating the feet and inches textboxes should update the wall labels on the canvas.
    * [ ] The walls should adjust as soon as the user has stopped typing.
* The tile grid should be lined up with the grid on the canvas.
* [ ] Wall labels should be shown in a measurement of feet and inches. So 5.5 feet should display as 5'6"
    * [ ] Inches portion of label should round to the nearest 10th place.
    * [ ] If the measurement is a whole amount of feet, do not display the inches portion. (6'0" should just display as
      6')
* [ ] Put calculator in an accordion-esque layout where each step is in its own collapsable section. The according
  should be to the left of the canvas.
    * Step 1: Choose room shape.
    * Step 2: Choose tile size.
    * Step 3: If tile size is 2x4, choose tile orientation.
    * Step 4: Adjust wall lengths.
* [ ] Get rid of price input.
* [ ] Get rid of area information.

# COMPLETED

* [x] Add a favicon
* [x] We only need feet/inches as a unit of measurement; get rid of meters
* [x] Remove the concept of a border.
* [x] Remove the concept of cutouts.
* [x] Remove the exporting of files.
* [x] You should not be able to zoom the canvas in and out. The content of the canvas should be at 100% zoom.
* [x] No button should display when the canvas is focused. You should just be able to click on the labels and edit them.
* [x] Add deployment configuration for GitHub pages.
    * [x] It should only deploy the main branch and should trigger when the main branch updates.
* [x] When you click and drag a wall length label, it should move the wall, resizing the adjacent walls.
    * [x] The labels should "activate" or change colors when clicked.
    * [x] If the wall is vertical, it should only move horizontally (left to right).
    * [x] If the wall is horizontal, it should only move vertically (up and down).
* [x] The tile size buttons (2 x 2 and 2 x 4) should be represented with clickable images or svg squares/rectangles
  instead of buttons.
* [x] Update the tile orientation section.
    * [x] The tile orientation config section should only display if 2 x 4 is selected.
    * [x] The tile orientation (vertical or horizontal) for 2 x 4 tiles should also be represented with images.
    * [x] The grid should rotate with the selected tile orientation.
* [x] Update the wall length inputs.
    * [x] For each wall, there should be a feet input and an inches input.
* [x] Add CSS styling to the ceiling tile calculator.
    * [x] Use tailwind.