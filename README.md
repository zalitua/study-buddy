# Study Buddy

StudyBuddy is an interactive environment designed to make organizing and managing your group projects easy and fun. By members being rewarded and recognized while using the app, they are encouraged to engage in a friendly, competitve and motivational space that will aid in increasing your teams productivity!

Study buddy web app made for software development practice sem 2 2024


## Developed by
Developers: 
- ISHUMANSS - Alister
- sophiaullrich - Sophia
- kny725979 - Lucy
- zalitua - Zali

## Installation
To run this app you need to have node.js installed on your computer

list of needed dependency:
```bash
- npm node: npm install
- react router: npm install react-router-dom

- react toastfiy: npm install --save react-toastify

- react-dom: npm install react react-dom

- react-firebase-hooks: npm install --save react-firebase-hooks

- react-router-dom: npm install react-router-dom@6

- react-toastify: npm install --save react-toastify 

- react-bootstrap: npm install react-bootstrap bootstrap

- react-google-button: npm install --save react-google-button

- uuid: npm install uuid

- react-nice-avatar: npm install react-nice-avatar

- jest for testing: npm install @testing-library/jest-dom@5.16.5 @testing-library/react@13.4.0 @testing-library/user-event@14.4.3 jest@29.3.1 jest-environment-jsdom@29.3.1 vitest@0.25.3 --save-dev

- react-calendar: npm install react-calendar

- React emoji: npm i emoji-picker-react.



```

## Usage
### How to start the app: 
- cd to the correct directory 
- run: npm start

### Entering the site:

- A user starts at the home page
If the user has previously registered and their login credentials are currently active, then navigation to the dashboard is automatic.

### How to register:

- From the home page click on the signup button and a signup modal will be displayed
- Fill in the inputs and click the signup button
If the email and password meet format checks then the user account is created. An authentication record is created, a user ID is assigned and user's details are stored in the database. Login is automatic as is navigation to the profile form page.

### How to login:

- From the home page click on the login button and a login modal will be displayed
- Fill in the user credentials and click the login button
If the user credentials match those stored with the authentication service then navigation to the dashboard is automatic.
Note: all pages use protected routes, so if a user tries to navigate to a page without being logged in, then navigation to the home page is automatic.

### How to create a group:

- Navigate to the group page
Type in the user name you want into the search for users bar (case sensitive) or just
- Click the Search button (if you have no input in the search a list of all the users will turn up)
if the user you are looking for hasn't turned up check if the username is typed in correctly with all of the same capital letters
- Click the add button on the user you want to add to your group (will grey out if done correctly)
- After you have added all the users you want press the Create Group button
A modal allowing you to confirm your choices and rename the group (group needs to be named before they are created)
- After submitting all the details and confirming your choices press the Create Group button
If everything works correctly an alert will pop up saying group and chat created successfully

### How to chat:

- Navigate to the group page
Make sure you are currently part of a group (if you are it will show up in the current group's section if not follow the how to create a group section above)
- Click on the Chat button in the group which you want to chat in
Now you are in the chat it will automatically scroll to the bottom of the chat so you can see the most recent messages being sent
- To send a message type your message in the type a message section and press send once you have written what you want to send
After you press send your message will appear in the chat box with your: user name, the message, the time the message was sent at

### How to edit a group after its been created:

- Navigate to the group page
Make sure you are currently part of a group (if you are it will show up in the current group's section if not follow the how to create a group section above)
- Click on the edit group button for the group you want to edit
- A modal allowing you to: Change the name of the group, Remove users, and search/add new users to the group will open
- To confirm any changes you made press the save changes and the group will be updated and an alert will pop up saying the group updated
- To cancel any change to the group you made to the group click on the Cancel button or press on the X button at the top right of the modal

### How to create a user profile:

- Navigate to the profile form page.
This navigation is automatic upon registration.
- Fill in the data fields fields and click update profile.
There are three required fields. If these have been filled out then the user's data will be added to user's record the database, and navigation to the dashboard is automatic.
Note: If an avatar has not been created then one is automatically generated.

### How to add a profile picture:

- Navigate to the profile form page.
- Click on the choose file button.
A file selection window will open.
- Select an image file and click open/select.
The image will be added to a storage database automatically and the profile image will then be shown on the profile form.

### How to create a custom avatar:

- Navigate to the profile form page.
- Click on the create avatar button.
A modal for creating a custom avatar will open and a default avatar will be displayed.
- Choose options for a variety of styles and use color pickers to choose preferred colors.
The displayed avatar will update in real time, showing style and color selections.
- Click save avatar. The avatar configuration will be saved to the data base and navigation back to the profile form is automatic.
The new custom avatar will display in the profile form.

### How to edit profile after it has been created:

- Navigate to the profile page.
Here all profile information, including the profile image and avatar are displayed.
- Click on edit profile link. This will open the profile form
If the user has created a profile then the name of the page will display as "Edit Profile". The form will automatically display the current profile data in the input fields, and the current profile image and avatar will be displayed.
- Change any of the input as required and create a new avatar or add a new profile image if desired.
- Click the update profile button.
The user's profile data in the database will be updated and navigation to the dashboard is automatic.

### How to logout:

- From any page click on the logout button on the sidebar
The user is logged out and navigation to the home page is automatic.

## how to add availability 
- click on the day you are available, under the add availability header you can put the time period you're free. The start time will be the time you start being free and the end time will be the time you stop being free.
- Next you can click add availbility.
- When you click on the date you are availabile you will now see your availbility next to your email address and how long you are availbile for.

## how to schedule a meeting
- There are two ways to schedule a meeting
- way #1 - creating a meeting from another persons availability.
- you can do this by pressing the button create meeting next to the persons availbility.
- this will create a meeting during the persons availibility time
- after reloading the page your meeting will appear underneath the meetings header
- way #2 create meeting without availability
- you can do this by scrolling down 'schedule a meeting' and inputting the time you would like to start the meeting and when you'd like it to end.
- You will next press the schedule meeting button.
- after reloading the page your meeting will appear underneath the meetings header

### how to earn points
- Task Completion: When a you completes a task, the task is marked as completed, and your points will increase by 5. These points will be reflected on the leaderboard instantly.
- Sign-up: Upon successfully signing up for an account, the user will receive 10 points. The leaderboard will update immediately to reflect the 10 points.
- Profile Setup: After signing up, if you have not yet set up your profile, once you completes your profile setup (e.g., adds DOB, phone number, avatar), you will receive 10 additional points, which will update the leaderboard in real-time.

### how to view the leaderboard:
- Viewing your rank: After logging in with valid credentials, you can navigate to the leaderboard page. The leaderboard will display your current points and rank, which updates automatically based on the points accumulated.
- Top 10 users: The leaderboard will display the top 10 users, showing their usernames, points, and ranks. These updates occur in real-time to ensure that the leaderboard reflects the most recent changes.

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Project Status
Assignment is finished so no more team development will be taking place. Development stoped
