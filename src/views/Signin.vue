<template>
  <v-container text-xs-center>
    <v-layout row wrap justify-center>
      <v-flex xs5 mt-5>
        <v-card>
          <v-card-text>
            <v-form ref="form" lazy-validation>
              <v-text-field
                v-model="userId"
                :counter="15"
                :rules="userIdRules"
                label="User ID"
                required
              />
              <v-text-field
                v-model="password"
                type="password"
                :counter="20"
                label="Password"
                required
              />

              <v-btn @click="signIn">Signin</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { CognitoWrapper } from "../auth/cognitoWrapper";
import { Logger } from "../logger/logger";

@Component
export default class Signin extends Vue {
  private userId = "";
  private userIdRules = [
    (v: string) => !!v || "User ID is required",
    (v: string) =>
      (v && v.length <= 15) || "User ID must be less than 15 characters",
  ];
  private password = "";

  private async signIn() {
    if (this.userId && this.password) {
      try {
        Logger.getLogger().info(
          `SignIn :userId=${this.userId}, password=${this.password}`
        );
        const result = await CognitoWrapper.getInstance().signIn(
          this.userId,
          this.password
        );
        Logger.getLogger().info(`SignIn result:${JSON.stringify(result)}`);
        this.$router.push("/");
      } catch (err) {
        Logger.getLogger().error(`SignIn failed: ${JSON.stringify(err)}`);
      }
    }
  }
}
</script>
