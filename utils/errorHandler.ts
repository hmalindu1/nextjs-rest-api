/* ================================================================================================ /
 * Title : Common Error Handler
 * Description : Error handling function to handle errors on endpoints
 * Author : Hashan
 * Date : November 25th, 2024
 /* ================================================================================================ */

import { NextResponse } from "next/server";

/**
 * Handles errors in API endpoints by returning a JSON response with the error message.
 *
 * @param error - The error object, which can be of any type.
 * @param statusCode - The HTTP status code to be returned in the response.
 * @param message - An optional message to be prepended to the error message.
 * @returns A JSON response with the error message and status code.
 */
export function handleError(
  error: unknown,
  statusCode: number,
  message?: string
) {
  // Determine the error message by checking if the error is an instance of the Error object
  const errorMessage =
    error instanceof Error
      // If it is an Error, prepend the optional message to the error's message
      ? message + error.message
      // If it is not an Error, use a generic error message
      : "An unknown error occurred";

  // Return a JSON response using NextResponse, including the determined error message and status code
  return NextResponse.json({ message: errorMessage }, { status: statusCode });
}
