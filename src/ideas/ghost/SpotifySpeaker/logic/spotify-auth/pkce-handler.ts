export class PKCEHandler {
  private readonly CODE_LENGTH = 128;
  private readonly POSSIBLE_CHARS =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  private readonly LOCAL_STORAGE_KEY = "CODE_VERIFIER";
  private readonly DIGEST_ALGORITHM = "SHA-256";

  getCodeVerifier() {
    return new Array(this.CODE_LENGTH)
      .fill("")
      .map(() =>
        this.POSSIBLE_CHARS.charAt(
          Math.floor(Math.random() * this.POSSIBLE_CHARS.length)
        )
      )
      .join("");
  }

  saveCodeVerifier(codeVerifier: string) {
    localStorage.setItem(this.LOCAL_STORAGE_KEY, codeVerifier);
  }

  retrieveCodeVerifier() {
    return localStorage.getItem(this.LOCAL_STORAGE_KEY);
  }

  clearLocalCodeVerifier() {
    localStorage.removeItem(this.LOCAL_STORAGE_KEY);
  }

  async digest(data: Uint8Array) {
    return await window.crypto.subtle.digest(this.DIGEST_ALGORITHM, data);
  }

  base64encode(data: ArrayBuffer) {
    if (!data || !(data instanceof ArrayBuffer)) {
      throw new Error("Invalid input data");
    }

    let encodedString;
    try {
      const utf8String = new TextDecoder().decode(data);
      encodedString = btoa(utf8String);
    } catch (err) {
      // @ts-ignore
      throw new Error("Failed to encode data: " + err.message);
    }

    if (typeof encodedString !== "string") {
      throw new Error("Invalid encoded string");
    }

    encodedString = encodedString.replace(/\+/g, "-");
    encodedString = encodedString.replace(/\//g, "_");
    encodedString = encodedString.replace(/=+$/, "");

    if (!encodedString) {
      throw new Error("Empty encoded string");
    }

    return encodedString;
  }

  async generateAndSaveCodeChallenge() {
    const codeVerifier = this.getCodeVerifier();
    this.saveCodeVerifier(codeVerifier);

    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await this.digest(data);

    return this.base64encode(digest);
  }
}
