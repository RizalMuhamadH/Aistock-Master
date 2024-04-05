import { prisma } from "@/app/(lib)/prisma-client";
import { UserType } from "@prisma/client";

export async function createGoogleUser(email: string, profile: string, name: string, token: string) {
    try {
        const user = await prisma.user.create({
            data:{
                name: name,
                email: email,
                profile: profile,
                token: token,
                type: UserType.GOOGLE
            }
        })

        return user
    } catch {
        return null;
    }
}