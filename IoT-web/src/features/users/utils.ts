export function getAvatarColor(_name: string) {
 return "text-white"
}

export function getInitials(name: string | null, email: string) {
 if (name) {
 const parts = name.trim().split(/\s+/)
 return parts.length >= 2
 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
 : name.slice(0, 2).toUpperCase()
 }
 return email.slice(0, 2).toUpperCase()
}

export function generatePassword(): string {
 const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
 let pwd = ""
 for (let i = 0; i < 8; i++) {
 pwd += chars.charAt(Math.floor(Math.random() * chars.length))
 }
 return pwd
}
