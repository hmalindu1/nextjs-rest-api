/* ================================================================================================ /
 * Title : First API call
 * Description : Simplest API call with Next.js
 * Author : Hashan
 * Date : February 10th, 2024
 /* ================================================================================================ */

import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

  /**
   * Handles GET requests to the /users endpoint.
   * This function is called when the user visits the /users endpoint in their browser.
   * It queries the database for all users and returns them in a JSON response.
   * If there are no users in the database, it returns a 404 status code with a message indicating that no users
   * could be found.// TODO (Confirm this, because when no users inside the table, it returns an empty array)
   * If there is an error with the database query, it returns a 500 status code with a message indicating that an
   * unknown error occurred.
   */
export const GET = async () => {
  try {
    /**
     * This is the function that will be called when a GET request is made to the /users endpoint.
     * We are using the Prisma client to query the database for all users
     */
    const allUsers = await prisma.user.findMany();
    // If there are no users in the database, we want to return a 404 status code
    // TODO (Confirm this, because when no users inside the table, it returns an empty array)
    if (!allUsers) {
      /**
       * The NextResponse object is a special object that Next.js provides that allows us to customize
       * the response to the user. Here, we are using it to return a JSON response with a status code
       * of 404 and a message indicating that no users could be found
       */
      return NextResponse.json({ message: "No users found" }, { status: 404 });
    }
    /**
     * If there are users in the database, we want to return a JSON response with a status code of 200
     * and the actual users in the database
     */
    return NextResponse.json(allUsers, { status: 200 });
  } catch (error: unknown) {
    /**
     * If there is an error with the database query, we want to handle it here.
     * We are using a try/catch block to catch any errors that might occur
     * The error object is of type unknown, so we have to cast it to an Error
     */
    const errorMessage =
      error instanceof Error
        ? "Error Fetching Users " + error.message
        : "An unknown error occurred";
    /**
     * If there is an error, we want to return a JSON response with a status code of 500 and a message
     * indicating that there was an error
     */
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
};
