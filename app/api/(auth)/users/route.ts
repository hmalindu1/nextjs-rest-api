/* ================================================================================================ /
 * Title : First API call
 * Description : Simplest API call with Next.js
 * Author : Hashan
 * Date : November 20th, 2024
 /* ================================================================================================ */

import { prisma } from "@/utils/db";
import { handleError } from "@/utils/errorHandler";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles GET requests to the /users endpoint.
 * This function is called when the user visits the /users endpoint in their browser.
 * It queries the database for all users and returns them in a JSON response.
 * If there are no users in the database, it returns a 404 status code with a message indicating that no users
 * could be found.
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
    if (allUsers.length === 0) {
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
    return handleError(error, 404, "Error Fetching Users");
  }
};

/**
 * Handles POST requests to the /users endpoint.
 * This function is called when the user visits the /users endpoint in their browser
 * and makes a POST request. It takes the request and response objects as parameters,
 * which are special objects that Next.js provides that allow us to customize the
 * request and response.
 * This function tries to create a user in the database with the data in the
 * request body. If the creation is successful, it returns a JSON response with
 * a status code of 201 and the user that was created. If there is an error with
 * the database query, it returns a JSON response with a status code of 500 and
 * a message indicating that there was an error.
 */
export const POST = async (request: NextRequest) => {
  try {
    /**
     * The request object has a method called `json()` which parses the request body
     * as JSON and returns it as an object. We are using this method to get the request
     * body as an object
     */
    const body = await request.json();
    /**
     * We are using the Prisma client to create a user in the database with the
     * data in the request body. The `create()` method takes an object with the
     * properties for the user as its argument. In this case, we are passing the
     * `body` object as the argument.
     */
    const user = await prisma.user.create({ data: body });
    /**
     * If the creation is successful, we want to return a JSON response with a
     * status code of 201 and the user that was created. The `NextResponse` object
     * is a special object that Next.js provides that allows us to customize the
     * response to the user.
     */
    return NextResponse.json(
      { user, message: "User created successfully" },
      { status: 201 }
    );
  } catch (error: unknown) {
    return handleError(error, 500, "Error Creating User");
  }
};
