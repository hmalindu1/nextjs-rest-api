/* ================================================================================================ /
 * Title : First API call
 * Description : Simplest API call with Next.js
 * Author : Hashan
 * Date : November 20th, 2024
 /* ================================================================================================ */

import { prisma } from "@/utils/db";
import { handleError } from "@/utils/errorHandler";
import exp from "constants";
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

/**
 * Handles PATCH requests to the /users endpoint.
 * This function is called when a PATCH request is made to update a user's information.
 * It expects a JSON body with the user's ID and the new values to update.
 * If the user ID is missing or invalid, it returns a 400 status code with an error message.
 * If the user does not exist in the database, it returns a 404 status code with an error message.
 * If the user is successfully updated, it returns a 200 status code with the updated user and a success message.
 * If there is an error during the update process, it returns a 500 status code with an error message.
 */

export const PATCH = async (request: NextRequest) => {
  try {
    /**
     * First, we need to get the JSON body from the request. The `json()` method
     * is a special method provided by Next.js that parses the request body as
     * JSON and returns it as an object.
     */
    const body = await request.json();

    /**
     * Next, we need to validate the user ID that was passed in the request body.
     * The user ID should be a string, and it should not be empty. If the user ID
     * is invalid, we should return a 400 status code with an error message.
     */
    if (!body.id || typeof body.id !== "string" || body.id.trim() === "") {
      // If the user ID is invalid, return a 400 status code with an error message
      return NextResponse.json(
        { error: "Invalid or missing user ID" },
        { status: 400 }
      );
    }

    /**
     * Now that we have a valid user ID, we need to check if the user actually
     * exists in the database. We are using the Prisma client to query the
     * database for the user with the given ID. The `findUnique()` method takes
     * an object with a `where` property as its argument. The `where` property
     * should contain the ID of the user we are looking for.
     */
    const existingUser = await prisma.user.findUnique({
      where: { id: body.id },
    });

    /**
     * If the user does not exist in the database, we should return a 404 status
     * code with an error message.
     */
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    /**
     * Now that we know the user exists, we can update the user in the database
     * with the new values. We are using the Prisma client to update the user in
     * the database. The `update()` method takes an object with a `where` property
     * and a `data` property as its argument. The `where` property should contain
     * the ID of the user we are updating, and the `data` property should contain
     * the new values for the user.
     */
    const user = await prisma.user.update({
      where: { id: body.id },
      data: {
        username: body.username,
        password: body.password,
      },
    });

    /**
     * Finally, we can return the updated user and a success message. We are
     * using the `NextResponse` object to customize the response to the user.
     */
    return NextResponse.json(
      { user, message: "User updated successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    /**
     * If there is an error with the database query, we should return a 500 status
     * code with an error message. We are using the `handleError()` function to
     * handle the error.
     */
    return handleError(error, 500, "Error Updating User");
  }
};

    /**
     * Handles DELETE requests to the /users endpoint.
     * This function is called when a DELETE request is made to delete a user.
     * It takes the request and response objects as parameters, which are special
     * objects that Next.js provides that allow us to customize the request and
     * response.
     * This function tries to delete a user in the database with the ID in the
     * request body. If the deletion is successful, it returns a JSON response with
     * a status code of 200 and the deleted user. If there is an error with the
     * database query, it returns a 500 status code with an error message.
     */
export const DELETE = async (request: NextRequest) => {
  try {
    const body = await request.json();

    if (!body.id || typeof body.id !== "string" || body.id.trim() === "") {
      // If the user ID is invalid, return a 400 status code with an error message
      return NextResponse.json(
        { error: "Invalid or missing user ID" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: body.id },
    });

    /**
     * If the user does not exist in the database, we should return a 404 status
     * code with an error message.
     */
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = await prisma.user.delete({
      where: {
        id: body.id,
      },
    });
    
    return NextResponse.json(
      { user, message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    return handleError(error, 500, "Error Deleting User");
  }
};
