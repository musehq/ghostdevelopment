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

  async digest(data: Uint8Array) {
    return await window.crypto.subtle.digest(this.DIGEST_ALGORITHM, data);
  }

  base64encode(data: ArrayBuffer) {
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(data)]))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
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
