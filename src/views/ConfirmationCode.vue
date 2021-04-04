<template>
  <v-container text-xs-center>
    <v-layout row wrap justify-center>
      <v-flex xs5 mt-5>
        <v-card>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="userId"
                :counter="15"
                :rules="userIdRules"
                label="User ID"
                required
              />
              <v-text-field
                v-model="confirmationCode"
                label="Confirmation Code"
                required
              />

              <v-btn @click="confirmCode">Confirm</v-btn>
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
export default class ConfirmationCode extends Vue {
  private valid = true;

  private userId = "";
  private userIdRules = [
    (v: string) => !!v || "User ID is required",
    (v: string) =>
      (v && v.length <= 15) || "User ID must be less than 15 characters",
  ];
  private confirmationCode = "";

  private async confirmCode() {
    if (this.userId && this.confirmationCode) {
      try {
        Logger.getLogger().info(
          `ConfirmCode :userId=${this.userId}, confirmationCode=${this.confirmationCode}`
        );
        const result = await CognitoWrapper.getInstance().confirmation(
          this.userId,
          this.confirmationCode
        );
        Logger.getLogger().info(`ConfirmCode result:${JSON.stringify(result)}`);
        // this.$router.push("/signin");
      } catch (err) {
        Logger.getLogger().error(`ConfirmCode failed: ${JSON.stringify(err)}`);
      }
    }
  }
}
</script>
