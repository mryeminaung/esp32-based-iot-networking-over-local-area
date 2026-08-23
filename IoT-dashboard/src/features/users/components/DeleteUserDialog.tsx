import type { User } from "../types"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

interface DeleteUserDialogProps {
 user: User | null
 onClose: () => void
 onConfirm: () => void
}

export default function DeleteUserDialog({ user, onClose, onConfirm }: DeleteUserDialogProps) {
 return (
 <AlertDialog open={!!user} onOpenChange={(v) => !v && onClose()}>
 <AlertDialogContent>
 <AlertDialogHeader>
 <AlertDialogTitle>Delete User</AlertDialogTitle>
 <AlertDialogDescription>
 Are you sure you want to delete{" "}
 <span className="font-semibold text-foreground">{user?.email}</span>?
 This action cannot be undone.
 </AlertDialogDescription>
 </AlertDialogHeader>
 <AlertDialogFooter>
 <AlertDialogCancel>Cancel</AlertDialogCancel>
 <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700 text-white">
 Delete
 </AlertDialogAction>
 </AlertDialogFooter>
 </AlertDialogContent>
 </AlertDialog>
 )
}
