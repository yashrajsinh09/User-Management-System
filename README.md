# User-Management-System

Create a User Management System
Requirements:
- Technologies : Nodejs, ExpressJs, mongodb
- Design the system to manage users with multiple roles in the
organization where user flow with the following as defined:
- Super Admin -> Admin -> User
- All the users and admins should log in to use the feature where they log
in using token functionality to which it will be authenticated and should
expire its login after 24 hours.
- You can use the JWT token, Passport libraries.
- Create multiple routes for CRUD with users where Each user type
will have functionality according to its roles.
- Create user schema with indexation.
- Use aggregation and pagination in service.
- The user should not be able to log in if its status is deactivated and
unverified.
- Create MongoDB schema to save data in the Database.
Features:
- Super Admin:
- Can create any user and admin and can manage every role with the
verification status of users with active/deactive.
- Admin:
- Can Add users but can’t control roles of users.
- Can change the status of users from active/deactive but can’t
change the verification of the users.
- User:
- Can only log in and can check their status.
● You should understand the requirements properly as it’s essential to
deliver what’s expected from the client.
● The file structure is also essential to which it’s scalable and secure.
● Code quality should must be clever with proper documentation and
understandable language.
● Using a web socket or any other feature can make you stand out.
● Everything should be saved in the MongoDB cluster if you can.
● Feel free to use google for help but the code should be your’s and it
should not be the same as the internet.
● Any Code variables and tables must start with CMS
○ For Ex, let CMS_users, CMSTable ETC
● After the completion of the task upload it to GitHub, make the repository
public and share the git repo link with us
