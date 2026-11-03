import { NextResponse } from "next/server";

/**
 * 
 * @param message 
 * @param error 
 * @param status 
 * @returns NextResponse
 */
export function errorResponse(message: string, error:any, status:number=500) {
    const body = {'message': message , 'error': error}
    return NextResponse.json(body,{status: status});
}