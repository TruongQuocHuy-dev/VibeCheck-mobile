import { getAuth, signInWithPhoneNumber, signOut as firebaseSignOut, FirebaseAuthTypes } from '@react-native-firebase/auth';

export type PhoneConfirmation = FirebaseAuthTypes.ConfirmationResult;

/**
 * Global Firebase Auth service wrapper.
 * All direct firebase/auth calls go through here — hooks should NOT import firebase directly.
 * Migrated to Modular API for v22+ compatibility.
 */

/**
 * Send OTP to a phone number via Firebase.
 */
const sendOtp = async (phone: string): Promise<PhoneConfirmation> => {
  const normalized = phone.startsWith('+') ? phone : `+84${phone.replace(/^0/, '')}`;
  const auth = getAuth();
  const confirmation = await signInWithPhoneNumber(auth, normalized);
  return confirmation;
};

/**
 * Verify OTP code against the Firebase confirmation object.
 */
const verifyOtp = async (
  confirmation: PhoneConfirmation,
  code: string
): Promise<FirebaseAuthTypes.UserCredential> => {
  const credential = await confirmation.confirm(code);
  if (!credential) throw new Error('Xác thực OTP thất bại.');
  return credential;
};

/**
 * Get Firebase ID Token for the currently signed-in Firebase user.
 */
const getIdToken = async (): Promise<string | null> => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  if (!currentUser) return null;
  return currentUser.getIdToken(true);
};

/**
 * Sign out from Firebase.
 */
const signOut = async (): Promise<void> => {
  const auth = getAuth();
  await firebaseSignOut(auth);
};

export const FirebaseService = { sendOtp, verifyOtp, getIdToken, signOut };
