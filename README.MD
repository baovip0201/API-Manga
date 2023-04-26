# Route Documentation: /api/chapter
This route is responsible for managing chapters of manga.

## GET /api/chapter/:mangaId
Get all chapters of a specific manga.

### URL parameters:

* mangaId (required) - The ID of the manga to get the chapters from.
### Response:       

* 200 OK - The list of chapters is returned successfully.
* 404 Not Found - If the manga ID is not found in the database.
* 500 Internal Server Error - If an error occurs on the server.
## GET /api/chapter/:mangaId/:chapterId
Get a specific chapter of a specific manga.

### URL parameters:

* mangaId (required) - The ID of the manga to get the chapter from.
* chapterId (required) - The ID of the chapter to get.
### Response:

* 200 OK - The chapter is returned successfully.
* 404 Not Found - If either the manga ID or the chapter ID is not found in the database.
* 500 Internal Server Error - If an error occurs on the server.
## POST /api/chapter
Create a new chapter.

### Request body:

* chapterId (required) - The ID of the chapter to create.
* mangaId (required) - The ID of the manga that the chapter belongs to.
* nameChapter (optional) - The name of the chapter.
* urlImageChapter (optional) - The URLs of the images in the chapter.
### Response:

* 201 Created - The chapter is created successfully.
* 400 Bad Request - If the manga ID is not found in the database.
* 401 Unauthorized - If the chapter ID already exists.
* 500 Internal Server Error - If an error occurs on the server.
## POST /api/chapter/json
Create new chapters from JSON file.

### Request body:

* data.json (required) - The JSON file containing the chapter data.
### Response:

* 200 OK - The chapters are created successfully.
* 500 Internal Server Error - If an error occurs on the server.
## PATCH /api/chapter/:chapterId
Update an existing chapter.

### URL parameters:

chapterId (required) - The ID of the chapter to update.
### Request body:

* nameChapter (optional) - The new name of the chapter.
* urlImageChapter (optional) - The new URLs of the images in the chapter.
### Response:

* 200 OK - The chapter is updated successfully.
* 404 Not Found - If the chapter ID is not found in the database.
* 500 Internal Server Error - If an error occurs on the server.
## DELETE /api/chapter/:chapterId
Delete a specific chapter.

### URL parameters:

* chapterId (required) - The ID of the chapter to delete.
### Response:

* 200 OK - The chapter is deleted successfully.
* 404 Not Found - If the chapter ID is not found in the database.
* 500 Internal Server Error - If an error occurs on the server.
## DELETE /api/chapter/all/:mangaId
Delete all chapters of a specific manga.

### URL parameters:

* mangaId (required) - The ID of the manga to delete the chapters from.
### Response:

* 200 OK - The chapters are deleted successfully.
* 500 Internal Server Error - If an error occurs on the server.
