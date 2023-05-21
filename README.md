# Documentation
## auth.js`
### Configure auth client 
   ```js
   import { Amplify, Auth } from 'aws-amplify';
  ```
- The configuration is done using the AWS Cognito User Pool details obtained from environment variables. "AWS -> Cognito ->  fragments-users"
- The `getUser()` function retrieves the authenticated user's information, including the username, idToken, accessToken, and a method to generate authorization headers.

## app.js
### login and logout events 
```js
import { Auth, getUser } from './auth';
```
- Event handlers for the login and logout buttons trigger the corresponding authentication actions using the `Auth` object.
- The `getUser()` checks the authentication status and update the HTML accordingly.
-  If a user is authenticated, the user's information is displayed. Otherwise, the logout button is disabled.
