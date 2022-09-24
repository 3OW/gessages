import * as argon2 from "argon2";

export const hashPassword = async (
  password: string
): Promise<string | null> => {
  try {
    // Hash password
    return await await argon2.hash(password);
  } catch (error) {
    console.log(error);
  }
  // Return null if error
  return null;
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  try {
    // Compare password
    return await argon2.verify(hash, password);
  } catch (error) {
    console.log(error);
  }
  // Return false if error
  return false;
};
