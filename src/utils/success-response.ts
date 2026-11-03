import { NextResponse } from "next/server";

/**
 * 
 * @param data 
 * @returns NextResponse
 */
export function successResponse(data: any) {
    return NextResponse.json(data);
}