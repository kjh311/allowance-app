# Allowance App

The Allowance App is a web application designed to help parents and children manage weekly allowances, chores, and rewards more effectively. This README.md file provides an overview of the features available in the app.

## Features

### Parent Dashboard

1. **Create and Manage Allowances**: Parents can set up weekly allowances for their children and adjust them as needed.

2. **Assign and Track Chores**: Parents can assign chores to their children and track their completion status. They can specify chore details such as due dates, descriptions, and point values.

3. **Reward System**: Parents can define rewards for completed chores and other achievements, motivating children to be more responsible.

4. **View Child Progress**: Parents can monitor their children's progress, including completed chores, earned allowances, and redeemed rewards.

### Child Dashboard

1. **View Weekly Allowance**: Children can see their weekly allowances and track how much they've earned for the week.

2. **Manage Chores**: Children can view assigned chores, mark them as completed, and earn points towards their allowance.

3. **Redeem Rewards**: Children can redeem earned points for rewards set by their parents, providing a sense of achievement.

### User Authentication

1. **Secure Authentication**: The app uses Firebase Authentication to ensure secure login and registration processes for both parents and children.

2. **Parent and Child Accounts**: The app supports separate accounts for parents and children, allowing each to access relevant features and data.

### Real-Time Updates

1. **Instant Updates**: The app utilizes Firebase Firestore to provide real-time updates on chores, allowances, and rewards, ensuring that all information is up-to-date.

2. **Synced Data**: Parents and children see changes reflected instantly across all devices, making it easy to stay in sync.

### Responsive Design

1. **Mobile-Friendly Interface**: The app features a responsive design that works seamlessly across different devices, including smartphones, tablets, and desktops.

2. **Intuitive Navigation**: The user interface is designed to be intuitive and user-friendly, making it easy for parents and children to navigate and use the app effectively.

## Getting Started

To get started with the Allowance App, follow these steps:

1. **Clone the Repository**: Clone the repository to your local machine using Git.

   ```bash
   git clone https://github.com/kjh311/allowance-app.git
   ```

2. **Install Dependencies**: Navigate to the project directory and install the required dependencies using npm or yarn.

   ```bash
   cd allowance-app
   npm install
   ```

3. **Set Up Firebase**: Set up a Firebase project and configure Firebase Authentication and Firestore. Update the Firebase configuration in the project.

//Firebase Rules:

rules_version = '2';
service cloud.firestore {
match /databases/{database}/documents {
// Allow read/write access to all documents for authenticated users
match /{document=\*\*} {
allow read, write: if request.auth != null;
}

    // Allow read/write access to the "children" collection for authenticated users,
    // but only for documents corresponding to their own user ID or if the child is shared with them.
    match /children/{childId} {
      allow read, write: if request.auth != null &&
        (request.auth.uid == resource.data.userId ||
        request.auth.uid in resource.data.sharingWith);
    }

    // Allow read/write access to the "todos" collection for authenticated users
    match /todos/{todoId} {
      allow read, write: if request.auth != null;
    }

    // Allow read/write access to the "users" collection for authenticated users
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Allow read access to the "sharedData" collection for authenticated users
    match /sharedData/{sharedId} {
      allow read: if request.auth != null && resource.data.shareAllow == true;
    }

}
}

4. **Run the App**: Start the development server and run the app locally.

   ```bash
   npm start
   ```

5. **Access the App**: Open your web browser and navigate to the local development server URL (usually http://localhost:3000) to access the Allowance App.
