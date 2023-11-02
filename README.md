# weekly

weekly is a web application built with React, Redux Toolkit, Tailwind CSS, and Firebase. It helps users to create their weekly schedule and then share it with anyone. The schedule can be edited only by the owner of the account but can be accessed publicly in different timezone formats.

## Installation

To run the application locally, follow these steps:

1. Clone the repository: `git clone https://github.com/vishesh-pandey/weekly.git`
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

## Firebase Configuration

To use the Firebase features in this project, you'll need to set up a Firebase project and add your project's configuration to the code. Here's how to do it:

1. Sign in to the [Firebase Console](https://console.firebase.google.com/) using your Google account.

2. Click the "Create a project" button, and follow the prompts to create a new Firebase project.

3. Once your project is created, click the "Add app" button to add a new app to your project. Choose "Web" as the platform, and give your app a name.

4. Firebase will generate a configuration object for your app, which includes a `apiKey`, `authDomain`, `projectId`, and other properties. Copy this configuration object to your clipboard.

5. In your code, open the `src/firebase.js` file, and paste your Firebase configuration object into the `firebaseConfig` variable.

`const firebaseConfig = {
// Paste your Firebase configuration object here
};`

`firebase.initializeApp(firebaseConfig);`

## Usage

The application helps users to create a weekly schedule without thinking about any dates and months. The schedule can be seen in different timezone formats and can be shared with anyone publicly.

## Deployment

The application is deployed on GitHub Pages and can be accessed at https://vishesh-pandey.github.io/weekly/.

## Contributing

Contributions to the project are welcome! If you'd like to contribute, please fork the repository and submit a pull request.

## Contact

If you have any questions or feedback, please don't hesitate to contact me.
