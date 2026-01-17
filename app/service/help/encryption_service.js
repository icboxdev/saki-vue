export class EncryptionService {
    static KEY_HEX = import.meta.env.VITE_API_PUBLIC_KEY
    static ALGO = 'AES-GCM'
    static IV_LENGTH = 12        // recomendado para GCM
    static TAG_LENGTH = 16

    /* =========================
     * ENCRYPT
     * ========================= */

    static async encrypt(text) {
        const encoder = new TextEncoder()
        const data = encoder.encode(text)

        const key = await this.importKey('encrypt')
        const iv = crypto.getRandomValues(new Uint8Array(this.IV_LENGTH))

        const encrypted = await crypto.subtle.encrypt(
            { name: this.ALGO, iv },
            key,
            data
        )

        const encryptedArray = new Uint8Array(encrypted)
        const authTag = encryptedArray.slice(-this.TAG_LENGTH)
        const ciphertext = encryptedArray.slice(0, -this.TAG_LENGTH)

        return [
            this.toHex(iv),
            this.toHex(authTag),
            this.toHex(ciphertext),
        ].join(':')
    }

    /* =========================
     * DECRYPT
     * ========================= */

    static async decrypt(payload) {
        const [ivHex, tagHex, cipherHex] = payload.split(':')

        if (!ivHex || !tagHex || !cipherHex) {
            throw new Error('Invalid payload')
        }

        const iv = this.fromHex(ivHex)
        const authTag = this.fromHex(tagHex)
        const ciphertext = this.fromHex(cipherHex)

        const encryptedData = new Uint8Array([
            ...ciphertext,
            ...authTag,
        ])

        const key = await this.importKey('decrypt')

        const decrypted = await crypto.subtle.decrypt(
            { name: this.ALGO, iv },
            key,
            encryptedData
        )

        return new TextDecoder().decode(decrypted)
    }

    /* =========================
     * BASE64 WRAPPERS
     * ========================= */

    static async encryptBase64(text) {
        const encrypted = await this.encrypt(text)
        return btoa(encrypted)
    }

    static async decryptBase64(base64) {
        const decoded = atob(base64)
        return this.decrypt(decoded)
    }

    /* =========================
     * KEY
     * ========================= */

    static async importKey(usage) {
        const keyData = this.fromHex(this.KEY_HEX)

        return crypto.subtle.importKey(
            'raw',
            keyData,
            { name: this.ALGO },
            false,
            [usage]
        )
    }

    /* =========================
     * HELPERS
     * ========================= */

    static fromHex(hex) {
        if (hex.length % 2 !== 0) {
            throw new Error('Invalid hex')
        }

        const bytes = new Uint8Array(hex.length / 2)
        for (let i = 0; i < hex.length; i += 2) {
            bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16)
        }
        return bytes
    }

    static toHex(buffer) {
        return Array.from(buffer)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('')
    }
}
