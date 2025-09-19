# BACKLOG 
* [ ] When you click and drag a wall length label, it should move the wall, resizing the adjacent walls.
    * [ ] The labels should "activate" or change colors when clicked.
    * [ ] If the wall is vertical, it should only move horizontally (left to right).
    * [ ] If the wall is horizontal, it should only move vertically (up and down).
* [ ] The tile size buttons (2 x 2 and 2 x 4) should be represented with images or svgs.
* [ ] The tile orientation for 2 x 4 tiles should also be represented with images.
* [ ] Wall labels should be shown in a measurement of feet and inches.  So 5.5 feet should display as 5'6"
    * [ ] Inches portion of label should round to the nearest 10th place.
    * [ ] If the measurement is a whole amount of feet, do not display the inches portion. (6'0" should just display as 6')

# COMPLETED

* [x] Add a favicon
* [x] We only need feet/inches as a unit of measurement; get rid of meters
* [x] Remove the concept of a border.
* [x] Remove the concept of cutouts.
* [x] Remove the exporting of files.
* [x] You should not be able to zoom the canvas in and out.  The content of the canvas should be at 100% zoom.
* [x] No button should display when the canvas is focused.  You should just be able to click on the labels and edit them.
* [x] Add deployment configuration for GitHub pages.
  * [x] It should only deploy the main branch and should trigger when the main branch updates.