// step 1. import statements.
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

import { AppwriteException, ID, Models } from "appwrite"; // what are these used for?
import { account } from "../models/client/config";

// step 2 - interface definitions
// what is this interface keyword..? (part of typescript?)
export interface UserPrefs {
  // more user preferences go here? like dark mode light mode?
  reputation: number;
}

// im so confused about the typescript!!
interface IAuthStore {
  // mention what the data that will come up??
  session: Models.Session | null; // '|' means the other type or does it mean or? what is this doing?
  jwt: string | null;
  user: Models.User<UserPrefs> | null; // what does <UserPrefs> do..?
  hydrated: boolean; // what is it even doing??

  setHydrated(): void; // putting things to hydrate them with react functionality..? this returns nothing so 'void'?
  verifySession(): Promise<void>; // no idea as well..

  login(
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: AppwriteException | null }>; // returns a type of Promise that returns an object with success key which is a boolean value?

  createAccount(
    email: string,
    password: string,
    name: string,
  ): Promise<{ success: boolean; error?: AppwriteException | null }>;

  logout(): Promise<void>; // this is a promise that returns nothing?
}

// step 3. work with zustand store

// ok this is method chaining? run methods back to back with ()() ?
export const useAuthStore = create<IAuthStore>()(
  persist(
    // what is this 'set' thing? immer makes sure we are creating a new state? the set is creating the state?
    // what is the callback in immer doing?
    immer((set) => ({
      session: null,
      jwt: null,
      user: null,
      hydrated: false,

      setHydrated() {
        set({ hydrated: true }); // this came from the set keyword..??
      },

      async verifySession() {
        try {
          const session = await account.getSession({ sessionId: "current" });
          set({ session }); // what the?
        } catch (error) {
          console.log(error);
        }
      },

      async login(email: string, password: string) {
        try {
          const session = await account.createEmailPasswordSession({
            email: email,
            password: password,
          });
          const [user, { jwt }] = await Promise.all([
            account.get<UserPrefs>(), // get a user for us?
            account.createJWT(),
          ]);

          // set reputation for user.
          if (!user.prefs?.reputation)
            await account.updatePrefs<UserPrefs>({
              prefs: {
                reputation: 0,
              },
            });

          set({ session, user, jwt });
          return { success: true };
        } catch (error) {
          console.log(error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null, // instanceof is what?
          };
        }
      },

      async createAccount(name: string, email: string, password: string) {
        try {
          await account.create({ userId: ID.unique(), email, password, name });
          return { success: true };
        } catch (error) {
          console.log(error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null, // instanceof is what?
          };
        }
      },

      async logout() {
        try {
          await account.deleteSessions();
          set({ session: null, jwt: null, user: null }); // make other state null for this user?
        } catch (error) {
          console.log(error);
        }
      },
    })),

    {
      name: "auth",
      onRehydrateStorage() {
        // this state is auto created by zustand?? what?
        return (state, error) => {
          if (!error) state?.setHydrated(); // if NO error, load the state with the setHydrated method..???
        };
      },
    },
  ),
);
