TODO:

MVP:

<!-- Under user page, todos should be similar to todo page, with colored due dates -->

Same as under child page

<!-- Error when saving changes in todoViewing -->

Clean up errors on each page

get rid of consoles

fix reads on firebase

<!-- child photo if no photo on childPage -->

<!-- Due Date for kid's todos -->

<!-- when $ or points are added to a todo item and it's marked as completed, the money and points don't go to the child -->

<!-- weird animation of navbar buttons on click -->
<!-- create a home page when not logged in that tells about the app and has a register and login button -->
<!-- -todo Counter updates when a new todo for the current user is added, not only on reload -->

CHILDREN
-login functionality for kids where they can only see their own page. They can see what chores are assigned to them and which they can pick up for extra cash
-a child's version of the app where they can hit 'complete' for each chore and a notification will be sent to the adult for review. Or it will turn a different color for review.
-Set reaccuring allowance to auto add to the child's total, need to check how long it's been since a user logged in and update the weekly allowance by the number of saturdays since login.  
-Allow image uploads for kids and users?
-when no photo exists link to photos in public images, not on internet

TODOS
-set reaccuring chores
-if user is signed up under email and not google make sure they can select themselves in the create/view todos
-redo user and children todos to be more like todoViewing

USER PAGE
-A list of chores under the user's profile that they need to review
-displayName when signing up under email may be reserved for google names

SHARING DATA
-some users get displayed twice under SharedViewing
-invitations get viewed for users who weren't sent one
-sharing data gets deleted for the wrong users
-error deleting sharing data
-error accepting and declining invitations

MOBILE
-table in sharedViewing needs to wrap on mobile

MISC
-Mobile friendly
-Get rid of consoles.
-comment code and refine.

DONE:
-do a nice Readme.
-header dropdown doesn't contract on clicking a link
-Redesign Login and Register pages
-Weekly Allowance when creating if blank should be 0, not NaN
-note that displays when a child or todo is created
-each chore monetary value can be adjusted
-Chores will automatically be bumped up the chain based on their urgency or due date.
-chores can be bumped up based on due date and may change color to indicate importance.
-password reset, forgot password
-photo for each child
-chores can be moved to another child
-The child's app version will show all available chores and their monetary value and they can pick which they want to do and those will be assigned to them.
-chores for adults, add list of chores and adults can pick which they'd like to accomplish
-login and signup functionality
-Create CRUD functionality for users to have children under them
-allow multiple users to access the same children
-crud for each child to have points/allowance amount
-crud for chores to be assigned to different children
-each chore will have a point / monetary value associated with it
-once complete that chore will be removed from the chore list and the money will be added to the child's total.

NOTES:
FIREBASE CONSOLE: https://console.firebase.google.com/u/0/
FIREBASE TUTORIAL: https://codedamn.com/news/reactjs/react-firebase-complete-tutorial
Firebase authentication tutorial: https://www.youtube.com/watch?v=WpIDez53SK4
Github repo for authenticatino: https://github.com/Nitij/react-firebase-auth-boilerplate/tree/main
YOUTUBE CRUD: https://www.youtube.com/watch?v=jCY6DH8F4oc&list=PLpPqplz6dKxUfvM22GXRvYA4s-mvJE0XF
ADDING SASS STYLESHEET: https://create-react-app.dev/docs/adding-a-sass-stylesheet/

DATABASE:
