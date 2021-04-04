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
                v-model="email"
                :rules="emailRules"
                label="E-mail"
                required
              />
              <v-text-field
                v-model="password"
                type="password"
                :counter="20"
                label="Password"
                required
              />
              <v-text-field
                v-model="passwordConfirm"
                type="password"
                :counter="20"
                :rules="[passwordConfirmRules]"
                label="Password Confirm"
                required
              />

              <!--
              <v-btn
                :disabled="!valid"
                color="success"
                class="mr-4"
                @click="validate"
              >
                Validate
              </v-btn>
              <v-btn color="error" class="mr-4" @click="reset">
                Reset Form
              </v-btn>
              <v-btn color="warning" @click="resetValidation">
                Reset Validation
              </v-btn>
              -->
              <v-btn @click="signUp">Signup</v-btn>
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
export default class Signup extends Vue {
  private valid = true;

  private userId = "";
  private userIdRules = [
    (v: string) => !!v || "User ID is required",
    (v: string) =>
      (v && v.length <= 15) || "User ID must be less than 15 characters",
  ];
  private email = "";
  private emailRules = [
    (v: string) => !!v || "E-mail is required",
    (v: string) => /.+@.+\..+/.test(v) || "E-mail must be valid",
  ];
  private password = "";
  private passwordConfirm = "";
  private get passwordConfirmRules() {
    return this.password == this.passwordConfirm || "Password does not match";
  }

  // private validate() {
  //   (this.$refs.form as any).validate();
  // }
  // private reset() {
  //   (this.$refs.form as any).reset();
  // }
  // private resetValidation() {
  //   (this.$refs.form as any).resetValidation();
  // }

  private async signUp() {
    if (this.userId && this.password === this.passwordConfirm) {
      try {
        Logger.getLogger().info(
          `SignUp :userId=${this.userId}, password=${this.password}, email=${this.email}`
        );
        const result = await CognitoWrapper.getInstance().signUp(
          this.userId,
          this.password,
          this.email
        );
        Logger.getLogger().info(`SignUp result:${JSON.stringify(result)}`);
        this.$router.push("/confcode");
      } catch (err) {
        Logger.getLogger().error(`SignUp failed: ${JSON.stringify(err)}`);
      }
    }
  }
}
</script>
