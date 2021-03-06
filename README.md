# A web-based imitation of MBTA's mTicket application

The 2 functionalities that this application simulates are:
- purchasing commuter rail tickets
- viewing ticket purchase history

<p align="center"><img src="./public/home.png" /></p>


## Running the application

In the project directory, you simply need to install the dependencies via `npm install` and then you can run `npm start` which will run the app in the development mode. Then open [http://localhost:3000](http://localhost:3000) to view it in the browser.

Also, the page will reload automatically if you make edits and you will also see any lint errors in the console.


## Views and their primary functionalities

**Home Screen View:**
Allows navigation to "Ticket Selection View" or "Ticket History View".

**Ticket Selection View:**
Allows selection of an origin stop and destination stop.

**Ticket Confirmation View:**
Prompts for confirmation of purchase while showing the selected origin stop and destination stop.

**Ticket History View:**
Displays list of tickets that have been purchased.


## System requirements

- Commuter rail data should be retrieved from [./commuterrail-data.json](./commuterrail-data.json).
- The purchase history does not need to persist if the page is refreshed.
- Outbound vs Inbound directions can be ignored.
- Any discrepancies in the number of stops on each commuter rail line can be ignored.
- "Ticket Selection View":
	- Selecting an origin stop should filter the displayed list of destination stops to only those on the same line as the selected origin stop.
	- Selecting a destination stop should filter the displayed list of origin stops to only those on the same line as the selected destination stop.
- "Ticket Confirmation View":
	- Should only be accessible via a "Confirm" button in the "Ticket Selection View" once the user has selected both an origin stop and destination stop.
	- Should have a button that navigates back to the beginning of the ticket selection process.
- You may use the JavaScript Framework of your choice (Angular, React, Vue, etc).

