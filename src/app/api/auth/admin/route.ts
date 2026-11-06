import { auth } from "@/lib/auth";

export const GET = async () =>{
    const adminAccount = await auth.api.signUpEmail(
                {
                    body: {
                        email: "admin@gmail.com",
                        password: "admin1234",
                        name: "Admin",
                        role: "admin",
                    },
                    asResponse: false,
                }
            );
    return new Response(JSON.stringify({message:"admin inserted successfully"}),{status:200})
}