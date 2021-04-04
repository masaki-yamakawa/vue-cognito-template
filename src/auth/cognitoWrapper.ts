import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";
import { promisify } from "util";

export class CognitoWrapper {
  public static getInstance(): CognitoWrapper {
    return this.instance;
  }
  private static instance: CognitoWrapper = new CognitoWrapper();

  private readonly userPoolId: string = process.env.VUE_APP_COGNITO_USER_POOL_ID
    ? process.env.VUE_APP_COGNITO_USER_POOL_ID
    : "";
  private readonly clientId: string = process.env.VUE_APP_COGNITO_CLIENT_ID
    ? process.env.VUE_APP_COGNITO_CLIENT_ID
    : "";

  private userPool: any = null;

  private constructor() {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.userPoolId,
      ClientId: this.clientId,
    });
  }

  public async signUp(
    userId: string,
    password: string,
    mail: string
  ): Promise<any> {
    const name = { Name: "name", Value: userId };
    const email = { Name: "email", Value: mail };
    const now = Math.floor(new Date().getTime() / 1000);
    const upatedAt = { Name: "updated_at", Value: String(now) };

    const attributeList: any[] = [];
    attributeList.push(new CognitoUserAttribute(name));
    attributeList.push(new CognitoUserAttribute(email));
    attributeList.push(new CognitoUserAttribute(upatedAt));

    return await promisify(this.userPool.signUp).bind(this.userPool)(
      userId,
      password,
      attributeList,
      null
    );
  }

  public async confirmation(
    username: string,
    confirmationCode: string
  ): Promise<any> {
    const userData = { Username: username, Pool: this.userPool };
    const cognitoUser = new CognitoUser(userData);

    return await promisify(cognitoUser.confirmRegistration).bind(cognitoUser)(
      confirmationCode,
      true
    );
  }

  public async signIn(username: string, password: string): Promise<any> {
    const userData = { Username: username, Pool: this.userPool };
    const cognitoUser = new CognitoUser(userData);
    const authenticationData = { Username: username, Password: password };
    const authenticationDetails = new AuthenticationDetails(authenticationData);

    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result: any) => {
          resolve(result);
        },
        onFailure: (err: any) => {
          reject(err);
        },
      });
    });
  }

  public async signout(): Promise<void> {
    if (this.userPool.getCurrentUser()) {
      this.userPool.getCurrentUser().signOut();
    }
  }
}
